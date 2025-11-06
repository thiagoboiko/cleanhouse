export type AgendamentoStatus = 'pendente' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';

export interface IEndereco {
  rua: string; numero: string; complemento?: string; bairro: string; cidade: string; cep: string;
}

export interface IAgendamento {
  _id?: string;
  clienteId: string;
  profissionalId: string;
  dataHora: string;
  tipoServico: string;
  status: AgendamentoStatus;
  endereco: IEndereco;
  valor: number;
  observacoes?: string;
  checkIn?: string; checkOut?: string;
  createdAt?: string; updatedAt?: string;
}

export class AgendamentoEntity implements IAgendamento {
  constructor(
    public clienteId: string,
    public profissionalId: string,
    public dataHora: string,
    public tipoServico: string,
    public endereco: IEndereco,
    public valor: number,
    public _id?: string,
    public status: AgendamentoStatus = 'pendente',
    public observacoes?: string,
    public checkIn?: string,
    public checkOut?: string,
    public createdAt?: string,
    public updatedAt?: string
  ) {}

  podeIniciarServico(): boolean { return this.status === 'confirmado'; }
  podeCancelar(): boolean { return ['pendente','confirmado'].includes(this.status); }
  podeConfirmar(): boolean { return this.status === 'pendente'; }
  calcularDuracao(): number | null { if (!this.checkIn || !this.checkOut) return null; return (new Date(this.checkOut).getTime() - new Date(this.checkIn).getTime()) / 36e5; }
  atualizarStatus(novo: AgendamentoStatus): boolean {
    const flow: Record<AgendamentoStatus, AgendamentoStatus[]> = {
      pendente:['confirmado','cancelado'],
      confirmado:['em_andamento','cancelado'],
      em_andamento:['concluido','cancelado'],
      concluido:[], cancelado:[]
    };
    if (!flow[this.status].includes(novo)) return false;
    this.status = novo; this.updatedAt = new Date().toISOString(); return true;
  }
}
