import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {API_URL, MESSAGE_URL} from '../constants/constant';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'numberToWords'
})
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen '];

  b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'];

  header : any;
  constructor() {
    var token = JSON.parse(localStorage.getItem('currentUser'));
  }

  public get(url: any){
    return fetch(API_URL + url, {
        method: "GET"
    }).then(response => response.json());
  }
  public post(url: any, jsonData: any){
    return fetch(API_URL + url, {
        method: "POST",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify(jsonData)
    }).then(response => response.json());
  }
  public sendMessage(queryparam: any){
      return fetch(MESSAGE_URL + queryparam, {
        method: "GET"
    }).then(response => response.json());
  }
  public convertAmountToWord(value: any, args?: any): any {
    if (value) {
      let num: any = Number(value);
      if (num) {
        if ((num = num.toString()).length > 9)  { return 'We are not the Iron Bank, you can lower down the stakes :)'; }
        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) {return ''; }
        let str = 'Rs. ';
        str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'crore ' : '';
        str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'lakh ' : '';
        str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'thousand ' : '';
        str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'hundred ' : '';
        str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') +
        (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' +
        this.a[n[5][1]]) + 'only' : '';
        return str;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}