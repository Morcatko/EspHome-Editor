import { useQuery } from "@tanstack/react-query";
import { api } from "../utils/api-client";

export const useStatusStore = () => {
	const query = useQuery({
		queryKey: ['status'],
		queryFn: api.getStatus
	});

	return {
		query,
		isHaAddon: query.data?.mode === "ha_addon",
	}
}