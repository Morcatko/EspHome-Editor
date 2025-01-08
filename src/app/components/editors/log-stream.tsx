import { useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'

type props = {
    data: string[];
}

export const LogStream = (props: props) => {
    // return <div style={{
    //     overflow: "auto",
    //     display: "block",
    //     unicodeBidi: "embed",
    //     fontFamily: "monospace",
    //     whiteSpace: "pre",
    // }}>
    //     {props.data.map((line, index) => <div key={index} dangerouslySetInnerHTML={{ __html: line }} />)}
    // </div>;


    const parentRef = useRef(null)

    const rowVirtualizer = useVirtualizer({
        count: props.data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 19.5,
        overscan: 5,
    })

    return <div
        ref={parentRef}
        style={{
            overflow: "auto",
            display: "block",
            unicodeBidi: "embed",
            fontFamily: "monospace",
            whiteSpace: "pre",
        }}>
        <div
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
            }}
        >
            {rowVirtualizer.getVirtualItems().map(virtualRow => (
                <div
                    key={virtualRow.key}
                    className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                    }}
                    dangerouslySetInnerHTML={{ __html: props.data[virtualRow.index] }} />
            ))}
        </div>
    </div >;
};