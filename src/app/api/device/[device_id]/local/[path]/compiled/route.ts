import type { TDeviceIdAndPath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

export async function GET(
    request: Request,
    { params }: TParams<TDeviceIdAndPath>) {
        const { device_id, path } = await params;

        let result: string;
        let status = 200;
        try {
            result = await local.compileFile(device_id, path);
        } catch (e) {
            const error = e as Error;
            result = error.message + "\n" + error.stack;
            status = 400;
        }
    
        return new Response(
            result,
            {
                status: status,
                headers: {
                    "content-type": "text/plain",
                },
            }
        );
}