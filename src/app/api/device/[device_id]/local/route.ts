import type { TDeviceId, TParams, } from "@/app/api/api-types";
import { importEspHomeToLocalDevice } from "@/server/devices";
import { local } from "@/server/devices/local";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: TParams<TDeviceId>,
) {
    const { device_id } = await params;
    let content: string;
    let status = 200;
    try {
        content = await local.compileDevice(device_id);
    } catch (e) {
        content = (e as Error).message;
        status = 400;
    }

    return new Response(
        content,
        {
            status: status,
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}

export async function PUT(request: Request, { params }: TParams<TDeviceId>) {
    const { device_id } = await params;
    await local.saveFileContent(device_id, "configuration.yaml", "");

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}

export async function POST(request: Request, { params }: TParams<TDeviceId>) {
    const { device_id } = await params;
    await importEspHomeToLocalDevice(device_id);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}
