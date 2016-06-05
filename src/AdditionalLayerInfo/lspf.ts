import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class lspf implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  flags:number;
  // TODO: flags のパースも行う


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.flags = stream.readUint32();
    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter):void {
    stream.writeUint32(this.flags);
  }

  getLength():number {
    return 4;
  }
}