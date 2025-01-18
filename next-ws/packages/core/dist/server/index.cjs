'use strict';

var chunkPFW3KWBF_cjs = require('../chunk-PFW3KWBF.cjs');
var logger3 = require('next/dist/build/output/log');
var ws = require('ws');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var logger3__namespace = /*#__PURE__*/_interopNamespace(logger3);

function getEnvironmentMeta() {
  let isCustomServer = !process.title.startsWith("next-"), isMainProcess = process.env.NEXT_WS_MAIN_PROCESS === "1", isDevelopment = process.env.NODE_ENV === "development";
  return { isCustomServer, isMainProcess, isDevelopment };
}
chunkPFW3KWBF_cjs.__name(getEnvironmentMeta, "getEnvironmentMeta");
function mainProcessOnly(fnName) {
  if (process.env.NEXT_WS_SKIP_ENVIRONMENT_CHECK === "1") return;
  let meta = getEnvironmentMeta();
  if (meta.isMainProcess)
    meta.isCustomServer || logger3__namespace.warnOnce(
      `[next-ws] Caution: The function '${fnName}' was invoked without a custom server.
This could lead to unintended behaviour, especially if you're attempting to interact with the WebSocket server outside of a SOCKET handler.
Please note, while such configurations might function during development, they will fail in production. This is because Next.js employs a worker process for routing in production, which do not have access to the WebSocket server on the main process.
You can resolve this by using a custom server.`
    );
  else throw new Error(
    `[next-ws] Attempt to invoke '${fnName}' outside the main process.
You may be attempting to interact with the WebSocket server outside of a SOCKET handler. This will fail in production, as Next.js employs a worker process for routing, which do not have access to the WebSocket server on the main process.
You can resolve this by using a custom server.`
  );
}
chunkPFW3KWBF_cjs.__name(mainProcessOnly, "mainProcessOnly");
var NextWsHttpServer = Symbol.for("NextWs_HttpServer");
function setHttpServer(server) {
  Reflect.set(globalThis, NextWsHttpServer, server);
}
chunkPFW3KWBF_cjs.__name(setHttpServer, "setHttpServer");
function getHttpServer() {
  return mainProcessOnly("getHttpServer"), Reflect.get(globalThis, NextWsHttpServer);
}
chunkPFW3KWBF_cjs.__name(getHttpServer, "getHttpServer");
function useHttpServer(server) {
  let existing = getHttpServer();
  return existing || (server && setHttpServer(server), server);
}
chunkPFW3KWBF_cjs.__name(useHttpServer, "useHttpServer");
var NextWsWebSocketServer = Symbol.for("NextWs_WebSocketServer");
function setWebSocketServer(wsServer) {
  Reflect.set(globalThis, NextWsWebSocketServer, wsServer);
}
chunkPFW3KWBF_cjs.__name(setWebSocketServer, "setWebSocketServer");
function getWebSocketServer() {
  return mainProcessOnly("getWebSocketServer"), Reflect.get(globalThis, NextWsWebSocketServer);
}
chunkPFW3KWBF_cjs.__name(getWebSocketServer, "getWebSocketServer");
function useWebSocketServer(wsServer) {
  let existing = getWebSocketServer();
  return existing || (wsServer && setWebSocketServer(wsServer), wsServer);
}
chunkPFW3KWBF_cjs.__name(useWebSocketServer, "useWebSocketServer");
function createRouteRegex(routePattern) {
  let paramRegex = routePattern.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&").replace(/\\\[([a-zA-Z0-9_]+)\\\]/g, "(?<$1>[^/]+)").replace(/\\\[(?:\\\.){3}([a-zA-Z0-9_]+)\\\]/g, "(?<rest_$1>.+)");
  return new RegExp(`^${paramRegex}$`);
}
chunkPFW3KWBF_cjs.__name(createRouteRegex, "createRouteRegex");
function getRouteParams(routePattern, routePath) {
  let routeRegex = createRouteRegex(routePattern), match = routePath.match(routeRegex);
  if (!match) return null;
  if (!match.groups) return {};
  let params = {};
  for (let [k, v] of Object.entries(match.groups))
    k.startsWith("rest_") && (k = k.slice(5), v = v.split("/")), Reflect.set(params, k, v);
  return params;
}
chunkPFW3KWBF_cjs.__name(getRouteParams, "getRouteParams");
function resolvePathToRoute(nextServer, requestPath) {
  let routes = {
    // @ts-expect-error - appPathRoutes is protected
    ...nextServer.appPathRoutes,
    // @ts-expect-error - getAppPathRoutes is protected
    ...nextServer.getAppPathRoutes()
  };
  for (let [routePath, [filePath]] of Object.entries(routes)) {
    let routeParams = getRouteParams(routePath, requestPath);
    if (routeParams) return { filePath, routeParams };
  }
  return null;
}
chunkPFW3KWBF_cjs.__name(resolvePathToRoute, "resolvePathToRoute");
async function importRouteModule(nextServer, filePath) {
  try {
    "hotReloader" in nextServer ? await nextServer.hotReloader?.ensurePage({
      page: filePath,
      clientOnly: !1
    }) : "ensurePage" in nextServer ? await nextServer.ensurePage({ page: filePath, clientOnly: !1 }) : logger3__namespace.warnOnce(
      "[next-ws] unable to ensure page, you may need to open the route in your browser first so Next.js compiles it"
    );
  } catch {
  }
  let buildPagePath = nextServer.getPagePath(filePath);
  return chunkPFW3KWBF_cjs.__require(buildPagePath);
}
chunkPFW3KWBF_cjs.__name(importRouteModule, "importRouteModule");

