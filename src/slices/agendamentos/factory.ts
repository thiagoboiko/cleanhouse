import { agendamentosRepository } from './infrastructure/repository';
import {
  ListarAgendamentosUseCase,
  CriarAgendamentoUseCase,
  AtualizarAgendamentoUseCase,
  AtualizarStatusAgendamentoUseCase,
  DeletarAgendamentoUseCase
} from './application/useCases';

export const useCases = {
  listarAgendamentos: new ListarAgendamentosUseCase(agendamentosRepository),
  criarAgendamento: new CriarAgendamentoUseCase(agendamentosRepository),
  atualizarAgendamento: new AtualizarAgendamentoUseCase(agendamentosRepository),
  atualizarStatusAgendamento: new AtualizarStatusAgendamentoUseCase(agendamentosRepository),
  deletarAgendamento: new DeletarAgendamentoUseCase(agendamentosRepository),
};
