import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {PathRecord} from "../PathRecord";
export class vmsk implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  version:number;
  flags : number;
  path : PathRecord;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var limit:number = stream.tell() + length;

    this.offset = stream.tell();
    this.version = stream.readUint32();
    this.flags = stream.readUint32();

    while (stream.tell() + 26 <= limit) {
      this.path = new PathRecord();
      this.path.parse(stream);
    }

    this.length = stream.tell() - this.offset;
  }

}