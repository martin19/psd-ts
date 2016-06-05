import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {Descriptor} from "../Descriptor";
import {StreamWriter} from "../StreamWriter";

export class Objc implements IDescriptorInfoBlock {

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


  write(stream:StreamWriter):void {
    this.value.write(stream);
  }

  getLength():number {
    return this.value.getLength();
  }
}