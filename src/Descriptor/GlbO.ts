import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";
import {Descriptor} from "../Descriptor";

export class GlbO implements IDescriptorInfoParser {
  offset:number;
  length:number;
  value:Descriptor;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();
    this.value = new Descriptor();
    this.value.parse(stream);
    this.length = stream.tell() - this.offset;
  }
}