const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

process.env.FORCE_COLOR = 1;
process.env.CHOKIDAR_USEPOLLING = process.env.CHOKIDAR_USEPOLLING || "1";
process.env.CHOKIDAR_INTERVAL = process.env.CHOKIDAR_INTERVAL || "300";
process.env.WATCHPACK_POLLING = process.env.WATCHPACK_POLLING || "true";

const distPath = path.resolve(__dirname, "../dist");
const libDepsPath = path.resolve(__dirname, "../lib-deps");
const libDistPath = path.resolve(__dirname, "../dist/atom-agentbuilder");
const distLibDepsPath = path.resolve(libDistPath, "lib-deps");

const ngPackagrJson = require("../projects/my-lib/ng-package.json");
if (fs.existsSync(distPath) && ngPackagrJson.deleteDestPath) {
  fs.rmSync(distPath, { recursive: true, force: true });
}
fs.mkdirSync(distPath, { recursive: true });

fs.watch(distPath, { recursive: true, persistent: true }, () => {
  if (!fs.existsSync(distLibDepsPath)) {
    try {
      const linkType = process.platform === "win32" ? "junction" : "dir";
      fs.symlinkSync(libDepsPath, distLibDepsPath, linkType);
    } catch (err) {
      try {
        if (fs.existsSync(distLibDepsPath)) fs.rmSync(distLibDepsPath, { recursive: true, force: true });
        fs.cpSync(libDepsPath, distLibDepsPath, { recursive: true });
      } catch (copyErr) {
        console.error("Failed to create lib-deps link/copy:", copyErr?.message || copyErr);
      }
    }
  }
});

const ngBuildProc = spawn(
  "node",
  ["--max-old-space-size=8192", "./node_modules/@angular/cli/bin/ng.js", "build", "my-lib", "--watch", "--configuration", "development"],
  { stdio: "inherit", shell: true }
);

ngBuildProc.on("exit", (code) => { console.log("ng build exited with code", code); });
process.on("exit", () => { ngBuildProc.kill(); });
