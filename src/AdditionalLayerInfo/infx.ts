import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class infx implements IAdditionalLayerInfoParser {

  offset : number;
  blendInteriorElements : boolean;
  length : number;

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.blendInteriorElements = !!stream.readUint8();

    // padding
    stream.seek(3);

    this.length = stream.tell() - this.offset;
  }

}