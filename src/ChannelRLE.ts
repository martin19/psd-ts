import {ChannelImage} from "./ChannelImage";
import {StreamReader} from "./StreamReader";
import {LayerRecord} from "./LayerRecord";
import {StreamWriter} from "./StreamWriter";

var USE_TYPEDARRAY : boolean = true;

export class ChannelRLE extends ChannelImage {

  lineLength:Array<number>;
  lines:Array<Array<number>>;

  constructor() {
    super();
    this.channel = [];
  }

  parse(stream:StreamReader, layerRecord:LayerRecord, length:number) {
    var i:number;
    var lineLength:Array<number> = this.lineLength = [];
    var lines:Array<any> = [];
    var height:number = layerRecord.bottom - layerRecord.top;
    var limit:number = stream.tell() + length;
    var size:number = 0;
    var pos:number;

    // line lengths
    for (i = 0; i < height; ++i) {
      lineLength[i] = stream.readUint16();
    }

    // channel data
    for (i = 0; i < height; ++i) {
      lines[i] = stream.readPackBits(lineLength[i]);
      size += lines[i].length;
      // TODO: avoid invalid height
      if (stream.tell() >= limit) {
        break;
      }
    }

    // concatenation
    if (USE_TYPEDARRAY) {
      this.channel = new Uint8Array(size);
      for (i = 0, pos = 0, height = lines.length; i < height; ++i) {
        (<Uint8Array>this.channel).set(lines[i], pos);
        pos += lines[i].length;
      }
    } else {
      this.channel = Array.prototype.concat.apply([], lines);
    }
  }

  prepare(layerRecord:LayerRecord) {
    var lineLength:Array<number> = this.lineLength = [];
    var lines:Array<Uint8Array> = this.lines = [];
    var height = layerRecord.bottom - layerRecord.top;
    var width = layerRecord.right - layerRecord.left;
    for(var i =0; i < height; i++) {
      var line = StreamWriter.createPackbits(this.channel.slice(i*width,i*width+width));
      lines.push(line);
      lineLength.push(line.length);
    }
  }
  
  write(stream:StreamWriter) {
    for(var i = 0; i < this.lineLength.length; i++) {
      stream.writeUint16(this.lineLength[i]);
    }
    for(var i = 0; i < this.lines.length;i++) {
      stream.write(this.lines[i]);
    }
  }

  getLength() {
    var length = 0;
    length += 2; //compression method
    length += this.lineLength.length * 2;
    for(var i = 0; i < this.lines.length; i++) {
      length += this.lines[i].length;
    }
    return length;
  }
}
