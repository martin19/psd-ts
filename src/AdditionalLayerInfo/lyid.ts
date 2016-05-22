import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class lyid implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  layerId:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.layerId = stream.readUint32();

    this.length = stream.tell() - this.offset;
  }

}