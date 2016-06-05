import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class _enum implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  _type:string;
  _enum:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();

    // type
    length = stream.readUint32();
    if (length === 0) {
      length = 4;
    }
    this._type = stream.readString(length);

    // enum
    length = stream.readUint32();
    if (length === 0) {
      length = 4;
    }
    this._enum = stream.readString(length);

    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter) {
    if(this._type.length === 4) {
      stream.writeUint32(0);
    } else {
      var length = this._type.length;
      stream.writeUint32(length);
    }
    stream.writeString(this._type);

    if(this._enum.length === 4) {
      stream.writeUint32(0);
    } else {
      length = this._enum.length;
      stream.writeUint32(length);
    }
    stream.writeString(this._enum);
  }

  getLength() {
    return this._type.length + 4 + this._enum.length + 4;
  }
}