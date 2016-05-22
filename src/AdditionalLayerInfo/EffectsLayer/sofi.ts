import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoParser} from "./EffectsLayerInfoParser";
export class sofi implements IEffectsLayerInfoParser {

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
}