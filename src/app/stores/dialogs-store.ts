import { atom, getDefaultStore, useAtom } from 'jotai'
import { TTextInputModalStoreData } from '../components/dialogs/input-text-dialog'

type TTextInputModalStoreDataInternal = TTextInputModalStoreData & {
    isOpen: boolean;
    onClose: (confirm: boolean) => void;
    value: string;
}

const textInputAtom = atom<TTextInputModalStoreDataInternal>();
const defaultStore = getDefaultStore();
export const textInputStore = {
    open: (props: TTextInputModalStoreData) => {
        return new Promise<string>((resolve, reject) => {
            defaultStore.set(textInputAtom,
                {
                    ...props,
                    isOpen: true,
                    value: props.defaultValue ?? '',
                    onClose: (confirm) => {   
                        defaultStore.set(textInputAtom, { ...defaultStore.get(textInputAtom)!, isOpen: false });                 
                        console.log("onCLose", confirm);
                        if (confirm) {
                            resolve(defaultStore.get(textInputAtom)?.value ?? "");
                        } else {
                            reject();
                        }
                    }
                });
        });
    },
    tryOpen: async (props: TTextInputModalStoreData) => {
        try {
            return await textInputStore.open(props);
        } catch (e) {
            return undefined;
        }
    }
};

export const useTextInputDialogInternalStore = () => {
    const [state, setState] = useAtom(textInputAtom);

    return {
        isOpen: state?.isOpen ?? false,
        modalContent: state!,
        setValue: (value: string) => setState({ ...state!, value }),
        onCancel: () => state?.onClose(false),
        onConfirm: () => state?.onClose(true),
    };
}