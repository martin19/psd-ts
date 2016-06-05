import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {ColorMode} from "../Enum";
import {StreamWriter} from "../StreamWriter";
export class Patt implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  version : number;
  mode : number;
  vertical : number;
  horizontal : number;
  name : string;
  id : string;
  // TODO: pattern  It is the object of a dedicated
  pattern:Uint8Array;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var limit:number = stream.tell() + length;
    var patternLength:number;
    var colorTable:Array<number>|Uint8Array;

    this.offset = stream.tell();

    // TODO
    // 現在 Patt は長さが 0 のものしか見つかっていない
    // 実際に動作するかどうかは確認する必要がある
    while (stream.tell() < limit) {
      patternLength = stream.readUint32();
      this.version = stream.readUint32();
      this.mode = stream.readInt32();
      this.vertical = stream.readInt16(); // TODO: 確認
      this.horizontal = stream.readInt16(); // TODO: 確認
      this.name = stream.readWideString(stream.readUint32());
      this.id = stream.readPascalString();

      if (header.colorMode === ColorMode.INDEXED_COLOR) {
        colorTable = stream.read(256 * 3);
      }

      // TODO: 現在は何もしていない, Virtural Memory Array List
      this.pattern = stream.read(limit - this.offset) as Uint8Array;
    }

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter, header : Header):void {
    stream.writeUint32(this.pattern.length);
    stream.writeUint32(1);
    stream.writeInt32(this.mode);
    stream.writeInt16(this.vertical);
    stream.writeInt16(this.horizontal);
    stream.writeUint32(this.name.length * 2);
    stream.writeWideString(this.name);
    stream.writePascalString(this.id);
    if(header.colorMode === ColorMode.INDEXED_COLOR) {
      var colorTable = new Uint8Array(768);
      stream.write(colorTable);
    }
    stream.write(this.pattern);
  }

  getLength(header : Header):number {
    return 16 + 4 + this.name.length*2 + this.id.length + (header.colorMode === ColorMode.INDEXED_COLOR ? 768 : 0) + this.pattern.length;
  }
}