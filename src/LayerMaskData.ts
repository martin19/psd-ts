import {StreamReader} from "./StreamReader";
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

}
