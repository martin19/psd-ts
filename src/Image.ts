import {StreamReader} from "./StreamReader";
import {Header} from "./Header";
import {StreamWriter} from "./StreamWriter";

export abstract class Image {
  channel : Array<Array<number>|Uint8Array>;
  abstract parse(stream : StreamReader, header: Header):void;
  abstract write(stream : StreamWriter, header?: Header):void;
}