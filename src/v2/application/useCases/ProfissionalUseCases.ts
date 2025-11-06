// [LEGACY REMOVIDO]
// Este arquivo fazia parte da antiga estrutura v2. O projeto agora utiliza apenas os slices por feature.
import { IProfissional } from '../../domain/entities/Profissional';

export interface IProfissionaisRepository {
  getAllProfissionais(): Promise<IProfissional[]>;
  getProfissionalById(id: number): Promise<IProfissional | null>;
  createProfissional(data: Omit<IProfissional, 'id'>): Promise<IProfissional>;
  updateProfissional(id: number, data: Partial<IProfissional>): Promise<IProfissional>;
  deleteProfissional(id: number): Promise<void>;
}

export class ListarProfissionaisUseCase {
  constructor(private profissionaisRepository: IProfissionaisRepository) {}

  async execute(): Promise<IProfissional[]> {
    return this.profissionaisRepository.getAllProfissionais();
  }
}

export class CriarProfissionalUseCase {
  constructor(private profissionaisRepository: IProfissionaisRepository) {}

  async execute(data: Omit<IProfissional, 'id'>): Promise<IProfissional> {
    // Validações de negócio
    if (!data.nome || !data.email || !data.cpf) {
      throw new Error('Nome, email e CPF são obrigatórios');
    }

    return this.profissionaisRepository.createProfissional(data);
  }
}

export class AtualizarProfissionalUseCase {
  constructor(private profissionaisRepository: IProfissionaisRepository) {}

  async execute(id: number, data: Partial<IProfissional>): Promise<IProfissional> {
    const profissional = await this.profissionaisRepository.getProfissionalById(id);
    if (!profissional) {
      throw new Error('Profissional não encontrado');
    }

    return this.profissionaisRepository.updateProfissional(id, data);
  }
}

export class DeletarProfissionalUseCase {
  constructor(private profissionaisRepository: IProfissionaisRepository) {}

  async execute(id: number): Promise<void> {
    const profissional = await this.profissionaisRepository.getProfissionalById(id);
    if (!profissional) {
      throw new Error('Profissional não encontrado');
    }

    await this.profissionaisRepository.deleteProfissional(id);
  }
}