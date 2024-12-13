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

            await api.getStream(
                this.url,
                m => {
                    const html = convert.toHtml(
                        m.replaceAll("\\033", "\x1b"),
                    );
                    runInAction(() => this.data.push(html));
                });
        }
    }
}
