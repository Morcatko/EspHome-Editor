# Multiple Components

PLC-like device with many identical inputs/outputs.

```yaml title="PLC/.lib/plc.eta"
<%- 
  const toHex = (number, digits) => number?.toString(16)?.padStart(digits, '0');
  const inputStartAddress = 0x00C0;
  const outputStartAddress = 0x0070;
%>
uart:
  tx_pin: 43
  rx_pin: 44
  baud_rate: 115200
modbus:
  - id: mb_main
    flow_control_pin: 2
modbus_controller:
  - id: mbc_1
    address: 0x1
    modbus_id: mb_main
    update_interval: 50ms

binary_sensor:
<%- for (let i = 0; i < it.inputs; i++) { 
    const offset = Math.trunc(i/16);
    const bit = i%16; 
%>
  - platform: modbus_controller
    modbus_controller_id: mbc_1
    id: input_0x<%= toHex(i+1, 2) %>
    register_type: holding
    address: 0x<%= toHex(inputStartAddress + offset, 4) %>
    bitmask: 0x<%= toHex(1 << bit, 4) %> # bit (<%= bit %>)
<%- } %>

switch:
<%- for (let i = 0; i < it.outputs; i++) { 
    const offset = Math.trunc(i/16);
    const bit = i%16; 
%>
  - platform: modbus_controller
    modbus_controller_id: mbc_1
    id: output_0x<%= toHex(i+1, 2) %>
    register_type: holding
    address: 0x<%= toHex(outputStartAddress + offset, 4) %>
    bitmask: 0x<%= toHex(1 << bit, 4) %> # bit (<%= bit %>)
<%_ } _%>
```

```yaml title="PLC/plc.eta"
<%~ include('./.lib/plc', { 
  outputs: 32,
  inputs: 32
}) %>
```
