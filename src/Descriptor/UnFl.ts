import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";

export class UnFl implements IDescriptorInfoParser {

  offset:number;
  length:number;
  value:Array<number>;
  key : string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var value:Array<number> = this.value = [];
    var count:number;
    var i:number;

    this.offset = stream.tell();

    this.key = stream.readString(4);
    count = stream.readUint32();
    for (i = 0; i < count; ++i) {
      value[i] = stream.readFloat64();
    }

    this.length = stream.tell() - this.offset;
  }
}