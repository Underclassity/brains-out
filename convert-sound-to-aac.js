import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

/**
 * Read directory helper
 *
 * @param   {String}  dir  Dir path
 *
 * @return  {Array}        Array with filepathes
 */
function readDir(dir) {
  return fs
    .readdirSync(dir)
    .reduce(
      (files, file) =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? files.concat(readDir(path.join(dir, file)))
          : files.concat(path.join(dir, file)),
      []
    );
}

// Sound dir path
const soundFolderPath = path.resolve("public", "sound");

(async () => {
  const files = readDir(soundFolderPath).filter(
    (item) => !item.includes(".aac")
  );

  //   Get non aac files and convert with ffmpeg
  for (const filepath of files) {
    const { base, ext, dir } = path.parse(filepath);
    const newFilename = base.replace(ext, ".aac");
    const newFilepath = path.resolve(dir, newFilename);

    // const command = `ffmpeg -i "${filepath}" -codec:a aac -b:a 128k "${newFilepath}"`;

    console.log(`Convert ${base} => ${newFilename}`);

    const code = await new Promise((resolve) => {
      const spawnedProcess = spawn("ffmpeg", [
        "-i",
        `"${filepath}"`,
        "-codec:a",
        "aac",
        "-b:a",
        "128k",
        `"${newFilepath}"`,
      ]);

      spawnedProcess.on("close", (code) => {
        resolve(code);
      });
    });

    if (
      code != -1 &&
      fs.existsSync(newFilepath) &&
      fs.statSync(newFilepath).size > 0
    ) {
      fs.unlinkSync(filepath);
    }
  }
})();
