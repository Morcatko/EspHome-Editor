"use client";
import { Heading } from "@primer/react";
import Image from "next/image";
import { DevicesTreeView } from "./components/devices-tree-view";
import { PanelsContainer } from "./components/panels-container";
import { useStatusStore } from "./stores/status-store";
import { usePanelsStore } from "./stores/panels-store";
import { useAboutDialogVisible } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { Orientation, SplitviewReact, SplitviewReadyEvent } from "dockview-react";
import { useDarkTheme } from "./utils/hooks";

const Header = () => {
	const panelsStore = usePanelsStore();
	return <div style={{ gridArea: "1/1/1/1", lineHeight: '56px' }} className="border-b border-slate-200 dark:border-slate-800 text-center" >
		<a href="#" onClick={(e) => panelsStore.addPanel(e, { operation: "onboarding" })}>
			<Image className="inline mr-2" src={logo} alt="ESPHome Editor" width="32" height="32" />
			<Heading className="inline-block align-baseline text-slate-600 dark:text-slate-400" variant="small" >Editor for ESPHome</Heading>
		</a>
	</div>
}

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