/*  eslint-env node */
import { createRequire } from 'node:module';

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import postcssPresetEnv from 'postcss-preset-env';
import type { RollupOptions } from 'rollup';
import minifyLiterals from 'rollup-plugin-minify-html-literals-v3';
import postcss from 'rollup-plugin-postcss';
import postcssLit from 'rollup-plugin-postcss-lit';
import serve, { type RollupServeOptions } from 'rollup-plugin-serve';
import typescript from 'rollup-plugin-typescript2';

const require = createRequire(import.meta.url);
const pkg = require('./package.json') as { version: string };

const IS_DEV = process.env.ROLLUP_WATCH;

const serverOptions: RollupServeOptions = {
  contentBase: ['./dist'],
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  host: 'localhost',
  port: 5000,
};

const plugins = [
  nodeResolve(),
  commonjs(),
  json(),
  replace({
    preventAssignment: true,
    values: {
      PKG_VERSION_VALUE: IS_DEV ? 'DEVELOPMENT' : pkg.version,
    },
  }),
  postcss({
    extract: false,
    plugins: [
      postcssPresetEnv({
        features: {
          'nesting-rules': true,
        },
        stage: 1,
      }),
    ],
  }),
  postcssLit(),
  typescript(),
  IS_DEV && serve(serverOptions),
  !IS_DEV && minifyLiterals(),
  !IS_DEV &&
    terser({
      format: {
        comments: false,
      },
      maxWorkers: 1,
    }),
].filter(Boolean);

export default {
  context: 'window',
  input: 'src/dreamy-card.ts',
  output: {
    dir: IS_DEV ? '/Volumes/config/www/development' : 'dist',
    format: 'es',
    inlineDynamicImports: true,
  },
  plugins,
} satisfies RollupOptions;