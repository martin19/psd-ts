import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
import {StreamWriter} from "../StreamWriter";
export class GdFl implements IAdditionalLayerInfoBlock {

  offset : number; 
  length : number;
  version : number;
  descriptor : Descriptor;

  constructor() {
  }

  parse(stream : StreamReader, length? : number, header? : Header) {
    this.offset = stream.tell();

    this.version = stream.readUint32();
    this.descriptor = new Descriptor();
    this.descriptor.parse(stream);

    this.length = stream.tell() - this.offset;
  }

  write(stream : StreamWriter) {
    stream.writeUint32(this.version);
    this.descriptor.write(stream);
  }
  
  getLength() {
    this.length = 4 + this.descriptor.getLength();
    return this.length;
  }

}