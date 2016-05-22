import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoParser} from "./EffectsLayerInfoParser";
export class dsdw implements IEffectsLayerInfoParser {

  offset:number;
  length:number;
  size:number;
  version:number;
  blur:number;
  intensity:number;
  angle:number;
  distance:number;
  color:Array<any>;
  signature:string;
  blend:string;
  enabled:boolean;
  use:boolean;
  opacity:number;
  nativeColor:Array<any>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.size = stream.readUint32();
    this.version = stream.readUint32();

    this.blur = stream.readInt32();
    this.intensity = stream.readInt32();
    this.angle = stream.readInt32();
    this.distance = stream.readInt32();

    stream.seek(2);
    this.color = [
      stream.readUint32(),
      stream.readUint32()
    ];

    this.signature = stream.readString(4);
    this.blend = stream.readString(4);

    this.enabled = !!stream.readUint8();
    this.use = !!stream.readUint8();

    this.opacity = stream.readUint8();

    stream.seek(2);
    this.nativeColor = [
      stream.readUint32(),
      stream.readUint32()
    ];

    this.length = stream.tell() - this.offset;
  }
}