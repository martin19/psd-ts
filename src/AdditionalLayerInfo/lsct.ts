import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class lsct implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  type:number;
  key:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var signature:string;

    this.offset = stream.tell();
    this.type = stream.readUint32();

    if (length === 12) {
      signature = stream.readString(4);
      if (signature !== '8BIM') {
        throw new Error('invalid section divider setting signature:'+ signature);
      }

      this.key = stream.readString(4);
    }

    this.length = stream.tell() - this.offset;
  }

}