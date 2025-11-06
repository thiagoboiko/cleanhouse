import { useState } from 'react';
import { Calendar, User, Sparkles } from 'lucide-react';
import Profissionais from './components/Profissionais';
import Agendamentos from './components/Agendamentos';

type Tab = 'agendamentos' | 'profissionais';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('agendamentos');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2 rounded-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">CleanHouse</h1>
                <p className="text-sm text-gray-600">Sistema de Gestão de Limpeza</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('agendamentos')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === 'agendamentos'
                  ? 'text-green-600 border-green-600'
                  : 'text-gray-600 border-transparent hover:text-green-600'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Agendamentos
            </button>
            <button
              onClick={() => setActiveTab('profissionais')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors border-b-2 ${
                activeTab === 'profissionais'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
            >
              <User className="w-5 h-5" />
              Profissionais
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'agendamentos' && <Agendamentos />}
        {activeTab === 'profissionais' && <Profissionais />}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            CleanHouse - Sistema de Limpeza Residencial Inteligente
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
