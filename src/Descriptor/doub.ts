import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class doub implements IDescriptorInfoParser {

  offset:number;
  length:number;
  value:number


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.value = stream.readFloat64();
    this.length = stream.tell() - this.offset;
  }
}