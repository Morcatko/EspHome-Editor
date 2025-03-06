import type { NextConfig } from "next";
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  output: "standalone",
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  assetPrefix: ".",
  typescript: {
    ignoreBuildErrors: false,
  },
  //https://github.com/Chenalejandro/next.js/blob/add-monaco-editor-example/examples/monaco-editor/next.config.mjs
  //https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md
  webpack: (config, options) => {
    if (!options.isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          // you can add other languages here as needed
          // (list of languages: https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages)
          //languages: ['javascript', 'typescript', 'php', 'python'],
          filename: 'static/[name].worker.[contenthash].js',
        })
      )
    }
    return config
  },
};

export default nextConfig;