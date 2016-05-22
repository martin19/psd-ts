import {StreamReader} from "./StreamReader";
import {Header} from "./Header";

export abstract class Image {
  channel : Array<any>;
  abstract parse(stream : StreamReader, header: Header):void;
}