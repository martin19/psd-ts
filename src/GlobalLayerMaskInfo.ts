import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {StreamWriter} from "./StreamWriter";

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

  write(stream:StreamWriter, header?:Header) {
    stream.writeUint32(0);

    //TODO: find out when this information is required
    // stream.writeUint32(this.getLength()-4);
    // stream.writeUint16(this.overlayColorSpace);
    // for(var i = 0; i < 4;i++) {
    //   stream.writeUint16(this.colorComponents[i]);
    // }
    // stream.writeUint16(this.opacity);
    // stream.writeUint8(this.kind);
    // stream.write([0,0,0]);
  }

  getLength():number {
    return 4;
    //TODO: find out when this information is required
    //return 4 + 2 + 8 + 2 + 1 + 3;
  }
}