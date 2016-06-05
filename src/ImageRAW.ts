import {Image} from "./Image";
import {Header} from "./Header";
import {StreamReader} from "./StreamReader";
import {StreamWriter} from "./StreamWriter";
export class ImageRAW extends Image {


  constructor() {
    super();
  }

  parse(stream:StreamReader, header:Header) {
    var channel:Array<any> = this.channel = [];
    var channelIndex:number;
    var width:number = header.columns;
    var height:number = header.rows;
    var channels:number = header.channels;
    var size:number = width * height * (header.depth / 8);

    for (channelIndex = 0; channelIndex < channels; ++channelIndex) {
      channel[channelIndex] = stream.read(size);
    }
  }

  write(stream:StreamWriter, header:Header):void {
    var width:number = header.columns;
    var height:number = header.rows;
    var channels:number = header.channels;
    var size:number = width * height * (header.depth / 8);
    for(var i = 0; i < channels; i++) {
      stream.write(this.channel[i].slice(i*size,(i+1)*size));
    }
  }
}