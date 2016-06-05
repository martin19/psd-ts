import {StreamReader} from "../../StreamReader";
import {Header} from "../../Header";
import {bevl} from "./bevl";
import {cmnS} from "./cmnS";
import {dsdw} from "./dsdw";
import {iglw} from "./iglw";
import {isdw} from "./isdw";
import {sofi} from "./sofi";
import {oglw} from "./oglw";
import {StreamWriter} from "../../StreamWriter";

export interface IEffectsLayerInfoBlock {
  parse(stream : StreamReader, length? : number, header? : Header):void;
  write(stream : StreamWriter):void;
  getLength():number;
}

export var EffectsLayerInfoBlock : {[id:string]:any} = {
    "bevl" : bevl, 
    "cmnS" : cmnS, 
    "dsdw" : dsdw, 
    "iglw" : iglw, 
    "isdw" : isdw, 
    "oglw" : oglw, 
    "sofi" : sofi, 
};