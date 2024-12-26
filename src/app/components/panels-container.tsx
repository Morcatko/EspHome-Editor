import { observer } from "mobx-react-lite";
import { useStore } from "../stores";
import { ESPHomeDeviceStore } from "../stores/panels-store/esphome-device-store";
import { LocalFileStore } from "../stores/panels-store/local-file-store";
import { LocalDeviceStore } from "../stores/panels-store/local-device-store";
import { DeviceDiffStore } from "../stores/panels-store/device-diff-store";
import { ESPHomeCompileStore } from "../stores/panels-store/esphome-compile-store";
import { LogStream } from "./panels/log-stream";
import { ESPHomeInstallStore } from "../stores/panels-store/esphome-install-store";
import { ESPHomeLogStore } from "../stores/panels-store/esphome-log-store";
import { IPanelsStore } from "../stores/panels-store/utils/IPanelsStore";
import { LocalFilePanel } from "./panels/local-file-panel";
import { LocalDevicePanel } from "./panels/local-device-panel";
import { ESPHomeDevicePanel } from "./panels/esphome-device-panel";
import { DiffPanel } from "./panels/diff-panel";
import { Actions, CLASSES, Layout, Model, TabNode } from "flexlayout-react";

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


const factory = (node: TabNode) => {
    var component = node.getComponent();

    return <div>{component}</div>
}

var json = {
    global: {},
    borders: [{
        "type": "border",
        "location": "left",
        enableAutoHide: true,
        selected: 0,
        "children": [
            {
                "type": "tab",
                "name": "Devices",
                "component": "devices",
                "enableClose": false,
            }
        ]
    },{
        "type": "border",
        enableAutoHide: true,
        "location": "right"
    }],
    layout: {
        type: "row",
        weight: 100,
        children: [
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "One",
                        component: "button",
                    }
                ]
            },
            {
                type: "tabset",
                weight: 50,
                children: [
                    {
                        type: "tab",
                        name: "Two",
                        component: "button",
                    }
                ]
            }
        ]
    }
};

const model = Model.fromJson(json);

export const PanelsContainer = observer(() => {
    const store = useStore();

    const tabStore = store.panels.tab;

    tabStore?.loadIfNeeded();

    if (!tabStore) {
        return <div className="relative h-full w-full"><Layout
            // classNameMapper={classNameMapper}
            model={model}
            factory={factory}
        />
        </div>;
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