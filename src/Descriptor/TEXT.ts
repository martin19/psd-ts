import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class TEXT implements IDescriptorInfoParser {

  offset:number;
  length:number;
  string:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.string = stream.readWideString(length);

    this.length = stream.tell() - this.offset;
  }
}