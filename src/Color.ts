import {Header} from "./Header";
import {ColorModeData} from "./ColorModeData";
import {ColorMode} from "./Enum";

var USE_TYPEDARRAY:boolean = true;

export class Color {


  header:Header;
  colorModeData:ColorModeData;
  channel:Array<Array<number>|Uint8Array>;
  parsed:boolean;
  redChannel:Array<number>|Uint8Array;
  greenChannel:Array<number>|Uint8Array;
  blueChannel:Array<number>|Uint8Array;
  alphaChannel:Array<number>|Uint8Array;

  constructor(header:Header, colorModeData:ColorModeData, channels:Array<Array<number>|Uint8Array>) {
    this.header = header;
    this.colorModeData = colorModeData;
    this.channel = channels;
    this.parsed = false;
  };

  parse() {
    switch (this.header.colorMode) {
      case ColorMode.BITMAP:
        window.console.error('bitmap color mode not supported');
        break;
      case ColorMode.DUOTONE:
        window.console.warn('duotone color mode implementation is incomplete');
      /* FALLTHROUGH */
      case ColorMode.GRAYSCALE:
        this.fromGrayscale();
        break;
      case ColorMode.INDEXED_COLOR:
        this.fromIndexedColor();
        break;
      case ColorMode.MULTICHANNEL_COLOR:
        window.console.warn('multichannel color mode implementation is incomplete');
      /* FALLTHROUGH */
      case ColorMode.RGB_COLOR:
        this.fromRGB();
        break;
      case ColorMode.CMYK_COLOR:
        this.fromCMYK();
        break;
      case ColorMode.LAB_COLOR:
        this.fromLAB();
        break;
    }

    this.parsed = true;
  }

  fromRGB() {
    var r = this.redChannel = this.channel[0];
    var g = this.greenChannel = this.channel[1];
    var b = this.blueChannel = this.channel[2];
    //var a:Array<number>|Uint8Array; TODO: alpha channel is not set and skip is true?
    var a = this.alphaChannel = this.channel[3];
    var skip = this.header.depth / 8;
    var i:number;
    var il:number;
    var idx:number;

    if (skip === 1) {
      return;
    }

    if (this.channel.length === 4) {
      a = this.alphaChannel = this.channel[3];
      for (i = idx = 0, il = r.length; i < il; ++idx, i += skip) {
        r[idx] = r[i];
        g[idx] = g[i];
        b[idx] = b[i];
        a[idx] = a[i];
      }
    } else {
      for (i = idx = 0, il = r.length; i < il; ++idx, i += skip) {
        r[idx] = r[i];
        g[idx] = g[i];
        b[idx] = b[i];
      }
    }

    if (USE_TYPEDARRAY) {
      this.redChannel = (<Uint8Array>r).subarray(0, idx);
      this.greenChannel = (<Uint8Array>g).subarray(0, idx);
      this.blueChannel = (<Uint8Array>b).subarray(0, idx);
    } else {
      r.length = g.length = b.length = idx;
    }

    if (this.channel.length === 4) {
      if (USE_TYPEDARRAY) {
        this.alphaChannel = (<Uint8Array>a).subarray(0, idx);
      } else {
        a.length = idx;
      }
    }
  }

  fromIndexedColor() {
    var indexed = this.channel[0];
    var i : number;
    var il:number = indexed.length;
    var idx:number;
    var r = this.redChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var g = this.greenChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var b = this.blueChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var palette:Array<number>|Uint8Array = this.colorModeData.data;
    var div:number = palette.length / 3;

    for (i = idx = 0; i < il; ++idx, i += 1) {
      r[idx] = palette[indexed[i]];
      g[idx] = palette[indexed[i] + div];
      b[idx] = palette[indexed[i] + div * 2];
    }
  }

  fromGrayscale() {
    var gray:Array<number>|Uint8Array = this.channel[0];
    var i:number;
    var il:number = gray.length;
    var r = this.redChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var g = this.greenChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var b = this.blueChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var skip:number = this.header.depth / 8;
    var idx:number;

    for (i = idx = 0; i < il; ++idx, i += skip) {
      r[idx] = g[idx] = b[idx] = gray[i];
    }
  }

  fromCMYK() {
    var cc = this.channel[0];
    var mc = this.channel[1];
    var yc = this.channel[2];
    var kc = this.channel[3];
    var i:number;
    var il = cc.length;
    var r = this.redChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var g = this.greenChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var b = this.blueChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var c:number;
    var m:number;
    var y:number;
    var k:number;
    var skip = this.header.depth / 8;
    var idx:number;

    // TODO: Alpha Channel support

    for (i = idx = 0; i < il; ++idx, i += skip) {
      c = 255 - cc[i];
      m = 255 - mc[i];
      y = 255 - yc[i];
      k = 255 - kc[i];
      r[idx] = (65535 - (c * (255 - k) + (k << 8))) >> 8;
      g[idx] = (65535 - (m * (255 - k) + (k << 8))) >> 8;
      b[idx] = (65535 - (y * (255 - k) + (k << 8))) >> 8;
    }
  }

  fromLAB() {
    var lc = this.channel[0];
    var ac = this.channel[1];
    var bc = this.channel[2];
    var i:number;
    var il = lc.length;
    var r = this.redChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var g = this.greenChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var b = this.blueChannel = new (USE_TYPEDARRAY ? Uint8Array : Array)(il);
    var x:number;
    var y:number;
    var z:number;
    const Xn = 0.950456;
    const Yn = 1.0;
    const Zn = 1.088754;
    const delta = 6 / 29;
    var fy:number;
    var fx:number;
    var fz:number;
    var idx:number;
    var skip = this.header.depth / 8;

    // TODO: Alpha Channel support

    for (i = idx = 0; i < il; ++idx, i += skip) {
      // lab to xyz
      //   L: L' * 100 >> 8
      //   a: a' - 128
      //   b: b' - 128
      fy = ((lc[i] * 100 >> 8) + 16) / 116;
      fx = fy + (ac[i] - 128) / 500;
      fz = fy - (bc[i] - 128) / 200;

      x = fx > delta ? Xn * Math.pow(fx, 3) : (fx - 16 / 116) * 3 * Math.pow(delta, 2);
      y = fy > delta ? Yn * Math.pow(fy, 3) : (fy - 16 / 116) * 3 * Math.pow(delta, 2);
      z = fz > delta ? Zn * Math.pow(fz, 3) : (fz - 16 / 116) * 3 * Math.pow(delta, 2);

      // xyz to adobe rgb
      r[idx] = Math.pow(2.041588 * x - 0.565007 * y - 0.344731 * z, 1 / 2.2) * 255;
      g[idx] = Math.pow(-0.969244 * x + 1.875968 * y + 0.041555 * z, 1 / 2.2) * 255;
      b[idx] = Math.pow(0.013444 * x - 0.118362 * y + 1.015175 * z, 1 / 2.2) * 255;
    }
  }

  /**    
   * @returns {Array<number>|Uint8Array[]}
   */
  toRGB() {
    if (!this.parsed) {
      this.parse();
    }

    return [
      this.redChannel,
      this.greenChannel,
      this.blueChannel
    ];
  }

  /**
   * 
   * @returns {Array<Array<number>|Uint8Array>}
   */
  toRGBA() {
    if (!this.parsed) {
      this.parse();
    }

    return [
      this.redChannel,
      this.greenChannel,
      this.blueChannel,
      this.alphaChannel
    ];
  }

}