"use client";
import { useEffect } from "react";
import { DevicesTreeView } from "./components/devices-tree-view";
import { PanelsContainer } from "./components/panels-container";
import { useStore } from "./stores";
import { Heading, Spinner } from "@primer/react";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { api } from "./utils/api-client";
import { LinkExternalIcon } from "@primer/octicons-react";
import { useDevicesStore } from "./stores/devices-store";

export default observer(() => {
	const store = useStore();
	const devices = useDevicesStore();

	const query = useQuery({
		queryKey: ['status'],
		queryFn: api.getStatus
	});

	return (devices.query.isLoading)
		? <div className="h-screen flex items-center justify-center">
			<Spinner className="content-center" />
		</div>
		: <div style={{ gridTemplateColumns: "18rem 1fr", gridTemplateRows: "56px 1fr auto", gridGap: "1px" }} className="h-screen grid" >
			<div style={{ gridArea: "1/1/1/1", lineHeight: '56px' }} className="border-b border-slate-200 text-center" >
				<Heading className="inline-block align-baseline text-slate-600 dark:text-slate-400" variant="small" >Editor for ESPHome</Heading>
			</div>
			<div style={{ gridArea: "2/1/2/1" }} className="pl-1 overflow-y-auto"><DevicesTreeView /></div>
			<div style={{ gridArea: "3/1/3/1" }} className="border-t border-slate-200 text-center">
				<div className="text-slate-400">{query.isSuccess && query.data?.version}</div>
				<div className="text-blue-300 text-sm underline"><a href="https://github.com/Morcatko/EspHome-Editor/issues" target="_blank">feedback <LinkExternalIcon className="inline" /></a></div>
			</div>
			<div style={{ gridArea: "1/2/4/2" }} className="border-l border-slate-200"><PanelsContainer /></div>
		</div>
});
