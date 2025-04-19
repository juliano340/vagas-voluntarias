import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mensagens',
  templateUrl: './mensagens.component.html'
})
export class MensagensComponent implements OnInit {
  vagaId!: number;
  outroUsuarioId!: number;
  mensagens: any[] = [];
  texto = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.vagaId = +this.route.snapshot.paramMap.get('vagaId')!;
    this.outroUsuarioId = +this.route.snapshot.paramMap.get('usuarioId')!;
    this.carregarMensagens();
  }

  carregarMensagens() {
    this.http.get<any[]>(`http://localhost:3000/mensagens/conversa/${this.vagaId}/${this.outroUsuarioId}`)
      .subscribe({
        next: (data) => this.mensagens = data,
        error: (err) => console.error('Erro ao carregar mensagens', err)
      });
  }

  enviarMensagem() {
    const token = localStorage.getItem('token');
    this.http.post('http://localhost:3000/mensagens', {
      vagaId: this.vagaId,
      destinatarioId: this.outroUsuarioId,
      texto: this.texto
    }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.texto = '';
        this.carregarMensagens();
      },
      error: (err) => console.error('Erro ao enviar mensagem', err)
    });
  }
}
