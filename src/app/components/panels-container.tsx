import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import { ESPHomeDeviceStore } from "../stores/panels-store/esphome-device-store";
import { LocalFileStore } from "../stores/panels-store/local-file-store";
import { SingleEditor } from "./panels/single-editor";
import { LocalDeviceStore } from "../stores/panels-store/local-device-store";
import { DeviceDiffStore } from "../stores/panels-store/device-diff-store";
import { DiffEditor } from "./panels/diff-editor";
import { ESPHomeCompileStore } from "../stores/panels-store/esphome-compile-store";
import { LogStream } from "./panels/log-stream";
import { ESPHomeInstallStore } from "../stores/panels-store/esphome-install-store";
import { ESPHomeLogStore } from "../stores/panels-store/esphome-log-store";
import { LocalFilePanel } from "./panels/local-file-panel";
import { PanelStoreBase } from "../stores/panels-store/types";

const PanelContent = observer(({ tabStore }: { tabStore: PanelStoreBase }) => {
    if (tabStore instanceof ESPHomeDeviceStore) {
        return <SingleEditor store={tabStore.monaco_file} />;
    } else if (tabStore instanceof LocalFileStore) {
        return <LocalFilePanel store={tabStore} />;
    } else if (tabStore instanceof LocalDeviceStore) {
        return <SingleEditor store={tabStore.monaco_file} />;
    } else if (tabStore instanceof DeviceDiffStore) {
        return <DiffEditor
            left_store={tabStore.left_file}
            right_store={tabStore.right_file} />;
    } else if (tabStore instanceof ESPHomeCompileStore) {
        return <LogStream store={tabStore.data} />;
    }
    else if (tabStore instanceof ESPHomeInstallStore) {
        return <LogStream store={tabStore.data} />;
    }
    else if (tabStore instanceof ESPHomeLogStore) {
        return <LogStream store={tabStore.data} />;
    }

    return <div>Noting selected</div>;
});

const PanelHeader = observer(({ tabStore }: { tabStore: PanelStoreBase }) => {
    if (!tabStore)
        return null;

    const panel = tabStore.panel;

    switch (panel.operation) {
        case "local_file":
            return <div>{panel.device_id} -  {panel.path}</div>;
        case "local_device":
            return <div>Local - {panel.device_id}</div>;
        case "esphome_device":
            return <div>ESPHome - {panel.device_id}</div>;
        case "diff":
            return <div>DIFF - {panel.device_id}</div>;
        case "esphome_compile":
            return <div>Compile - {panel.device_id}</div>;
        case "esphome_install":
            return <div>Install - {panel.device_id}</div>;
        case "esphome_log":
            return <div>Log - {panel.device_id}</div>;
    }
    return <div>Noting selected</div>;
});

export const PanelsContainer = observer(() => {
    const store = useStore();

    const tabStore = store.panels.tab;

    tabStore?.loadIfNeeded();

    if (!tabStore) {
        return null;
    }

    return <div style={{
        height: "100%",
        display: "grid",
        gridTemplateRows: "auto 1fr",
    }}>
        <PanelHeader tabStore={tabStore} />
        <PanelContent tabStore={tabStore} />
    </div>

});