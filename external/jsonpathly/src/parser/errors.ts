export class JSONPathSyntaxError extends Error {
  line: number;
  charPositionInLine: number;
  msg: string;

  constructor(line: number, charPositionInLine: number, msg: string) {
    super(msg);
    this.line = line;
    this.charPositionInLine = charPositionInLine;
    this.msg = msg;
  }
}
