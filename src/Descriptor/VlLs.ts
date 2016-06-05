import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock, DescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

export class VlLs implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  item:Array<{type:string,data:IDescriptorInfoBlock}>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var items:number;
    var i:number;
    var type:string;
    var data:IDescriptorInfoBlock;

    this.offset = stream.tell();

    this.item = [];
    items = stream.readUint32();
    for (i = 0; i < items; ++i) {
      type = stream.readString(4);
      if (typeof DescriptorInfoBlock[type] !== 'function') {
        console.error('OSType Key not implemented:', type);
        return;
      }

      data = new DescriptorInfoBlock[type]();
      data.parse(stream);

      this.item.push({
        type: type,
        data: data
      });
    }

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint32(this.item.length);
    for(var i = 0; i < this.item.length; i++) {
      stream.writeString(this.item[i].type);
      if (typeof DescriptorInfoBlock[this.item[i].type] !== 'function') {
        console.error('OSType Key not implemented:', this.item[i].type);
        return;
      }
      this.item[i].data.write(stream);
    }
  }

  getLength():number {
    var length = 0;
    length += 4;
    for(var i = 0; i < this.item.length; i++) {
      length += this.item[i].type.length + this.item[i].data.getLength();
    }
    return length;
  }
}