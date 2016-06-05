import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoBlock} from "./EffectsLayerInfoBlock";
import {StreamWriter} from "../../StreamWriter";
export class iglw implements IEffectsLayerInfoBlock {

  offset:number;
  length:number;
  size:number;
  version:number;
  blur:number;
  intensity:number;
  color:Array<any>;
  signature:string;
  blend:string;
  enabled:boolean;
  opacity:number;
  invert:boolean;
  nativeColor:Array<any>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.size = stream.readUint32();
    this.version = stream.readUint32();

    this.blur = stream.readInt32();
    this.intensity = stream.readInt32();

    stream.seek(2);
    this.color = [
      stream.readUint32(),
      stream.readUint32()
    ];

    this.signature = stream.readString(4);
    this.blend = stream.readString(4);
    this.enabled = !!stream.readUint8();
    this.opacity = stream.readUint8();

    // version 2 only
    if (this.version === 2) {
      this.invert = !!stream.readUint8();

      stream.seek(2);
      this.nativeColor = [
        stream.readUint32(),
        stream.readUint32()
      ];
    }

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter) {
    stream.writeUint32(43);
    stream.writeUint32(2);
    stream.writeInt32(this.blur);
    stream.writeInt32(this.intensity);
    stream.writeUint16(0);
    for(var i = 0; i < 4; i++) {
      stream.writeUint16(this.color[i]);
    }
    stream.writeString(this.signature);
    stream.writeString(this.blend);
    stream.writeUint8(this.enabled ? 1 : 0);
    stream.writeUint8(this.opacity);

    stream.writeUint8(this.invert ? 1 : 0);
    stream.writeUint16(0);
    for(var i = 0; i < 4; i++) {
      stream.writeUint16(this.nativeColor[i]);
    }
  }

  getLength():number {
    return 47;
  }
}