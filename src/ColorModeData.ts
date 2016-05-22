import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {ColorMode} from "./Enum";
export class ColorModeData {

  offset:number;
  length:number;
  data:Array<number>|Uint8Array;

  parse(stream:StreamReader, header:Header) {
    var length:number;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.length = length + 4;

    if (header.colorMode === ColorMode.INDEXED_COLOR && length !== 768) {
      throw new Error('invalid color mode data');
    }

    this.data = stream.read(length);
  }
}
