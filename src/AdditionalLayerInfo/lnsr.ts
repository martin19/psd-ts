import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class lnsr implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  id:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.id = stream.readString(4);
    this.length = stream.tell() - this.offset;
  }

}