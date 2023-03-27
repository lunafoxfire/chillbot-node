import path from 'path';
import glob from 'glob';

export const SRC_DIRECTORY = path.join(__dirname, '../..');

export async function importAllFromDirectory(directory: string) {
  const files = glob.sync(`${path.join(SRC_DIRECTORY, directory)}/**/*.ts`);
  await Promise.all(files.map(async (file) => import(file)));
}
