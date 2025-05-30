---
sidebar_position: 1
slug: /
---

# Introduction

import { BeakerIcon, CodeIcon, DownloadIcon, GitCompareIcon, LogIcon, UploadIcon } from "@primer/octicons-react";
import { color_local, color_gray, color_esphome, color_online, color_offline } from "@site/../src/app/utils/const";

**Editor for ESPHome** is a self-hosted, open-source, and fully offline code editor built specifically for working with [ESPHome](https://esphome.io) projects.

**Editor for ESPHome** is a self-hosted, open-source, and fully offline code editor built specifically for working with  projects.

It simplifies the process of configuring ESPHome devices by providing an intuitive interface for writing, editing, and managing YAML configuration files — especially those with repetitive or complex sections.

Whether you're a seasoned home automation enthusiast or just getting started with ESP-based devices, this editor helps you:

- **Speed up development** by reducing repetitive configuration tasks  
- **Stay offline and in control** with a local, self-hosted setup  

Once Editor for ESPHome is running, you'll be greeted with a clean and simple interface focused on managing and editing ESPHome device configurations.


![Screenshot](@site/static/img/screenshot.png)

## 📂 Sidebar – Device List

The sidebar on the left shows all devices currently stored in your editor's configuration folder and in ESPHome. From here, you can:

- View Device Status indicated by the color of the light bulb
    - <b style={{ color: color_gray }}>Gray</b> - Editor-only device
    - <b style={{ color: color_online }}>Online</b>/<b style={{ color: color_offline }}>Offline</b> - status of ESPHome device
- Add a new device
- Edit device configuration



## 📝 Editor Panel

The main area of the screen is the code editor. This is where you write or modify the configuration for the selected device.

Features include:

- Syntax highlighting for YAML
- Auto-indentation and smart formatting
- Quick navigation to ESPHome component documentation

## 🔧 Device Actions

At the top of the editor, you’ll find actions specific to the currently selected device:

- <DownloadIcon fill={color_local} /> Import configuration from ESPHome instance  
- <CodeIcon fill={color_local} /> View the compiled local ESPHome configuration  
- <GitCompareIcon fill={color_gray} /> Compare local vs. ESPHome configuration  
- <UploadIcon fill={color_gray} /> Upload local configuration to ESPHome  
- <CodeIcon fill={color_esphome} /> View ESPHome configuration  
- <BeakerIcon fill={color_esphome} /> Compile ESPHome configuration  
- <UploadIcon fill={color_esphome} /> Install configuration to a device  
- <LogIcon fill={color_esphome} /> View log stream  

---
In the next section, we'll walk you through how to get started with installing and running Editor for ESPHome on your own machine.