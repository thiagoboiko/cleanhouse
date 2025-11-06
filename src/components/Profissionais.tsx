import { useState, useEffect } from 'react';
import { User, Plus, Edit2, Trash2, Save, X, Star, DollarSign } from 'lucide-react';
import type { IProfissional } from '../slices/profissionais';
import { useCases } from '../slices/profissionais';

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState<IProfissional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfissional, setEditingProfissional] = useState<IProfissional | null>(null);

  const [formData, setFormData] = useState<Partial<IProfissional>>({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    descricao: '',
    valorHora: 0,
    disponivel: true,
    ativo: true,
    notaMedia: 0,
    totalAvaliacoes: 0,
  });

  useEffect(() => {
    loadProfissionais();
  }, []);

  const loadProfissionais = async () => {
    try {
      setLoading(true);
      const data = await useCases.listarProfissionais.execute();
      setProfissionais(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar profissionais');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (profissional?: IProfissional) => {
    if (profissional) {
      setEditingProfissional(profissional);
      setFormData(profissional);
    } else {
      setEditingProfissional(null);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        endereco: '',
        cidade: '',
        estado: '',
        cep: '',
        descricao: '',
        valorHora: 0,
        disponivel: true,
        ativo: true,
        notaMedia: 0,
        totalAvaliacoes: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProfissional(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProfissional) {
        await useCases.atualizarProfissional.execute(editingProfissional.id, formData as any);
      } else {
        await useCases.criarProfissional.execute(formData as any);
      }
      closeModal();
      loadProfissionais();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar profissional');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este profissional?')) return;
  try {
    await useCases.deletarProfissional.execute(id);
    loadProfissionais();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Erro ao excluir profissional');
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-7 h-7" />
          Profissionais
        </h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Profissional
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profissionais.map((prof) => (
          <div
            key={prof.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-24"></div>
            <div className="px-6 pb-6 -mt-12">
              <div className="flex justify-between items-start">
                <div className="bg-white rounded-full p-1">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
                    {prof.nome.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="flex gap-2 mt-14">
                  <button
                    onClick={() => openModal(prof)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prof.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-800">{prof.nome}</h3>
              <p className="text-sm text-gray-600">{prof.email}</p>
              <p className="text-sm text-gray-600">{prof.telefone}</p>

              {prof.descricao && (
                <p className="mt-3 text-sm text-gray-700 line-clamp-2">{prof.descricao}</p>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    Valor/hora:
                  </span>
                  <span className="font-semibold text-green-600">
                    R$ {prof.valorHora.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    Avaliação:
                  </span>
                  <span className="font-semibold">
                    {prof.notaMedia.toFixed(1)} ({prof.totalAvaliacoes})
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      prof.disponivel
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {prof.disponivel ? 'Disponível' : 'Indisponível'}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      prof.ativo
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {prof.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProfissional ? 'Editar Profissional' : 'Novo Profissional'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor/Hora *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.valorHora}
                    onChange={(e) =>
                      setFormData({ ...formData, valorHora: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.disponivel}
                    onChange={(e) =>
                      setFormData({ ...formData, disponivel: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Disponível</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Ativo</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
