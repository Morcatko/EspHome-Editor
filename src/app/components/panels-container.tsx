import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import { ESPHomeDeviceStore } from "../stores/panels-store/esphome-device-store";
import { LocalFileStore } from "../stores/panels-store/local-file-store";
import { LocalDeviceStore } from "../stores/panels-store/local-device-store";
import { DeviceDiffStore } from "../stores/panels-store/device-diff-store";
import { ESPHomeCompileStore } from "../stores/panels-store/esphome-compile-store";
import { ESPHomeInstallStore } from "../stores/panels-store/esphome-install-store";
import { ESPHomeLogStore } from "../stores/panels-store/esphome-log-store";
import { IPanelsStore } from "../stores/panels-store/utils/IPanelsStore";
import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { EspHomeLogPanel } from "./panels/esphome-log-panel";
import { EspHomeInstallPanel } from "./panels/esphome-install-panel";
import { EspHomeCompilePanel } from "./panels/esphome-compile-panel";

const PanelContent = observer(({ tabStore }: { tabStore: IPanelsStore }) => {
    if (tabStore instanceof ESPHomeDeviceStore) {
        return <ESPHomeDevicePanel device_id={tabStore.device.id} />;
    } else if (tabStore instanceof LocalFileStore) {
        return <LocalFilePanel device_id={tabStore.device.id} file={tabStore.file} />;
    } else if (tabStore instanceof LocalDeviceStore) {
        return <LocalDevicePanel device_id={tabStore.device.id} />;
    } else if (tabStore instanceof DeviceDiffStore) {
        return <DiffPanel device_id={tabStore.device.id} />;
    } else if (tabStore instanceof ESPHomeCompileStore) {
        return <EspHomeCompilePanel device_id={tabStore.device.id} />;
    } else if (tabStore instanceof ESPHomeInstallStore) {
        return <EspHomeInstallPanel device_id={tabStore.device.id} />;
    } else if (tabStore instanceof ESPHomeLogStore) {
        return <EspHomeLogPanel device_id={tabStore.device.id} />;
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