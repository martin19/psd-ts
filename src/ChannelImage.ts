import {StreamReader} from "./StreamReader";
import {LayerRecord} from "./LayerRecord";
import {StreamWriter} from "./StreamWriter";

export abstract class ChannelImage {
  channel : Array<number>|Uint8Array;
  abstract parse(stream:StreamReader, layerRectord:LayerRecord, length:number):void;
  abstract write(stream:StreamWriter, layerRecord:LayerRecord):void;
  abstract getLength():number;
}