import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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

  minhasVagas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    return this.http.get<any[]>('http://localhost:3000/vagas/minhas', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  removerVaga(id: number) {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.api}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  buscarVaga(id: number) {
    return this.http.get(`http://localhost:3000/vagas/${id}`);
  }

  atualizarVaga(id: number, dados: any) {
    const token = localStorage.getItem('token');
    return this.http.patch(`http://localhost:3000/vagas/${id}`, dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  vagasCandidatadas(): Observable<number[]> {
    const token = localStorage.getItem('token');
    return this.http.get<number[]>(`http://localhost:3000/candidaturas/minhas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  candidatarSe(vagaId: number) {
    return this.http.post('http://localhost:3000/candidaturas', {
      vagaId,
    });
  }

  listarCandidatos(vagaId: number) {
    return this.http.get<any[]>(`http://localhost:3000/vagas/${vagaId}/candidatos`);
  }

  vagasComMensagensRecebidas() {
    const token = localStorage.getItem('token');
    return this.http.get<number[]>(`http://localhost:3000/mensagens/recebidas/vagas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  
}
