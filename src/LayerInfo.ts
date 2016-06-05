import {LayerRecord} from "./LayerRecord";
import {ChannelImageData} from "./ChannelImageData";
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {StreamWriter} from "./StreamWriter";
export class LayerInfo {
  offset:number;
  length:number;
  layerCount:number;
  layerRecord:Array<LayerRecord>;
  channelImageData:Array<ChannelImageData>;


  constructor() {
    this.layerRecord = [];
    this.channelImageData = [];
  }

  parse(stream:StreamReader, header:Header) {
    var i:number;
    var il:number;
    var layerRecord:LayerRecord;
    var channelImageData:ChannelImageData;

    this.offset = stream.tell();
    this.length = stream.readUint32() + 4;

    this.layerCount = Math.abs(stream.readInt16());

    for (i = 0, il = this.layerCount; i < il; ++i) {
      layerRecord = new LayerRecord();
      layerRecord.parse(stream, header);
      this.layerRecord[i] = layerRecord;
    }

    // TODO: ChannelImageData の実装はまだないのでスキップする
    for (i = 0, il = this.layerCount; i < il; ++i) {
      channelImageData = new ChannelImageData();
      channelImageData.parse(stream, this.layerRecord[i]);
      this.channelImageData[i] = channelImageData;
    }
    stream.seek(this.offset + this.length, 0);
  }
  
  write(stream:StreamWriter, header:Header) {
    var i : number;
    var il : number;
    
    stream.writeUint32(this.getLength());

    stream.writeInt16(-this.layerRecord.length);

    for (i=0, il = this.layerRecord.length; i < il; ++i) {
      this.layerRecord[i].write(stream, header);
    }

    for (i=0, il = this.layerRecord.length; i < il; ++i) {
      this.channelImageData[i].write(stream, this.layerRecord[i]);
    }
  }
  
  getLength() {
    var length = 0;
    length += 2; //layer count
    for(var i = 0; i < this.layerRecord.length; i++) {
      length += this.layerRecord[i].getLength();
      length += this.channelImageData[i].getLength();
    }
    return length;
  }

}