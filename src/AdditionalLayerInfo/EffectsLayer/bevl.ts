import {Header} from "../../Header";
import {StreamReader} from "../../StreamReader";
import {IEffectsLayerInfoParser} from "./EffectsLayerInfoParser";
export class bevl implements IEffectsLayerInfoParser {


  offset : number;
  length : number;
  size : number;
  version : number;
  angle : number;
  strength : number;
  blur : number;
  highlightBlendModeSignature : string;
  highlightBlendModeKey : string;
  shadowBlendModeSignature : string;
  shadowBlendModeKey : string;
  highlightColor : Array<any>;
  bevelStyle : number;
  highlightOpacity : number;
  shadowOpacity : number;
  shadowColor : Array<any>;
  enabled : boolean;
  use :boolean;
  up : boolean;
  readHighlightColor : Array<any>;
  readShadowColor : Array<any>;

  parse(stream : StreamReader, length? : number, header? : Header) {
    this.offset = stream.tell();
    this.size = stream.readUint32();
    this.version = stream.readUint32();

    this.angle = stream.readInt32();
    this.strength = stream.readInt32();
    this.blur = stream.readInt32();

    this.highlightBlendModeSignature = stream.readString(4);
    this.highlightBlendModeKey = stream.readString(4);
    this.shadowBlendModeSignature = stream.readString(4);
    this.shadowBlendModeKey = stream.readString(4);

    stream.seek(2);
    this.highlightColor = [
      stream.readUint32(),
      stream.readUint32()
    ];
    stream.seek(2);
    this.shadowColor = [
      stream.readUint32(),
      stream.readUint32()
    ];

    this.bevelStyle = stream.readUint8();

    this.highlightOpacity = stream.readUint8();
    this.shadowOpacity = stream.readUint8();

    this.enabled = !!stream.readUint8();
    this.use = !!stream.readUint8();
    this.up = !!stream.readUint8();

    // version 2 only
    if (this.version === 2) {
      stream.seek(2);
      this.readHighlightColor = [
        stream.readUint32(),
        stream.readUint32()
      ];

      stream.seek(2);
      this.readShadowColor = [
        stream.readUint32(),
        stream.readUint32()
      ];
    }

    this.length = stream.tell() - this.offset;
  }

}