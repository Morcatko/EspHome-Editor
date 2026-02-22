export const fixStreamMessage = (message: string) =>
    message.trim().replaceAll("\\033", "\x1b");