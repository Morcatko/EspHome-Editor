"use client";
import { Suspense } from "react";
import { Anchor, Loader } from "@mantine/core";
import Image from "next/image";
import { DevicesTree } from "./components/devices-tree";
import { PanelsContainer } from "./components/panels-container";
import { useDevicesStore } from "./stores/devices-store";
import { useStatusStore } from "./stores/status-store";
import { PanelMode, usePanelsStore } from "./stores/panels-store";
import { openAboutDialog } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";
import { useMonacoInit } from "./components/editors/monaco/next-init";

const Header = () => {
	const panelsStore = usePanelsStore();
	return <div style={{ gridArea: "1/1/1/1", lineHeight: '56px' }} className="border-b border-slate-200 dark:border-slate-800 text-center" >
		<a href="#" onClick={() => panelsStore.addPanel(PanelMode.Default, { operation: "onboarding", step: "home" })}>
			<Image className="inline mr-2 align-middle" src={logo} alt="ESPHome Editor" width="32" height="32" />
			<h4 className="inline-block align-baseline text-slate-600 dark:text-slate-400 m-0 font-semibold" >Editor for ESPHome</h4>
		</a>
	</div>
}



const Page = () => {
	const statusStore = useStatusStore();
	const monacoInitialized = useMonacoInit();
	const devicesStore = useDevicesStore();


	return (!monacoInitialized || devicesStore.query.isLoading)
		? <div className="h-screen flex items-center justify-center">
			<Loader className="content-center" />
		</div>
		: <Suspense>
			<div style={{ gridTemplateColumns: "18rem 1fr", gridTemplateRows: "56px 1fr auto", gridGap: "1px" }} className="h-screen w-screen grid" >
				<Header />
				<div style={{ gridArea: "2/1/2/1" }} className="pl-1 overflow-y-auto"><DevicesTree /></div>
				<div style={{ gridArea: "3/1/3/1" }} className="border-t border-slate-200 dark:border-slate-800 text-center p-6">
					<Anchor href="#" onClick={() => openAboutDialog()}>{statusStore.query.isSuccess && statusStore.query.data?.version }</Anchor>
				</div>
				<div style={{ gridArea: "1/2/4/2" }} className="border-l border-slate-200 dark:border-slate-800 relative"><PanelsContainer /></div>
			</div>
		</Suspense>
};
export default Page;