
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {AdditionalLayerInfoBlock, IAdditionalLayerInfoBlock} from "./AdditionalLayerInfo/AdditionalLayerInfoParser";
import {StreamWriter} from "./StreamWriter";

var COMPILED:boolean = false;

export class AdditionalLayerInfo {

  offset:number;
  length:number;
  signature:string;
  key:string;
  info : IAdditionalLayerInfoBlock;

  constructor() {
  }

  parse(stream:StreamReader, header:Header) {
    var length:number;

    this.offset = stream.tell();
    this.signature = stream.readString(4);
    this.key = stream.readString(4);
    length = stream.readUint32();
    this.length = length + 12;

    // 実装されている key の場合はパースを行う
    // 各 key の実装は AdditionaLayerInfo ディレクトリにある
    if (typeof AdditionalLayerInfoBlock[this.key] === 'function') {
      this.info = new (AdditionalLayerInfoBlock[this.key])() as IAdditionalLayerInfoBlock;
      this.info.parse(stream, length, header);
    } else {
      console.warn('additional layer information: not implemented', this.key);
    }

    // error check
    if (stream.tell() - (this.offset + this.length) !== 0) {
      if (!COMPILED) {
        //   console.log(stream.fetch(stream.tell(), (this.offset + this.length)), this.offset + this.length);
        console.log("Error: difference between expected offset and real offset in " + this.key + " Difference:" + (stream.tell() - (this.offset + this.length)));
      }
    }

    stream.seek(this.offset + this.length, 0);
  }
  
  write(stream:StreamWriter, header:Header) {
    stream.writeString("8BIM");
    stream.writeString(this.key);
    if(typeof AdditionalLayerInfoBlock[this.key] === "function") {
      var lib = (this.info as IAdditionalLayerInfoBlock);
      stream.writeUint32(lib.getLength());
      lib.write(stream);  
    }
  }

  getLength() {
    var length = 12;
    if(typeof AdditionalLayerInfoBlock[this.key] === "function") {
      var lib = (this.info as IAdditionalLayerInfoBlock);
      length += lib.getLength();
    }
    return length;
  }

}
