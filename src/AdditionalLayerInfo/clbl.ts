import {StreamReader} from "../StreamReader";
import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";

export class clbl implements IAdditionalLayerInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeUint8(this.blendClippedElements ? 1 : 0);
    for(var i = 0; i < 3;i++) {
      stream.writeUint8(0);
    }
  }

  getLength():number {
    return 4;
  }
}