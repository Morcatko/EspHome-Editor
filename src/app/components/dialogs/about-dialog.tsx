import {atom, useAtom } from 'jotai';

const aboutDialogVisibleAtom = atom<boolean>(false);
export const useAboutDialogVisible = () => useAtom(aboutDialogVisibleAtom);


export const AboutDialog = () => {
    const [visible, setVisible] = useAboutDialogVisible();

    return <Dialog
        title="About"
        isOpen={visible}
        onClose={() => setVisible(false)}
}