"use client";
import { Suspense } from "react";
import { Anchor, Button, Loader } from "@mantine/core";
import Image from "next/image";
import { DevicesTree } from "./components/devices-tree";
import { PanelsContainer } from "./components/panels-container";
import { useDevicesStore } from "./stores/devices-store";
import { useStatusStore } from "./stores/status-store";
import { usePanelsStore, useRerenderOnPanelChange } from "./stores/panels-store";
import { openAboutDialog } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { useMonacoInit } from "./components/editors/monaco/monaco-init";
import { TPanel } from "./stores/panels-store/types";
import { SidebarExpandIcon } from "@primer/octicons-react";
import { Orientation, SplitviewReact, SplitviewReadyEvent } from "dockview-react";
import { useDarkTheme } from "./utils/hooks";

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

const DevicesPanel = () => {
	const [_, setAboutDialogVisible] = useAboutDialogVisible();
	const statusStore = useStatusStore();

	return <div style={{ gridTemplateRows: "56px 1fr auto", gridGap: "1px" }} className="h-screen grid" >
		<Header />
		<div className="pl-1 overflow-y-auto"><DevicesTreeView /></div>
		<div className="border-t border-slate-200 dark:border-slate-800 text-center p-6">
			<a className="underline text-blue-600 dark:text-blue-800 hover:text-blue-800" href="#" onClick={() => setAboutDialogVisible(true)}>{statusStore.query.isSuccess && statusStore.query.data?.version}</a>
		</div>
	</div>;
}

const components = {
	"devices-panel": () => <DevicesPanel />,
	"panels-container": () => <PanelsContainer />
};

const Page = () => {
	const isDarkMode = useDarkTheme();

	const onReady = (event: SplitviewReadyEvent) => {
		event.api.addPanel({
			id: 'devices-panel',
			component: 'devices-panel',
			minimumSize: 65,
			maximumSize: 400,
			size: 300
		});
		event.api.addPanel({
			id: 'panels-container',
			component: 'panels-container'
		});
	}

	return <SplitviewReact
		orientation={Orientation.HORIZONTAL}
		components={components}
		onReady={onReady}
		className={`${isDarkMode ? "dockview-theme-dark" : "dockview-theme-light"}`}
	/>
};
export default Page;