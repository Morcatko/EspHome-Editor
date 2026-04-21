import { DataTable } from "mantine-datatable";
import { TDeviceRecord, useDevicesPanelStore } from "./devices-panel-store";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Button, Tooltip } from "@mantine/core";
import { useDevicesColor } from "@/app/stores/devices-store";
import { DeviceLightbulbIcon } from "../../DeviceLightbulbIcon";
import { AlertIcon, CheckIcon, ListOrderedIcon, PlayIcon, QuestionIcon } from "@primer/octicons-react";
import { AnsiConverter } from "@/app/utils/ansi-format-converter";

const tryFormatDistanceToNowStrict = (date: Date | null | undefined) =>
  date
    ? <Tooltip label={format(date, "PPpp")}>
      <span>{formatDistanceToNowStrict(date, { addSuffix: true })}</span>
    </Tooltip>
    : "";

const deviceNameRenderer = (record: TDeviceRecord) => {
  const { getDeviceColor } = useDevicesColor();
  return <span style={{ color: getDeviceColor(record.device) }}>
    {record.device.name}&nbsp;<DeviceLightbulbIcon device={record.device} />
  </span>;
}

const StatusIcon = ({ status }: { status: TDeviceRecord["compilation_status"] }) => {
  switch (status) {
    case "planned": return <ListOrderedIcon fill="orange" />;
    case "running": return <PlayIcon fill="blue" />;
    case "success": return <CheckIcon fill="green" />;
    case "failed": return <AlertIcon fill="red" />;
    default: return null;
  }
}

const compilationRenderer = (record: TDeviceRecord) => {
  return <><StatusIcon status={record.compilation_status} />&nbsp;{
    record.compilation_status !== "running"
      ? tryFormatDistanceToNowStrict(record.device.compilationInfo?._updated_at)
      : ""
  }</>;
}

const HeaderWithTooltip = ({ children, tooltip }: { children: React.ReactNode, tooltip: React.ReactNode }) =>
  <span>{children} <Tooltip label={tooltip}><QuestionIcon /></Tooltip></span>;

const ESPHomeVersionRenderer = (record: TDeviceRecord) => {
  //@esphome @ chip
return record.device.deviceInfo
  ? `${record.device.deviceInfo.esphome_version} @ ${record.device.deviceInfo.chip}`
  : "";
}

const lastMessageRenderer = (record: TDeviceRecord) => {
  const html = AnsiConverter.toHtml(record.last_message ?? "");
  return <span
    dangerouslySetInnerHTML={{ __html: html }}
  />;
};

export const DevicesPanel = () => {
  const store = useDevicesPanelStore();

  const data = [...store.devices.values()];

  return <>
    <Button onClick={store.compile} disabled={store.selectionStore[0].length === 0}>Compile selected</Button>
    <DataTable
      className="m-[10px]"
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
      //pinFirstColumn
      selectedRecords={store.selectionStore[0]}
      onSelectedRecordsChange={store.selectionStore[1]}

      records={data}
      groups={[
        {
          id: 'name',
          title: '',
          columns: [
            {
              accessor: 'device.name', title: 'Name', width: 200,textAlign: 'right', render: deviceNameRenderer
            },
          ]
        }, {
          id: 'compilation_info',
          title: '',
          columns: [
            {
              accessor: 'compilation_status',
              title: <HeaderWithTooltip tooltip="Information from last compilation">Latest Build</HeaderWithTooltip>,
              width: 150,
              render: compilationRenderer
            }
          ]
        },{
          id: 'device_info',
          title: <HeaderWithTooltip tooltip="Information parsed from device log">On Device</HeaderWithTooltip>,
          columns: [
            { accessor: 'device.deviceInfo', title: 'ESPHome Version', width: 250, render: ESPHomeVersionRenderer },
            { accessor: 'device.deviceInfo.compiled_on', title: 'Compiled On', width: 130, render: (r) => tryFormatDistanceToNowStrict(r.device.deviceInfo?.compiled_on) },
            { accessor: 'device.deviceInfo._updated_at', title: 'As of', width: 130, render: (r) => tryFormatDistanceToNowStrict(r.device.deviceInfo?._updated_at) },
          ]
        }, {
          id: 'last_message',
          title: "",
          columns: [
            { accessor: 'last_message', title: 'Last Message', noWrap: true, render: lastMessageRenderer },
          ]
        }
      ]}
    /></>;
}