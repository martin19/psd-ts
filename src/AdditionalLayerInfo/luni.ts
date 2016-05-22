import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class luni implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  layerName:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();
    length = stream.readUint32();
    this.layerName = stream.readWideString(length);

    // NOTE: length が奇数の時はパディングがはいる
    if ((length & 1) === 1) {
      stream.seek(2);
    }

    this.length = stream.tell() - this.offset;
  }

}