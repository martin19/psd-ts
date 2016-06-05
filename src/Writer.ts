import {Header} from "./Header";
import {ColorModeData} from "./ColorModeData";
import {ImageResources} from "./ImageResources";
import {LayerAndMaskInformation} from "./LayerAndMaskInformation";
import {PSDImageData} from "./ImageData";
import {StreamWriter} from "./StreamWriter";

export interface WriterOptions {
  inputPosition?: number;
}

/**
 * PSD parser in JavaScript.
 * @author imaya <imaya.devel@gmail.com>
 */
export class Writer {

  stream : StreamWriter;
  header:Header;
  colorModeData:ColorModeData;
  imageResources:ImageResources;
  layerAndMaskInformation:LayerAndMaskInformation;
  imageData:PSDImageData;


  /**
   * PSD parser
   * @param output output buffer.
   * @param opt_param option parameters.
   */
  constructor(output:Array<number>, opt_param?:WriterOptions) {
    if (!opt_param) {
      opt_param = {};
    }

    this.stream = new StreamWriter(output);
  }

  write() {
    var stream = this.stream;

    // parse
    this.header.write(stream);
    this.colorModeData.write(stream, this.header);
    this.imageResources.write(stream);
    this.layerAndMaskInformation.write(stream, this.header);
    this.imageData.write(stream, this.header);
  }

}