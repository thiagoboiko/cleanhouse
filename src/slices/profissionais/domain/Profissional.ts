export interface IProfissional {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  foto?: string;
  descricao?: string;
  valorHora: number;
  disponivel: boolean;
  notaMedia: number;
  totalAvaliacoes: number;
  dataCadastro?: string;
  ativo: boolean;
}

export class ProfissionalEntity implements IProfissional {
  constructor(
    public id: number,
    public nome: string,
    public email: string,
    public telefone: string,
    public cpf: string,
    public valorHora: number,
    public disponivel: boolean = true,
    public ativo: boolean = true,
    public notaMedia: number = 0,
    public totalAvaliacoes: number = 0,
    public endereco?: string,
    public cidade?: string,
    public estado?: string,
    public cep?: string,
    public foto?: string,
    public descricao?: string,
    public dataCadastro?: string
  ) {}

  public calcularValorServico(horas: number): number {
    return this.valorHora * horas;
  }

  public adicionarAvaliacao(nota: number): void {
    const novoTotal = this.totalAvaliacoes + 1;
    this.notaMedia = ((this.notaMedia * this.totalAvaliacoes) + nota) / novoTotal;
    this.totalAvaliacoes = novoTotal;
  }

  public isDisponivel(): boolean {
    return this.disponivel && this.ativo;
  }
}
