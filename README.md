# CleanHouse - Sistema de Gestão de Limpeza
Alunos: Thiago Boiko
## Arquitetura do Projeto

Este projeto aplica desde o início os princípios de Clean Architecture combinados com o padrão **Vertical Slice** para organizar o código por feature, mantendo baixo acoplamento e alta coesão.

### Estrutura de Pastas (Clean Architecture + Vertical Slice)

Cada funcionalidade possui seu próprio slice com camadas internas (Domain / Application / Infrastructure / Factory).

```
src/
├── slices/
│   ├── profissionais/                 # Feature Profissionais
│   │   ├── domain/                    # Entidade e regras (ProfissionalEntity)
│   │   ├── application/               # Casos de uso da feature
│   │   ├── infrastructure/            # Repositório/API da feature
│   │   ├── factory.ts                 # Instancia os casos de uso
│   │   └── index.ts                   # Facade pública
│   ├── agendamentos/                  # Feature Agendamentos
│   │   ├── domain/                    # Entidade e regras (AgendamentoEntity)
│   │   ├── application/               # Casos de uso
│   │   ├── infrastructure/            # Repositório/API
│   │   ├── factory.ts                 # Instanciação de casos de uso
│   │   └── index.ts                   # Facade pública
├── components/                        # Componentes React (UI) consumindo slices
```

### Por que Vertical Slice?

Agrupar por feature em vez de apenas por camadas globais facilita evolução, leitura e testes. Benefícios:
1. Foco por funcionalidade: abrir somente o slice relevante.
2. Menos acoplamento: cada slice expõe apenas sua facade.
3. Escalabilidade: adicionar feature não exige alterar estrutura global.
4. Testes específicos: cada slice pode ter seus próprios testes.

### Layout Interno de um Slice

```
domain/         -> Entidades e regras
application/    -> Casos de uso (Listar, Criar, Atualizar, Deletar...)
infrastructure/ -> Implementação do repositório (HTTP, DB, etc.)
factory.ts      -> Montagem das instâncias
index.ts        -> Re-export (facade pública)
```

### Consumo na UI

```ts
// Profissionais.tsx
import { useCases } from '../slices/profissionais';

const dados = await useCases.listarProfissionais.execute();
```

Dependência entre features:
```ts
import { useCases as agendamentos } from '../slices/agendamentos';
import { useCases as profissionais } from '../slices/profissionais';

const lista = await agendamentos.listarAgendamentos.execute();
const profs = await profissionais.listarProfissionais.execute();
```

### Comunicação entre camadas

A UI chama casos de uso; eles usam repositórios via interfaces; repositórios acessam recursos externos. O domínio permanece isolado.

### Clean Architecture no projeto

Regras mantidas:
* Domain não depende de infraestrutura.
* Application depende apenas de interfaces.
* Infrastructure contém detalhes externos (HTTP, persistência).
* Factory compõe dependências e entrega objetos prontos para a UI.

### Implementação da Clean Architecture

A arquitetura reflete os princípios de independência, testabilidade e separação de responsabilidades conforme proposto por Robert C. Martin.

#### 1. Camada de Domínio (`domain`)
- Centro das regras de negócio.
- Entidades como `ProfissionalEntity` e `AgendamentoEntity`.
- Sem dependências externas.
- Exemplo:
```typescript
export class AgendamentoEntity {
  public podeCancelar(): boolean {
    return ['pendente', 'confirmado'].includes(this.status);
  }
  public atualizarStatus(novoStatus: AgendamentoStatus): void {
    if (!this.podeAtualizarPara(novoStatus)) {
      throw new Error('Atualização de status inválida');
    }
    this.status = novoStatus;
  }
}
```

#### 2. Camada de Aplicação (`application`)
- Orquestra casos de uso e fluxo.
- Depende de interfaces.
- Exemplo:
```typescript
export class CriarProfissionalUseCase {
  constructor(private repository: IProfissionaisRepository) {}
  async execute(data: Omit<IProfissional, 'id'>): Promise<IProfissional> {
    if (!data.nome || !data.email || !data.cpf) {
      throw new Error('Nome, email e CPF são obrigatórios');
    }
    return this.repository.createProfissional(data);
  }
}
```

#### 3. Camada de Infraestrutura (`infrastructure`)
- Implementa repositórios.
- Lida com transporte (HTTP, etc.).
- Exemplo:
```typescript
export class ApiRepository implements IProfissionaisRepository {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Erro na requisição');
    return response.json();
  }
  async getAllProfissionais(): Promise<IProfissional[]> {
    return this.request<IProfissional[]>('/api/profissionais');
  }
}
```

#### 4. Camada de Interface (`components`)
- Componentes React.
- Estado e interação do usuário.
- Exemplo:
```typescript
import { useCases as profissionais } from './slices/profissionais';
export default function Profissionais() {
  const loadProfissionais = async () => {
    const data = await profissionais.listarProfissionais.execute();
    setProfissionais(data);
  };
}
```

#### Princípios Garantidos

1. Independência de frameworks.
2. Testabilidade por isolamento.
3. Interface desacoplada da lógica.
4. Persistência substituível.
5. Regras de negócio centralizadas.

### Fluxo de Dados
1. UI aciona caso de uso.
2. Caso de uso aplica regras usando entidades.
3. Repositório realiza operações externas.
4. Resultado retorna para a UI.

### Benefícios
- Testabilidade.
- Manutenibilidade.
- Flexibilidade.
- Organização clara.
- Escalabilidade.

### Resumo
- Componentes consomem casos de uso dos slices.
- Arquitetura: Clean Architecture + Vertical Slice por feature.

### Testes de Arquitetura

O projeto inclui testes unitários que validam a integridade da arquitetura em `src/tests/architecture.test.ts`.

#### O que é testado:

**Entidades do Domínio**
- Métodos de negócio das entidades (ProfissionalEntity, AgendamentoEntity)
- Cálculos corretos (valor de serviço, média de avaliações)
- Regras de negócio (disponibilidade, transições de status)

**Isolamento de Camadas**
- Domínio não depende de infraestrutura
- Entidades não importam fetch ou bibliotecas externas

**Regras de Negócio**
- Profissional inativo não fica disponível
- Agendamentos respeitam fluxo de status correto (pendente → confirmado → em_andamento → concluído)
- Validações de duração de serviço

#######################################
Acessar `http://localhost:5174`.
TODAS AS APIS PRECISAM ESTAR RODANDO!

