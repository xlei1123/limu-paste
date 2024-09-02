// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fs, { fstatSync } from 'node:fs';
import path from 'node:path';
import dgit from '@dking/dgit';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "limu-vscode-extension" is now active!');

	// 注册命令
	let commandOfLimu = vscode.commands.registerCommand('limu-paste', async (uri) => {
		// 文件路径
		const filePath = uri.path.substring(1);
		let clipboardContent = await vscode.env.clipboard.readText();
		fs.stat(filePath, async (err:any, stats:any) => {
			if (err) {
				vscode.window.showWarningMessage(`获取文件时遇到错误了${err}!!!`,  { modal: true });
			}
			try {
				const clipboardPath = JSON.parse(clipboardContent);
				let destPath = '';
				if (stats.isDirectory()) { // 复制到当前目录下
					destPath = path.resolve(filePath, clipboardPath.path.replace('\/', './'));
				}

				if (stats.isFile()) { // 复制到当前文件所在的文件夹
					const dir = path.resolve(filePath, '..'); // 文件所在的文件夹
					destPath = path.resolve(dir, clipboardPath.path.replace('\/', './'));
				}
				console.log('复制中...');
				await dgit(
					{
						owner: 'xlei1123',
						repoName: 'limu-ele-pro',
						ref: 'main',
						relativePath: `src/views${clipboardPath.path}`,
					},
					destPath,
				);
				// 同时需要判断依赖组件是否已经复制
				console.log('复制成功🚀');

				// 复制dest中src目录 找到全局组件目录
				try {
					let rootPath = path.resolve(destPath, '../');
					let src = path.resolve(rootPath, './src');
					console.log(rootPath, src);
					while(!fs.existsSync(src)) {
						rootPath = path.resolve(rootPath, '../');
						src = path.resolve(rootPath, './src');
					}
					// 找到components目录
					clipboardPath.dependencies.forEach(async (comp:string) => {
						const componentPath = path.resolve(src, './components', `./${comp}`);
						if (!fs.existsSync(componentPath)) { // 不存在就下载
							console.log('下载全局组件...');
							let dest = '';
							if(comp.substring(comp.lastIndexOf('.')) === 'vue') {
								dest = path.join(src, './components',);
							} else {
								dest = path.join(src, './components', `./${comp}`);
							}
							await dgit(
								{
									owner: 'xlei1123',
									repoName: 'limu-ele-pro',
									ref: 'main',
									relativePath: `src/components/${comp}`,
								},
								dest
							);
						}
					});

				} catch (error) {
					
				}
				
			} catch (error) {
				vscode.window.showWarningMessage(`请重新复制页面，${err}!!!`,  { modal: true });
			}
		});
		
		const stats = fs.statSync(filePath);
		console.log('stats', stats);
		console.log('isFile', stats.isFile());
	});

	// 将命令放入其上下文对象中，使其生效
	context.subscriptions.push(commandOfLimu);
}

// This method is called when your extension is deactivated
export function deactivate() {}
