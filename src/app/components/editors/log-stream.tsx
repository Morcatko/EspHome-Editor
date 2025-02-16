import { useEffect, useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'

type props = {
    data: string[];
}

export const LogStream = (props: props) => {
    const parentRef = useRef(null)

    const rowVirtualizer = useVirtualizer({
        count: props.data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 19.5,
        overscan: 5,
    })

    useEffect(() => {
        const lastOffset = rowVirtualizer.getOffsetForIndex(props.data.length - 1)?.[0] || 0;
        const currentOffset = rowVirtualizer.scrollOffset ?? 0;

        if ((lastOffset - currentOffset) < 80) {
            rowVirtualizer.scrollToIndex(props.data.length - 1);
        }
    }, [props.data.length, rowVirtualizer]);

    return <div
        ref={parentRef}
        className="p-2 h-full"
        style={{
            overflow: "auto",
            display: "block",
            unicodeBidi: "embed",
            fontFamily: "monospace",
            fontSize: "0.8rem",
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