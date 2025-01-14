import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";
import type { TTextInputModalStoreData } from "../components/dialogs/input-text-dialog";
import type { TConfirmationModalStoreData } from "../components/dialogs/confirmation-dialog";
import { CommonDialogStore } from "../components/dialogs/common-dialog-store";
import { QueryClient } from "@tanstack/react-query";

export class RootStore {
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