import { TDevice } from "@/server/devices/types";
import { assertResponseAndJsonOk, assertResponseOk } from "@/shared/http-utils";
import { log } from "@/shared/log";

export namespace api {
    export type TCallResult = {
        status: number;
        content: string;
    };

    const fixUrl = (url: string) => {
        url = url
            .replace("//", "/") // Replace double //
            .replace(/\/$/, ""); // Remove / at the end of url

        return (url.startsWith("/")) ? `.${url}` : url;
    };

    const fixPath = (path: string) => {
        const fixed = path
            .replaceAll("//", "/") // Replace double //
            .replaceAll(/^\/+|\/+$/g, '') // Remove / from start and end of path
            .replaceAll("/", "\\") // Replace  \ by /
            ;

        return encodeURIComponent(fixed);
    }

    export async function callGet_text(url: string): Promise<TCallResult> {
        const response = await fetch(fixUrl(url));
        return <TCallResult>{
            content: await response.text(),
            status: response.status,
        };
    }

    export async function callGet_json<T = any>(url: string): Promise<T> {
        const response = await fetch(fixUrl(url));
        return await assertResponseAndJsonOk(response);
    }

    async function callDelete(url: string) {
        const response = await fetch(fixUrl(url), {
            method: "DELETE",
            headers: {
                "Content-Type": "text/plain",
            }
        });
        await assertResponseOk(response);
    }

    async function callPostPut(
        method: "POST" | "PUT",
        url: string,
        content: string | null,
        throwOnError: boolean): Promise<TCallResult> {
        const response = await fetch(fixUrl(url), {
            method: method,
            headers: {
                "Content-Type": "text/plain",
            },
            body: content || undefined,
        });

        if (throwOnError)
            await assertResponseOk(response);

        return <TCallResult>{
            content: await response.text(),
            status: response.status,
        };
    }

    export async function callPost(url: string, content: string | null, throwOnError: boolean = true): Promise<TCallResult> {
        return await callPostPut("POST", url, content, throwOnError);
    }

    async function callPut(url: string, content: string): Promise<TCallResult> {
        return await callPostPut("PUT", url, content, true);
    }

    export const url_device = (device_id: string, suffix: string = "") => `/api/device/${encodeURIComponent(device_id)}/${suffix}`;
    export const url_local_path = (device_id: string, path: string, suffix: string = "") =>
        url_device(device_id, `/local/${fixPath(path)}/${suffix}`);

    export async function local_createDirectory(device_id: string, directory_path: string) {
        await callPut(url_local_path(device_id, directory_path), "directory");
    }

    export async function local_createFile(device_id: string, directory_path: string) {
        await callPut(url_local_path(device_id, directory_path), "file");
    }

    export async function local_save(device_id: string, file_path: string, content: string) {
        await callPost(url_local_path(device_id, file_path), content, true);
    }

    export async function local_rename(device_id: string, path: string, newName: string) {
        await callPost(url_local_path(device_id, path, `rename_to/${fixPath(newName)}`), "", true);
    }

    export async function local_delete(device_id: string, path: string) {
        await callDelete(url_local_path(device_id, path));
    }

    export async function local_path_compile(device: TDevice, path: string, test_content: string | undefined) {
        return await callPost(url_local_path(device.id, path, "compile"), test_content ?? "", false);
    }

    export async function getStatus() {
        return await callGet_json("/api/status");
    }

    export async function getPing() {
        return await callGet_json("/api/device/ping");
    }

    export async function getStream(
        url: string,
        onMessage: (message: string) => void,
    ) {
        const finalUrl = new URL(fixUrl(url), location.href);
        finalUrl.protocol = finalUrl.protocol === "http:" ? "ws:" : "wss:";

        const ws = new WebSocket(finalUrl.toString());
        ws.onmessage = (ev) => {
            const msg = JSON.parse(ev.data);
            switch (msg.event) {
                case "completed":
                    log.verbose("Stream completed");
                    ws.close();;
                    break;
                case "error":
                    log.error("Stream error", msg.data);
                    ws.close();
                    break;
                case "message":
                    onMessage(msg.data as string);
                    break;
                default:
                    log.warn("Unknown event", msg);
                    break;
            }
        };
    }
}
