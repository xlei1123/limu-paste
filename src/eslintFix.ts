import * as vscode from 'vscode';
import { findEslint } from './util';
import { log } from 'node:console';
import { exec } from 'child_process';

export async function lintAndFix (filePaths: string[], rootPath: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }
  const command = await findEslint(rootPath);
  const args = ['--fix', ...filePaths];
  exec(`${command} ${args.join(' ')}`, {cwd: rootPath}, (error, stdout, stderr) => {  
    if (error) {
      console.error(`exec error: ${error}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stderr: ${stderr}`);
  });
  log('ok');
}
