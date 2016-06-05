import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class long implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  value:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.value = stream.readInt32();
    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint32(this.value);
  }

  getLength():number {
    return 4;
  }
}