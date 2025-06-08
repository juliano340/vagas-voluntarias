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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkApi();
    setInterval(() => this.checkApi(), 5000); // verifica a cada 5 segundos
  }

  checkApi() {
    this.http.get(`${environment.apiUrl}/ping`).subscribe({
      next: () => (this.apiOnline = true),
      error: () => (this.apiOnline = false),
    });
  }
}
