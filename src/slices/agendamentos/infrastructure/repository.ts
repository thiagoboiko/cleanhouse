import { IAgendamento } from '../domain/Agendamento';

export interface IAgendamentosRepository {
  getAllAgendamentos(): Promise<IAgendamento[]>;
  getAgendamentoById(id: string): Promise<IAgendamento | null>;
  createAgendamento(data: Omit<IAgendamento,'_id'>): Promise<IAgendamento>;
  updateAgendamento(id: string, data: Partial<IAgendamento>): Promise<IAgendamento>;
  deleteAgendamento(id: string): Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

export class ApiAgendamentosRepository implements IAgendamentosRepository {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers||{}) }});
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json().catch(() => null);
    const normalized = Array.isArray(data) ? data : (data?.data ?? data);
    return normalized as T;
  }
  getAllAgendamentos() { return this.request<IAgendamento[]>('/api/agendamentos'); }
  async getAgendamentoById(id: string) { try { return await this.request<IAgendamento>(`/api/agendamentos/${id}`); } catch { return null; } }
  createAgendamento(data: Omit<IAgendamento,'_id'>) { return this.request<IAgendamento>('/api/agendamentos',{method:'POST',body:JSON.stringify(data)}); }
  updateAgendamento(id: string, data: Partial<IAgendamento>) { return this.request<IAgendamento>(`/api/agendamentos/${id}`,{method:'PUT',body:JSON.stringify(data)}); }
  async deleteAgendamento(id: string) { await this.request<void>(`/api/agendamentos/${id}`,{method:'DELETE'}); }
}

export const agendamentosRepository = new ApiAgendamentosRepository();
