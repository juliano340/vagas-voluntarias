import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod'; // Adjust the import path as necessary
// import { environment } from '../../environments/environment'; // Uncomment this line if you want to use the local environment

@Injectable({
  providedIn: 'root',
})
export class VagasService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  listarVagas(filtros?: {
    titulo?: string;
    localidade?: string;
  }): Observable<any> {
    let params = new HttpParams();
    if (filtros?.titulo) params = params.set('titulo', filtros.titulo);
    if (filtros?.localidade)
      params = params.set('localidade', filtros.localidade);
    return this.http.get(this.apiUrl, { params });
  }

  criarVaga(dados: any) {
    const token = localStorage.getItem('token');
    return this.http.post(this.apiUrl, dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  minhasVagas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>(`${this.apiUrl}/vagas/minhas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  removerVaga(id: number) {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  buscarVaga(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  atualizarVaga(id: number, dados: any) {
    const token = localStorage.getItem('token');
    return this.http.patch(`${this.apiUrl}/${id}`, dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  vagasCandidatadas(): Observable<number[]> {
    const token = localStorage.getItem('token');
    return this.http.get<number[]>(`${this.apiUrl}/candidaturas/minhas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  candidatarSe(vagaId: number) {
    return this.http.post(`${this.apiUrl}/candidaturas`, {
      vagaId,
    });
  }

  listarCandidatos(vagaId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/vagas/${vagaId}/candidatos`);
  }

  vagasComMensagensRecebidas() {
    const token = localStorage.getItem('token');
    return this.http.get<number[]>(`${this.apiUrl}/mensagens/recebidas/vagas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
