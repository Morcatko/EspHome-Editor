---
sidebar_position: 2
---

# Installation – Standalone Docker

You can also run **Editor for ESPHome** as a standalone, self-hosted Docker app. It connects to your existing ESPHome dashboard and stores editor-specific device configurations separately.

### Quick Demo

If you just want to try it out without setting anything up, run the following command:

```bash
docker run -d -p 8080:3000 morcatko/esphome-editor
```
This will launch the editor on port 8080 with some sample devices preloaded.

### Full Setup with Docker Compose
To use Editor for ESPHome with your own ESPHome instance and device configurations, follow these steps:

Create a folder to store editor device configurations (e.g. `/home/esphome-editor/devices` - ⚠️ This is not the folder where your ESPHome config files live.).

Create a docker-compose.yml file with the following content:

```yaml title="docker-compose.yaml"
name: editor-for-esphome
services:
  editor-for-esphome:
    image: morcatko/esphome-editor:latest
    container_name: editor-for-esphome
    environment:
      - ESPHOME_URL=http://192.168.0.99:6052         # Replace with your ESPHome dashboard URL
    ports:
      - 8080:3000                                    # Change 8080 to any external port you prefer
    volumes:
      - /home/esphome-editor/devices:/app/work-folder/devices
```

Start the container: ```docker compose up -d```
Once running, open your browser and go to http://localhost:8080 (or the external port you configured) to access the editor.