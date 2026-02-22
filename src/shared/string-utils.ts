const removeAnsiControlSequencesRegEx = /\x1b\[[0-9;]*m/g;

export const fixStreamMessage = (message: string) =>
    message.trim().replaceAll("\\033", "\x1b");

export const removeAnsiControlSequences = (message: string) =>
    fixStreamMessage(message).replaceAll(removeAnsiControlSequencesRegEx, '');