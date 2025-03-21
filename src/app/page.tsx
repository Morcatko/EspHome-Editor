"use client";
import { useEffect, useState } from "react";
import { ISplitviewPanelProps, Orientation, SplitviewApi, SplitviewReact, SplitviewReadyEvent } from "dockview-react";
import { Anchor, Button, Loader } from "@mantine/core";
import Image from "next/image";
import { SidebarExpandIcon } from "@primer/octicons-react";
import { DevicesTree } from "./components/devices-tree";
import { useStatusStore } from "./stores/status-store";
import { usePanelsStore, useRerenderOnPanelChange } from "./stores/panels-store";
import { openAboutDialog } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { TPanel } from "./stores/panels-store/types";
import { useDarkTheme } from "./utils/hooks";
import { useMonacoInit } from "./components/editors/monaco/monaco-init";
import { useDevicesQuery } from "./stores/devices-store";
import { PanelsContainer } from "./components/panels-container";
import { useWindowEvent } from "@mantine/hooks";

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

const DevicesPanel = () => {
	const statusStore = useStatusStore();

	return <div className="flex-none flex flex-col h-screen">
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
	</div>;
}

const components:Record<string, React.FunctionComponent<ISplitviewPanelProps>> = {
	"devices-sidePanel": () => <DevicesPanel />,
	"panels-container": () => <PanelsContainer />
};

const findDevicesSidePanel = (api: SplitviewApi) => api.getPanel("devices-sidePanel");

const PageContent = () => {
	const [api, setApi] = useState<SplitviewApi>()
	const panelsApi = useRerenderOnPanelChange();
	const devicePanelExists = !!panelsApi.findPanel(devicesPanel);

	const isDarkMode = useDarkTheme();
	const onReady = (event: SplitviewReadyEvent) => setApi(event.api);

	useEffect(() => {
		if (!api) return;

		api.addPanel({
			id: 'panels-container',
			component: 'panels-container',
			index: 1,
		});

		api.onDidLayoutChange((e) => {
			const devicesSidePanel = findDevicesSidePanel(api);
			if (devicesSidePanel) {
				console.log("devicesSidePanel", devicesSidePanel.width.toString());
				localStorage.setItem('e4e.devicesWidth', devicesSidePanel.width.toString());
			}
		});
	}, [api]);

	useWindowEvent("resize", () => api?.layout(window.innerWidth, window.innerHeight));

	useEffect(() => {
		if (!api) return;

		if (devicePanelExists)
			api.removePanel(findDevicesSidePanel(api)!);
		else  {
			api.addPanel({
				id: 'devices-sidePanel',
				component: 'devices-sidePanel',
				minimumSize: 75,
				maximumSize: 450,
				size: parseFloat(localStorage.getItem('e4e.devicesWidth') ?? "250"),
				index: 0,
			});
		}
	}, [api, devicePanelExists]);
	
	return <SplitviewReact
		orientation={Orientation.HORIZONTAL}
		components={components}
		onReady={onReady}
		className={`${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
	/>
}

const Page = () => {
	const monacoInitialized = useMonacoInit();
	const devicesQuery = useDevicesQuery();

	return (!monacoInitialized || devicesQuery.isLoading)
		? <div className="h-screen flex items-center justify-center">
			<Loader className="content-center" />
		</div>
		: <PageContent />
};
export default Page;