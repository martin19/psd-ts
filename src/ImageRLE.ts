import {Image} from "./Image";
import {Header} from "./Header";
import {StreamReader} from "./StreamReader";
import {StreamWriter} from "./StreamWriter";

var USE_TYPEDARRAY : boolean = true;

export class ImageRLE extends Image {

  constructor() {
    super();
    this.channel = [];
  }

  parse(stream:StreamReader, header:Header) {
    var i:number;
    var channel:Array<any> = this.channel = [];
    var lineLength:Array<number> = [];
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

  write(stream:StreamWriter, header:Header) {
    
    var lineLength:Array<number> = [];
    var lines:Array<Uint8Array> = [];
    var height = header.rows;
    var width = header.columns;

    for(var j = 0; j < this.channel.length; j++) {
      var channel = this.channel[j];
      for(var i =0; i < height; i++) {
        var line = StreamWriter.createPackbits(channel.slice(i*width,i*width+width)) as Uint8Array;
        lines.push(line);
        lineLength.push(line.length);
      }
    }
    for(var i = 0; i < lineLength.length; i++) {
      stream.writeUint16(lineLength[i]);
    }
    for(var i = 0; i < lines.length;i++) {
      stream.write(lines[i]);
    }
  }
}