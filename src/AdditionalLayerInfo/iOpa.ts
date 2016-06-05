import {IAdditionalLayerInfoBlock} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {StreamWriter} from "../StreamWriter";
export class iOpa implements IAdditionalLayerInfoBlock {

  offset:number;
  length:number;
  /** TODO: 公式の仕様？ */
  opacity:number;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    this.offset = stream.tell();

    // TODO: おそらく 1 Byte で Opacity を表していて残りはパディングだと思われる
    // console.log('iOpa:', stream.fetch(stream.tell(), stream.tell()+4));
    this.opacity = stream.readUint8();
    stream.seek(3);

    this.length = stream.tell() - this.offset;
  }


  write(stream:StreamWriter):void {
    stream.writeUint8(this.opacity);
    for(var i = 0; i < 3;i++) {
      stream.writeUint8(0);
    }
  }

  getLength():number {
    return 4;
  }
}