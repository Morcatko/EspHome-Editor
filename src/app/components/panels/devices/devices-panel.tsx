import { Table } from "@mantine/core";
import { useDevicesPanelStore } from "./devices-panel-store";

export const DevicesPanel = () => {
    const store = useDevicesPanelStore();
 
    const data = store?.devices_query?.data ?? [];

    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Th />
                <Table.Th colSpan={4} align="center">Device Info</Table.Th>
                <Table.Th colSpan={2} align="center">Compilation Info</Table.Th>
            </Table.Tr>
            <Table.Tr>
                <Table.Th>Name</Table.Th>

                <Table.Th>Compilation</Table.Th>
                <Table.Th>Compilation Updated At</Table.Th>
                
                <Table.Th>Chip</Table.Th>
                <Table.Th>ESPHome Version</Table.Th>
                <Table.Th>Compiled On</Table.Th>
                <Table.Th>Info Updated At</Table.Th>
            </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
            {data.map((d) => <Table.Tr key={d.id}>
                <Table.Td>{d.name}</Table.Td>

                <Table.Td>{d.compilationResult ? (d.compilationResult?.success ? "Success" : "Failed") : ""}</Table.Td>
                <Table.Td>{d.compilationResult?.compilationResultUpdatedAt?.toLocaleString()}</Table.Td>

                <Table.Td>{d.deviceInfo?.chip}</Table.Td>
                <Table.Td>{d.deviceInfo?.esphome_version}</Table.Td>
                <Table.Td>{d.deviceInfo?.compiled_on?.toLocaleString()}</Table.Td>
                <Table.Td>{d.deviceInfo?.deviceInfoUpdatedAt?.toLocaleString()}</Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
    </Table>
}