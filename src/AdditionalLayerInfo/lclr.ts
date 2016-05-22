import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class lclr implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  color:Array<number>;
  // TODO: flags のパースも行う


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.color = [
      stream.readUint32(),
      stream.readUint32()
    ];
    this.length = stream.tell() - this.offset;
  }

}
