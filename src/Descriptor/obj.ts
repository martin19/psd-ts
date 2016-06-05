import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {IDescriptorInfoBlock, DescriptorInfoBlock} from "./DescriptorInfoBlock";
import {StreamWriter} from "../StreamWriter";

var Table:{[key:string]:string} = {
  'prop': 'prop',
  'Clss': 'type',
  'Enmr': 'enum',
  'rele': 'rele',
  'Idnt': 'long',
  'indx': 'long',
  'name': 'TEXT'
};

export class _obj implements IDescriptorInfoBlock {

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
    var data:IDescriptorInfoBlock;
    var i:number;

    this.offset = stream.tell();

    this.item = [];
    items = this.items = stream.readUint32();
    for (i = 0; i < items; ++i) {
      key = stream.readString(4);
      type = Table[key];

      if (typeof DescriptorInfoBlock[type] !== 'function') {
        console.error('OSType Key not implemented:', type);
        return;
      }

      data = new (DescriptorInfoBlock[type])();
      data.parse(stream);

      this.item.push({key: key, data: data});
    }

    this.length = stream.tell() - this.offset;
  };


  write(stream:StreamWriter):void {
    throw "Object reference structure not implemented";
  }

  getLength():number {
    return null;
  }
}