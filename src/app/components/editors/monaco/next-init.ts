export const nextMonacoInit = () => {
    import('./index')
        .then((index) => {
            index.monacoInit();
        });

}