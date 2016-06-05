import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class UntF implements IDescriptorInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeString(this.units);
    stream.writeFloat64(this.value);
  }

  getLength():number {
    return 4 + 8;
  }
}