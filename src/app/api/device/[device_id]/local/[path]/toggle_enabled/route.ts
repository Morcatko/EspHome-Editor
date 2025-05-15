import type { TDeviceIdAndPath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

export async function POST(request: Request, { params }: TParams<TDeviceIdAndPath>) {
    const { device_id, path } = await params;

    await local.togglePathEnabled(device_id, path);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}