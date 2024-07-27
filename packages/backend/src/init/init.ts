import fs from 'fs';
import path from 'path';

export async function createGKEConfigDirectory(): Promise<void> {
  const dataOutputPath = path.resolve('data');

  if (!fs.existsSync(dataOutputPath)) {
    fs.mkdirSync(dataOutputPath, { recursive: true });
    console.log(`Folder created at: ${dataOutputPath}`);
  } else {
    console.log(`Folder already exists at: ${dataOutputPath}`);
    // fs.rmSync(dataOutputPath, { recursive: true, force: true });
    // fs.mkdirSync(dataOutputPath, { recursive: true });
    // console.log(`Folder created at: ${dataOutputPath}`);
  }
}
