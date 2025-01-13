import { SingleEditor } from "../editors/single-editor";
import { Code, Heading, Section } from "./components";

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

export const Flowers = () => {
  return <>
    <Heading
      title="Flowers"
      subtitle="We will make an automated plant watering system for all flowers in your house.
                Each device (a.k.a. plant) will have a moisture sensor, light sensor and a motor to water your plant." />

    <Section
      step="flower.shared"
      title="1. Shared Configuration">
      We will start by making a file in .lib folder called demo-flower-template.eta. Click on "..." menu in .lib folder and select "New file".
      <Code
        fileName=".lib/demo-flower-template.eta"
        heightPx={350}
        code={demo_flower_template_eta} />
      Notice the `&lt;%= it.name %&gt;` (line 2) and  `&lt;%= it.moisture_limit %&gt;` (lines 32 and 35) placeholders. These are used as variables passed whenever tempalte is used.
    </Section>
    <Section
      step="flower.flower-1"
      title="2. Flower Device">
      Now create a new device called flower-1.
      Use a "Create device" button in devices panel. This will automatically create a file "configuration.yaml" for you. ¨
      Rename it to configuration.eta and edit with following content.
      <Code
        fileName="flower-1/configuration.eta"
        heightPx={150}
        code={configuration_eta} />
    </Section>

    <Section
      step="flower.flower-2"
      title="3. Additional Devices">
      Repeat step 2. to create an automated watering system for every flower in your home.
      Just change the name in configuration.eta file.

      And that is it. Now you can open your ESPHome dashbpard and flash your configuration to a physical hardware.
    </Section>
  </>;
}