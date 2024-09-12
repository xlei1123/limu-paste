import fs from 'node:fs';
import path from 'node:path';
import vscode from 'vscode';

export async function getAllFiles(dirPath: string) {  
  let files: string[] = [];
  // 读取目录内容  
  const entries = await fs.readdirSync(dirPath, { withFileTypes: true });
  for (let entry of entries) {
      const fullPath = path.join(dirPath, entry.name); 
      // 如果是文件，则直接添加到列表中  
      if (entry.isFile()) {
        files.push(fullPath);
      }
      // 如果是目录，则递归读取  
      else if (entry.isDirectory()) {
        files = files.concat(await getAllFiles(fullPath));
      }
  }  
  return files;
}

export async function findEslint(rootPath: string): Promise<string> {
	const platform = process.platform;
	if (platform === 'win32' && await existFile(path.join(rootPath, 'node_modules', '.bin', 'eslint.cmd'))) {
		return path.join('.', 'node_modules', '.bin', 'eslint.cmd');
	} else if ((platform === 'linux' || platform === 'darwin') && await existFile(path.join(rootPath, 'node_modules', '.bin', 'eslint'))) {
		return path.join('.', 'node_modules', '.bin', 'eslint');
	} else {
		return 'eslint';
	}
}

function existFile(file: string): Promise<boolean> {
	return new Promise<boolean>((resolve, _reject) => {
		fs.stat(file, (error, stats) => {
			if (error !== null) {
				resolve(false);
			}
			resolve(stats.isFile());

		});
	});
}

// 向下寻找第一个src目录 从下往上搜索
export function findUpFirstSrcPath(filePath: string): string {
  let rootPath = path.resolve(filePath, '../');
  let src = path.resolve(rootPath, './src');
  let findCount = 0;
  while(!fs.existsSync(src) && findCount < 4) {
    rootPath = path.resolve(rootPath, '../');
    src = path.resolve(rootPath, './src');
    findCount++;
  }
  return src;
}

// 寻找根目录 从上到下搜索
export function findRootPath(filePath: string) {
  const folders = vscode.workspace.workspaceFolders;
  const rootPaths = folders?.map((folder) => path.normalize(folder.uri.path));
  let rootPath = path.resolve(filePath);
  let findCount = 0;
  while (findCount < 5) {
    rootPath = path.resolve(rootPath, '../');
    findCount++;
    if(rootPaths?.includes(path.normalize(rootPath)) || rootPaths?.includes(path.normalize(path.sep + rootPath))) {
      break;
    }
  }
  console.log('rootPath====>', rootPath);
  return rootPath;
}