import { IProfissional } from '../domain/Profissional';

export interface IProfissionaisRepository {
  getAllProfissionais(): Promise<IProfissional[]>;
  getProfissionalById(id: number): Promise<IProfissional | null>;
  createProfissional(data: Omit<IProfissional, 'id'>): Promise<IProfissional>;
  updateProfissional(id: number, data: Partial<IProfissional>): Promise<IProfissional>;
  deleteProfissional(id: number): Promise<void>;
}

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

export class ApiProfissionaisRepository implements IProfissionaisRepository {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
    });
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    const data = await response.json().catch(() => null);
    const normalized = Array.isArray(data) ? data : (data?.data ?? data);
    return normalized as T;
  }
  getAllProfissionais() { return this.request<IProfissional[]>('/api/profissionais'); }
  async getProfissionalById(id: number) { try { return await this.request<IProfissional>(`/api/profissionais/${id}`); } catch { return null; } }
  createProfissional(data: Omit<IProfissional,'id'>) { return this.request<IProfissional>('/api/profissionais',{method:'POST',body:JSON.stringify(data)}); }
  updateProfissional(id: number, data: Partial<IProfissional>) { return this.request<IProfissional>(`/api/profissionais/${id}`,{method:'PUT',body:JSON.stringify(data)}); }
  async deleteProfissional(id: number) { await this.request<void>(`/api/profissionais/${id}`,{method:'DELETE'}); }
}

export const profissionaisRepository = new ApiProfissionaisRepository();