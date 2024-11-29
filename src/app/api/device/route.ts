import { getTreeData } from "@/server/devices";

export async function GET() {
    const result = await getTreeData();
	
    return Response.json(result);
}