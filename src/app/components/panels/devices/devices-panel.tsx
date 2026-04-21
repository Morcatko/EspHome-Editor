import { DataTable } from "mantine-datatable";
import { useDevicesPanelStore } from "./devices-panel-store";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Tooltip } from "@mantine/core";
import { TDevice } from "@/server/devices/types";
import { useDevicesColor } from "@/app/stores/devices-store";
import { DeviceLightbulbIcon } from "../../DeviceLightbulbIcon";
import { QuestionIcon } from "@primer/octicons-react";

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

const HeaderWithTooltip = ({ children, tooltip }: { children: React.ReactNode, tooltip: React.ReactNode }) => 
  <span>{children} <Tooltip label={tooltip}><QuestionIcon /></Tooltip></span>;

export const DevicesPanel = () => {
  const store = useDevicesPanelStore();

  const data = (store?.devices_query?.data ?? [])
    .filter(d => d.name !== ".lib");

  return <DataTable
    className="m-[10px]"
    withTableBorder
    withColumnBorders
    striped
    highlightOnHover
    //pinFirstColumn
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
        title: <HeaderWithTooltip tooltip="Information parsed from device log">On Device</HeaderWithTooltip>,

        columns: [
          { accessor: 'deviceInfo.chip', title: 'Chip' },
          { accessor: 'deviceInfo.esphome_version', title: 'ESPHome Version' },
          { accessor: 'deviceInfo.compiled_on', title: 'Compiled On', render: (r) => tryFormatDistanceToNowStrict(r.deviceInfo?.compiled_on) },
          { accessor: 'deviceInfo._updated_at', title: 'As of', width: 130, render: (r) => tryFormatDistanceToNowStrict(r.deviceInfo?._updated_at) },
        ]
      }, {
        id: 'compilation_info',
        title: <HeaderWithTooltip tooltip="Information from last compilation">Latest Build</HeaderWithTooltip>,
        columns: [
          { accessor: 'compilationInfo.status', title: 'Status' },
          { accessor: 'compilationInfo._updated_at', title: 'As of', width: 130, render: (r) => tryFormatDistanceToNowStrict(r.compilationInfo?._updated_at) },
        ]
      }
    ]}
  />;
}