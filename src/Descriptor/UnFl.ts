import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class UnFl implements IDescriptorInfoBlock {

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


  write(stream:StreamWriter):void {
    stream.writeString(this.key);
    stream.writeUint32(this.value.length);
    for(var i = 0; i < this.value.length; i++) {
      stream.writeFloat64(this.value[i]);
    }
  }

  getLength():number {
    return 4 + 4 + this.value.length * 8;
  }
}