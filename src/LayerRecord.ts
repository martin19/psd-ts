
import {LayerBlendingRanges} from "./LayerBlendingRanges";
import {AdditionalLayerInfo} from "./AdditionalLayerInfo";
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {LayerMaskData} from "./LayerMaskData";
export class LayerRecord {

  offset : number;
  length : number;
  top : number;
  left : number;
  bottom : number;
  right : number;
  channels : number;
  info : Array<{id : number, length : number}>;
  blendMode : string;
  opacity : number;
  clipping : number;
  flags : number;
  filter : number;
  name : string;
  extraLength : number;
  layerMaskData : LayerMaskData;
  blendingRanges : LayerBlendingRanges;
  additionalLayerInfo : Array<AdditionalLayerInfo>;

  constructor() {
    this.info = [];
  }

  parse(stream:StreamReader, header:Header) {
    var pos : number;
    var i : number;
    var il : number;
    var additionalLayerInfo:AdditionalLayerInfo;

    this.offset = stream.tell();

    // rectangle
    this.top = stream.readInt32();
    this.left = stream.readInt32();
    this.bottom = stream.readInt32();
    this.right = stream.readInt32();

    // channel information
    this.channels = stream.readUint16();
    for (i = 0, il = this.channels; i < il; ++i) {
      this.info[i] = {
        id: stream.readInt16(),
        length: stream.readUint32()
      };
    }
    // signature
    if (stream.readString(4) !== '8BIM') {
      throw new Error('invalid blend mode signature');
    }

    // blend mode
    this.blendMode = stream.readString(4);

    // opacity
    this.opacity = stream.readUint8();

    // clipping
    this.clipping = stream.readUint8();

    // flags
    this.flags = stream.readUint8();

    // filter
    this.filter = stream.readUint8();

    // extra field length
    this.extraLength = stream.readUint32();
    pos = stream.tell() + this.extraLength;

    // layer mask data
    this.layerMaskData = new LayerMaskData();
    this.layerMaskData.parse(stream);

    // layer blending ranges
    this.blendingRanges = new LayerBlendingRanges();
    this.blendingRanges.parse(stream);

    // name
    var stringLength = stream.readUint8();
    this.name = stream.readString(stringLength);
    stream.seek((4 - ((1 + stringLength) % 4)) % 4); // padding

    // additional information
    this.additionalLayerInfo = [];
    while (stream.tell() < pos) {
      additionalLayerInfo = new AdditionalLayerInfo();
      additionalLayerInfo.parse(stream, header);
      this.additionalLayerInfo.push(additionalLayerInfo);
    }

    this.length = stream.tell() - this.offset;
  };

}