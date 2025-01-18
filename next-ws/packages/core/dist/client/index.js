import { __name } from '../chunk-WO25ABG2.js';
import React, { createContext, useMemo, useEffect, useContext } from 'react';

var WebSocketContext = createContext(null);
WebSocketContext.displayName = "WebSocketContext";
var WebSocketConsumer = WebSocketContext.Consumer;
function WebSocketProvider(p) {
  let client = useMemo(() => {
    if (typeof window > "u") return null;
    let client2 = new WebSocket(p.url, p.protocols);
    return p.binaryType && (client2.binaryType = p.binaryType), client2;
  }, [p.url, p.protocols, p.binaryType]);
  return useEffect(() => {
    if (client?.readyState === WebSocket.OPEN)
      return () => client.close();
  }, [client]), /* @__PURE__ */ React.createElement(WebSocketContext.Provider, { value: client }, p.children);
}
__name(WebSocketProvider, "WebSocketProvider");
function useWebSocket() {
  let context = useContext(WebSocketContext);
  if (context === void 0)
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
}
__name(useWebSocket, "useWebSocket");

export { WebSocketConsumer, WebSocketContext, WebSocketProvider, useWebSocket };
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map