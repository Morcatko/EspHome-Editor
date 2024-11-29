import type { TDeviceIdFilePath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

type TPath = TDeviceIdFilePath & {
    new_name: string;
}

export async function POST(request: Request, { params }: TParams<TPath>) {
    const { device_id, file_path, new_name } = await params;

    const content = await request.text();

    await local.renameFile(device_id, file_path, new_name);

    return new Response(
        "OK",
        {
            headers: {
                "content-type": "text/plain",
            },
        },
    );
}