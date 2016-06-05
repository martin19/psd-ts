import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
import {StreamWriter} from "../StreamWriter";
export class lfx2 implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  version:number;
  descriptorVersion:number;
  descriptor : Descriptor;

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    this.version = stream.readUint32();
    this.descriptorVersion = stream.readUint32();
    this.descriptor = new Descriptor();
    this.descriptor.parse(stream);

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint32(this.version);
    stream.writeUint32(this.descriptorVersion);
    this.descriptor.write(stream);
  }

  getLength():number {
    return 4 + 4 + this.descriptor.getLength();
  }
}
