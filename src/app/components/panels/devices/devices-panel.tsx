import { DataTable } from "mantine-datatable";
import { useDevicesPanelStore } from "./devices-panel-store";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Tooltip } from "@mantine/core";
import { TDevice } from "@/server/devices/types";
import { useDevicesColor } from "@/app/stores/devices-store";
import { DeviceLightbulbIcon } from "../../DeviceLightbulbIcon";

const tryFormatDistanceToNowStrict = (date: Date | null | undefined) =>
  date
    ? <Tooltip label={format(date, "PPpp")}>
      <span>{formatDistanceToNowStrict(date, { addSuffix: true })}</span>
    </Tooltip>
    : "";

const deviceNameRenderer = (device: TDevice) => {
  const { getDeviceColor } = useDevicesColor();
  return <span style={{ color: getDeviceColor(device) }}>
    {device.name}&nbsp;<DeviceLightbulbIcon device={device} />
  </span>;
}

export const DevicesPanel = () => {
  const store = useDevicesPanelStore();
  const data = store?.devices_query?.data ?? [];

  return <DataTable
    withTableBorder
    withColumnBorders
    striped
    highlightOnHover
    records={data}
    groups={[
      {
        id: 'name',
        title: '',
        columns: [
          {
            accessor: 'name', title: 'Name', textAlign: 'right', render: deviceNameRenderer
          },
        ]
      }, {
        id: 'device_info',
        title: 'Device Info',
        columns: [
          { accessor: 'deviceInfo.chip', title: 'Chip' },
          { accessor: 'deviceInfo.esphome_version', title: 'ESPHome Version' },
          { accessor: 'deviceInfo.compiled_on', title: 'Compiled On', render: (r) => tryFormatDistanceToNowStrict(r.deviceInfo?.compiled_on) },
          { accessor: 'deviceInfo._updated_at', title: 'Updated At', render: (r) => tryFormatDistanceToNowStrict(r.deviceInfo?._updated_at) },
        ]
      }, {
        id: 'compilation_info',
        title: 'Compilation Info',
        columns: [
          { accessor: 'compilationInfo.success', title: 'Success', render: (r) => r.compilationInfo ? (r.compilationInfo?.success ? 'Yes' : 'No') : "" },
          { accessor: 'compilationInfo._updated_at', title: 'Updated At', render: (r) => tryFormatDistanceToNowStrict(r.compilationInfo?._updated_at) },
        ]
      }
    ]}
  />;
}