import { promises as fs } from 'fs';
import fg from 'fast-glob';

export default async ({ cwd, ignore, pattern, transform }) => {
  const files = await fg.async(pattern, {
    absolute: true,
    cwd,
    ignore,
    nocase: true,
    unique: true,
  });

  await Promise.all(
    files.map(async file => {
      const code = await fs.readFile(file, 'utf-8');
      let output = '';
      try {
        output = transform(code);
      } catch (ex) {
        console.error(file, ex);
      }

      if (output !== '') {
        await fs.writeFile(file, output);
      }
    }),
  );
};
