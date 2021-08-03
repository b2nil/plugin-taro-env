require('esbuild').buildSync({
  entryPoints: ['src/index.ts'],
  format: "cjs",
  minify: false,
  loader: {
    ".ts": "ts"
  },
  outdir: "dist",
  tsconfig: 'tsconfig.json'
})