import { rmSync } from 'fs-extra';
import { daemonClient } from '../../daemon/client/client';
import {
  cacheDir,
  projectGraphCacheDirectory,
} from '../../utils/cache-directory';
import { output } from '../../utils/output';
import { join } from 'path';
import { lstatSync, readdirSync } from 'fs';

export async function resetHandler() {
  output.note({
    title: 'Resetting the Nx workspace cache and stopping the Nx Daemon.',
    bodyLines: [`This might take a few minutes.`],
  });
  await daemonClient.stop();
  output.log({ title: 'Daemon Server - Stopped' });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const nativeFile = `20.0.0-nx.win32-x64-msvc.node`;
  // rmSync(cacheDir, { recursive: true, force: true });
  const cacheDirFiles = readdirSync(cacheDir).map((filePath) =>
    join(cacheDir, filePath)
  );
  for (const file of cacheDirFiles) {
    if (lstatSync(file).isDirectory()) {
      rmSync(file, { recursive: true, force: true });
    } else {
      if (file.endsWith('.node')) {
        continue;
      }
      rmSync(file);
    }
  }
  if (projectGraphCacheDirectory !== cacheDir) {
    rmSync(projectGraphCacheDirectory, { recursive: true, force: true });
  }
  output.success({
    title: 'Successfully reset the Nx workspace.',
  });
}
