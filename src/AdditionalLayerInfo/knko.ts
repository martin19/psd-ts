import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class knko implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  knockout:boolean;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.knockout = !!stream.readUint8();

    // padding
    stream.seek(3);

    this.length = stream.tell() - this.offset;
  }

}