import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class doub implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  value:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.value = stream.readFloat64();
    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter) {
    stream.writeFloat64(this.value);
  }

  getLength() {
    return 8;
  }
}