'use strict';

var chunkPFW3KWBF_cjs = require('../chunk-PFW3KWBF.cjs');
var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

var WebSocketContext = React.createContext(null);
WebSocketContext.displayName = "WebSocketContext";
var WebSocketConsumer = WebSocketContext.Consumer;
function WebSocketProvider(p) {
  let client = React.useMemo(() => {
    if (typeof window > "u") return null;
    let client2 = new WebSocket(p.url, p.protocols);
    return p.binaryType && (client2.binaryType = p.binaryType), client2;
  }, [p.url, p.protocols, p.binaryType]);
  return React.useEffect(() => {
    if (client?.readyState === WebSocket.OPEN)
      return () => client.close();
  }, [client]), /* @__PURE__ */ React__default.default.createElement(WebSocketContext.Provider, { value: client }, p.children);
}
chunkPFW3KWBF_cjs.__name(WebSocketProvider, "WebSocketProvider");
function useWebSocket() {
  let context = React.useContext(WebSocketContext);
  if (context === void 0)
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  return context;
}
chunkPFW3KWBF_cjs.__name(useWebSocket, "useWebSocket");

exports.WebSocketConsumer = WebSocketConsumer;
exports.WebSocketContext = WebSocketContext;
exports.WebSocketProvider = WebSocketProvider;
exports.useWebSocket = useWebSocket;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.cjs.map