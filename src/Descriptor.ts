import {StreamReader} from "./StreamReader";
import {IDescriptorInfoBlock, DescriptorInfoBlock} from "./Descriptor/DescriptorInfoBlock";
import {StreamWriter} from "./StreamWriter";
export class Descriptor {

  offset:number;
  length:number;
  name:string;
  classId:string;
  items:number;
  item:Array<{key:string, type:string, data:IDescriptorInfoBlock}>;


  constructor() {
  }

  parse(stream:StreamReader) {
    var length:number;
    var key:string;
    var type:string;
    var i:number;
    var il:number;
    var data:IDescriptorInfoBlock;

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

      if (typeof DescriptorInfoBlock[type] !== 'function') {
        console.warn('OSType Key not implemented:', type);
        //console.log(hoge, String.fromCharCode.apply(null, hoge));
        break;
      }

      data = new DescriptorInfoBlock[type]();
      data.parse(stream);

      this.item.push({key: key, type: type, data: data});
    }

    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter) {
    var i : number;
    var il : number;

    stream.writeUint32(this.name.length);
    stream.writeWideString(this.name);
    if(this.classId.length === 4) {
      stream.writeUint32(0);
    } else {
      stream.writeUint32(this.classId.length);
    }
    stream.writeString(this.classId);
    stream.writeUint32(this.item.length);

    for (i = 0, il = this.item.length; i < il; ++i) {

      if(this.item[i].key.length === 4) {
        stream.writeUint32(0);
      } else {
        stream.writeUint32(this.item[i].key.length);
      }
      stream.writeString(this.item[i].key);
      stream.writeString(this.item[i].type);


      if (typeof DescriptorInfoBlock[this.item[i].type] !== 'function') {
        console.warn('OSType Key not implemented:', this.item[i].key);
        break;
      }

      this.item[i].data.write(stream);
    }
  }
  
  getLength() {
    var length = 0;
    length += 4;  //name length field
    length += this.name.length*2; //name string
    length += 4; //class id length
    length += this.classId.length; //classid string
    length += 4; //number of items in descriptor
    for(var i = 0; i < this.item.length; i++) {
      length += 4 + this.item[i].key.length + this.item[i].type.length + this.item[i].data.getLength();
    }
    return length;
  }
}