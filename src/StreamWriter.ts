export class StreamWriter {
  private output:Array<number>;
  private ip:number;

  /**
   * ByteArray Writer.
   * @param output output buffer.
   */
  constructor(output:Array<number>) {
    this.output = output;
    this.ip = 0;
  }

  /**
   * Write Uint32 number.
   * @param value
   */
  writeUint32(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    this.output.push((value >> 24) & 0xFF);
    this.output.push((value >> 16) & 0xFF);
    this.output.push((value >> 8) & 0xFF);
    this.output.push(value & 0xFF);
  }

  /**
   * Write Int32 number.
   * @param value
   */
  writeInt32(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    this.output.push((value >> 24) & 0xFF);
    this.output.push((value >> 16) & 0xFF);
    this.output.push((value >> 8) & 0xFF);
    this.output.push(value & 0xFF);
  }

  /**
   * Write Uint16 number.
   * @param value
   */
  writeUint16(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    this.output.push((value >> 8) & 0xFF);
    this.output.push(value & 0xFF);
  }

  /**
   * Write Int16 number.
   * @param value
   */
  writeInt16(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    this.output.push((value >> 8) & 0xFF);
    this.output.push(value & 0xFF);
  }

  /**
   * Write UInt8.
   */
  writeUint8(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    this.output.push(value);
  }

  /**
   * Write Int8.
   */
  writeInt8(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    this.output.push(value);
  }

  /**
   * Write Float64.
   * @param value
   */
  writeFloat64(value:number) {
    if(typeof value === "undefined") throw "undefined value";
    var buffer = new ArrayBuffer(8);
    var float64 = new Float64Array(buffer);
    var uint8 = new Uint8Array(buffer);
    float64[0] = value;
    var i = 8;
    while (--i >= 0) {
      this.output.push(uint8[i]);
    }
  }

  /**
   * Write array of bytes to output.
   * @param data
   */
  write(data:Array<number>|Uint8Array) {
    // var i = 0;
    // while(i < data.length) {
    //   this.output.push(data[i++]);
    // }
    this.output.push.apply(this.output,data);
  }


  /**
   * Writes a 0 terminated string to output.
   * @param value
   * @returns {string}
   */
  writeString(value:string) {
    for (var i = 0; i < value.length; i++) {
      this.output.push(value.charCodeAt(i));
    }
  }

  /**
   * Writes a 2-byte-symbol string to output.
   * @param value
   */
  writeWideString(value:string) {
    for (var i = 0; i < value.length; ++i) {
      var charcode = value.charCodeAt(i);
      this.output.push(charcode >> 8 & 0xFF);
      this.output.push(charcode & 0xFF);
    }
  }

  /**
   * Writes a Pascal string to output.
   */
  writePascalString(value:string) {
    this.writeString(value);
  }

  /**
   * @return {number}
   */
  tell() {
    return this.ip;
  }

  /**
   * @param pos position.
   * @param opt_base base position.
   */
  seek(pos:number, opt_base?:number) {
    if (typeof opt_base !== 'number') {
      opt_base = this.ip;
    }
    this.ip = opt_base + pos;
  }

  /**
   * Encodes data in data to Packbits and writes to ouput.
   * @param data
   */
  writePackbits(data:Uint8Array|Array<number>) {
    this.write(StreamWriter.createPackbits(data));
  }

  /**
   * Encodes data in data to Packbits and returns it.
   * @param data
   * @returns {Array<number>}
   */
  static createPackbits(data:Uint8Array|Array<number>) {
    var output:Uint8Array = new Uint8Array(data.length * 2);
    var index = 0;
    if(data.length == 0) {
      return;
    }
    if(data.length == 1) {
      output[index++] = 0;
      output[index++] = data[0];
      return output.slice(0,index);
    }

    var pos = 0;
    var buf:Array<number> = [];
    var repeatCount = 0;
    const MAX_LENGTH = 127;

    // we can safely start with RAW as empty RAW sequences
    // are handled by finish_raw()
    var state = 0; //0 == RAW, 1 == RLE

    while(pos < data.length-1) {
      var currentByte = data[pos];
      if(data[pos] == data[pos+1]) {
        if(state === 0) {
          // end of RAW data
          if (buf.length != 0) {
            output[index++] = buf.length - 1;
            for (var i = 0; i < buf.length; i++) {
              output[index++] = buf[i];
            }
            buf = [];
          }
          state = 1;
          repeatCount = 1;
        } else if(state === 1) {
          if(repeatCount === MAX_LENGTH) {
            // restart the encoding
            output[index++] = 256 - (repeatCount - 1);
            output[index++] = data[pos];
            repeatCount = 0;
          }
          // move to next byte
          repeatCount++;
        }
      } else {
        if(state === 1) {
          repeatCount++;
          output[index++] = 256 - (repeatCount - 1);
          output[index++] = data[pos];
          state = 0;
          repeatCount = 0;
        } else if(state === 0) {
          if(buf.length === MAX_LENGTH) {
            // restart the encoding
            if (buf.length != 0) {
              output[index++] = buf.length - 1;
              for (var i = 0; i < buf.length; i++) {
                output[index++] = buf[i];
              }
              buf = [];
            }
          }
          buf.push(currentByte);
        }
      }
      pos++;
    }
    if(state === 0) {
      buf.push(data[pos]);
      if (buf.length != 0) {
        output[index++] = buf.length - 1;
        for (var i = 0; i < buf.length; i++) {
          output[index++] = buf[i];
        }
        buf = [];
      }
    } else {
      repeatCount++;
      output[index++] = 256 - (repeatCount - 1);
      output[index++] = data[pos];
    }
    return output.slice(0,index);
  }
}