import { StreamingStore } from "@/app/stores/panels-store/utils/streaming-store";
import { observer } from "mobx-react-lite";

type props = {
    store: StreamingStore;
}
export const LogStream = observer((props: props) => {
    return <div style={{
        overflow: "auto",
        display: "block",
        unicodeBidi: "embed",
        fontFamily: "monospace",
        whiteSpace: "pre",
    }}
        dangerouslySetInnerHTML={{ __html: props.store.data.join('<br />') }} />;
});