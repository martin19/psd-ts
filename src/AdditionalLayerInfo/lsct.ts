import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class lsct implements IAdditionalLayerInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeUint32(this.type);
    if(this.key !== "norm") {
      stream.writeString("8BIM");
      stream.writeString(this.key);
    }
  }

  getLength():number {
    if(this.key !== "norm") {
      return 12;
    } else {
      return 4;
    }
  }
}