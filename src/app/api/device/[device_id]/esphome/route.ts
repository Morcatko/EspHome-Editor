import type { TDeviceId, TParams } from "@/app/api/api-types";
import { espHome } from "@/server/devices/esphome";
import { local } from "@/server/devices/local";

export async function GET(
    request: Request,
    { params }: TParams<TDeviceId>,
) {
    const { device_id } = await params;
    const content = await espHome.getConfiguration(device_id);

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
    { params }: TParams<TDeviceId>,
) {
    const { device_id } = await params;

    const content = await local.compileDevice(device_id);
    if (!content.success) {
        return new Response(
            "Failed to compile device",
            {
                status: 500,
                headers: {
                    "content-type": "text/plain",
                },
            },
        );
    }
    
    await espHome.saveConfiguration(device_id, content.value);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}
