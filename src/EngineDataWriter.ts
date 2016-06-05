import {IEngineData, KnownEngineDataPropertyTypes} from "./EngineData";
function ind(data:Array<number>, indent : number) {
  for(var i = 0; i < indent;i++) {
    data.unshift(0x09);
  }
  return data;
}

function stringToArray(s:string) {
  var data:Array<number> = [];
  for(var i = 0; i < s.length; i++) {
    data.push(s.charCodeAt(i));
  }
  return data;
}

//http://stackoverflow.com/questions/6226189/how-to-convert-a-string-to-bytearray
//https://mathiasbynens.be/notes/javascript-encoding
function stringToUtf16ByteArray(str:string)
{
  var data:Array<number> = [];
  //currently the function returns without BOM. Uncomment the next line to change that.
  //data.push(254, 255);  //Big Endian Byte Order Marks
  for (var i = 0; i < str.length; ++i)
  {
    var charCode = str.charCodeAt(i);
    //char > 2 data is impossible since charCodeAt can only return 2 data
    data.push((charCode & 0xFF00) >>> 8);  //high byte (might be 0)
    data.push(charCode & 0xFF);  //low byte
  }
  return data;
}

function stringToPhotoshopUtf16ByteArray(str:string)
{
  var data:Array<number> = [];
  //currently the function returns without BOM. Uncomment the next line to change that.
  //data.push(254, 255);  //Big Endian Byte Order Marks
  for (var i = 0; i < str.length; ++i)
  {
    var charCode = str.charCodeAt(i);
    var d = [(charCode & 0xFF00) >>> 8, charCode & 0xFF];
    if(d[1] === 40 || d[1] === 41 || d[1] === 92) {
      data.push(d[0]);
      data.push(92);
      data.push(d[1]);
    } else {
      data.push(d[0]);  //high byte (might be 0)
      data.push(d[1]);  //low byte
    }
  }
  return data;
}

function formatNumber(value:number, type:string) {
  var num:number = value;
  var str:string;
  if(typeof type === "undefined") {
    str = (Math.round(value*100000)/100000).toString();
  } else
  if(typeof type === "string" && type === "integer") {
    str = Math.round(value).toString();
  } else
  if(typeof type === "string" && type === "float") {
    num = (Math.round(value*100000)/100000);
    str = num.toFixed(Math.max(1, (num.toString().split('.')[1] || []).length));
  }
  return str;
}

export class EngineDataWriter {
  constructor() {
  }

  static writeNumber(name : string, value:number, output : Array<number>, indent : number) {
    output.push.apply(output,ind(stringToArray("/" + name + " " + formatNumber(value,KnownEngineDataPropertyTypes[name]) + "\n\t"),indent));
  }
  
  static writeString(name : string, value:string, output : Array<number>, indent : number) {
    var data:Array<number> = [];
    if(name) {
      data = stringToArray("/" + name + " ");
    }
    data.push.apply(data,[0x28,0xFE,0xFF]); //starting ( and BOM
    data.push.apply(data,stringToPhotoshopUtf16ByteArray(value));
    data.push.apply(data,[0x29]);
    data.push.apply(data,stringToArray("\n\t"));
    data = ind(data,indent);
    output.push.apply(output,data);
  }

  static writeBoolean(name : string, value:boolean, output : Array<number>, indent : number) {
    output.push.apply(output,ind(stringToArray("/" + name + " " + (value?"true":"false") + "\n\t"),indent));
  }

  static writeArray(name : string, value:Array<any>, output : Array<number>, indent : number) {
    if(!value.length) {
      output.push.apply(output,ind(stringToArray("/" + name + " " + "[ ]\n\t"),indent));
    } else
    if(value.length && typeof value[0] === "number") {
      var rounded = value.map((f:number)=>{return formatNumber(f, KnownEngineDataPropertyTypes[name])});
      output.push.apply(output,ind(stringToArray("/" + name + " " + "[ " + rounded.join(" ") + " ]\n\t"),indent));
    } else {
      output.push.apply(output,ind(stringToArray("/" + name + " " + "[\n\t"),indent));
      for(var i = 0; i < value.length;i++) {
        var v = value[i];
        if(typeof v === "object") {
          EngineDataWriter.writeProperty(null, v, output, indent+1);
        } else
        if(typeof v === "string") {
          EngineDataWriter.writeString(null, v, output, indent+1);
        } else {
          throw "unexpected array data type" + typeof v;
        }
      }
      output.push.apply(output,ind(stringToArray("]\n\t"),indent));
    }
  }

  static writeProperty(name : string, value:any, output : Array<number>, indent : number) {
    if(name) { 
      output.push.apply(output,ind(stringToArray("/" + name + "\n\t"),indent));
    }
    output.push.apply(output,ind(stringToArray("<<\n\t"),indent));
    for(var n in value) {
      if(value.hasOwnProperty(n)) {
        var v:any = value[n];
        if(typeof v === "number") {
          EngineDataWriter.writeNumber(n,v,output, indent);
        } else
        if(typeof v === "string") {
          EngineDataWriter.writeString(n,v,output, indent);
        } else
        if(typeof v === "boolean") {
          EngineDataWriter.writeBoolean(n,v,output, indent);
        } else
        if(Array.isArray(v)) {
          EngineDataWriter.writeArray(n, v,output, indent);
        } else
        if(typeof v === "object") {
          EngineDataWriter.writeProperty(n, v, output, indent+1);
        }
      }
    }
    output.push.apply(output,ind(stringToArray(">>\n\t"),indent));
  }

  static write(engineData:IEngineData):Array<number> {
    var output:Array<number> = [];
    output.push.apply(output, stringToArray("<<\n\t"));
    EngineDataWriter.writeProperty("EngineDict", engineData.EngineDict, output, 0);
    EngineDataWriter.writeProperty("ResourceDict", engineData.ResourceDict, output, 0);
    EngineDataWriter.writeProperty("DocumentResources",engineData.DocumentResources, output, 0);
    output.push.apply(output, stringToArray(">>\n\t"));
    return output;
  }
}