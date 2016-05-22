import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class fxrp implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  referencePoint:Array<number>;


  parse(stream : StreamReader, length? : number, header? : Header) {
  this.offset = stream.tell();

  // TODO: decode double
  this.referencePoint = [
    stream.readFloat64(),
    stream.readFloat64()
  ];

  this.length = stream.tell() - this.offset;
  }
}