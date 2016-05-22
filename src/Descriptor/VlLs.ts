import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser, DescriptorInfoParser} from "./DescriptorInfoParser";

export class VlLs implements IDescriptorInfoParser {

  offset:number;
  length:number;
  item:Array<any>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var items:number;
    var i:number;
    var type:string;
    var data:IDescriptorInfoParser;

    this.offset = stream.tell();

    this.item = [];
    items = stream.readUint32();
    for (i = 0; i < items; ++i) {
      type = stream.readString(4);
      if (typeof DescriptorInfoParser[type] !== 'function') {
        console.error('OSType Key not implemented:', type);
        return;
      }

      data = new DescriptorInfoParser[type]();
      data.parse(stream);

      this.item.push({
        type: type,
        data: data
      });
    }

    this.length = stream.tell() - this.offset;
  }
}