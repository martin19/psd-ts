import {ChannelImage} from "./ChannelImage";
import {StreamReader} from "./StreamReader";
import {LayerRecord} from "./LayerRecord";
import {CompressionMethod} from "./Enum";
import {Header} from "./Header";
import {ColorModeData} from "./ColorModeData";
import {ChannelRLE} from "./ChannelRLE";
import {ChannelRAW} from "./ChannelRAW";
import {Color} from "./Color";
import {StreamWriter} from "./StreamWriter";

export class ChannelImageData {

  offset:number;
  length:number;
  channel:Array<ChannelImage>;


  constructor() {
    this.channel = [];
  }

  parse(stream:StreamReader, layerRecord:LayerRecord) {
    var channels:Array<ChannelImage> = this.channel = [];
    var channel:ChannelImage;
    var compressionMethod:CompressionMethod;
    var i:number;
    var il:number;
    var pos:number;
    var info:any;

    this.offset = stream.tell();

    for (i = 0, il = layerRecord.channels; i < il; ++i) {
      pos = stream.tell();
      info = layerRecord.info[i];

      compressionMethod = stream.readUint16();

      if (info.length === 2) {
        continue;
      }

      switch (compressionMethod) {
        case CompressionMethod.RAW:
          channel = new ChannelRAW();
          break;
        case CompressionMethod.RLE:
          channel = new ChannelRLE();
          break;
        default:
          throw new Error('unknown compression method: ' + compressionMethod);
      }
      channel.parse(stream, layerRecord, info.length - 2);

      channels[i] = channel;
      stream.seek(info.length + pos, 0);
    }

    this.length = stream.tell() - this.offset;
  };


  write(stream:StreamWriter, layerRecord : LayerRecord) {
    for(var i = 0; i < this.channel.length; i++) {
      stream.writeUint16(CompressionMethod.RLE);
      this.channel[i].write(stream, layerRecord);
    }
  }
  
  /**
   * Extract RGBA channel data from canvas. 
   * @param canvas
   * @param layerRecord
   * @returns {null}
   */
  createChannels(canvas:HTMLCanvasElement, layerRecord:LayerRecord):void {
    if(canvas) {
      var ctx = canvas.getContext("2d");
      var width:number = canvas.width;
      var height:number = canvas.height;
    }

    if (canvas == null || width === 0 || height === 0) {
      this.channel = [];
      this.channel.push(new ChannelRLE());
      this.channel.push(new ChannelRLE());
      this.channel.push(new ChannelRLE());
      this.channel.push(new ChannelRLE());
      this.channel[0].channel = new Uint8Array(0);
      this.channel[1].channel = new Uint8Array(0);
      this.channel[2].channel = new Uint8Array(0);
      this.channel[3].channel = new Uint8Array(0);

      //compress channels
      for(var i = 0; i < 4;i++){
        (this.channel[i] as ChannelRLE).prepare(layerRecord);
      }

      //layer record info seems to have length two for mask layer
      //and layers of zero width/height
      layerRecord.info = [
        { id : -1, length : 2 },
        { id : 0, length : 2 },
        { id : 1, length : 2 },
        { id : 2, length : 2 }
      ];
      return null;
    }


    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var pixelArray = imageData.data;

    this.channel = [];
    this.channel.push(new ChannelRLE());
    this.channel.push(new ChannelRLE());
    this.channel.push(new ChannelRLE());
    this.channel.push(new ChannelRLE());
    this.channel[0].channel = new Uint8Array(width*height);
    this.channel[1].channel = new Uint8Array(width*height);
    this.channel[2].channel = new Uint8Array(width*height);
    this.channel[3].channel = new Uint8Array(width*height);

    var i = 0;
    for (var y = 0; y < height; ++y) {
      for (var x = 0; x < width; ++x) {
        var index = (y * width + x);
        (<Array<number>>this.channel[0].channel)[i] = pixelArray[index * 4 + 3];
        (<Array<number>>this.channel[1].channel)[i] = pixelArray[index * 4    ];
        (<Array<number>>this.channel[2].channel)[i] = pixelArray[index * 4 + 1];
        (<Array<number>>this.channel[3].channel)[i] = pixelArray[index * 4 + 2];
        i++;
      }
    }
    
    //compress channels
    for(var i = 0; i < 4;i++){
      (this.channel[i] as ChannelRLE).prepare(layerRecord);
    }
    
    layerRecord.info = [
      { id : -1, length : this.channel[0].getLength()},
      { id : 0, length : this.channel[1].getLength()},
      { id : 1, length : this.channel[2].getLength()},
      { id : 2, length : this.channel[3].getLength()}
    ];
  }

  /**
   * Copy bitmap data in layerRecord to HTMLCanvasElement.
   * @param header
   * @param colorModeData
   * @param layerRecord
   * @returns {HTMLCanvasElement}
   */
  createCanvas(header:Header, colorModeData:ColorModeData, layerRecord:LayerRecord):HTMLCanvasElement {
    var canvas:HTMLCanvasElement = document.createElement('canvas');
    var ctx:CanvasRenderingContext2D = canvas.getContext('2d');
    var width:number = canvas.width = (layerRecord.right - layerRecord.left);
    var height:number = canvas.height = (layerRecord.bottom - layerRecord.top);
    var imageData:ImageData;
    var pixelArray:Uint8ClampedArray;
    var x:number;
    var y:number;
    var index:number;
    var channels:Array<ChannelRAW|ChannelRLE> = this.channel;
    var channel:Array<any> = [];
    var i:number;
    var il:number;
    var color:Array<Array<number>|Uint8Array>;
    var alpha:Array<number>|Uint8Array;
    var mask:Array<number>|Uint8Array;


    if (width === 0 || height === 0) {
      return canvas;
    }

    imageData = ctx.createImageData(width, height);
    pixelArray = imageData.data;
    for (i = 0, il = channels.length; i < il; ++i) {
      switch (layerRecord.info[i].id) {
        case 0: // r c
        case 1: // g m
        case 2: // b y
        case 3: //   k
          channel[layerRecord.info[i].id] = channels[i].channel;
          break;
        case -1: // alpha
          alpha = channels[i].channel;
          break;
        case -2:
          mask = channels[i].channel;
          break;
        default:
          window.console.warn("not supported channel id", layerRecord.info[i].id);
          continue;
      }
    }

    if (alpha) {
      channel.push(alpha);
    }
    color = new Color(header, colorModeData, channel).toRGBA();

    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        index = (y * width + x);
        pixelArray[index * 4 + 0] = color[0][index];
        pixelArray[index * 4 + 1] = color[1][index];
        pixelArray[index * 4 + 2] = color[2][index];
        if (mask) {
          pixelArray[index * 4 + 3] = (mask[index] / 255) * (color[3] ? color[3][index] : 255);
        } else {
          pixelArray[index * 4 + 3] = color[3] ? color[3][index] : 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  getLength() {
    var length = 0;
    for(var i = 0; i < this.channel.length; i++) {
      length += this.channel[i].getLength();
    }
    return length;
  }
}