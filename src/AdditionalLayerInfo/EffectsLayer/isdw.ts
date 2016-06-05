import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoBlock} from "./EffectsLayerInfoBlock";
import {StreamWriter} from "../../StreamWriter";
export class isdw implements IEffectsLayerInfoBlock {

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


  write(stream:StreamWriter) {
    stream.writeUint32(51);
    stream.writeUint32(2);
    stream.writeInt32(this.blur);
    stream.writeInt32(this.intensity);
    stream.writeInt32(this.angle);
    stream.writeInt32(this.distance);

    stream.writeUint16(0);
    for(var i = 0; i < 4; i++) {
      stream.writeUint16(this.color[i]);
    }

    stream.writeUint8(this.enabled ? 1 : 0);
    stream.writeUint8(this.use ? 1 : 0);
    stream.writeUint8(this.opacity);
    stream.writeUint16(0);
    for(var i = 0; i < 4; i++) {
      stream.writeUint16(this.nativeColor[i]);
    }
  }

  getLength():number {
    return 55;
  }
}