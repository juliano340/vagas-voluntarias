import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod'; // Adjust the import path as necessary

@Component({
  selector: 'app-api-status',
  templateUrl: './api-status.component.html',
  styleUrls: ['./api-status.component.css'],
})
export class ApiStatusComponent implements OnInit {
  apiOnline: boolean = false;
  intervalId: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkApi();
    this.intervalId = setInterval(() => this.checkApi(), 5000);
  }

  checkApi() {
    this.http.get(`${environment.apiUrl}/ping`).subscribe({
      next: () => {
        this.apiOnline = true;
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
      },
      error: () => (this.apiOnline = false),
    });
  }
}
