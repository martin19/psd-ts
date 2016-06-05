import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class rele implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  name:string;
  classId:string;
  value:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.name = stream.readWideString(length);

    length = stream.readUint32() || 4;
    this.classId = stream.readString(length);

    this.value = stream.readUint32();

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint32(this.name.length * 2);
    stream.writeWideString(this.name);
    stream.writeUint32(this.classId.length);
    stream.writeString(this.classId);
  }

  getLength():number {
    return this.name.length * 2 + 4 + this.classId.length + 4;
  }
}