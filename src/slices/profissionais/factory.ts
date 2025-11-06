import { profissionaisRepository } from './infrastructure/repository';
import { 
  ListarProfissionaisUseCase,
  CriarProfissionalUseCase,
  AtualizarProfissionalUseCase,
  DeletarProfissionalUseCase
} from './application/useCases';

export const useCases = {
  listarProfissionais: new ListarProfissionaisUseCase(profissionaisRepository),
  criarProfissional: new CriarProfissionalUseCase(profissionaisRepository),
  atualizarProfissional: new AtualizarProfissionalUseCase(profissionaisRepository),
  deletarProfissional: new DeletarProfissionalUseCase(profissionaisRepository),
};
