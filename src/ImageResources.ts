
import {ImageResourceBlock} from "./ImageResourceBlock";
import {StreamReader} from "./StreamReader";
export class ImageResources {

  offset:number;
  length:number;
  imageResource:ImageResourceBlock;


  constructor() {
  }

  parse(stream:StreamReader) {
    var length:number;

    this.offset = stream.tell();
    length = stream.readUint32();
    this.length = length + 4;

    this.imageResource = new ImageResourceBlock();
    this.imageResource.parse(stream);

    stream.seek(this.offset + this.length, 0);
  }
}