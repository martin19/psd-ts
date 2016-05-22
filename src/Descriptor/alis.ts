import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class alis implements IDescriptorInfoParser {

  offset:number;
  length:number;
  value:Array<number>|Uint8Array;


  constructor() {
  }

  parse(stream : StreamReader, length? : number, header? : Header) {
  var length:number;
  this.offset = stream.tell();

  length = stream.readUint32();
  // TODO: きちんと parse する
  this.value = stream.read(length);

  this.length = stream.tell() - this.offset;
}
}