import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser} from "./DescriptorInfoParser";
import {EngineData} from "../EngineData";

/**
 * Text Enginedata
 */
export class tdta implements IDescriptorInfoParser {

  offset:number;
  length:number;
  value:Array<number>|Uint8Array;
  data:Array<number>|Uint8Array;
  engineData:any;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.data = stream.read(length);

    this.engineData = (new EngineData()).parse([].slice.call(this.data));

    this.length = stream.tell() - this.offset;
  }
}