import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class TEXT implements IDescriptorInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeUint32(this.string.length);
    stream.writeWideString(this.string);
  }

  getLength():number {
    return this.string.length * 2 + 4;
  }
}