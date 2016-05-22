import {LayerInfo} from "./LayerInfo";
import {GlobalLayerMaskInfo} from "./GlobalLayerMaskInfo";
import {AdditionalLayerInfo} from "./AdditionalLayerInfo";
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
export class LayerAndMaskInformation {

  offset:number;
  length:number;
  layerInfo:LayerInfo;
  globalLayerMaskInfo:GlobalLayerMaskInfo;
  additionalLayerInfo:AdditionalLayerInfo;


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
    this.additionalLayerInfo = new AdditionalLayerInfo();

    // parse
    this.layerInfo.parse(stream, header);
    this.globalLayerMaskInfo.parse(stream, header);
    this.additionalLayerInfo.parse(stream, header);

    // TODO: remove
    stream.seek(pos, 0);
  }
}