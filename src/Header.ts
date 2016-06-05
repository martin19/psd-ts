import {StreamReader} from "./StreamReader";
import {ColorMode} from "./Enum";
import {StreamWriter} from "./StreamWriter";
export class Header {

  offset:number;
  length:number;
  signature:string;
  version:number;
  reserved:Uint8Array|Array<number>;
  channels:number;
  rows:number;
  columns:number;
  depth:number;
  colorMode:ColorMode;

  parse(stream:StreamReader) {
    this.offset = stream.tell();

    // signature
    this.signature = stream.readString(4);
    if (this.signature !== '8BPS') {
      throw new Error('invalid signature');
    }

    this.version = stream.readUint16();
    this.reserved = stream.read(6);
    this.channels = stream.readUint16();
    this.rows = stream.readUint32();
    this.columns = stream.readUint32();
    this.depth = stream.readUint16();
    this.colorMode = stream.readUint16();

    this.length = stream.tell() - this.offset;
  }
  
  write(stream:StreamWriter) {
    stream.writeString("8BPS");
    stream.writeUint16(1);
    stream.write([0,0,0,0,0,0]);
    stream.writeUint16(this.channels);
    stream.writeUint32(this.rows);
    stream.writeUint32(this.columns);
    stream.writeUint16(this.depth);
    stream.writeUint16(this.colorMode);
  }
}