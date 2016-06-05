import {StreamReader} from "../StreamReader";
import {Header} from "../Header";
import {_enum} from "./enum";
import {doub} from "./doub";
import {bool} from "./bool";
import {alis} from "./alis";
import {GlbC} from "./GlbC";
import {long} from "./long";
import {ObAr} from "./ObAr";
import {_obj} from "./obj";
import {GlbO} from "./GlbO";
import {Objc} from "./Objc";
import {prop} from "./prop";
import {rele} from "./rele";
import {tdta} from "./tdta";
import {TEXT} from "./TEXT";
import {type} from "./type";
import {UnFl} from "./UnFl";
import {UntF} from "./UntF";
import {VlLs} from "./VlLs";
import {StreamWriter} from "../StreamWriter";

export interface IDescriptorInfoBlock {
  parse(stream : StreamReader, length? : number, header? : Header):void;
  write(stream : StreamWriter):void;
  getLength():number;
}

export var DescriptorInfoBlock : {[id:string]:any} = {
  "alis" : alis,
  "bool" : bool,
  "doub" : doub, 
  "enum" : _enum, 
  "GlbC" : GlbC, 
  "GlbO" : GlbO, 
  "long" : long, 
  "ObAr" : ObAr, 
  "obj " : _obj,  
  "Objc" : Objc, 
  "prop" : prop, 
  "rele" : rele, 
  "tdta" : tdta, 
  "TEXT" : TEXT, 
  "type" : type, 
  "UnFl" : UnFl, 
  "UntF" : UntF, 
  "VlLs" : VlLs,
};