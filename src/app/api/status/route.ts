import { c } from "@/server/config";

const getStatus = () => ({
    version: c.version,
    mode: c.mode,
    espHomeWebUrl: c.espHomeWebUrl,
});

export type TGetStatus = ReturnType<typeof getStatus>;
export async function GET() {
    return Response.json(getStatus());
}