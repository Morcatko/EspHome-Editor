type props = {
    data: string[];
}
export const HtmlViewer = (props: props) => {
    return <div style={{
        overflow: "auto",
        display: "block",
        unicodeBidi: "embed",
        fontFamily: "monospace",
        whiteSpace: "pre",
    }}
        dangerouslySetInnerHTML={{ __html: props.data.join('<br />') }} />;
};