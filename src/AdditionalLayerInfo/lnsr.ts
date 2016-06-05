import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class lnsr implements IAdditionalLayerInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeString(this.id);
  }

  getLength():number {
    return this.id.length;
  }
}