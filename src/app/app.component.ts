import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ibWeb';
  ngOnInit(): void {
    //localStorage.setItem('loggedin', "0");
  }
}
