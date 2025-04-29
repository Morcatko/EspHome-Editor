import type { TOperationResult } from "@/server/devices/types";
import { Table } from "@mantine/core";

type TProps = {
    logs?: TOperationResult["logs"]
}

const LogIcon = ({ type }: { type: TOperationResult["logs"][0]["type"] }) => {
    switch (type) {
        case "info":
            return <span>ℹ️</span>;
        case "error":
            return <span>❌</span>;
        default:
            return <span>ℹ️</span>;
    }
}

export const LogList = (props: TProps) => {
    return <Table stickyHeader>
        <Table.Thead>
            <Table.Tr>
                <Table.Th style={{width: '28px'}}></Table.Th>
                <Table.Th>Message</Table.Th>
                <Table.Th>Path</Table.Th>
                <Table.Th>Exception</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {props.logs?.length === 0
                ? <Table.Tr><Table.Td colSpan={5}>No logs</Table.Td></Table.Tr>
                : props.logs?.map((l, i) =>
                    <Table.Tr key={i}>
                        <Table.Td><LogIcon type={l.type} /></Table.Td>
                        <Table.Td>{l.message}</Table.Td>
                        <Table.Td>{l.path}</Table.Td>
                        <Table.Td>{l.type === "error" ? l.exception : null}</Table.Td>
                    </Table.Tr>)
            }
        </Table.Tbody>
    </Table>


}