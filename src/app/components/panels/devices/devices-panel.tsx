import { DataTable } from "mantine-datatable";
import { TDeviceRecord, useDevicesPanelStore } from "./devices-panel-store";
import { format, formatDistanceToNowStrict } from "date-fns";
import { Button, Tooltip } from "@mantine/core";
import { useDevicesColor } from "@/app/stores/devices-store";
import { DeviceLightbulbIcon } from "../../DeviceLightbulbIcon";
import { AlertIcon, CheckIcon, DiffAddedIcon, DiffIgnoredIcon, DiffRemovedIcon, ListOrderedIcon, PlayIcon, QuestionIcon, SquareIcon } from "@primer/octicons-react";
import { AnsiConverter } from "@/app/utils/ansi-format-converter";
import { icons } from "@/app/utils/icons";
import { DeviceToolbarItem } from "../../devices-tree/device-toolbar";

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

const LastMessageRenderer = (record: TDeviceRecord) => {
  const html = AnsiConverter.toHtml(record.last_message ?? "");
  return <>{(record.upload_status !== "success")
    ? <span><StatusIcon status={record.upload_status} />&nbsp;</span>
    : ""
  }
    <span
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </>;
};

export const DevicesPanel = () => {
  const store = useDevicesPanelStore();

  const data = [...store.devices.values()];

  const selProps: Button.Props = {
    variant: "outline",
    size: "sm",
  };

  const anySelected = store.selectionStore[0].length > 0;

  const actionProps: Button.Props = {
    ...selProps,
    disabled: !anySelected
  };

  return <>
    <div>
      <Button.Group display="inline">
        <Button {...selProps} leftSection={<DiffAddedIcon />} onClick={() => store.selectionStore[1](data)}>
          Select All
        </Button>
        <Button {...selProps} leftSection={<DiffIgnoredIcon />} onClick={() => store.selectionStore[1]([])}>
          Toggle
        </Button>
        <Button {...selProps} leftSection={<DiffRemovedIcon />} onClick={() => store.selectionStore[1]([])}>
          Unselect All
        </Button>
      </Button.Group>
      &nbsp;&nbsp;
      <Button.Group display="inline">
        <Tooltip label="Upload Selected Local Configs to ESPHome Device Builder">
          <Button {...actionProps} onClick={store.uploadSelected} leftSection={icons.uploadToESPHome}>
            Upload
          </Button>
        </Tooltip>
        <Tooltip label="Compile Selected Devices">
          <Button {...actionProps} onClick={store.compileSelected} leftSection={icons.compile}>
            Compile
          </Button>
        </Tooltip>
      </Button.Group>
    </div>
    <DataTable
      className="m-[10px]"
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
      //pinFirstColumn
      selectedRecords={store.selectionStore[0]}
      onSelectedRecordsChange={store.selectionStore[1]}
      selectionTrigger="cell"
      records={data}
      groups={[
        {
          id: 'name',
          title: '',
          columns: [
            {
              accessor: 'device.name', title: 'Name', width: 250, align: 'right', render: deviceNameRenderer
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
        }, {
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
            { accessor: 'last_message', title: 'Last Message', noWrap: true, render: LastMessageRenderer },
          ]
        }
      ]}
    /></>;
}