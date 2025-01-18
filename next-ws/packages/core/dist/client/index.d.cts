import React from 'react';

declare const WebSocketContext: React.Context<WebSocket | null>;
declare const WebSocketConsumer: React.Consumer<WebSocket | null>;
/**
 * Provides a WebSocket client to its children via context,
 * allowing for easy access to the WebSocket from anywhere in the app.
 * @param props WebSocket parameters and children.
 * @returns JSX Element
 */
declare function WebSocketProvider(p: React.PropsWithChildren<{
    /** The URL for the WebSocket to connect to. */
    url: string;
    /** The subprotocols to use. */
    protocols?: string[] | string;
    /** The binary type to use. */
    binaryType?: BinaryType;
}>): React.JSX.Element;
/**
 * Access the websocket from anywhere in the app, so long as it's wrapped in a WebSocketProvider.
 * @returns WebSocket client when connected, null when disconnected.
 */
declare function useWebSocket(): WebSocket | null;

export { WebSocketConsumer, WebSocketContext, WebSocketProvider, useWebSocket };
