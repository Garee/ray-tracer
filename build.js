const fs = require("fs");
const esbuild = require("esbuild");

const isProduction = process.env.NODE_ENV === "production";

function copyFiles() {
  const files = [
    { from: "src/app/index.html", to: "dist/index.html" },
    { from: "assets/favicon.ico", to: "dist/favicon.ico" },
  ];

  files.forEach(({ from, to }) => fs.copyFileSync(from, to));
}

const options = {
  entryPoints: ["src/app/index.jsx", "src/app/worker.js"],
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
