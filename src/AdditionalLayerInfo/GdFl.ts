import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {Descriptor} from "../Descriptor";
export class GdFl implements IAdditionalLayerInfoParser {

  offset : number; 
  length : number;
  version : number;
  descriptor : any;

  constructor() {
  }

  parse(stream : StreamReader, length? : number, header? : Header) {
    this.offset = stream.tell();

    this.version = stream.readUint32();
    this.descriptor = new Descriptor();
    this.descriptor.parse(stream);

    this.length = stream.tell() - this.offset;
  }

}