---
sidebar_position: 1
---

# Flowers

We will create an automated watering system for your flowers, with each plant having its own moisture sensor and motor for watering.

## 1. Shared Configuration
In this step we will write a shared configuration template for all the plants. This template will be used to generate the configuration for each plant.

- Navigate to the root `.lib` folder
- Create a new eta template file
    - Click the **"..."** menu on the `.lib` folder.
    - Select **New File...** and name it `demo-flower-template.eta`
    - Add the folowing code to the file (Source panel)
```yaml showLineNumbers .lib/demo-flowe-template.eta
esphome:
// highlight-next-line
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
        - 0 -> 0.0
        - 1.5 -> 100.0
    on_value_range:
    // highlight-next-line
      - below: <%= it.moisture_limit %>
        then:
          - switch.turn_on: relay
          // highlight-next-line
      - above: <%= it.moisture_limit %>
        then:
          - switch.turn_off: relay

switch:
  - platform: gpio
    pin: 26
    id: relay
    name: "Water pump"
```
        
- Note the placeholders in the
    - `<= it.name %>` (e.g., Line 2) is used to insert the name of each plant.
    - `<= it.moisture_limit  %>` (e.g., Lines 32 and 35) specifies the moisture threshold for watering.

These placeholders will dynamically update based on the variables you provide when using the template. You can test that by entering the following code in to "Test Data" panel:
```json
{
  "name": "sample",
  "moisture_limit": 99
}
```

## 2. Flower Device
Here we will create a configuration for your first plant.
- Add a new device for your first plant:
    - In the Devices Panel, click the *+ New Device* button.
    - Name it `Flower-1`
    - A `configuration.yaml` file will be generated automatically.
- Click *"..."* menu on `configuration.yaml` and rename it to `configuration.eta`.
- Edit `configuration.eta` with the following content:
```yaml Flower-1/configuration.eta
<%~ include('../.lib/demo-flower-template', 
    {
        name: 'flower-1', 
        moisture_limit: 35
    })
%>
```

## 3. Additional Devices
- Repeat *Step 2* for each additional plant you want to automate. Just change the `name` and `moisture_limit`
- Flash the configuration files to your physical hardware devices.
- Enjoy your automated plant watering system!
    