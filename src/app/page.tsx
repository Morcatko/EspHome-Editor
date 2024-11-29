"use client";
import { useEffect } from "react";
import { DevicesTreeView } from "./components/devices-tree-view";
import { PanelsContainer } from "./components/panels-container";
import { useStore } from "./stores";
import { Box, Heading, Spinner } from "@primer/react";
import { observer } from "mobx-react-lite";

export default observer(() => {
	const store = useStore();
	useEffect(() => {
		store.devices.loadIfNeeded()
	});

	return (store.devices.asyncState !== "loaded")
		? <div className="h-screen flex items-center justify-center">
			<Spinner className="content-center" />
		</div>
		: <div className="flex font-sans h-full">
			<Box
				className="flex-none w-72 overflow-y-auto"
				sx={{ borderRight: "1px solid #e1e4e8" }}
			>
				<Box className="pl-1" sx={{ borderBottom: "1px solid #e1e4e8" }}>
					<Heading variant="medium">Devices</Heading>
				</Box>
				<div className="pl-1">
					<DevicesTreeView />
				</div>
			</Box>
			<div className="flex-1">
				<PanelsContainer />
			</div>
		</div >;
});
