
import {ImageResourceBlock} from "./ImageResourceBlock";
import {StreamReader} from "./StreamReader";
import {StreamWriter} from "./StreamWriter";
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

    if(length > 0) {
      this.imageResource = new ImageResourceBlock();
      this.imageResource.parse(stream);
    }

    stream.seek(this.offset + this.length, 0);
  }
  
  write(stream:StreamWriter) {
    if(!this.imageResource) {
      stream.writeUint32(0);
      return;
    }
    stream.writeUint32(this.imageResource.length);
    this.imageResource.write(stream);
  }
}