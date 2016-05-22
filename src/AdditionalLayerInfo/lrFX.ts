import {IAdditionalLayerInfoParser} from "./AdditionalLayerInfoParser";
import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {EffectsLayerInfoParser, IEffectsLayerInfoParser} from "./EffectsLayer/EffectsLayerInfoParser";
export class lrFX implements IAdditionalLayerInfoParser {

  offset:number;
  length:number;
  version:number;
  count:number;
  effect:Array<{key:string, effect:IEffectsLayerInfoParser}>;
  key : string;

  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var signature:string;
    var key:string;
    /** @type {{parse: function(PSD.StreamReader)}} */
    var effect:IEffectsLayerInfoParser;
    var i:number;

    this.offset = stream.tell();

    this.version = stream.readUint16();
    this.count = stream.readUint16();
    this.effect = [];

    for (i = 0; i < this.count; ++i) {
      // signature
      signature = stream.readString(4);
      if (signature !== '8BIM') {
        console.warn('invalid signature:', signature);
        break;
      }

      this.key = key = stream.readString(4);
      if (typeof EffectsLayerInfoParser[this.key] === 'function') {
        effect = new (EffectsLayerInfoParser[this.key])();
        effect.parse(stream);
        this.effect[i] = {
          key: key,
          effect: effect
        };
      } else {
        console.warn('detect unknown key:', key);
        break;
      }
    }

    this.length = stream.tell() - this.offset;
  }

}