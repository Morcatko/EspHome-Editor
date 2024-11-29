import type { TDeviceIdAndPath, TParams } from "@/app/api/api-types";
import { local } from "@/server/devices/local";

const compile = async ({ params }: TParams<TDeviceIdAndPath>, testData: string | null) => {
    const { device_id, path } = await params;

    let result: string;
    let status = 200;
    try {
        result = await local.compileFile(device_id, path, testData);
    } catch (e) {
        const error = e as Error;
        result = error.message + "\n" + e.stack;
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
export async function GET(
    request: Request,
    params: any) {
    return await compile(params, null);
}

export async function POST(
    request: Request,
    params: any) {
    const content = await request.text()
    return await compile(params, content);
}