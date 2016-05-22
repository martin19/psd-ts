import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoParser} from "./EffectsLayerInfoParser";
export class cmnS implements IEffectsLayerInfoParser {

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
}
