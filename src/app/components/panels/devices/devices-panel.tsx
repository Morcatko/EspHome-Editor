import { DataTable } from "mantine-datatable";
import { TDeviceRecord, useDevicesPanelStore } from "./devices-panel-store";
import { format, formatDistanceToNowStrict } from "date-fns";
import { ActionIcon, Alert, Box, Button, HoverCard, Text, Tooltip } from "@mantine/core";
import { useDevicesColor } from "@/app/stores/devices-store";
import { DeviceLightbulbIcon } from "../../DeviceLightbulbIcon";
import { AlertIcon, CheckIcon, DiffAddedIcon, DiffIgnoredIcon, DiffRemovedIcon, InfoIcon, ListOrderedIcon, PlayIcon, QuestionIcon, SquareIcon } from "@primer/octicons-react";
import { AnsiConverter } from "@/app/utils/ansi-format-converter";
import { Icons } from "@/app/utils/icons";
import { JSX } from "react";
import { ExtLink } from "../../ext-link";

const CardBlock = ({ label, value }: { label: string, value: JSX.Element | string | null }) => (
  <Box mb="xs">
    {value}
    <Text fz="xs" c="dimmed">
      {label}
    </Text>
  </Box>
);

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
  return record.device.deviceInfo
    ? <HoverCard width={250} shadow="md">
      <HoverCard.Target>
        <span>{record.device.deviceInfo.esphome_version}</span>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <CardBlock label="ESPHome Version" value={record.device.deviceInfo.esphome_version} />
        <CardBlock label="Chip" value={record.device.deviceInfo.chip} />
        <CardBlock label="Compiled" value={tryFormatDistanceToNowStrict(record.device.deviceInfo?.compiled_on)} />
        <CardBlock label="Polled" value={tryFormatDistanceToNowStrict(record.device.deviceInfo?._updated_at)} />
      </HoverCard.Dropdown>
    </HoverCard>
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

  const selProps: ActionIcon.Props = {
    variant: "outline",
    size: "lg"
  };

  const anySelected = store.selectionStore[0].length > 0;

  const actionProps: Button.Props = {
    variant: "outline",
    size: "sm",
    disabled: !anySelected
  };

  return <div className="m-[10px]">
    <div className="mb-2">
      <Alert variant="light" color="orange" icon={<InfoIcon />}>
        This feature is in an early preview stage.
        Have any feedback - let us know in our <ExtLink href="https://github.com/Morcatko/EspHome-Editor/issues">GitHub</ExtLink>
      </Alert>
    </div>
    <div>
      <ActionIcon.Group display="inline">
        <Tooltip label="Select all devices">
          <ActionIcon {...selProps} onClick={() => store.selectionStore[1](data)} >
            <DiffAddedIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Toggle selection">
          <ActionIcon {...selProps} onClick={() => store.selectionStore[2]()} >
            <DiffIgnoredIcon />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Unelect all devices">
          <ActionIcon {...selProps} onClick={() => store.selectionStore[1]([])} >
            <DiffRemovedIcon />
          </ActionIcon>
        </Tooltip>
      </ActionIcon.Group>
      &nbsp;&nbsp;
      <Button.Group display="inline">
        <Tooltip label="Upload Selected Local Configs to ESPHome Device Builder">
          <Button {...actionProps} onClick={store.uploadSelected} leftSection={Icons.UploadToESPHome}>
            Upload
          </Button>
        </Tooltip>
        <Tooltip label="Compile Selected Devices">
          <Button {...actionProps} onClick={store.compileSelected} leftSection={Icons.Compile}>
            Compile
          </Button>
        </Tooltip>
      </Button.Group>
    </div>
    <DataTable
      className="mt-2"
      withTableBorder
      withColumnBorders
      striped
      highlightOnHover
      //pinFirstColumn
      selectedRecords={store.selectionStore[0]}
      onSelectedRecordsChange={store.selectionStore[1]}
      selectionTrigger="cell"
      records={data}
      columns={[
        {
          accessor: 'device.name',
          title: 'Name',
          width: 450, textAlign: 'right', render: deviceNameRenderer
        }, {
          title: <HeaderWithTooltip tooltip="Information from last compilation">Latest Build</HeaderWithTooltip>,
          width: 300,
          accessor: '__',
          render: compilationRenderer
        }, {
          title: <HeaderWithTooltip tooltip="Information collected from live logs">On Device</HeaderWithTooltip>,
          accessor: '__',
          width: 300,
          render: ESPHomeVersionRenderer
        }, {
          accessor: 'last_message',
          title: 'Last Message',
          noWrap: true,
          render: LastMessageRenderer
        }
      ]}
    />
  </div>;
}