import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock} from "./DescriptorInfoBlock";
import {EngineDataParser} from "../EngineDataParser";
import {StreamWriter} from "../StreamWriter";
import {IEngineData} from "../EngineData";
import {EngineDataWriter} from "../EngineDataWriter";

/**
 * Text Enginedata
 */
export class tdta implements IDescriptorInfoBlock {

  offset:number;
  length:number;
  value:Array<number>|Uint8Array;
  data:Array<number>|Uint8Array;
  engineData:IEngineData;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();

    length = stream.readUint32();
    this.data = stream.read(length);

    this.engineData = (new EngineDataParser()).parse([].slice.call(this.data));

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    this.data = EngineDataWriter.write(this.engineData);
    stream.writeUint32(this.data.length);
    stream.write(this.data);
  }

  getLength():number {
    //TODO:optimize
    return 4 + EngineDataWriter.write(this.engineData).length;
  }
}