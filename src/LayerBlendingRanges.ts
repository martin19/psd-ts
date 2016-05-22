import {StreamReader} from "./StreamReader";

export class LayerBlendingRanges {


  offset : number;
  length : number;
  channel :Array<Array<any>>;
  black : number;
  white : number;
  destRange : number;


  constructor() {
    this.channel = [];
  }

  parse(stream:StreamReader) {
    var next:number;

    this.offset = stream.tell();
    this.length = stream.readUint32() + 4;

    if (this.length === 4) {
      window.console.log("skip: layer blending ranges(empty body)");
      return;
    }

    next = this.offset + this.length;

    this.black = stream.readUint16();
    this.white = stream.readUint16();

    this.destRange = stream.readUint32();

    while (stream.tell() < next) {
      // TODO: 専用のオブジェクトを作る
      this.channel.push([
        /* source range      */ stream.readUint32(),
        /* destination range */ stream.readUint32()
      ]);
    }
  };

}