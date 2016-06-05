import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class luni implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  layerName:string;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var length:number;

    this.offset = stream.tell();
    length = stream.readUint32();
    this.layerName = stream.readWideString(length);

    // NOTE: length が奇数の時はパディングがはいる
    if ((length & 1) === 1) {
      stream.seek(2);
    }

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint32(this.layerName.length * 2);
    stream.writeWideString(this.layerName);
  }

  getLength():number {
    return 4 + this.layerName.length * 2;
  }
}