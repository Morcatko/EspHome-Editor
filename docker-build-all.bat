docker buildx use esphome-editor-builder
docker buildx build --platform=linux/amd64,linux/arm64 --load -t morcatko/esphome-editor:latest -f %~dp0Dockerfile .