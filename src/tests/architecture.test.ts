import { ProfissionalEntity } from '../slices/profissionais/domain/Profissional';
import { AgendamentoEntity } from '../slices/agendamentos/domain/Agendamento';

describe('Testes de Arquitetura', () => {
  describe('Entidades do Domínio - Profissionais', () => {
    it('ProfissionalEntity deve ter métodos de domínio necessários', () => {
      const profissional = new ProfissionalEntity(
        1,
        'João Silva',
        'joao@email.com',
        '11987654321',
        '12345678900',
        100
      );

      expect(profissional.calcularValorServico).toBeDefined();
      expect(profissional.adicionarAvaliacao).toBeDefined();
      expect(profissional.isDisponivel).toBeDefined();
    });

    it('ProfissionalEntity deve calcular valor de serviço corretamente', () => {
      const profissional = new ProfissionalEntity(
        1,
        'João Silva',
        'joao@email.com',
        '11987654321',
        '12345678900',
        100
      );

      expect(profissional.calcularValorServico(3)).toBe(300);
    });

    it('ProfissionalEntity deve atualizar média de avaliações', () => {
      const profissional = new ProfissionalEntity(
        1,
        'João Silva',
        'joao@email.com',
        '11987654321',
        '12345678900',
        100
      );

      profissional.adicionarAvaliacao(5);
      expect(profissional.notaMedia).toBe(5);
      expect(profissional.totalAvaliacoes).toBe(1);

      profissional.adicionarAvaliacao(3);
      expect(profissional.notaMedia).toBe(4);
      expect(profissional.totalAvaliacoes).toBe(2);
    });
  });

  describe('Entidades do Domínio - Agendamentos', () => {
    it('AgendamentoEntity deve ter métodos de domínio necessários', () => {
      const agendamento = new AgendamentoEntity(
        'cliente1',
        'prof1',
        '2025-12-01T10:00:00',
        'Limpeza Completa',
        {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          cep: '01000-000'
        },
        200
      );

      expect(agendamento.podeIniciarServico).toBeDefined();
      expect(agendamento.podeCancelar).toBeDefined();
      expect(agendamento.podeConfirmar).toBeDefined();
      expect(agendamento.calcularDuracao).toBeDefined();
      expect(agendamento.atualizarStatus).toBeDefined();
    });

    it('AgendamentoEntity deve validar transições de status', () => {
      const agendamento = new AgendamentoEntity(
        'cliente1',
        'prof1',
        '2025-12-01T10:00:00',
        'Limpeza Completa',
        {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          cep: '01000-000'
        },
        200
      );

      expect(agendamento.status).toBe('pendente');
      expect(agendamento.atualizarStatus('confirmado')).toBe(true);
      expect(agendamento.status).toBe('confirmado');
      expect(agendamento.atualizarStatus('pendente')).toBe(false);
      expect(agendamento.atualizarStatus('em_andamento')).toBe(true);
    });

    it('AgendamentoEntity deve calcular duração do serviço', () => {
      const agendamento = new AgendamentoEntity(
        'cliente1',
        'prof1',
        '2025-12-01T10:00:00',
        'Limpeza Completa',
        {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Centro',
          cidade: 'São Paulo',
          cep: '01000-000'
        },
        200
      );

      expect(agendamento.calcularDuracao()).toBeNull();

      agendamento.checkIn = '2025-12-01T10:00:00';
      agendamento.checkOut = '2025-12-01T13:00:00';

      expect(agendamento.calcularDuracao()).toBe(3);
    });
  });

  describe('Isolamento de Camadas', () => {
    it('Entidades de domínio não devem depender de infraestrutura', async () => {
      const profissionalModule = await import('../slices/profissionais/domain/Profissional');
      const agendamentoModule = await import('../slices/agendamentos/domain/Agendamento');

      const profissionalSource = profissionalModule.toString();
      const agendamentoSource = agendamentoModule.toString();

      expect(profissionalSource).not.toContain('infrastructure');
      expect(profissionalSource).not.toContain('fetch');
      expect(agendamentoSource).not.toContain('infrastructure');
      expect(agendamentoSource).not.toContain('fetch');
    });
  });

  describe('Regras de Negócio', () => {
    it('Profissional inativo não deve estar disponível', () => {
      const profissional = new ProfissionalEntity(
        1,
        'João Silva',
        'joao@email.com',
        '11987654321',
        '12345678900',
        100,
        true,
        false
      );

      expect(profissional.isDisponivel()).toBe(false);
    });

    it('Profissional disponível mas inativo não deve estar disponível', () => {
      const profissional = new ProfissionalEntity(
        1,
        'João Silva',
        'joao@email.com',
        '11987654321',
        '12345678900',
        100,
        false,
        true
      );

      expect(profissional.isDisponivel()).toBe(false);
    });

    it('Agendamento pendente pode ser confirmado', () => {
      const agendamento = new AgendamentoEntity(
        'cliente1',
        'prof1',
        '2025-12-01T10:00:00',
        'Limpeza',
        { rua: 'Rua A', numero: '1', bairro: 'B', cidade: 'C', cep: '00000-000' },
        100
      );

      expect(agendamento.podeConfirmar()).toBe(true);
      expect(agendamento.podeCancelar()).toBe(true);
      expect(agendamento.podeIniciarServico()).toBe(false);
    });

    it('Agendamento confirmado pode iniciar serviço', () => {
      const agendamento = new AgendamentoEntity(
        'cliente1',
        'prof1',
        '2025-12-01T10:00:00',
        'Limpeza',
        { rua: 'Rua A', numero: '1', bairro: 'B', cidade: 'C', cep: '00000-000' },
        100,
        undefined,
        'confirmado'
      );

      expect(agendamento.podeConfirmar()).toBe(false);
      expect(agendamento.podeCancelar()).toBe(true);
      expect(agendamento.podeIniciarServico()).toBe(true);
    });
  });
});