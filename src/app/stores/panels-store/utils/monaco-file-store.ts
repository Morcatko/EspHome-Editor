import { api } from "@/app/utils/api-client";
import { makeAutoObservable, runInAction } from "mobx";
import { AsyncState } from "../../utils";

export class MonacoFileStore {
    loadState: AsyncState = "none";
    content: string = "";
    language: string = "";

    onChange: ((content: string) => void) | null = null;

    constructor(
        readonly readonly: boolean,
        language: string,
        private readonly _load: () => Promise<api.TCallResult>,
    ) {
        this.language = language;
        makeAutoObservable(this);
    }

    async reload() {
        this.loadState = "loading";
        const loadResult = await this._load();
        runInAction(() => {
            this.language = loadResult.status === 200 ? this.language : "plain";
            this.loadState = loadResult.status === 200 ? "loaded" : "error";
            this.content = loadResult.content;
        });
    }

    async loadIfNeeded() {
        if (this.loadState === "none") {
            await this.reload();
        }
    }

    changeContent(newContent: string) {
        this.content = newContent;
        this.onChange?.(this.content);
    }


}

export const createMonacoFileStore_url = (readonly: boolean, language: string, url: string) =>
    new MonacoFileStore(readonly, language, () => api.callGet_text(url));

export const createMonacoFileStore_local = (readonly: boolean, language: string, text: string) => 
    new MonacoFileStore(readonly, language, () => Promise.resolve({ status: 200, content: text }));