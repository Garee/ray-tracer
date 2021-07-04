const fs = require("fs");
const esbuild = require("esbuild");

const isProduction = process.env.NODE_ENV === "production";

function copyFiles() {
  fs.copyFileSync("src/index.html", "dist/index.html");
  fs.copyFileSync("assets/favicon.ico", "dist/favicon.ico");
}

const options = {
  entryPoints: ["src/index.js", "src/styles.css"],
  outdir: "dist",
  bundle: true,
  sourcemap: !isProduction,
  minify: isProduction,
  watch: isProduction
    ? false
    : {
        onRebuild(err) {
          if (err) {
            console.error(err);
            return;
          }

          copyFiles();
        },
      },
  logLevel: "info",
};

esbuild
  .build(options)
  .then(() => isProduction && copyFiles())
  .catch(() => process.exit(1));
