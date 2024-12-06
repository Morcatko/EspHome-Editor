"use client";
import { useEffect } from "react";
import { DevicesTreeView } from "./components/devices-tree-view";
import { PanelsContainer } from "./components/panels-container";
import { useStore } from "./stores";
import { Box, Heading, Spinner } from "@primer/react";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { api } from "./utils/api-client";

export default observer(() => {
	const store = useStore();
	useEffect(() => {
		store.devices.loadIfNeeded()
	});

	const query = useQuery({ 
		queryKey: ['status'], 
		queryFn: api.getStatus });
	
	return (store.devices.asyncState !== "loaded")
		? <div className="h-screen flex items-center justify-center">
			<Spinner className="content-center" />
		</div>
		: <div className="flex font-sans h-full">
			<Box
				className="w-72 flex flex-col"
				sx={{ borderRight: "1px solid #e1e4e8" }}
			>
				<div className="flex flex-col h-lvh">
					<Box className="pl-1 text-center" sx={{ borderBottom: "1px solid #e1e4e8", height: '56px', lineHeight: '56px' }}>
						<Heading className="inline-block align-baseline" variant="medium" >ESPHome Editor</Heading>
					</Box>
					<main className="pl-1 flex-1 overflow-y-auto"><DevicesTreeView /></main>
					<Box className="shrink-0 text-center text-slate-400" sx={{ borderTop: "1px solid #e1e4e8" }}>
						{query.isSuccess && query.data?.version}
					</Box>
				</div>
			</Box>
			<div className="flex-1">
				<PanelsContainer />
			</div>
		</div >;
});
