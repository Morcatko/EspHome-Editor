import { NextRequest } from "next/server";
import { getStreamResponse } from "../utils";
import type { TDeviceId, TParams } from "@/app/api/api-types";

export async function GET(
    request: NextRequest,
    { params }: TParams<TDeviceId>) {

    const { device_id } = await params;
    return getStreamResponse(device_id, "logs", { port: "OTA"});
}