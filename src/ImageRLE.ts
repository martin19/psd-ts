import {Image} from "./Image";
import {Header} from "./Header";
import {StreamReader} from "./StreamReader";

var USE_TYPEDARRAY : boolean = true;

export class ImageRLE extends Image {

  lineLength:Array<number>;

  constructor() {
    super();
  }

  parse(stream:StreamReader, header:Header) {
    var i:number;
    var channel:Array<any> = this.channel = [];
    var lineLength:Array<number> = this.lineLength = [];
    var channelIndex:number;
    var lines:Array<any>;
    var height:number = header.rows;
    var channels:number = header.channels;
    var size:number;
    var pos:number;

    // line lengths
    for (i = 0; i < height * channels; ++i) {
      lineLength[i] = stream.readUint16();
    }

    // channel data
    for (channelIndex = 0; channelIndex < channels; ++channelIndex) {
      lines = [];
      size = 0;

      for (i = 0; i < height; ++i) {
        lines[i] = stream.readPackBits(lineLength[channelIndex * height + i] * (header.depth / 8));
        size += lines[i].length;
      }
      // concatenation
      if (USE_TYPEDARRAY) {
        channel[channelIndex] = new Uint8Array(size);
        for (i = 0, pos = 0, height = lines.length; i < height; ++i) {
          channel[channelIndex].set(lines[i], pos);
          pos += lines[i].length;
        }
      } else {
        channel[channelIndex] = Array.prototype.concat.apply([], lines);
      }
    }
  }
}