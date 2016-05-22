
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {AdditionalLayerInfoParser, IAdditionalLayerInfoParser} from "./AdditionalLayerInfo/AdditionalLayerInfoParser";

var COMPILED:boolean = true;

export class AdditionalLayerInfo {

  offset:number;
  length:number;
  signature:string;
  key:string;
  data:Array<number>|Uint8Array;
  /** @type {{parse: function(PSD.StreamReader, number, PSD.Header)}} */
  info : IAdditionalLayerInfoParser;

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
    if (typeof AdditionalLayerInfoParser[this.key] === 'function') {
      this.info = new (AdditionalLayerInfoParser[this.key])() as IAdditionalLayerInfoParser;
      this.info.parse(stream, length, header);
    } else {
      console.warn('additional layer information: not implemented', this.key);
    }

    // error check
    if (stream.tell() - (this.offset + this.length) !== 0) {
      if (!COMPILED) {
        //   console.log(stream.fetch(stream.tell(), (this.offset + this.length)), this.offset + this.length);
        console.log(this.key, stream.tell() - (this.offset + this.length));
      }
    }

    stream.seek(this.offset + this.length, 0);
  }

}
