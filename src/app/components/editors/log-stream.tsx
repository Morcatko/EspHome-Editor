import { useEffect, useRef } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'
import { useStreamingStore } from "@/app/stores/panels-store/utils/streaming-store";
import React from "react";

type LogsProps = {
    store: ReturnType<typeof useStreamingStore>;
}

const Logs = (props: LogsProps) => {
    const parentRef = useRef(null)

    const rowVirtualizer = useVirtualizer({
        count: props.store.data.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 19.5,
        overscan: 5,
    })

    useEffect(() => {
        const lastOffset = rowVirtualizer.getOffsetForIndex(props.store.data.length - 1)?.[0] || 0;
        const currentOffset = rowVirtualizer.scrollOffset ?? 0;

        if ((lastOffset - currentOffset) < 80) {
            rowVirtualizer.scrollToIndex(props.store.data.length - 1);
        }
    }, [props.store.data.length, rowVirtualizer]);

    return <div
        ref={parentRef}
        className="p-2 absolute inset-0"
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
                    dangerouslySetInnerHTML={{ __html: props.store.data[virtualRow.index] }} />
            ))}
        </div>
    </div >;
};


const OutdatedCheck = ({ isOutdated, children }: { isOutdated: boolean, children: React.ReactNode }) => isOutdated
        ? <div>Click Refresh</div>
        : children;

export const LogStream = (props: LogsProps) => {
    return <OutdatedCheck isOutdated={props.store.isOutdated}>
        <Logs store={props.store} />
    </OutdatedCheck>
}