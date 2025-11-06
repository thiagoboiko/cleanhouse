import { IProfissionaisRepository } from '../../application/useCases/ProfissionalUseCases';
import { IAgendamentosRepository } from '../../application/useCases/AgendamentoUseCases';
import { IProfissional } from '../../domain/entities/Profissional';
import { IAgendamento } from '../../domain/entities/Agendamento';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

// Implementação do repositório que mantém a compatibilidade com a API atual
export class ApiRepository implements IProfissionaisRepository, IAgendamentosRepository {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Erro ao processar requisição'
      }));
      throw new Error(error.message || `Erro ${response.status}`);
    }

    const data = await response.json();
    // Normaliza o retorno e faz cast seguro para T
    const normalized = Array.isArray(data) ? data : data && data.data ? data.data : data;
    return normalized as unknown as T;
  }
  // Implementação de IProfissionaisRepository
  async getAllProfissionais(): Promise<IProfissional[]> {
    return this.request<IProfissional[]>('/api/profissionais');
  }

  async getProfissionalById(id: number): Promise<IProfissional | null> {
    try {
      return await this.request<IProfissional>(`/api/profissionais/${id}`);
    } catch {
      return null;
    }
  }

  async createProfissional(data: Omit<IProfissional, 'id'>): Promise<IProfissional> {
    return this.request<IProfissional>('/api/profissionais', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfissional(id: number, data: Partial<IProfissional>): Promise<IProfissional> {
    return this.request<IProfissional>(`/api/profissionais/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProfissional(id: number): Promise<void> {
    await this.request<void>(`/api/profissionais/${id}`, {
      method: 'DELETE',
    });
  }

  // Implementação de IAgendamentosRepository
  async getAllAgendamentos(): Promise<IAgendamento[]> {
    return this.request<IAgendamento[]>('/api/agendamentos');
  }

  async getAgendamentoById(id: string): Promise<IAgendamento | null> {
    try {
      return await this.request<IAgendamento>(`/api/agendamentos/${id}`);
    } catch {
      return null;
    }
  }

  async createAgendamento(data: Omit<IAgendamento, '_id'>): Promise<IAgendamento> {
    return this.request<IAgendamento>('/api/agendamentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgendamento(id: string, data: Partial<IAgendamento>): Promise<IAgendamento> {
    return this.request<IAgendamento>(`/api/agendamentos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgendamento(id: string): Promise<void> {
    await this.request<void>(`/api/agendamentos/${id}`, {
      method: 'DELETE',
    });
  }
}

// Instância única do repositório
export const apiRepository = new ApiRepository();