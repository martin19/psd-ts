import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class alis implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  value:Array<number>|Uint8Array;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;
    this.offset = stream.tell();

    length = stream.readUint32();
    // TODO: きちんと parse する
    this.value = stream.read(length);

    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter) {
    stream.writeUint32(this.value.length);
    stream.write(this.value);
  }
  
  getLength() {
    this.length = this.value.length + 4;
    return this.length;
  }
}