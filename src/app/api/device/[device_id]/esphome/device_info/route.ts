import { TDeviceId, TParams } from "@/app/api/api-types";
import { getDeviceInfo } from "@/server/devices";

export async function GET(request: Request, { params }: TParams<TDeviceId>) {
    const { device_id } = await params;
    
    const deviceInfo = await getDeviceInfo(device_id);

    return new Response(
        JSON.stringify(deviceInfo),
        {
            headers: {
                "content-type": "application/json",
            },
        },
    );
}