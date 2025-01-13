import { Editor, Heading, Section } from "./components";

const demo_flower_template_eta =
  `esphome:
  name: <%= it.name %>

esp32:
  board: m5stack-atom
  framework:
    type: arduino

api:
ota:
    platform: esphome

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password


sensor:
  - platform: adc
    pin: 32
    name: Soil Moisture Value
    attenuation: 11db
    id:  soil_moisture
    accuracy_decimals: 0
    unit_of_measurement: "%"
    update_interval: 10s
    filters:
      - calibrate_linear:
        - 1.795 -> 0.0
        - 1.43 -> 100.0
    on_value_range:
      - below: <%= it.moisture_limit %>
        then:
          - switch.turn_on: relay
      - above: <%= it.moisture_limit %>
        then:
          - switch.turn_off: relay

switch:
  - platform: gpio
    pin: 26
    id: relay
    name: "Water pump"`;

const configuration_eta =
  `<%~ include('../.lib/demo-flower-template', 
    {
        name: 'flower-1', 
        moisture_limit: 35
    })
%>`;

type TChildren = {
  children: React.ReactNode
}
const Ol = (p: TChildren) => <ol className="list-decimal list-inside space-y-2 pl-3">{p.children}</ol>;
const Ul = (p: TChildren) => <ul className="list-disc list-inside space-y-2 pl-3">{p.children}</ul>;
const Code = (p: TChildren) => <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-blue-700 dark:text-blue-300 font-mono">{p.children}</code>;

export const Flowers = () => {
  return <>
    <Heading
      title="Flowers"
      subtitle="We will create an automated watering system for your houseplants, with each plant having its own moisture sensor and motor for watering." />

    <Section
      step="flower.shared"
      title="Step 1: Shared Configuration">
      <Ol>
        <li>Navigate to the <Code>.lib</Code> folder</li>
        <li>Create a new file called <Code>demo-flower-template.eta</Code>
          <Ul>
            <li>Click the <strong>"..."</strong> menu on the <Code>.lib</Code> folder.</li>
            <li>Select <strong>New File...</strong> and name it <Code>demo-flower-template.eta</Code></li>
          </Ul>
        </li>
        <li>Add the folowing code to the file
          <Editor
            heightPx={350}
            code={demo_flower_template_eta} />
        </li>
        <li>Note the placeholders in the
          <Ul>
            <li><Code>&lt;= it.name %&gt;</Code> (e.g., Line 2) is used to insert the name of each plant.</li>
            <li><Code>&lt;= it.moisture_limit  %&gt;</Code> (e.g., Lines 32 and 35) specifies the moisture threshold for watering.</li>
          </Ul>
          These placeholders will dynamically update based on the variables you provide when using the template.
        </li>
      </Ol>
    </Section>

    <Section
      step="flower.flower-1"
      title="Step 2: Flower Device">
      <Ol>
        <li>
          Add a new device for your first plant:
          <Ul>
            <li>In the <strong>Devices</strong> panel, click the <strong>"Create device"</strong> button.</li>
            <li>Name it <Code>Flower-1</Code></li>
            <li>A <Code>configuration.yaml</Code> file will be generated automatically.</li>
          </Ul>
        </li>
        <li>Rename <Code>configuration.yaml</Code> to <Code>configuration.eta</Code>.</li>
        <li>Edit <Code>configuration.eta</Code> with the following content:
          <Editor
            heightPx={150}
            code={configuration_eta} />
        </li>
      </Ol>
    </Section>

    <Section
      step="flower.flower-2"
      title="Step 3: Additional Devices">
      <Ol>
        <li>Repeat <strong>Step 2</strong> for each additional plant you want to automate. Just change the <Code>name</Code> and <Code>moisture_limit</Code></li>
        <li>Flash the configuration files to your physical hardware devices.</li>
        <li>Enjoy your automated plant watering system!</li>
      </Ol>
    </Section>
  </>;
}