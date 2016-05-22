import {StreamReader} from "../StreamReader";
import {clbl} from "./clbl";
import {Header} from "../Header";
import {fxrp} from "./fxrp";
import {GdFl} from "./GdFl";
import {infx} from "./infx";
import {iOpa} from "./iOpa";
import {knko} from "./knko";
import {lclr} from "./lclr";
import {lfx2} from "./lfx2";
import {lnsr} from "./lnsr";
import {lrFX} from "./lrFX";
import {lsct} from "./lsct";
import {lspf} from "./lspf";
import {luni} from "./luni";
import {lyid} from "./lyid";
import {lyvr} from "./lyvr";
import {Patt} from "./Patt";
import {shmd} from "./shmd";
import {SoCo} from "./SoCo";
import {SoLd} from "./SoLd";
import {TySh} from "./TySh";
import {vmsk} from "./vmsk";
import {PlLd} from "./PlLd";

export interface IAdditionalLayerInfoParser {
  parse(stream : StreamReader, length? : number, header? : Header):void;
}

export var AdditionalLayerInfoParser : {[id:string]:any} = {
  'clbl' : clbl,
  'fxrp' : fxrp,
  'GdFl' : GdFl,
  'infx' : infx,
  'iOpa' : iOpa,
  'knko' : knko,
  'lclr' : lclr,
  'lfx2' : lfx2,
  'lnsr' : lnsr,
  'lrFX' : lrFX,
  'lsct' : lsct,
  'lspf' : lspf,
  'luni' : luni,
  'lyid' : lyid,
  'lyvr' : lyvr,
  'Patt' : Patt,
  'PlLd' : PlLd,
  'shmd' : shmd,
  'SoCo' : SoCo,
  'SoLd' : SoLd,
  'TySh' : TySh,
  'vmsk' : vmsk
};