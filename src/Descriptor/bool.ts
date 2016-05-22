import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class bool implements IDescriptorInfoParser {

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
}