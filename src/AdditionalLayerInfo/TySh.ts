import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
import {StreamWriter} from "../StreamWriter";
export class TySh implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  version:number;
  transform:Array<number>;
  textVersion:number;
  textDescriptorVersion:number;
  textData:Descriptor;
  warpVersion:number;
  warpDescriptorVersion:number;
  warpData:Descriptor;
  left:number;
  top:number;
  right:number;
  bottom:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.version = stream.readInt16();
    this.transform = [
      stream.readFloat64(), // xx
      stream.readFloat64(), // xy
      stream.readFloat64(), // yx
      stream.readFloat64(), // yy
      stream.readFloat64(), // tx
      stream.readFloat64()  // ty
    ];

    this.textVersion = stream.readInt16();
    this.textDescriptorVersion = stream.readInt32();
    this.textData = new Descriptor();
    this.textData.parse(stream);

    // parse failure
    if (this.textData.items !== this.textData.item.length) {
      console.error('Descriptor parsing failed');
      return;
    }

    this.warpVersion = stream.readInt16();
    this.warpDescriptorVersion = stream.readInt32();
    this.warpData = new Descriptor();
    this.warpData.parse(stream);


    // TODO: 4 Byte * 4? - Float32
    console.log('TySh implementation is incomplete');
    this.left = stream.readInt32();
    this.top = stream.readInt32();
    this.right = stream.readInt32();
    this.bottom = stream.readInt32();

    /*
     this.left = stream.readFloat64();
     this.top = stream.readFloat64();
     this.right = stream.readFloat64();
     this.bottom = stream.readFloat64();

     stream.seek(-32);
     goog.global.console.log('64 or 32:',
     this.left,
     this.top,
     this.right,
     this.bottom,
     stream.readInt32(),
     stream.readInt32(),
     stream.readInt32(),
     stream.readInt32()
     );
     */

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint16(1); //version
    for(var i = 0; i < 6; i++) {
      stream.writeFloat64(this.transform[i]); //transform
    }
    stream.writeInt16(50); //textversion
    stream.writeUint32(16); //textdescriptor version
    this.textData.write(stream);
    stream.writeInt16(1); //warp version
    stream.writeUint32(16); //warp descriptor version
    this.warpData.write(stream);
    stream.writeInt32(this.left);
    stream.writeInt32(this.top);
    stream.writeInt32(this.right);
    stream.writeInt32(this.bottom);

    //padding
    var length = this.getUnpaddedLength();
    if(0 != length % 4) {
      var paddingLength = 4 - length % 4;
    }
    for(var i = 0; i < paddingLength; i++) {
      stream.writeUint8(0);
    }
  }

  getUnpaddedLength():number {
    var length = 0;
    length += 2; //version
    length += 6*8; //transform
    length += 2; //textversion
    length += 4; //text descriptor version
    length += this.textData.getLength(); //text data
    length += 2; //warp version
    length += 4; //warp descriptor version
    length += this.warpData.getLength(); //warp data
    length += 4 * 4; //rectangle
    return length;
  }

  getLength():number {
    var length = this.getUnpaddedLength();
    if(0 != length % 4) {
      length += (4 - length % 4);
    }
    return length;
  }
}