import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
export class PlLd implements IAdditionalLayerInfoParser {

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

}