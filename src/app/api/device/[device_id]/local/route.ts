import type { TDeviceId, TParams, } from "@/app/api/api-types";
import { importEspHomeToLocalDevice } from "@/server/devices";
import { local } from "@/server/devices/local";
import { NextRequest } from "next/server";

export type TLocalDevice_GetResult = Awaited<ReturnType<typeof local.tryCompileDevice>>;

export async function GET(
    request: NextRequest,
    { params }: TParams<TDeviceId>,
) {
    const { device_id } = await params;
    const content = await local.tryCompileDevice(device_id);
    return new Response(
        JSON.stringify(content),
        {
            status: 200,
            headers: {
                "content-type": "application/json",
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
