import { assertResponseAndJsonOk, assertResponseOk } from "@/shared/http-utils";
import { TGetStatus } from "../api/status/route";

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

    export const getWsUrl = (url: string) => {
        const finalUrl = new URL(fixUrl(url), location.href);
        finalUrl.protocol = finalUrl.protocol === "http:" ? "ws:" : "wss:";
        return finalUrl.toString();
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

    async function callPut(url: string, content: string | null): Promise<TCallResult> {
        return await callPostPut("PUT", url, content, true);
    }

    export const url_device = (device_id: string, suffix: string = "") => `/api/device/${encodeURIComponent(device_id)}/${suffix}`;
    export const url_local_path = (device_id: string, path: string, suffix: string = "") =>
        url_device(device_id, `/local/${fixPath(path)}/${suffix}`);

    export async function local_createDevice(device_id: string) {
        await callPut(url_device(device_id, "local"), null);
    }

    export async function local_importDevice(device_id: string) {
        await callPost(url_device(device_id, "local"), null);
    }

    export async function local_device(device_id: string) {
        return await callGet_text(url_device(device_id, "local"));
    }

    export async function local_createDirectory(device_id: string, directory_path: string) {
        await callPut(url_local_path(device_id, directory_path), "directory");
    }

    export async function local_createFile(device_id: string, directory_path: string) {
        await callPut(url_local_path(device_id, directory_path), "file");
    }

    export async function local_path_save(device_id: string, file_path: string, content: string) {
        await callPost(url_local_path(device_id, file_path), content, true);
    }

    export async function local_path_rename(device_id: string, path: string, newName: string) {
        await callPost(url_local_path(device_id, path, `rename_to/${fixPath(newName)}`), "", true);
    }

    export async function local_path_delete(device_id: string, path: string) {
        await callDelete(url_local_path(device_id, path));
    }

    export async function local_path_get(device_id: string, path: string) {
        return await callGet_text(url_local_path(device_id, path));
    }

    export async function local_path_compiled(device_id: string, path: string) {
        return await callGet_text(url_local_path(device_id, path, "compiled"));
    }

    export async function local_path_testData_get(device_id: string, path: string) {
        return await callGet_text(url_local_path(device_id, path, "test-data"));
    }

    export async function local_path_testData_post(device_id: string, path: string, content: string) {
        return await callPost(url_local_path(device_id, path, "test-data"), content);
    }

    export async function esphome_device(device_id: string) {
        return await callGet_text(url_device(device_id, "esphome"));
    }

    export async function device_delete(device_id: string) {
        await callDelete(url_device(device_id));
    }

    export async function getStatus() {
        return await callGet_json<TGetStatus>("/api/status");
    }

    export async function getPing() {
        return await callGet_json("/api/device/ping");
    }
}
