var USE_TYPEDARRAY : boolean = true;

export class StreamReader {
  private input:Uint8Array|Array<number>;
  private ip:number;

  /**
   * ByteArray Reader.
   * @param input input buffer.
   * @param opt_start start position.
   */
  constructor(input:Array<number>|Uint8Array, opt_start:number) {
    this.input = USE_TYPEDARRAY ? new Uint8Array(input) : input;
    /** @type {number} */
    this.ip = opt_start | 0;
  }

  /**
   * @return {number}
   */
  readUint32() {
    return (
        (this.input[this.ip++] << 24) | (this.input[this.ip++] << 16) |
        (this.input[this.ip++] << 8) | (this.input[this.ip++]      )
      ) >>> 0;
  }

  /**
   * @return {number}
   */
  readInt32() {
    return (
      (this.input[this.ip++] << 24) | (this.input[this.ip++] << 16) |
      (this.input[this.ip++] << 8) | (this.input[this.ip++]      )
    );
  }

  /**
   * @return {number}
   */
  readUint16() {
    return (this.input[this.ip++] << 8) | this.input[this.ip++];
  }

  /**
   * @return {number}
   */
  readInt16() {
    return ((this.input[this.ip++] << 8) | this.input[this.ip++]) << 16 >> 16;
  }

  /**
   * @return {number}
   */
  readUint8() {
    return this.input[this.ip++];
  }

  /**
   * @return {number}
   */
  readInt8() {
    return this.input[this.ip++] << 24 >> 24;
  }

  /**
   * @return {number}
   */
  readFloat64() {


    if (USE_TYPEDARRAY) {
      var buffer = new ArrayBuffer(8);
      var uint8 = new Uint8Array(buffer);
      var float64 = new Float64Array(buffer);
    }

    function parseDoublePlain(input:Array<number>|Uint8Array, ip:number) {
      const Pow48 = Math.pow(2, 48);
      const Pow40 = Math.pow(2, 40);
      const Pow32 = Math.pow(2, 32);
      const Pow24 = Math.pow(2, 24);
      const Pow16 = Math.pow(2, 16);
      const Pow8 = Math.pow(2, 8);
      const Pow_1022 = Math.pow(2, -1022);
      const Pow_52 = Math.pow(2, -52);

      /** @type {boolean} true: positive, false: negative */
      var sign = (input[ip] & 0x80) === 0;
      /** @type {number} */
      var exp = ((input[ip++] & 0x7F) << 4) | ((input[ip] & 0xf0) >> 4);
      /** @type {number} */
      var mantissa = ((input[ip++] & 0x0f) * Pow48) +
        (input[ip++] * Pow40) + (input[ip++] * Pow32) + (input[ip++] * Pow24) +
        (input[ip++] * Pow16) + (input[ip++] * Pow8) + input[ip++];

      if (exp === 0) {
        return mantissa === 0 ? 0 :
        (sign ? 1 : -1) * Pow_1022 * mantissa * Pow_52;
      } else if (exp === 0x7ff) {
        return (
          mantissa ? NaN :
            sign ? Infinity : -Infinity
        );
      }

      return (sign ? 1 : -1) *
        (Math.pow(2, exp - 1023) + mantissa * Math.pow(2, exp - 1075));
    }

    function parseDoubleUsingTypedArray(input:Array<number>|Uint8Array, ip:number) {
      var i = 8;
      while (--i) {
        uint8[i] = input[ip++];
      }
      return float64[0];
    }

    var value:number;
    value = USE_TYPEDARRAY ?
      parseDoubleUsingTypedArray(this.input, this.ip) :
      parseDoublePlain(this.input, this.ip);
    this.ip += 8;
    return value;
  }

  read(length:number):Array<number>|Uint8Array {
    return USE_TYPEDARRAY ?
      (<Uint8Array>this.input).subarray(this.ip, this.ip += length) :
      this.input.slice(this.ip, this.ip += length);
  }

  /**
   *
   * @param start
   * @param end
   * @return {Array<number>|Uint8Array}
   */
  slice(start:number, end:number):Array<number>|Uint8Array {
    this.ip = end;
    return USE_TYPEDARRAY ?
      (<Uint8Array>this.input).subarray(start, end) : this.input.slice(start, end);
  }

  /**
   * @param start start position.
   * @param end end position.
   * @return {Array<number>|Uint8Array}
   */
  fetch(start:number, end:number):Array<number>|Uint8Array {
    return USE_TYPEDARRAY ?
      (<Uint8Array>this.input).subarray(start, end) : this.input.slice(start, end);
  }

  /**
   * @param {number} length read length.
   * @return {string}
   */
  readString(length:number) {
    var input = this.input;
    var ip = this.ip;
    var charArray:Array<string> = [];
    var i:number;

    for (i = 0; i < length; ++i) {
      charArray[i] = String.fromCharCode(input[ip++]);
    }

    this.ip = ip;

    return charArray.join('');
  }

  /**
   * @param {number} length read length.
   * @return {string}
   */
  readWideString(length:number) {
    var input = this.input;
    var ip = this.ip;
    var charArray:Array<string> = [];
    var i:number;

    for (i = 0; i < length; ++i) {
      charArray[i] = String.fromCharCode((input[ip++] << 8) | input[ip++]);
    }

    this.ip = ip;

    return charArray.join('');
  }

  /**
   * @return {string}
   */
  readPascalString() {
    return this.readString(this.input[this.ip++]);
  };

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
   * @param length read length.
   * @return {Array.<Number>} plain data.
   */
  readPackBits(length:number) {
    var limit:number;
    var runLength:number;
    var copyValue:number;
    var data:Array<number> = [];
    var pos:number = 0;

    limit = this.ip + length;

    // decode
    while (this.ip < limit) {
      runLength = this.readInt8();

      // runlength copy
      if (runLength < 0) {
        runLength = 1 - runLength;
        copyValue = this.readUint8();
        while (runLength-- > 0) {
          data[pos++] = copyValue;
        }
        // plain copy
      } else {
        runLength = 1 + runLength;
        while (runLength-- > 0) {
          data[pos++] = this.readUint8();
        }
      }
    }

    return data;
  }


}