import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {Descriptor} from "../Descriptor";
import {StreamWriter} from "../StreamWriter";

export class ObAr implements IDescriptorInfoBlock {

  offset:number;
  length:number;

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;
    var item:Descriptor;
    var i:number;
    var il:number;

    this.offset = stream.tell();

    console.warn('OSType key not implemented (undocumented): ObAr(ObjectArray?)');

    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter):void {
    console.warn('OSType key not implemented (undocumented): ObAr(ObjectArray?)');
  }

  getLength():number {
    return null;
  }
}