import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class infx implements IAdditionalLayerInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeUint8(this.blendInteriorElements ? 1 : 0);
    for(var i = 0; i < 3;i++) {
      stream.writeUint8(0);
    }
  }

  getLength():number {
    return 4;
  }
}