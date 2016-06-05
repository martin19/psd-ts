import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class shmd implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  items:number;
  metadata:Array<{ signature : string, key : string, copy : number, data : Array<number>|Uint8Array }>;

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var signature:string;
    var key:string;
    var copy:number;
    var length:number;
    var data:Array<number>|Uint8Array;
    this.metadata = [];
    var i:number;
    var il:number;

    this.offset = stream.tell();

    this.items = stream.readUint32();

    for (i = 0, il = this.items; i < il; ++i) {
      signature = stream.readString(4);
      key = stream.readString(4);
      copy = stream.readUint8();
      stream.seek(3); // padding
      length = stream.readUint32();
      data = stream.read(length);

      // TODO: オブジェクトではなく型をつくる
      this.metadata.push({
        signature: signature,
        key: key,
        copy: copy,
        data: data
      });
    }

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint32(this.metadata.length);
    for(var i = 0; i < this.metadata.length; i++) {
      var m = this.metadata[i];
      stream.writeString(m.signature);
      stream.writeString(m.key);
      stream.writeUint8(m.copy);
      for(var j = 0; j < 3; j++) stream.writeUint8(0);
      stream.writeUint32(m.data.length);
      stream.write(m.data);
    }
  }

  getLength():number {
    var length = 4;
    for(var i = 0; i < this.metadata.length; i++) {
      length += 4 + 4 + 4 + 4 + this.metadata[i].data.length;
    }
    return length;
  }
}