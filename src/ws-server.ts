import { IncomingMessage, Server, ServerResponse } from "http";
import { NextServer } from "next/dist/server/next";
import { parse } from 'url'
import { WebSocketServer } from "ws";
import { log } from "./shared/log";

const wss = new WebSocketServer({ noServer: true });

export const setupWsServer = (
    nextServer: NextServer,
    server: Server<typeof IncomingMessage, typeof ServerResponse>) => {

    server.on("upgrade", (req, socket, head) => {
        const { pathname } = parse(req.url || "/", true);
    
        // Make sure we all for hot module reloading
        if (pathname === "/_next/webpack-hmr") {
            nextServer.getUpgradeHandler()(req, socket, head);
        }
    
        // Set the path we want to upgrade to WebSockets
        if (pathname === "/api/ws") {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
    
            ws.on('message', (message, isBinary) => {
              log.info(`Message received api/ws: ${message}`);
              ws.send("Hello from the server ws");
            });
    
          });
        }
    
        if (pathname === "/api/def") {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req);
            log.info(`Connection established api/def`);
            ws.on('message', (message, isBinary) => {
              log.info(`Message received api/def: ${message}`);
              ws.send("Hello from the server def");
            });
    
          });
        }
      });
}