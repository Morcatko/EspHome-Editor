"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Anchor, Button, Loader } from "@mantine/core";
import Image from "next/image";
import { DevicesTree } from "./components/devices-tree";
import { PanelsContainer } from "./components/panels-container";
import { useStatusStore } from "./stores/status-store";
import { usePanelsStore, useRerenderOnPanelChange } from "./stores/panels-store";
import { openAboutDialog } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { TPanel } from "./stores/panels-store/types";
import { SidebarExpandIcon } from "@primer/octicons-react";
import { Orientation, SplitviewApi, SplitviewReact, SplitviewReadyEvent } from "dockview-react";
import { useDarkTheme } from "./utils/hooks";
import { useMonacoInit } from "./components/editors/monaco/monaco-init";
import { useDevicesQuery } from "./stores/devices-store";

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

const components = {
	"devices-panel": () => <DevicesPanel />,
	"panels-container": () => <div >pc</div>//</div><PanelsContainer />
};

const PageContent = () => {
	const [api, setApi] = useState<SplitviewApi>()
	const isDarkMode = useDarkTheme();
	const onReady = (event: SplitviewReadyEvent) => {
		console.log("onReady", event);
		setApi(event.api);
	};

	useEffect(() => {
		console.log("useEffect");
		if (!api) return;
		api.addPanel({
			id: 'devices-panel',
			component: 'devices-panel',
			minimumSize: 65,
			maximumSize: 400,
			size: 300
		});
		console.log("addPanel", api.panels);
		api.addPanel({
			id: 'panels-container',
			component: 'panels-container'
		});
	}, [api]);

	console.log("PageContent");

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