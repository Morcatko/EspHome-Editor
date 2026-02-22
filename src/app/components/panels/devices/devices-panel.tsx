import { Table } from "@mantine/core";
import { useDevicesPanelStore } from "./devices-panel-store";

export const CompileCell = (props: { device_id: string }) => {
    const store = useDevicesPanelStore();
    const state = store.getCompileState(props.device_id);

    return (state.status === "unknown")
        ? <button onClick={() => store.compile(props.device_id)}>Compile</button>
        : <div>
            <div>{state.status}</div>
            <div>{state.last_message}</div>
            <div>{state.finished_at?.toISOString() ?? "Not finished"}</div>
        </div>;
}

export const DevicesPanel = () => {
    const store = useDevicesPanelStore();
 
    const data = store?.devices_query?.data ?? [];

    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Chip</Table.Th>
                <Table.Th>ESPHome Version</Table.Th>
                <Table.Th>Compiled On</Table.Th>
                <Table.Th>Info Updated At</Table.Th>
                <Table.Th>Action</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {data.map((d) => <Table.Tr key={d.id}>
                <Table.Td>{d.name}</Table.Td>
                <Table.Td>{d.deviceInfo?.chip}</Table.Td>
                <Table.Td>{d.deviceInfo?.esphome_version}</Table.Td>
                <Table.Td>{d.deviceInfo?.compiled_on}</Table.Td>
                <Table.Td>{d.deviceInfo?.deviceInfoUpdatedAt}</Table.Td>
                <Table.Td><CompileCell device_id={d.id} /></Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
    </Table>
}