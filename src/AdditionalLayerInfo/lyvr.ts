import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class lyvr implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  version:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.version = stream.readUint32();

    this.length = stream.tell() - this.offset;
  }

}