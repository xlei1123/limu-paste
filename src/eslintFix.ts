import * as vscode from 'vscode';
import { ESLint } from 'eslint';
import { log } from 'node:console';

let eslint: ESLint;

const rcs = [
  'eslintrc.js',
  'eslintrc.cjs',
  'eslintrc.yaml',
  'eslintrc.yml',
  'eslintrc.json',
  'package.json'
];

export async function lintAndFix (filePaths: string[]) {
  const editor = vscode.window.activeTextEditor;  
  if (!editor) {  
    return;  
  }
  const filePath = editor.document.uri.fsPath;
  eslint = new ESLint({
    fix: true,
    ignore: true,
  });
  const results = await eslint.lintFiles([...filePaths]);
  await ESLint.outputFixes(results);
  // 处理检查结果
  const formatter = await eslint.loadFormatter("stylish");
  let data: any;
  const resultText = formatter.format(results, data);
  log(resultText);
}
