import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class prop implements IDescriptorInfoParser {

  offset:number;
  length:number;
  name:string;
  classId:string;
  keyId:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    /** @type {number} */
    var length:number;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.name = stream.readWideString(length);

    length = stream.readUint32() || 4;
    this.classId = stream.readString(length);

    length = stream.readUint32() || 4;
    this.keyId = stream.readString(length);

    this.length = stream.tell() - this.offset;
  }
}