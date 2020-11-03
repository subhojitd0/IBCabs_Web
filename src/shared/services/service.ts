import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {API_URL} from '../constants/constant';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
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

}