/**
 * Generic WebSocket client for the esphome-style JSON-RPC protocol observed
 * in the device's websocket traffic.
 *
 * Protocol summary:
 *  - Requests sent to the server look like:
 *      { "command": "config/get_preferences", "message_id": "8", "args"?: {...} }
 *  - Responses come back matched by message_id:
 *      { "message_id": "8", "result": {...} }
 *  - The server may also push unsolicited messages (which happen to reuse an
 *    earlier message_id) shaped like:
 *      { "message_id": "1", "event": "initial_state", "data": {...} }
 *    These are distinguished by the presence of "event" instead of "result"
 *    and are NOT responses to a pending call.
 *
 * Requires Node.js 22+ (native global WebSocket).
 */

import { c } from "@/server/config";

export interface WsClientOptions {
  /** Timeout in ms to wait for a response before rejecting a call. Default: 10000 */
  timeoutMs?: number;
  /** Called for every unsolicited push message (has "event", not "result"). */
  onEvent?: (event: PushMessage) => void;
  /** Called on any raw parse/protocol error. */
  onError?: (err: Error) => void;
}

export interface PushMessage {
  message_id?: string;
  event: string;
  data?: unknown;
  [key: string]: unknown;
}

interface PendingCall {
  resolve: (value: unknown) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface ServerResponse<TResult = string> {
  message_id: string;
  result?: TResult;
  error?: { message?: string;[key: string]: unknown };
}

type IncomingMessage = ServerResponse | PushMessage;

function isPush(msg: IncomingMessage): msg is PushMessage {
  return typeof (msg as PushMessage).event === 'string';
}

class WsClient {
  private ws: WebSocket | null = null;
  private nextId = 1;
  private pending = new Map<string, PendingCall>();
  private readonly url: URL;
  private readonly timeoutMs: number;
  private connectPromise: Promise<void> | null = null;

  private constructor(apiUrl: string, private readonly options: WsClientOptions = {}) {
    this.url = new URL(`${apiUrl}/ws`);
    this.url.protocol = this.url.protocol === "http:" ? "ws:" : "wss:";

    console.log("Creating wsClient");
    this.timeoutMs = options.timeoutMs ?? 10_000;
  }

  connect(): Promise<void> {
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(this.url);
      this.ws = ws;

      ws.addEventListener('open', () => resolve(), { once: true });
      ws.addEventListener('error', (ev) => {
        const err = new Error(`WebSocket error connecting to ${this.url}`);
        this.options.onError?.(err);
        reject(err);
      }, { once: true });

      ws.addEventListener('message', (ev) => this.handleRawMessage(ev.data));

      ws.addEventListener('close', () => {
        this.ws = null;
        this.connectPromise = null;
        // Reject anything still waiting; the connection is gone.
        for (const [id, call] of this.pending) {
          clearTimeout(call.timer);
          call.reject(new Error('WebSocket closed before response was received'));
          this.pending.delete(id);
        }
      });
    });

    return this.connectPromise;
  }

  close(): void {
    this.ws?.close();
    this.ws = null;
    this.connectPromise = null;
  }

  /**
   * Send a command and wait for its matching response.
   *
   * Example:
   *   const prefs = await client.call<TPreferences>('config/get_preferences');
   *   const secrets = await client.call('config/get_secrets');
   */
  async call<T = string>(command: string, args?: Record<string, unknown>): Promise<T> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    const message_id = String(this.nextId++);
    const payload: Record<string, unknown> = { command, message_id };
    if (args !== undefined) payload.args = args;

    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(message_id);
        reject(new Error(`Timed out waiting for response to "${command}" (message_id ${message_id})`));
      }, this.timeoutMs);

      this.pending.set(message_id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timer,
      });

      this.ws!.send(JSON.stringify(payload));
    });
  }

  private handleRawMessage(data: unknown): void {
    let msg: IncomingMessage;
    try {
      console.log("wsClient - received ", data);
      msg = JSON.parse(String(data));
    } catch (err) {
      this.options.onError?.(new Error(`Failed to parse message: ${String(data)}`));
      return;
    }

    if (isPush(msg)) {
      // Unsolicited event push (e.g. initial_state). Not a response to a call.
      this.options.onEvent?.(msg);
      return;
    }

    const response = msg as ServerResponse;
    const pending = this.pending.get(response.message_id);
    if (!pending) {
      // Response for something we didn't send (or already timed out) — ignore.
      return;
    }

    this.pending.delete(response.message_id);
    clearTimeout(pending.timer);

    if (response.error) {
      pending.reject(new Error(response.error.message ?? JSON.stringify(response.error)));
    } else {
      pending.resolve(response.result);
    }
  }

  static #instance: WsClient;
  public static get instance(): WsClient {
    if (!WsClient.#instance) {
      WsClient.#instance = new WsClient(c.espHomeApiUrl);
    }

    return WsClient.#instance;
  }
}

let _wsClient: WsClient | null = null;


export const wsClient = WsClient.instance;