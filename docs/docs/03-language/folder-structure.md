---
sidebar_position: 20
---
# Folders & Files
Let's see how you can structure source files for your ESPHome config.

By default all files in a root folder of a device are processed. Those files however can include other files. That way you can share a code between some or all your devices.

:::warning
Eventually not only root files, but also files in folders might be added to a processing pipeline. Therefore it is recommended to add helper files into devices `.lib` folder
:::

TODO:
 - screenshot of device list with .lib and one device.
 - File processing order is not guaranteeed and should not be important.



Apart from source files like `.yaml` `.eta` `.patch`, etc. you can also add `.md` and `.txt` text files just for your notes or documentation

