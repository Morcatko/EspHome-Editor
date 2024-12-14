import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { setupWsServer } from './ws-server'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const nextServer = next({ dev })

nextServer.prepare().then(() => {
  const nextHandler = nextServer.getRequestHandler();
  const server = createServer(
      (req, res) => nextHandler(req, res, parse(req.url, true))
    );

    setupWsServer(nextServer, server);

  /*wss.on('connection', (ws) => {
    ws.on('message', (message, isBinary) => {
      console.log(`Message received: ${message}`);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });*/

  // server.on("upgrade", (req, socket, head) => {
  //   const { pathname } = parse(req.url || "/", true);

  //   // Make sure we all for hot module reloading
  //   if (pathname === "/_next/webpack-hmr") {
  //     nextApp.getUpgradeHandler()(req, socket, head);
  //   }

  //   // Set the path we want to upgrade to WebSockets
  //   if (pathname === "/api/ws") {
  //     wss.handleUpgrade(req, socket, head, (ws) => {
  //       wss.emit('connection', ws, req);

  //       ws.on('message', (message, isBinary) => {
  //         console.log(`Message received api/ws: ${message}`);
  //         ws.send("Hello from the server ws");
  //       });

  //     });
  //   }

  //   if (pathname === "/api/def") {
  //     wss.handleUpgrade(req, socket, head, (ws) => {
  //       wss.emit('connection', ws, req);

  //       ws.on('message', (message, isBinary) => {
  //         log.info(`Message received api/def: ${message}`);
  //         ws.send("Hello from the server def");
  //       });

  //     });
  //   }
  // });

  server.listen(port, (err) => {
    if (err) {
      throw err;
    }
    console.log(    `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV }`);
  });
})