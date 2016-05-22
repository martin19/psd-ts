import {StreamReader} from "./StreamReader";
import {IDescriptorInfoParser, DescriptorInfoParser} from "./Descriptor/DescriptorInfoParser";
export class Descriptor {

  offset:number;
  length:number;
  name:string;
  classId:string;
  items:number;
  item:Array<{key:string, data:any}>;


  constructor() {
  }

  parse(stream:StreamReader) {
    var length:number;
    var key:string;
    var type:string;
    var i:number;
    var il:number;
    var data:IDescriptorInfoParser;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.name = stream.readWideString(length);

    length = stream.readUint32() || 4;
    this.classId = stream.readString(length);

    this.items = stream.readUint32();
    this.item = [];

    for (i = 0, il = this.items; i < il; ++i) {
      length = stream.readUint32() || 4;
      key = stream.readString(length);
      type = stream.readString(4);

      if (typeof DescriptorInfoParser[type] !== 'function') {
        console.warn('OSType Key not implemented:', type);
        //console.log(hoge, String.fromCharCode.apply(null, hoge));
        break;
      }

      data = new DescriptorInfoParser[type]();
      data.parse(stream);

      this.item.push({key: key, data: data});
    }

    this.length = stream.tell() - this.offset;
  }

}