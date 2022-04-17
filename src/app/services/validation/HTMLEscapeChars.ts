import { StringMap } from "@angular/compiler/src/compiler_facade_interface";
export class HTMLEscape{


static escapeMethod(str:string)
{

const htmlEscapeReg = new RegExp(`[${Object.keys(HTMLEscapeChars)}]`, "g");
  return str.replace(
   htmlEscapeReg,
   (tag: string) => (HTMLEscapeChars as StringMap)[tag] || tag
 ).trim();

}
}
export enum HTMLEscapeChars {
  "&" = "&amp;",
  "<" = "&lt;",
  ">" = "&gt;",
  "'" = "&#39;",
  '"' = "&quot;",
}
