import { makeAutoObservable } from "mobx";
import { DevicesStore } from "./devices-store";
import { createContext, useContext } from "react";
import { PanelsStore } from "./panels-store";
import type { TTextInputModalStoreData } from "../components/dialogs/input-text-dialog";
import type { TConfirmationModalStoreData } from "../components/dialogs/confirmation-dialog";
import { CommonDialogStore } from "../components/dialogs/common-dialog-store";
import { QueryClient } from "@tanstack/react-query";

export class RootStore {
    readonly devices = new DevicesStore(this);
    readonly panels = new PanelsStore();
    readonly inputTextDialog = new CommonDialogStore<TTextInputModalStoreData, string>((x) => { x.value = x.storeData.defaultValue ?? ""; });
    readonly confirmationDialog = new CommonDialogStore<TConfirmationModalStoreData, boolean>((x) => { x.value = true; });	

  constructor() {
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();
export const queryClient = new QueryClient()
export const RootStoreContext = createContext<RootStore>(rootStore);
export const useStore = () => useContext(RootStoreContext);