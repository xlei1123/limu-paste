import fs from 'node:fs';
import path from 'node:path';

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
