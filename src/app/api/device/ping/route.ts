import { espHome } from "@/server/devices/esphome";

export async function GET() {
    return Response.json(await espHome.getPing());
}