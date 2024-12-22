import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import { ESPHomeDeviceStore } from "../stores/panels-store/esphome-device-store";
import { LocalFileStore } from "../stores/panels-store/local-file-store";
import { SingleEditor, SingleEditor2 } from "./editors/single-editor";
import { LocalDeviceStore } from "../stores/panels-store/local-device-store";
import { DeviceDiffStore } from "../stores/panels-store/device-diff-store";
import { DiffEditor } from "./panels/diff-editor";
import { ESPHomeCompileStore } from "../stores/panels-store/esphome-compile-store";
import { LogStream } from "./panels/log-stream";
import { ESPHomeInstallStore } from "../stores/panels-store/esphome-install-store";
import { ESPHomeLogStore } from "../stores/panels-store/esphome-log-store";
import { IPanelsStore } from "../stores/panels-store/utils/IPanelsStore";
import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";

const PanelContent = observer(({ tabStore } : {tabStore: IPanelsStore}) => {
    if (tabStore instanceof ESPHomeDeviceStore) {
        return <ESPHomeDevicePanel store={tabStore} />;
    } else if (tabStore instanceof LocalFileStore) {
        return <LocalFilePanel store={tabStore} />;
    } else if (tabStore instanceof LocalDeviceStore) {
        return <LocalDevicePanel store={tabStore} />;
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
        <div>
            <span>{tabStore.device.name} - </span>
            <span>{tabStore.dataPath}</span>
        </div>
        <PanelContent tabStore={tabStore} />
    </div>
    
});