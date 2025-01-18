import NextNodeServer from 'next/dist/server/next-server';
import { Server } from 'node:http';
import { WebSocketServer } from 'ws';

declare function setupWebSocketServer(nextServer: NextNodeServer): void;
declare function hookNextNodeServer(this: NextNodeServer): void;

/**
 * Set the HTTP server that the WebSocket server should listen on, must be called before the WebSocket server is created.
 * @param server The HTTP server.
 */
declare function setHttpServer(server: Server): void;
/**
 * Get the HTTP server that the WebSocket server is listening on.
 * @remark If you want to access the HTTP server outside of a SOCKET handler, you must be using a custom server.
 * @returns The HTTP server.
 * @throws If attempting to access the HTTP server outside of the main process.
 */
declare function getHttpServer(): Server;
/**
 * Set the WebSocket server that the WebSocket server should listen on, must be called before the WebSocket server is created.
 * @param wsServer The WebSocket server.
 */
declare function setWebSocketServer(wsServer: WebSocketServer): void;
/**
 * Get the WebSocket server that the WebSocket server is listening on.
 * @remark If you want to access the WebSocket server outside of a SOCKET handler, you must be using a custom server.
 * @returns The WebSocket server.
 * @throws If attempting to access the WebSocket server outside of the main process.
 */
declare function getWebSocketServer(): WebSocketServer;

/**
 * @deprecated
 */
declare function verifyPatch(): void;

export { getHttpServer, getWebSocketServer, hookNextNodeServer, setHttpServer, setWebSocketServer, setupWebSocketServer, verifyPatch };
