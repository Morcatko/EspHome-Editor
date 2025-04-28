import type { TDeviceIdAndPath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

export async function GET(request: Request, { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;

    const content = await local.getFileContent(device_id, path);

    return new Response(
        content,
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}

export async function PUT(request: Request, { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;
    const body = await request.text();
    switch (body) {
        case "directory":
            await local.createDirectory(device_id, path);
            break;
        case "file":
            await local.createFile(device_id, path);
            break;
        default:
            throw new Error(`Invalid body: ${body}`);
    }

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}

export async function POST(request: Request, { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;

    const content = await request.text();

    await local.saveFileContent(device_id, path, content);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}


export async function DELETE(request: Request, { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;
    await local.deletePath(device_id, path);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}