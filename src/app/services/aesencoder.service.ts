import { Injectable } from '@angular/core';
import { CRYPT_KEY } from './properties';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AESEncoderService {

  constructor() { }

  encode(value:any){
    var key = CryptoJS.enc.Utf8.parse(CRYPT_KEY);
    var iv = CryptoJS.enc.Utf8.parse(CRYPT_KEY);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
  }

  decode( value:any){
    var key = CryptoJS.enc.Utf8.parse(CRYPT_KEY);
    var iv = CryptoJS.enc.Utf8.parse(CRYPT_KEY);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
