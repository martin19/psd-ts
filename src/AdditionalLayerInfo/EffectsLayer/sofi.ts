import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoBlock} from "./EffectsLayerInfoBlock";
import {StreamWriter} from "../../StreamWriter";
export class sofi implements IEffectsLayerInfoBlock {

  offset:number;
  length:number;
  size:number;
  version:number;
  blend:string;
  color:Array<any>;
  opacity:number;
  enabled:boolean;
  nativeColor:Array<any>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var signature:string;

    this.offset = stream.tell();
    this.size = stream.readUint32();
    this.version = stream.readUint32();

    signature = stream.readString(4);
    if (signature !== '8BIM') {
      throw new Error('invalid signature:'+ signature);
    }

    this.blend = stream.readString(4);

    // ARGB
    stream.seek(2);
    this.color = [
      stream.readUint16() >> 8,
      stream.readUint16() >> 8,
      stream.readUint16() >> 8,
      stream.readUint16() >> 8
    ];

    this.opacity = stream.readUint8();
    this.enabled = !!stream.readUint8();

    // ARGB
    stream.seek(2);
    this.nativeColor = [
      stream.readInt16() >> 8,
      stream.readInt16() >> 8,
      stream.readInt16() >> 8,
      stream.readInt16() >> 8
    ];

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter) {
    stream.writeUint32(34);
    stream.writeUint32(2);
    stream.writeString(this.blend);
    stream.writeUint16(0);

    for(var i = 0; i < 4; i++) {
      stream.writeUint16(this.color[i]);
    }

    stream.writeUint8(this.opacity);
    stream.writeUint8(this.enabled ? 1 : 0);

    stream.writeUint16(0);
    for(var i = 0; i < 4; i++) {
      stream.writeUint16(this.nativeColor[i]);
    }
  }

  getLength():number {
    return 38;
  }
}