import type { NextConfig } from "next";
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { patchWebpackConfig } = require("next-global-css");

//Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  assetPrefix: ".",
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpack(config, options) {
    console.log("config", config);
    // this fixes some issues with loading web workers
    config.output.publicPath = "/_next/";
    // because next.js doesn't like node_modules that import css files - this solves the issue for monaco-editor, which relies on importing css files
    patchWebpackConfig(config, options);

    // alias the inlined, vscode forked marked implementation to the actual library
    config.resolve.alias["../common/marked/marked.js"] = "marked";

    // adding monaco-editor to your bundle is slow as is, no need to bundle it for the server in addition to the client
    if (!options.isServer) {
      config.plugins.push(
        // if you find yourself needing to override
        // MonacoEnvironment.getWorkerUrl or MonacoEnvironment.getWorker,
        // you probably just need to tweak configuration here.
        new MonacoWebpackPlugin({
          // you can add other languages here as needed
          languages: ["yaml"],
          filename: "static/[name].worker.js",
          // this option is not in the plugin readme, but saves us having to override MonacoEnvironment.getWorkerUrl or similar.
          /*customLanguages: [
            {
              label: "graphql",
              worker: {
                id: "graphql",
                entry: require.resolve("monaco-graphql/esm/graphql.worker.js"),
              },
            },
          ],*/
        })
      );
    }
    //load monaco-editor provided ttf fonts
    config.module.rules.push({ test: /\.ttf$/, type: "asset/resource" });

    return config;
  }
};

export default nextConfig;