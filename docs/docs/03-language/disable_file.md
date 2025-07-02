---
sidebar_position: 30
---

# Disable Source File/Folder

This feature lets you define and switch between different versions (or _variants_) of a device configuration — without duplicating your entire ESPHome YAML setup.

This is useful for:

- Supporting multiple hardware revisions
- Toggling optional features (e.g., presence sensor vs. no sensor)
- Quickly testing new functionality without changing core templates

:::warning
This feature is currently in development and might change slightly in final version
:::

---

## How It Works

Disabling a file/fodler will remove it from compilation pipeline. Only enabled files are included in the final YAML output.

- You can organize variants in subfolders like `v1`, `v2`, `with_sensor`, `no_sensor`, etc.
- The editor UI lets you toggle these alternates on or off with a few clicks.
- Files in disabled folders are completely ignored during preprocessing and YAML assembly.

---

### Folder Structure Example
![Alternates](@site/static/img/alternates-device.png)

In this setup:

- Only one of `display_i2c` or `display_spi` should be enabled at a time.
- The rest of the configuration (`device.yaml`, `common.eta`) remains shared.

---

### Disabling a File/Folder in the UI

In the device editor:

1. Open context menu of a file/directory you want to disable
2. Click the **Disable...** menu item.
3. Enabled files/folders are included in the final YAML.
4. Disabled ones are ignored during build and grayed-out in devices & files panel

---

### Best Practices

- Use clear folder names like `v1`, `with_lights`, `test_mode`, etc.
- Keep folders modular — isolate them by feature or condition.
- Avoid overlapping IDs between alternate files unless intentionally overridden.

---

### Limitations

- This feature works at the file/folder level — you can’t selectively enable just part of a file.
- Only one version of a file with the same ID should be active at once to avoid conflicts.

---

This is a simple but powerful way to manage multiple configurations without copy-pasting entire YAMLs.