import {StreamReader} from "./StreamReader";
import {StreamWriter} from "./StreamWriter";
export class LayerMaskData {

  offset:number;
  length:number;
  top:number;
  left:number;
  bottom:number;
  right:number;
  defaultColor:number;
  flags:number;
  padding:number;
  realFlags:number;
  realBackground:number;
  top2:number;
  left2:number;
  bottom2:number;
  right2:number;


  constructor() {
  }

  parse(stream:StreamReader) {
    var length:number;

    this.offset = stream.tell();
    length = stream.readUint32();
    this.length = length + 4;

    if (length === 0) {
      window.console.log("skip: layer mask data (empty body)");
      return;
    }

    // rectangle enclosing layer mask
    this.top = stream.readInt32();
    this.left = stream.readInt32();
    this.bottom = stream.readInt32();
    this.right = stream.readInt32();

    // default color
    this.defaultColor = stream.readUint8();

    // flags
    this.flags = stream.readUint8();

    // length: 20
    if (length === 20) {
      // padding
      this.padding = stream.readUint16();
      // length: 36
    } else {
      // real flags
      this.realFlags = stream.readUint8();

      // real user mask background
      this.realBackground = stream.readUint8();

      // rectangle enclosing layer mask
      this.top2 = stream.readInt32();
      this.left2 = stream.readInt32();
      this.bottom2 = stream.readInt32();
      this.right2 = stream.readInt32();
    }
  }

  getLength() {
    if(typeof this.top === "undefined" || typeof this.left === "undefined" || typeof this.bottom === "undefined" ||
      typeof this.defaultColor === "undefined" || typeof this.flags === "undefined") {
      this.length = 4;
    } else if(typeof this.realFlags === "undefined" || typeof this.realBackground === "undefined" ||
      typeof this.top2 === "undefined" || typeof this.left2 === "undefined" || typeof this.bottom2 === "undefined" ||
      typeof this.right2 === "undefined") {
      this.length = 24;
    } else {
      this.length = 40;
    }
    return this.length;
  }

  write(stream:StreamWriter) {
    this.length = this.getLength();
    stream.writeUint32(this.length - 4);
    if(this.length == 4) {
      window.console.log("skip: layer mask data (empty body)");
      return;
    }
    // rectangle enclosing layer mask
    stream.writeInt32(this.top);
    stream.writeInt32(this.left);
    stream.writeInt32(this.bottom);
    stream.writeInt32(this.right);

    // default color
    stream.writeUint8(this.defaultColor);

    // flags
    stream.writeUint8(this.flags);

    if (this.length === 24) {
      // padding
      stream.writeUint16(this.padding);
      // length: 36
    } else {
      // real flags
      stream.writeUint8(this.realFlags);

      // real user mask background
      stream.writeUint8(this.realBackground);

      // rectangle enclosing layer mask
      stream.writeInt32(this.top2);
      stream.writeInt32(this.left2);
      stream.writeInt32(this.bottom2);
      stream.writeInt32(this.right2);
    }
  }

}
