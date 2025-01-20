"use client";
import { Suspense } from "react";
import { Heading, Spinner } from "@primer/react";
import Image from "next/image";
import { DevicesTreeView } from "./components/devices-tree-view";
import { PanelsContainer } from "./components/panels-container";
import { useDevicesStore } from "./stores/devices-store";
import { useStatusStore } from "./stores/status-store";
import { usePanelsStore } from "./stores/panels-store";
import { useAboutDialogVisible } from "./components/dialogs/about-dialog";
import logo from "@/assets/logo.svg";

const Header = () => {
	const panelsStore = usePanelsStore();
	return <div style={{ gridArea: "1/1/1/1", lineHeight: '56px' }} className="border-b border-slate-200 dark:border-slate-800 text-center" >
		<a href="#" onClick={(e) => panelsStore.addPanel(e, { operation: "onboarding", step: "home" })}>
			<Image className="inline mr-2" src={logo} alt="ESPHome Editor" width="32" height="32" />
			<Heading className="inline-block align-baseline text-slate-600 dark:text-slate-400" variant="small" >Editor for ESPHome</Heading>
		</a>
	</div>
}

const Page =  () => {
	const statusStore = useStatusStore();
	const devicesStore = useDevicesStore();
	const [_, setAboutDialogVisible] = useAboutDialogVisible();


	return (devicesStore.query.isLoading)
		? <div className="h-screen flex items-center justify-center">
			<Spinner className="content-center" />
		</div>
		: <Suspense>
			<div style={{ gridTemplateColumns: "18rem 1fr", gridTemplateRows: "56px 1fr auto", gridGap: "1px" }} className="h-screen w-screen grid" >
				<Header />
				<div style={{ gridArea: "2/1/2/1" }} className="pl-1 overflow-y-auto"><DevicesTreeView /></div>
				<div style={{ gridArea: "3/1/3/1" }} className="border-t border-slate-200 dark:border-slate-800 text-center p-6">
					<a className="underline text-blue-600 dark:text-blue-800 hover:text-blue-800" href="#" onClick={() => setAboutDialogVisible(true)}>{statusStore.query.isSuccess && statusStore.query.data?.version}</a>
				</div>
				<div style={{ gridArea: "1/2/4/2" }} className="border-l border-slate-200 dark:border-slate-800 relative"><PanelsContainer /></div>
			</div>
		</Suspense>
};
export default Page;