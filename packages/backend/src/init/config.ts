import fs from 'fs';
import path from 'path';

export function checkIfExists(filePath: string): void {
  const resolvedPath = path.resolve(filePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`File or directory does not exist: ${filePath}`);
  }
}
