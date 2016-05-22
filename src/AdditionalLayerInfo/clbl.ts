import {StreamReader} from "../StreamReader";
import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {Header} from "../Header";

export class clbl implements IAdditionalLayerInfoParser {

  offset : number;
  length : number;
  blendClippedElements : boolean;

  constructor() {
  }

  parse(stream:StreamReader, length? : number, header?:Header) {
    this.offset = stream.tell();

    this.blendClippedElements = !!stream.readUint8();

    // padding
    stream.seek(3);

    this.length = stream.tell() - this.offset;
  }

}