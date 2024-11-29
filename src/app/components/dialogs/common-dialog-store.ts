import { DialogButtonProps } from "@primer/react";
import { makeAutoObservable } from "mobx";

export type TCommonModalStoreData = {
    title: string;
    subtitle?: string;
    confirmLabel?: string;
    confirmButtonType?: DialogButtonProps["buttonType"];
    cancelLabel?: string;
    cancelButtonType?: DialogButtonProps["buttonType"];
}

export class CommonDialogStore<TStoreData extends TCommonModalStoreData, TValue> {
    public storeData: TStoreData = {} as any;
    public isOpen: boolean = false;
    public value: TValue = null as any;

    onConfirm = () => { };
    onCancel = () => { };
    onClose = () => { };

    constructor(private readonly onOpenCallback: (self: CommonDialogStore<TStoreData, TValue>) => void) {
        makeAutoObservable(this);
    }

    public setValue(value: TValue) {
        this.value = value;
    }

    private setIsOpen(value: boolean) {
        if (value) {
            this.onOpenCallback(this);
        }

        this.isOpen = value;
    }

    public showModal(data: TStoreData) {
        this.storeData = makeAutoObservable(data);
        this.setIsOpen(true);

        return new Promise<TValue>((resolve, reject) => {
            this.onConfirm = () => { this.setIsOpen(false); resolve(this.value); };
            this.onCancel = () => { this.setIsOpen(false); reject(); };
            this.onClose = () => { this.setIsOpen(false); reject(); };
        });
    }

    public async tryShowModal(data: TStoreData) {
        try {
            return await this.showModal(data);
        } catch (e) {
            return undefined;
        }
    }
}