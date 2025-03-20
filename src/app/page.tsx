"use client";
import { Suspense } from "react";
import { Anchor, Button, Loader } from "@mantine/core";
import Image from "next/image";
import { SidebarExpandIcon } from "@primer/octicons-react";
import { DevicesTree } from "./components/devices-tree";
import { PanelsContainer } from "./components/panels-container";
import { useDevicesQuery } from "./stores/devices-store";
import { useStatusStore } from "./stores/status-store";
import { usePanelsStore, useRerenderOnPanelChange } from "./stores/panels-store";
import { openAboutDialog } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { useMonacoInit } from "./components/editors/monaco/monaco-init";
import { TPanel } from "./stores/panels-store/types";

const devicesPanel: TPanel = {
	operation: "devices_tree"
};

const Header = () => {
	const panelsStore = usePanelsStore();
	return <a href="#" onClick={() => panelsStore.addPanel({ operation: "onboarding", step: "home" })}>
		<Image className="inline mr-2 align-middle" src={logo} alt="ESPHome Editor" width="32" height="32" />
		<h4 className="inline-block align-baseline text-slate-600 dark:text-slate-400 m-0 font-semibold" >Editor for ESPHome</h4>
	</a>
}

const CollapseButton = () => {
	const panelsStore = usePanelsStore();
	return <Button variant="subtle" radius="md" onClick={() => panelsStore.addPanel(devicesPanel)}>
		<SidebarExpandIcon />
	</Button>
}
const Page = () => {
	const statusStore = useStatusStore();
	const monacoInitialized = useMonacoInit();
	const devicesQuery = useDevicesQuery();

	const papi = useRerenderOnPanelChange();
	const devicePanelExists = !!papi.findPanel(devicesPanel);

	return (!monacoInitialized || devicesQuery.isLoading)
		? <div className="h-screen flex items-center justify-center">
			<Loader className="content-center" />
		</div>
		: <Suspense>
			<div className="h-screen w-screen flex" >
				{!devicePanelExists
					? <div className="flex-none w-2xs flex flex-col">
						<div className="flex-none border-b border-slate-200 dark:border-slate-800 text-center leading-[56px]" >
							<Header />
						</div>
						<div className="flex-grow pl-1 overflow-y-auto">
							<DevicesTree />
						</div>
						<div className="flex-none border-t border-slate-200 dark:border-slate-800 text-center p-4 flex">
							<div className="w-14 flex-none">
								<CollapseButton />
							</div>
							<Anchor className="flex-grow" style={{ lineHeight: '34px' }} href="#" onClick={() => openAboutDialog()}>{statusStore.query.isSuccess && statusStore.query.data?.version}</Anchor>
						</div>
					</div>
					: null}
				<div className="flex-grow border-l border-slate-200 dark:border-slate-800 relative">
					<PanelsContainer />
				</div>
			</div>
		</Suspense>
};
export default Page;