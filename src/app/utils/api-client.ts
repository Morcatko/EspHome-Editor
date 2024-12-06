import { TDevice } from "@/server/devices/types";
import { assertResponseAndJsonOk, assertResponseOk } from "@/shared/http-utils";

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
        throwOnError: boolean) : Promise<TCallResult> {
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
        url_device(device_id, `/local/${encodeURIComponent(path)}/${suffix}`);

    export async function local_createDirectory(device_id: string, directory_path: string) {
        await callPut(`/api/device/${encodeURIComponent(device_id)}/local/${encodeURIComponent(directory_path)}`, "directory");
    }

    export async function local_createFile(device_id: string, directory_path: string) {
        await callPut(`/api/device/${encodeURIComponent(device_id)}/local/${encodeURIComponent(directory_path)}`, "file");
    }

    export async function local_save(device_id: string, file_path: string, content: string) {
        await callPost(url_local_path(device_id, file_path), content, true);
    }

    export async function local_rename(device_id: string, path: string, newName: string) {
        await callPost(`/api/device/${encodeURIComponent(device_id)}/local/${encodeURIComponent(path)}/rename_to/${encodeURIComponent(newName)}`, "", true);
    }

    export async function local_delete(device_id: string, path: string) {
        await callDelete(`/api/device/${encodeURIComponent(device_id)}/local/${encodeURIComponent(path)}/`);
    }

    export async function local_path_compile(device: TDevice, path: string, test_content: string | undefined) {
        return await callPost(url_local_path(device.id, path, "compile"), test_content ?? "", false);
    }

    export async function getStatus() {
        return await callGet_json("/api/status");
    }
}
