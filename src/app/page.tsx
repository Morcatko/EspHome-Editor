"use client";
import { useEffect, useState } from "react";
import { ISplitviewPanelProps, Orientation, SplitviewApi, SplitviewReact, SplitviewReadyEvent } from "dockview-react";
import { Anchor, Button, Loader } from "@mantine/core";
import Image from "next/image";
import { SidebarCollapseIcon, SidebarExpandIcon } from "@primer/octicons-react";
import { DevicesTree } from "./components/devices-tree";
import { useStatusStore } from "./stores/status-store";
import { openAboutDialog } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { useDarkTheme } from "./utils/hooks";
import { useMonacoInit } from "./components/editors/monaco/monaco-init";
import { useDevicesQuery } from "./stores/devices-store";
import { PanelsContainer } from "./components/panels/panels-container";
import { useWindowEvent } from "@mantine/hooks";
import { useLocalStorage } from "usehooks-ts";

const Header = () => {
	return <>
		<Image className="inline mr-2 align-middle" src={logo} alt="ESPHome Editor" width="32" height="32" />
		<h4 className="inline-block align-baseline text-slate-600 dark:text-slate-400 m-0 font-semibold" >Editor for ESPHome</h4>
	</>
}

const useDevicesPanelCollapsed = () => {
	const [collapsed, setCollapsed] = useLocalStorage<boolean>("e4e.devicesCollapsed", false);
	return { collapsed, setCollapsed };
}

const CollapseButton = () => {
	const { collapsed, setCollapsed } = useDevicesPanelCollapsed();
	return <Button	
		style={{ position: "absolute", left: "8px", bottom: "17px", zIndex: 950 }}
		variant={ collapsed ? "filled" : "subtle" }
		radius="md"
		onClick={() => setCollapsed(!collapsed)}>
		{collapsed
			? <SidebarCollapseIcon />
			: <SidebarExpandIcon />

		}
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
		<div className="flex-none border-t border-slate-200 dark:border-slate-800 text-center p-2 pl-16 flex">
			<Anchor className="flex-grow" href="#" onClick={() => openAboutDialog()} underline="never">
				<div>❤️ Support development</div>
				<div>{statusStore.query.isSuccess && statusStore.query.data?.version}</div>
			</Anchor>
		</div>
	</div>;
}

const components: Record<string, React.FunctionComponent<ISplitviewPanelProps>> = {
	"devices-sidePanel": () => <DevicesPanel />,
	"panels-container": () => <PanelsContainer />
};

const findDevicesSidePanel = (api: SplitviewApi) => api.getPanel("devices-sidePanel");

const PageContent = () => {
	const [api, setApi] = useState<SplitviewApi>()

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
				localStorage.setItem('e4e.devicesWidth', devicesSidePanel.width.toString());
			}
		});
	}, [api]);

	useWindowEvent("resize", () => api?.layout(window.innerWidth, window.innerHeight));

	const { collapsed } = useDevicesPanelCollapsed();

	useEffect(() => {
		if (!api) return;

		if (collapsed) {
			const devicesSidePanel = findDevicesSidePanel(api);
			if (devicesSidePanel)
				api.removePanel(devicesSidePanel);
		} else {
			api.addPanel({
				id: 'devices-sidePanel',
				component: 'devices-sidePanel',
				minimumSize: 75,
				maximumSize: 450,
				size: parseFloat(localStorage.getItem('e4e.devicesWidth') ?? "250"),
				index: 0,
			});
		}
	}, [api, collapsed]);


	return <div className="h-screen w-screen">
		<SplitviewReact
			orientation={Orientation.HORIZONTAL}
			components={components}
			onReady={onReady}
			className={`${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
		/>
		<CollapseButton />
	</div>
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