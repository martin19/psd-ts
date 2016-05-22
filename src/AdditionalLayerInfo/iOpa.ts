import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
export class iOpa implements IAdditionalLayerInfoParser {

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

}