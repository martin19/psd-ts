import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {StreamWriter} from "./StreamWriter";
import {CompressionMethod} from "./Enum";

export interface PatternHeader {
  version?:number; 
  length?:number;
  top?:number;
  left?:number;
  bottom?:number;
  right?:number;
  channels?:number;
}

export interface PatternChannel {
  skip? : number;
  length?:number;
  depth1?:number;
  top?:number;
  left?:number;
  bottom?:number;
  right?:number;
  depth2?:number;
  compressionMode?:CompressionMethod;
  data?:Uint8Array;
}

export class Pattern {

  offset:number;
  length:number;

  version : number;
  mode : number;
  vertical : number;
  horizontal : number;
  name : string;
  id : string;
  
  header : PatternHeader;
  channels : PatternChannel[];

  constructor() {
  }

  parse(stream:StreamReader, length : number) {
    var limit:number = stream.tell() + length;
    //  Number of channels + one for user mask + one for sheet mask.
    //  Make sure you loop number of channels + 2. Make sure you are skipping non written and no length arrays.
    this.channels = [];
    this.header = {};
    this.header.version = stream.readInt32();
    this.header.length = stream.readInt32();
    this.header.top = stream.readInt32();
    this.header.left = stream.readInt32();
    this.header.bottom = stream.readInt32();
    this.header.right = stream.readInt32();
    this.header.channels = stream.readInt32();
    for(var i = 0; i < this.header.channels + 2; i++) {
      var channel : PatternChannel = {};  
      channel.skip = stream.readInt32();
      if(channel.skip == 0) continue;
      channel.length = stream.readInt32();
      if(channel.length == 0) continue;
      channel.depth1 = stream.readInt32();
      channel.top = stream.readInt32();
      channel.left = stream.readInt32();
      channel.bottom = stream.readInt32();
      channel.right = stream.readInt32();
      channel.depth2 = stream.readInt16();
      channel.compressionMode = stream.readInt8();
      switch (channel.compressionMode) {
        case CompressionMethod.RAW:
          channel.data = new Uint8Array(stream.read(channel.length - 23));
          break;
        case CompressionMethod.RLE:
          var height = this.header.bottom - this.header.top;
          channel.data = Pattern.parseChannelRLE(stream, height, channel.length - 23);
          break;
        default:
          throw new Error('unsupported compression method');
      }
      this.channels.push(channel);
    }
    stream.seek(0,limit);
  }
  
  static parseChannelRLE(stream:StreamReader, height:number, length:number):Uint8Array {
    var lineLength:Array<number> = [];
    var lines:Array<Array<number>> = [];
    var limit:number = stream.tell() + length;
    var channel:Uint8Array;
    var size:number;
    var pos:number;

    // line lengths
    for (let i = 0; i < height; ++i) {
      lineLength[i] = stream.readUint16();
    }

    // channel data
    size = 0;
    for (let i = 0; i < height; ++i) {
      lines[i] = stream.readPackBits(lineLength[i]);
      size += lines[i].length;
      if (stream.tell() >= limit) {
        break;
      }
    }
    
    // concatenation
    channel= new Uint8Array(size);
    for (let i = 0, pos = 0, height = lines.length; i < height; ++i) {
      channel.set(lines[i], pos);
      pos += lines[i].length;
    }
    return channel;
  }

  createCanvas() {
    var canvas:HTMLCanvasElement = document.createElement('canvas');
    var ctx:CanvasRenderingContext2D = canvas.getContext('2d');
    var width:number = canvas.width = (this.header.right - this.header.left);
    var height:number = canvas.height = (this.header.bottom - this.header.top);
    var imageData:ImageData;
    var pixelArray:Uint8ClampedArray;

    if (width <= 0 || height <= 0) {
      return null;
    }

    imageData = ctx.createImageData(width, height);
    pixelArray = imageData.data;

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        let index = (y * width + x);
        pixelArray[index * 4] = this.channels[0].data[index];
        pixelArray[index * 4 + 1] = this.channels[1].data[index];
        pixelArray[index * 4 + 2] = this.channels[2].data[index];
        pixelArray[index * 4 + 3] = this.channels[3] ? this.channels[3].data[index] : 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  };
  
  write(stream:StreamWriter, header:Header) {
    // stream.writeUint32(this.getLength());
    // this.layerInfo.write(stream, header);
    // this.globalLayerMaskInfo.write(stream, header);
    // if(this.additionalLayerInfo) {
    //   this.additionalLayerInfo.write(stream, header);
    // }
  }

  getLength() {
    // var length = 4;
    // length += this.layerInfo.getLength();
    // length += this.globalLayerMaskInfo.getLength();
    // if(this.additionalLayerInfo) {
    //   length += this.additionalLayerInfo.getLength();
    // }
    // return length;
  }
}