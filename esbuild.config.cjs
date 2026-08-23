const path = require('path')

require("esbuild").build({
    entryPoints: ["main.js"],
    bundle: true,
    sourcemap: true,
    format: "iife",
    target: "es6",
    outdir: path.join(process.cwd(), "builds/javascripts/"),
    absWorkingDir: path.join(process.cwd(), "javascripts"),
}).catch(() => process.exit(1))
