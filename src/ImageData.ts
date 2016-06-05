import {CompressionMethod} from "./Enum";
import {Image} from "./Image";
import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {ColorModeData} from "./ColorModeData";
import {Color} from "./Color";
import {ImageRLE} from "./ImageRLE";
import {ImageRAW} from "./ImageRAW";
import {StreamWriter} from "./StreamWriter";
import {ChannelRLE} from "./ChannelRLE";
export class PSDImageData {

  offset:number;
  length:number;
  compressionMethod:CompressionMethod;
  image:Image;

  constructor() {
  }

  parse(stream:StreamReader, header:Header) {
    this.offset = stream.tell();
    this.compressionMethod = stream.readUint16();

    switch (this.compressionMethod) {
      case CompressionMethod.RAW:
        this.image = new ImageRAW();
        break;
      case CompressionMethod.RLE:
        this.image = new ImageRLE();
        break;
      default:
        throw new Error('unknown compression method');
    }
    this.image.parse(stream, header);

    this.length = stream.tell() - this.offset;
  };
  
  write(stream:StreamWriter, header?:Header) {
    stream.writeUint16(this.compressionMethod);
    this.image.write(stream, header);
  }

  /**
   * Extract RGBA channel data from canvas.
   * @param canvas
   * @returns {null}
   */
  createChannels(canvas:HTMLCanvasElement):void {
    var ctx = canvas.getContext("2d");
    var width:number = canvas.width;
    var height:number = canvas.height;
    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
    var pixelArray = imageData.data;

    if (width === 0 || height === 0) {
      return null;
    }

    this.image = new ImageRLE();
    this.image.channel.push(new Uint8Array(width*height));
    this.image.channel.push(new Uint8Array(width*height));
    this.image.channel.push(new Uint8Array(width*height));
    this.image.channel.push(new Uint8Array(width*height));

    var i = 0;
    for (var y = 0; y < height; ++y) {
      for (var x = 0; x < width; ++x) {
        var index = (y * width + x);
        this.image.channel[0][i]=pixelArray[index * 4 + 3];
        this.image.channel[1][i]=pixelArray[index * 4    ];
        this.image.channel[2][i]=pixelArray[index * 4 + 1];
        this.image.channel[3][i]=pixelArray[index * 4 + 2];
        i++;
      }
    }
  }

  createCanvas(header:Header, colorModeData:ColorModeData) {
    var canvas:HTMLCanvasElement = document.createElement('canvas');
    var ctx:CanvasRenderingContext2D = canvas.getContext('2d');
    var width:number = canvas.width = header.columns;
    var height:number = canvas.height = header.rows;
    var imageData:ImageData;
    var pixelArray:Uint8ClampedArray;
    var x:number;
    var y:number;
    var index:number;
    var color = new Color(header, colorModeData, this.image.channel).toRGB();

    if (width <= 0 || height <= 0) {
      return null;
    }

    imageData = ctx.createImageData(width, height);
    pixelArray = imageData.data;

    for (y = 0; y < height; ++y) {
      for (x = 0; x < width; ++x) {
        index = (y * width + x);
        pixelArray[index * 4] = color[0][index];
        pixelArray[index * 4 + 1] = color[1][index];
        pixelArray[index * 4 + 2] = color[2][index];
        pixelArray[index * 4 + 3] = 255;
        //pixelArray[index * 4 + 3] = channels[3] ? channels[3][index] : 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
  };
}