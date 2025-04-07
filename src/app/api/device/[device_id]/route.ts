import { TDeviceId, TParams } from "../../api-types";
import { deleteDevice } from "@/server/devices";

export async function DELETE(request: Request, { params }: TParams<TDeviceId>) {
    const { device_id } = await params;
    await deleteDevice(device_id);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}