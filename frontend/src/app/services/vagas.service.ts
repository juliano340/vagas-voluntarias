import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  private readonly api = 'http://localhost:3000/vagas';

  constructor(private http: HttpClient) {}

  listarVagas(filtros?: { titulo?: string; localidade?: string }): Observable<any> {
    let params = new HttpParams();
    if (filtros?.titulo) params = params.set('titulo', filtros.titulo);
    if (filtros?.localidade) params = params.set('localidade', filtros.localidade);
    return this.http.get(this.api, { params });
  }
  criarVaga(dados: any) {
    const token = localStorage.getItem('token');
    return this.http.post(this.api, dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  

}
