import { TDeviceId, TParams } from "@/app/api/api-types";
import { espHome } from "@/server/devices/esphome";

export async function GET(
    request: Request,
    { params }: TParams<TDeviceId>,
) {
    const { device_id } = await params;
    const content = await espHome.refreshDeviceInfo(device_id);

    return new Response(
        JSON.stringify(content),
        {
            headers: {
                "content-type": "application/json",
            },
        },
    );
}
