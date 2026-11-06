import { rm } from "node:fs/promises";
// Release assets must come from the current source, including global CSS.
for (const folder of ["../.next", "../out"]) {
  await rm(new URL(folder, import.meta.url), { recursive: true, force: true });
}
