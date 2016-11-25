import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {ColorMode} from "../Enum";
import {StreamWriter} from "../StreamWriter";
import {Pattern} from "../Pattern";
export class Patt implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  patterns:Pattern[];

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var limit:number = stream.tell() + length;
    var patternLength:number;
    var colorTable:Array<number>|Uint8Array;
    this.patterns = [];
    this.offset = stream.tell();

    while (stream.tell() < limit) {
      patternLength = stream.readUint32() + 3;
      var patternStart = stream.tell();

      var pattern = new Pattern();

      pattern.version = stream.readUint32();
      pattern.mode = stream.readInt32();
      pattern.vertical = stream.readInt16();
      pattern.horizontal = stream.readInt16();
      pattern.name = stream.readWideString(stream.readUint32());
      pattern.id = stream.readPascalString();

      if (header.colorMode === ColorMode.INDEXED_COLOR) {
        colorTable = stream.read(256 * 3);
      }

      pattern.parse(stream, patternLength - (stream.tell() - patternStart));
      this.patterns.push(pattern);
    }

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter, header : Header):void {
    // //TODO:
    // //stream.writeUint32(this.pattern.length);
    // stream.writeUint32(1);
    // stream.writeInt32(this.pattern.mode);
    // stream.writeInt16(this.vertical);
    // stream.writeInt16(this.horizontal);
    // stream.writeUint32(this.name.length * 2);
    // stream.writeWideString(this.name);
    // stream.writePascalString(this.id);
    // if(header.colorMode === ColorMode.INDEXED_COLOR) {
    //   var colorTable = new Uint8Array(768);
    //   stream.write(colorTable);
    // }
    // //TODO:
    // //stream.write(this.pattern);
  }

  getLength(header : Header):number {
    //return 16 + 4 + this.name.length*2 + this.id.length + (header.colorMode === ColorMode.INDEXED_COLOR ? 768 : 0) + this.pattern.length;
    return 0;
  }
}