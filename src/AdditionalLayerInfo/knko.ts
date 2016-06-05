import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class knko implements IAdditionalLayerInfoBlock {

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

  write(stream:StreamWriter):void {
    stream.writeUint8(this.knockout ? 1 : 0);
    for(var i = 0; i < 3;i++) {
      stream.writeUint8(0);
    }
  }

  getLength():number {
    return 4;
  }
}