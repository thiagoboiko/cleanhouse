import { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Clock,
  MapPin,
  DollarSign,
  User,
} from 'lucide-react';
import type { IAgendamento } from '../slices/agendamentos';
import type { IProfissional } from '../slices/profissionais';
import { useCases as agendamentosUseCases } from '../slices/agendamentos';
import { useCases as profissionaisUseCases } from '../slices/profissionais';

export default function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([]);
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState<IAgendamento | null>(null);

  const [formData, setFormData] = useState<Partial<IAgendamento>>({
    clienteId: '',
    profissionalId: '',
    dataHora: '',
    tipoServico: '',
    status: 'pendente',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
    },
    valor: 0,
    observacoes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let agendamentosData: any;
      let profissionaisData: any;

  agendamentosData = await agendamentosUseCases.listarAgendamentos.execute();
  profissionaisData = await profissionaisUseCases.listarProfissionais.execute();
      
      // Verifica se os dados retornados são arrays
      const agendamentosArray = Array.isArray(agendamentosData) ? agendamentosData : [];
      const profissionaisArray = Array.isArray(profissionaisData) ? profissionaisData : [];
      
  // logs removidos (mantemos silêncio em produção)

      setAgendamentos(agendamentosArray);
      setProfissionais(profissionaisArray);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (agendamento?: IAgendamento) => {
    if (agendamento) {
      setEditingAgendamento(agendamento);
      setFormData({
        ...agendamento,
        dataHora: agendamento.dataHora.slice(0, 16),
      });
    } else {
      setEditingAgendamento(null);
      setFormData({
        clienteId: '',
        profissionalId: '',
        dataHora: '',
        tipoServico: '',
        status: 'pendente',
        endereco: {
          rua: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          cep: '',
        },
        valor: 0,
        observacoes: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAgendamento(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        dataHora: new Date(formData.dataHora!).toISOString(),
      };

      if (editingAgendamento) {
        await agendamentosUseCases.atualizarAgendamento.execute(editingAgendamento._id!, submitData);
      } else {
        await agendamentosUseCases.criarAgendamento.execute(submitData as Omit<IAgendamento, '_id'>);
      }
      closeModal();
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar agendamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      await agendamentosUseCases.deletarAgendamento.execute(id);
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Erro ao excluir agendamento:', msg);
      setError(msg);
      alert('Erro ao excluir agendamento: ' + msg);
      await loadData();
    }
  };

  const getProfissionalNome = (id: string) => {
    const prof = profissionais.find((p) => p.id.toString() === id);
    return prof ? prof.nome : 'Profissional não encontrado';
  };

  const getStatusColor = (status: IAgendamento['status']) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-700',
      confirmado: 'bg-blue-100 text-blue-700',
      em_andamento: 'bg-green-100 text-green-700',
      concluido: 'bg-gray-100 text-gray-700',
      cancelado: 'bg-red-100 text-red-700',
    };
    return colors[status];
  };

  const getStatusLabel = (status: IAgendamento['status']) => {
    const labels = {
      pendente: 'Pendente',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };
    return labels[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-7 h-7" />
          Agendamentos
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Agendamento
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agendamentos.map((agendamento) => (
          <div
            key={agendamento._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-800">
                    {getProfissionalNome(agendamento.profissionalId)}
                  </span>
                </div>
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    agendamento.status
                  )}`}
                >
                  {getStatusLabel(agendamento.status)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(agendamento)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(agendamento._id!)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>
                  {new Date(agendamento.dataHora).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>

              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div className="text-sm">
                  <div>
                    {agendamento.endereco.rua}, {agendamento.endereco.numero}
                  </div>
                  <div>
                    {agendamento.endereco.bairro} - {agendamento.endereco.cidade}
                  </div>
                  <div>CEP: {agendamento.endereco.cep}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Serviço: {agendamento.tipoServico}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    R$ {agendamento.valor.toFixed(2)}
                  </span>
                </div>
              </div>

              {agendamento.observacoes && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Observações:</strong> {agendamento.observacoes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profissional *
                  </label>
                  <select
                    required
                    value={formData.profissionalId}
                    onChange={(e) =>
                      setFormData({ ...formData, profissionalId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione um profissional</option>
                    {profissionais
                      .filter((p) => p.disponivel && p.ativo)
                      .map((prof) => (
                        <option key={prof.id} value={prof.id}>
                          {prof.nome} - R$ {prof.valorHora.toFixed(2)}/h
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data e Hora *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dataHora}
                    onChange={(e) => setFormData({ ...formData, dataHora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tipoServico}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoServico: e.target.value })
                    }
                    placeholder="Ex: Limpeza Completa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as IAgendamento['status'],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="confirmado">Confirmado</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.valor}
                    onChange={(e) =>
                      setFormData({ ...formData, valor: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold text-gray-800">Endereço</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.endereco?.rua}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endereco: { ...formData.endereco!, rua: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.endereco?.numero}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endereco: { ...formData.endereco!, numero: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={formData.endereco?.complemento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endereco: {
                            ...formData.endereco!,
                            complemento: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.endereco?.bairro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endereco: { ...formData.endereco!, bairro: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.endereco?.cep}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endereco: { ...formData.endereco!, cep: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endereco?.cidade}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        endereco: { ...formData.endereco!, cidade: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
