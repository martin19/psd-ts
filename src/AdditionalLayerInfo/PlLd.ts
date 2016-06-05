import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
import {StreamWriter} from "../StreamWriter";
export class PlLd implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  type:string;
  version:number;
  id:string;
  page:number;
  totalPage:number;
  antiAlias:number;
  placedLayerType:number;
  transform:Array<number>;
  warpVersion:number;
  warpDescriptorVersion:number;
  descriptor:Descriptor;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.type = stream.readString(4);
    if (this.type !== 'plcL') {
      throw new Error('invalid type:' + this.type);
    }

    this.version = stream.readUint32();
    this.id = stream.readPascalString();
    this.page = stream.readInt32();
    this.totalPage = stream.readInt32();
    this.antiAlias = stream.readInt32();
    this.placedLayerType = stream.readInt32();
    this.transform = [
      stream.readFloat64(), stream.readFloat64(),
      stream.readFloat64(), stream.readFloat64(),
      stream.readFloat64(), stream.readFloat64(),
      stream.readFloat64(), stream.readFloat64()
    ];
    this.warpVersion = stream.readInt32();
    this.warpDescriptorVersion = stream.readInt32();
    this.descriptor = new Descriptor();
    this.descriptor.parse(stream);

    this.length = stream.tell() - this.offset;
  }

  write(stream:StreamWriter):void {
    stream.writeString("plcL");
    stream.writeUint32(3);
    stream.writePascalString(this.id);
    stream.writeInt32(this.page);
    stream.writeInt32(this.totalPage);
    stream.writeInt32(this.antiAlias);
    stream.writeInt32(this.placedLayerType);
    for(var i = 0; i < 8;i++) {
      stream.writeFloat64(this.transform[i]);
    }
    stream.writeInt32(0);
    stream.writeInt32(16);
    this.descriptor.write(stream);
  }

  getLength():number {
    return 4 + 4 + this.id.length + 4 + 4 + 4 + 4 + 8*8 + 4 + 4 + this.descriptor.getLength();
  }
}