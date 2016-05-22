import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class UntF implements IDescriptorInfoParser {

  offset:number;
  length:number;
  units:string;
  value:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.units = stream.readString(4);
    this.value = stream.readFloat64();
    this.length = stream.tell() - this.offset;
  }
}