import { c } from "@/server/config";

export const getStatus = () => ({
    version: c.version,
    mode: c.mode,
});

export type TGetStatus = ReturnType<typeof getStatus>;
export async function GET() {
    return Response.json(getStatus());
}