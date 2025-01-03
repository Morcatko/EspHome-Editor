import type { TDeviceIdAndPath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

type TPath = TDeviceIdAndPath & {
    new_name: string;
}

export async function POST(request: Request, { params }: TParams<TPath>) {
    const { device_id, path, new_name } = await params;

    await local.renameFile(device_id, path, new_name);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}