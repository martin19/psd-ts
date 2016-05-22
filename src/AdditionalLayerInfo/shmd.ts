import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class shmd implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  items:number;
  metadata:Array<any>;

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var signature:string;
    var key:string;
    var copy:number;
    var length:number;
    var data:Array<number>|Uint8Array;
    var metadata:Array<any> = this.metadata = [];
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
      metadata[i] = {
        signature: signature,
        key: key,
        copy: copy,
        data: data
      };
    }

    this.length = stream.tell() - this.offset;
  }

}