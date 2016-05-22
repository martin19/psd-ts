import {StreamReader} from "./StreamReader";
import {Header} from "./Header";

export class GlobalLayerMaskInfo {

  offset:number;
  length:number;
  overlayColorSpace:number;
  colorComponents:Array<number>;
  opacity:number;
  kind:number;
  filter:Array<number>|Uint8Array;


  constructor() {
  }

  parse(stream:StreamReader, header:Header) {
    var length:number;

    this.offset = stream.tell();
    length = stream.readUint32();
    this.length = length + 4;

    this.overlayColorSpace = stream.readUint16();
    this.colorComponents = [
      stream.readUint16(), stream.readUint16(),
      stream.readUint16(), stream.readUint16()
    ];
    this.opacity = stream.readUint16();
    this.kind = stream.readUint8();
    this.filter = stream.read(this.offset + this.length - stream.tell());

    stream.seek(this.offset + this.length, 0);
  }

}