import {ChannelImage} from "./ChannelImage";
import {StreamReader} from "./StreamReader";
import {LayerRecord} from "./LayerRecord";
import {StreamWriter} from "./StreamWriter";

export class ChannelRAW extends ChannelImage {

  constructor() {
    super();
  }

  parse(stream:StreamReader, layerRecord:LayerRecord, length:number) {
    var width = layerRecord.right - layerRecord.left;
    var height = layerRecord.bottom - layerRecord.top;

    //this.channel = stream.read(width * height);
    this.channel = stream.read(length) as Uint8Array;
  }

  write(stream:StreamWriter, layerRecord:LayerRecord) {
    var width = layerRecord.right - layerRecord.left;
    var height = layerRecord.bottom - layerRecord.top;
    stream.write(this.channel);
  }

  getLength() {
    return this.channel.length;
  }
}