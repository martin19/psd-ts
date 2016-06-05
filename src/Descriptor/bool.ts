import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class bool implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  value:boolean;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.value = !!stream.readUint8();
    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter) {
    stream.writeUint8(this.value ? 1 : 0);
  }

  getLength() {
    return 1;
  }
}