import Convert from "ansi-to-html";
import { AsyncState } from "../../utils";
import { makeAutoObservable, runInAction } from "mobx";
import { api } from "@/app/utils/api-client";

const convert = new Convert({
    stream: true,
});

export class StreamingStore {
    loadState: AsyncState = "none";
    readonly data: string[] = [];
    content: string = "";

    constructor(private readonly url: string) {
        makeAutoObservable(this);
    }

    async loadIfNeeded() {
        if ((this.loadState === "none") || (this.loadState === "error")) {
            this.loadState = "loading";
            const sse = new EventSource(api.fixUrl(this.url));
            sse.addEventListener("completed", () => sse.close());
            sse.addEventListener("error", () => sse.close());
            sse.addEventListener("message", (ev) => {
                const html = convert.toHtml(
                    (ev.data as string).replaceAll("\\033", "\x1b"),
                );
                runInAction(() => this.data.push(html));
            });
        }
    }
}
