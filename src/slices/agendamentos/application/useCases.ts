import { IAgendamento } from '../domain/Agendamento';
import { IAgendamentosRepository } from '../infrastructure/repository';

export class ListarAgendamentosUseCase {
  constructor(private repo: IAgendamentosRepository) {}
  execute() { return this.repo.getAllAgendamentos(); }
}

export class CriarAgendamentoUseCase {
  constructor(private repo: IAgendamentosRepository) {}
  async execute(data: Omit<IAgendamento,'_id'>): Promise<IAgendamento> {
    if (!data.clienteId || !data.profissionalId || !data.dataHora) throw new Error('Cliente, profissional e data/hora são obrigatórios');
    if (new Date(data.dataHora) < new Date()) throw new Error('Não é possível criar agendamentos para datas passadas');
    return this.repo.createAgendamento(data);
  }
}

export class AtualizarAgendamentoUseCase {
  constructor(private repo: IAgendamentosRepository) {}
  async execute(id: string, data: Partial<IAgendamento>): Promise<IAgendamento> {
    const existente = await this.repo.getAgendamentoById(id);
    if (!existente) throw new Error('Agendamento não encontrado');
    return this.repo.updateAgendamento(id, data);
  }
}

export class AtualizarStatusAgendamentoUseCase {
  constructor(private repo: IAgendamentosRepository) {}
  async execute(id: string, status: IAgendamento['status']): Promise<IAgendamento> {
    const existente = await this.repo.getAgendamentoById(id);
    if (!existente) throw new Error('Agendamento não encontrado');
    return this.repo.updateAgendamento(id, { status, updatedAt: new Date().toISOString() });
  }
}

export class DeletarAgendamentoUseCase {
  constructor(private repo: IAgendamentosRepository) {}
  async execute(id: string): Promise<void> { await this.repo.deleteAgendamento(id); }
}
