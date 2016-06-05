
import {LayerBlendingRanges} from "./LayerBlendingRanges";
import {AdditionalLayerInfo} from "./AdditionalLayerInfo";
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {LayerMaskData} from "./LayerMaskData";
import {StreamWriter} from "./StreamWriter";
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
  }
  
  write(stream:StreamWriter, header:Header) {
    var il : number;
    
    // rectangle
    stream.writeInt32(this.top);
    stream.writeInt32(this.left);
    stream.writeInt32(this.bottom);
    stream.writeInt32(this.right);

    //channel information
    stream.writeUint16(this.channels);
    for (var i = 0, il = this.channels; i < il; ++i) {
      stream.writeInt16(this.info[i].id);
      stream.writeUint32(this.info[i].length);
    }
    
    //signature
    stream.writeString("8BIM");

    // blend mode
    stream.writeString(this.blendMode);

    // opacity
    stream.writeUint8(this.opacity);

    // clipping
    stream.writeUint8(this.clipping);

    // flags
    stream.writeUint8(this.flags);

    // filter
    stream.writeUint8(0);

    // name
    var name = this.name;
    var namePaddingLength = 4 - (((this.name.length+1) % 4) == 0 ? 4 : ((this.name.length+1) % 4));
    
    // extra field length
    stream.writeUint32(
      this.layerMaskData.getLength() +
      this.blendingRanges.getLength() +
      1 + name.length + namePaddingLength +
      this.getAdditionalLayerInfoLength()
    );

    // layer mask data
    this.layerMaskData.write(stream);
    
    // layer blending ranges
    this.blendingRanges.write(stream);

    // layer name
    stream.writeUint8(name.length);
    stream.writeString(name);
    for(var i = 0; i < namePaddingLength;i++) {
      stream.writeUint8(0);
    }

    // additional information
    for(var i = 0; i < this.additionalLayerInfo.length; i++) {
      this.additionalLayerInfo[i].write(stream, header);  
    }
  }

  private getAdditionalLayerInfoLength() {
    var addLayerInfoLength = 0;
    for (var i = 0; i < this.additionalLayerInfo.length; i++) {
      addLayerInfoLength += this.additionalLayerInfo[i].getLength();
    }
    return addLayerInfoLength;
  }

  getLength() {
    var namePaddingLength = 4 - (((this.name.length+1) % 4) == 0 ? 4 : ((this.name.length+1) % 4));
    return 4*4 //rectangle
      + 2 //number of channels
      + 6 * this.channels //channel info
      + 4 //8BIM
      + 4 //blend mode key
      + 1 //opacity
      + 1 //clipping
      + 1 //flags
      + 1 //filler
      + 4 //length of extra data
      + this.layerMaskData.getLength()
      + this.blendingRanges.getLength()
      + 1 + this.name.length + namePaddingLength
      + this.getAdditionalLayerInfoLength();
  }

}