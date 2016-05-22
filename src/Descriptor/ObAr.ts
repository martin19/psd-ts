import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";
import {Descriptor} from "../Descriptor";

export class ObAr implements IDescriptorInfoParser {

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
}