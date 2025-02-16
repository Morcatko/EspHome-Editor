import type { TDeviceIdAndPath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

export async function GET(
    request: Request,
    { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;

    const content = await local.tryGetFileContent(device_id, path + ".testdata") ?? "{\n}";

    return new Response(
        content,
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}

export async function POST(
    request: Request,
    { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;

    const content = await request.text();

    await local.saveFileContent(device_id, path + ".testdata", content);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}