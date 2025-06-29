# Room Sensors


Multiple devices with identical configurations, differing only by name (e.g., thermometers spread across your home).

1. Create an `.eta` template shared by all devices.

```yaml title=".lib/room-sensor.eta"
esphome:
  name: <%= it.name %>

sensor:
  - platform: dht
    pin: D2
    temperature:
      name: "Temperature"
    humidity:
      name: "Humidity"
    update_interval: <%= it.update_interval %>
```

2. Create a file for each device:

```yaml title="Living Room/index.eta"
<%~ include('../.lib/room-sensor', 
{ 
    name: 'Living Room', 
    update_interval: '60s'
}) %>
```
```yaml title="Kitchen/index.eta"
<%~ include('../.lib/room-sensor', 
{ 
    name: 'Kitchen', 
    update_interval: '30s'
}) %>
```
```yaml title="Bathroom/index.eta"
<%~ include('../.lib/room-sensor', 
{ 
    name: 'Bathroom', 
    update_interval: '30s'
}) %>
```
