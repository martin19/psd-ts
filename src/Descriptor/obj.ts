import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoParser, DescriptorInfoParser} from "./DescriptorInfoParser";

var Table:{[key:string]:string} = {
  'prop': 'prop',
  'Clss': 'type',
  'Enmr': 'enum',
  'rele': 'rele',
  'Idnt': 'long',
  'indx': 'long',
  'name': 'TEXT'
};

export class _obj implements IDescriptorInfoParser {

  offset:number;
  length:number;
  items:number;
  item:Array<any>;


  constructor() {
  }

  parse(stream:StreamReader, length?:number, header?:Header) {
    var items:number;
    var key:string;
    var type:string;
    /** @type {!{parse: function(PSD.StreamReader)}} */
    var data:IDescriptorInfoParser;
    var i:number;

    this.offset = stream.tell();

    this.item = [];
    items = this.items = stream.readUint32();
    for (i = 0; i < items; ++i) {
      key = stream.readString(4);
      type = Table[key];

      if (typeof DescriptorInfoParser[type] !== 'function') {
        console.error('OSType Key not implemented:', type);
        return;
      }

      data = new (DescriptorInfoParser[type])();
      data.parse(stream);

      this.item.push({key: key, data: data});
    }

    this.length = stream.tell() - this.offset;
  };

}