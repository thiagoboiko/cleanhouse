import { IProfissional } from '../domain/Profissional';
import { IProfissionaisRepository } from '../infrastructure/repository';

export class ListarProfissionaisUseCase {
  constructor(private repo: IProfissionaisRepository) {}
  async execute(): Promise<IProfissional[]> {
    return this.repo.getAllProfissionais();
  }
}

export class CriarProfissionalUseCase {
  constructor(private repo: IProfissionaisRepository) {}
  async execute(data: Omit<IProfissional, 'id'>): Promise<IProfissional> {
    if (!data.nome || !data.email || !data.cpf) throw new Error('Nome, email e CPF são obrigatórios');
    return this.repo.createProfissional(data);
  }
}

export class AtualizarProfissionalUseCase {
  constructor(private repo: IProfissionaisRepository) {}
  async execute(id: number, data: Partial<IProfissional>): Promise<IProfissional> {
    const existente = await this.repo.getProfissionalById(id);
    if (!existente) throw new Error('Profissional não encontrado');
    return this.repo.updateProfissional(id, data);
  }
}

export class DeletarProfissionalUseCase {
  constructor(private repo: IProfissionaisRepository) {}
  async execute(id: number): Promise<void> {
    const existente = await this.repo.getProfissionalById(id);
    if (!existente) throw new Error('Profissional não encontrado');
    await this.repo.deleteProfissional(id);
  }
}
