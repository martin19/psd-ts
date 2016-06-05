import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoBlock} from "./EffectsLayerInfoBlock";
import {StreamWriter} from "../../StreamWriter";
export class cmnS implements IEffectsLayerInfoBlock {

  offset:number;
  length:number;
  size:number;
  version:number;
  visible:boolean;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.size = stream.readUint32();
    this.version = stream.readUint32();

    this.visible = !!stream.readUint8();

    // unused
    stream.seek(2);

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter) {
    stream.writeUint32(7);
    stream.writeUint32(0);
    stream.writeUint8(1);
    stream.writeUint16(0);
  }

  getLength():number {
    return 11;
  }
}
