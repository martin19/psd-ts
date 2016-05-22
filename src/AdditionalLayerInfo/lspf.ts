import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class lspf implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  flags:number;
  // TODO: flags のパースも行う


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.flags = stream.readUint32();
    this.length = stream.tell() - this.offset;
  }

}