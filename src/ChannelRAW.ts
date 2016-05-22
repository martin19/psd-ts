import {ChannelImage} from "./ChannelImage";
import {StreamReader} from "./StreamReader";
import {LayerRecord} from "./LayerRecord";

export class ChannelRAW extends ChannelImage {

  constructor() {
    super();
  }

  parse(stream:StreamReader, layerRecord:LayerRecord, length:number) {
    /** @type {number} */
    var width = layerRecord.right - layerRecord.left;
    /** @type {number} */
    var height = layerRecord.bottom - layerRecord.top;

    //this.channel = stream.read(width * height);
    this.channel = stream.read(length);
  }
}