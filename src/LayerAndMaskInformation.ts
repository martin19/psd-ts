import {LayerInfo} from "./LayerInfo";
import {GlobalLayerMaskInfo} from "./GlobalLayerMaskInfo";
import {AdditionalLayerInfo} from "./AdditionalLayerInfo";
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {StreamWriter} from "./StreamWriter";
export class LayerAndMaskInformation {

  offset:number;
  length:number;
  layerInfo:LayerInfo;
  globalLayerMaskInfo:GlobalLayerMaskInfo;
  additionalLayerInfo:AdditionalLayerInfo[];


  constructor() {
  }

  parse(stream:StreamReader, header:Header) {
    var length:number;

    this.offset = stream.tell();
    length = stream.readUint32();
    this.length = length + 4;

    if (length === 0) {
      window.console.log("skip: layer and mask information (empty body)");
    }

    var pos = stream.tell() + length;

    // initialize
    this.layerInfo = new LayerInfo();
    this.globalLayerMaskInfo = new GlobalLayerMaskInfo();
    //this.additionalLayerInfo = new AdditionalLayerInfo();
    this.additionalLayerInfo = [];

    // parse
    this.layerInfo.parse(stream, header);
    this.globalLayerMaskInfo.parse(stream, header);

    while (stream.tell() < pos) {
      let additionalLayerInfo = new AdditionalLayerInfo();
      additionalLayerInfo.parse(stream, header);
      this.additionalLayerInfo.push(additionalLayerInfo);
    }

    //this.additionalLayerInfo.parse(stream, header);

    // TODO: remove
    stream.seek(pos, 0);
  }

  write(stream:StreamWriter, header:Header) {
    stream.writeUint32(this.getLength());
    this.layerInfo.write(stream, header);
    this.globalLayerMaskInfo.write(stream, header);
    //TODO: fixme
    //if(this.additionalLayerInfo) {
    //  this.additionalLayerInfo.write(stream, header);
    //}
  }
  
  getLength() {
    var length = 4;
    length += this.layerInfo.getLength();
    length += this.globalLayerMaskInfo.getLength();
    //TODO: fixme
    //if(this.additionalLayerInfo) {
    //  length += this.additionalLayerInfo.getLength();
    //}
    return length;
  }
}