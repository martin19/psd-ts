import {StreamReader} from "./StreamReader";
import {LayerRecord} from "./LayerRecord";

export abstract class ChannelImage {
  channel : Array<number>|Uint8Array;
  abstract parse(stream:StreamReader, layerRectord:LayerRecord, length:number):void;
}