
# 📅 Módulo de Vagas - Portal de Vagas Voluntárias

Este documento descreve a implementação do módulo **Vagas** no backend do Portal de Vagas Voluntárias, desenvolvido com NestJS, TypeORM e PostgreSQL.

---

## 🌐 Visão Geral

O módulo de Vagas permite que usuários autenticados com perfil `ofertante` publiquem vagas de trabalho voluntário. Cada vaga é vinculada ao usuário que a criou e pode ser visualizada por qualquer outro usuário autenticado.

---

## 🚫 Regras de Acesso

- Apenas **usuários com perfil `ofertante`** podem criar novas vagas.
- Rota protegida com `JwtAuthGuard`.

---

## 🧱 Entidade `Vaga`

| Campo         | Tipo       | Descrição                                |
|---------------|------------|--------------------------------------------|
| `id`          | number     | Identificador da vaga                      |
| `titulo`      | string     | Título da vaga                            |
| `descricao`   | string     | Descrição da vaga                         |
| `localidade`  | string     | Cidade ou região (ex: Porto Alegre - RS)  |
| `dataCriacao` | Date       | Data/hora de criação da vaga             |
| `publicadaPor`| User       | Usuário ofertante que publicou a vaga     |

Relacionamento:
- `@ManyToOne(() => User, user => user.vagas)`

---

## 🔧 DTOs

### CreateVagaDto
```ts
{
  titulo: string;
  descricao: string;
  localidade: string;
}
```
Validações aplicadas com `class-validator`.

---

## 📡 Endpoints

### POST `/vagas`
**Cria nova vaga (apenas ofertante)**

**Requisição:**
```json
{
  "titulo": "Voluntário para aula de reforço escolar",
  "descricao": "Atuar com crianças do ensino fundamental oferecendo reforço em matemática e português.",
  "localidade": "Porto Alegre - RS"
}
```
**Cabeçalho:**
```
Authorization: Bearer <token JWT>
```

**Resposta esperada:**
```json
{
  "id": 1,
  "titulo": "Voluntário para aula de reforço escolar",
  "descricao": "Atuar com crianças...",
  "localidade": "Porto Alegre - RS",
  "dataCriacao": "2025-04-10T16:53:24.529Z",
  "publicadaPor": {
    "id": 5,
    "email": "brasil@email.com",
    "role": "ofertante"
  }
}
```

### GET `/vagas`
**Lista todas as vagas com quem publicou**

---

## 📄 Status

- [x] Cadastro de vagas com proteção JWT
- [x] Vinculação da vaga com o usuário ofertante
- [x] Listagem de vagas com relação `publicadaPor`
- [ ] Filtros por localidade ou título
- [ ] Atualização e remoção protegidas por permissão
- [ ] Integração com frontend Angular

---

## ⚙️ Comando de geração do módulo

```bash
nest g resource vagas
```

---

## 🌟 Testado com sucesso via Insomnia!
