import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {ColorMode} from "../Enum";
export class Patt implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  // TODO: pattern は専用のオブジェクト化する
  pattern:Array<any>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var limit:number = stream.tell() + length;
    var patternLength:number;
    var version:number;
    var mode:number;
    var vertical:number;
    var horizontal:number;
    var name:string;
    var id:string;
    var colorTable:Array<number>|Uint8Array;
    /* TODO */
    var patternData:any;

    this.offset = stream.tell();

    // TODO
    // 現在 Patt は長さが 0 のものしか見つかっていない
    // 実際に動作するかどうかは確認する必要がある
    while (stream.tell() < limit) {
      patternLength = stream.readUint32();
      version = stream.readUint32();
      mode = stream.readInt32();
      vertical = stream.readInt16(); // TODO: 確認
      horizontal = stream.readInt16(); // TODO: 確認
      name = stream.readWideString(stream.readUint32());
      id = stream.readPascalString();

      if (header.colorMode === ColorMode.INDEXED_COLOR) {
        colorTable = stream.read(256 * 3);
      }

      // TODO: 現在は何もしていない, Virtural Memory Array List
      patternData = stream.read(limit - this.offset);
    }

    this.length = stream.tell() - this.offset;
  }

}