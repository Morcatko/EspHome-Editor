import { c } from "@/server/config";

export async function GET() {
    return Response.json({
        version: c.version
    });
}