// src/server/setup.ts
function setupWebSocketServer(nextServer) {
  process.env.NEXT_WS_MAIN_PROCESS = String(1), process.env.NEXT_WS_SKIP_ENVIRONMENT_CHECK = String(1);
  let httpServer = useHttpServer(nextServer.serverOptions?.httpServer), wsServer = useWebSocketServer(new ws.WebSocketServer({ noServer: !0 }));
  if (delete process.env.NEXT_WS_SKIP_ENVIRONMENT_CHECK, !httpServer)
    return logger3__namespace.error("[next-ws] was not able to find the HTTP server");
  if (!wsServer)
    return logger3__namespace.error("[next-ws] was not able to find the WebSocket server");
  logger3__namespace.ready("[next-ws] has started the WebSocket server"), httpServer.on("upgrade", async (request, socket, head) => {
    let pathname = new URL(request.url ?? "", "ws://next").pathname;
    if (pathname.startsWith("/_next")) return;
    let routeInfo = resolvePathToRoute(nextServer, pathname);
    if (!routeInfo)
      return logger3__namespace.error(`[next-ws] could not find module for page ${pathname}`), socket.destroy();
    let routeModule = await importRouteModule(nextServer, routeInfo.filePath);
    if (!routeModule)
      return logger3__namespace.error(`[next-ws] could not find module for page ${pathname}`), socket.destroy();
    let socketHandler = routeModule?.routeModule?.userland?.SOCKET;
    return !socketHandler || typeof socketHandler != "function" ? (logger3__namespace.error(`[next-ws] ${pathname} does not export a SOCKET handler`), socket.destroy()) : wsServer.handleUpgrade(request, socket, head, async (c, r) => {
      let routeContext = { params: routeInfo.routeParams }, handleClose = await socketHandler(c, r, wsServer, routeContext);
      typeof handleClose == "function" && c.once("close", () => handleClose());
    });
  });
}
chunkPFW3KWBF_cjs.__name(setupWebSocketServer, "setupWebSocketServer");
function hookNextNodeServer() {
  setupWebSocketServer(this);
}
chunkPFW3KWBF_cjs.__name(hookNextNodeServer, "hookNextNodeServer");

// src/server/index.ts
function verifyPatch() {
  throw new Error(
    "The 'verifyPatch' function has been deprecated in favour of the `npx next-ws-cli@latest verify` command."
  );
}
chunkPFW3KWBF_cjs.__name(verifyPatch, "verifyPatch");

exports.getHttpServer = getHttpServer;
exports.getWebSocketServer = getWebSocketServer;
exports.hookNextNodeServer = hookNextNodeServer;
exports.setHttpServer = setHttpServer;
exports.setWebSocketServer = setWebSocketServer;
exports.setupWebSocketServer = setupWebSocketServer;
exports.verifyPatch = verifyPatch;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map