import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
export class SoLd implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  identifier:string;
  version:number;
  descriptorVersion:number;
  descriptor:Descriptor;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.identifier = stream.readString(4);
    if (this.identifier !== 'soLD') {
      throw new Error('invalid identifier:' + this.identifier);
    }

    this.version = stream.readUint32();
    this.descriptorVersion = stream.readInt32();
    this.descriptor = new Descriptor();
    this.descriptor.parse(stream);

    this.length = stream.tell() - this.offset;
  }

}