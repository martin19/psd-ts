import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class fxrp implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  referencePoint:Array<number>;


  parse(stream : StreamReader, length? : number, header? : Header) {
  this.offset = stream.tell();

  this.referencePoint = [
    stream.readFloat64(),
    stream.readFloat64()
  ];

  this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeFloat64(this.referencePoint[0]);
    stream.writeFloat64(this.referencePoint[1]);
  }

  getLength():number {
    return 16;
  }
}