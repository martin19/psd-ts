import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class lclr implements IAdditionalLayerInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeUint32(this.color[0]);
    stream.writeUint32(this.color[1]);
  }

  getLength():number {
    return 8;
  }
}
