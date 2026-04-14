process.env.FORCE_COLOR = 1;

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const libDepsPath = path.resolve(__dirname, "../lib-deps");
const distPath = path.resolve(__dirname, "../dist");
const libDistPath = path.resolve(__dirname, "../dist/atom-agentbuilder");
const tarballPath = path.resolve(__dirname, "../dist/atom-agentbuilder.tgz");
const distLibDepsPath = path.resolve(libDistPath, "lib-deps");

if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath, { recursive: true });

console.log("Building the project");
execSync("npm run ng build my-lib", { cwd: __dirname });

const libDepsFiles = fs.readdirSync(libDepsPath).filter((file) => file.endsWith(".tgz"));
fs.mkdirSync(distLibDepsPath, { recursive: true });
for (const file of libDepsFiles) {
  fs.copyFileSync(path.resolve(libDepsPath, file), path.resolve(distLibDepsPath, file));
}

execSync("npm pack", { cwd: libDistPath });
const tarball = fs.readdirSync(libDistPath).find((file) => file.endsWith(".tgz"));
fs.renameSync(path.resolve(libDistPath, tarball), tarballPath);

if (process.platform === "win32") execSync("start .", { cwd: distPath });
