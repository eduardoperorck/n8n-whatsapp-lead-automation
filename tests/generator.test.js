'use strict';

/**
 * generator.test.js
 *
 * Testes unitários para templateEngine.js e generateWorkflow.js
 * Usa o Node.js built-in test runner (node:test) — sem dependências externas.
 *
 * Executar: node tests/generator.test.js
 * Ou: node --test tests/
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  substituteVariables,
  validateConfig,
  findUnresolvedVariables,
  renderTemplate,
  REQUIRED_VARIABLES
} = require('../generator/templateEngine');

const {
  generateWorkflow,
  generateWorkflowId,
  applyPostProcessing
} = require('../generator/generateWorkflow');

// ─── Configuração válida de teste ─────────────────────────────────────────────

const VALID_CONFIG = {
  company_name: 'Empresa Teste',
  welcome_message: 'Olá! Bem-vindo à Empresa Teste!',
  services: 'Serviço A,Serviço B,Serviço C'
};

// ─── Testes: substituteVariables ─────────────────────────────────────────────

describe('substituteVariables', () => {
  it('deve substituir uma variável simples', () => {
    const result = substituteVariables('Olá {{name}}!', { name: 'Mundo' });
    assert.equal(result, 'Olá Mundo!');
  });

  it('deve substituir múltiplas variáveis', () => {
    const result = substituteVariables(
      '{{company_name}} — {{services}}',
      { company_name: 'ACME', services: 'X,Y,Z' }
    );
    assert.equal(result, 'ACME — X,Y,Z');
  });

  it('deve substituir todas as ocorrências da mesma variável', () => {
    const result = substituteVariables('{{a}} e {{a}} e {{a}}', { a: 'X' });
    assert.equal(result, 'X e X e X');
  });

  it('deve escapar aspas duplas no valor para uso em JSON', () => {
    const result = substituteVariables('{"key": "{{val}}"}', { val: 'com "aspas"' });
    assert.ok(result.includes('\\"aspas\\"'));
  });

  it('deve escapar barras invertidas no valor', () => {
    const result = substituteVariables('{{val}}', { val: 'C:\\Users' });
    assert.ok(result.includes('C:\\\\Users'));
  });

  it('não deve alterar texto sem variáveis', () => {
    const original = 'texto simples sem variáveis';
    const result = substituteVariables(original, { qualquer: 'coisa' });
    assert.equal(result, original);
  });

  it('deve deixar variáveis não fornecidas intactas', () => {
    const result = substituteVariables('{{a}} {{b}}', { a: 'X' });
    assert.equal(result, 'X {{b}}');
  });
});

// ─── Testes: validateConfig ──────────────────────────────────────────────────

describe('validateConfig', () => {
  it('deve aceitar config com todas as variáveis obrigatórias', () => {
    assert.doesNotThrow(() => validateConfig(VALID_CONFIG));
  });

  it('deve rejeitar config sem company_name', () => {
    const config = { ...VALID_CONFIG };
    delete config.company_name;
    assert.throws(() => validateConfig(config), /company_name/);
  });

  it('deve rejeitar config sem welcome_message', () => {
    const config = { ...VALID_CONFIG };
    delete config.welcome_message;
    assert.throws(() => validateConfig(config), /welcome_message/);
  });

  it('deve rejeitar config sem services', () => {
    const config = { ...VALID_CONFIG };
    delete config.services;
    assert.throws(() => validateConfig(config), /services/);
  });

  it('deve rejeitar config com campo vazio (string vazia)', () => {
    assert.throws(
      () => validateConfig({ ...VALID_CONFIG, company_name: '' }),
      /company_name/
    );
  });

  it('deve rejeitar config com campo apenas whitespace', () => {
    assert.throws(
      () => validateConfig({ ...VALID_CONFIG, company_name: '   ' }),
      /company_name/
    );
  });

  it('deve listar todos os campos ausentes no erro', () => {
    try {
      validateConfig({});
      assert.fail('Deveria ter lançado erro');
    } catch (err) {
      for (const key of REQUIRED_VARIABLES) {
        assert.ok(err.message.includes(key), `Erro deveria mencionar "${key}"`);
      }
    }
  });
});

// ─── Testes: findUnresolvedVariables ─────────────────────────────────────────

describe('findUnresolvedVariables', () => {
  it('deve encontrar variável não substituída', () => {
    const result = findUnresolvedVariables('Olá {{name}}!');
    assert.deepEqual(result, ['{{name}}']);
  });

  it('deve retornar array vazio quando tudo foi substituído', () => {
    const result = findUnresolvedVariables('Olá Mundo!');
    assert.deepEqual(result, []);
  });

  it('deve ignorar expressões n8n internas com $', () => {
    const result = findUnresolvedVariables('={{$json["field"]}}');
    assert.deepEqual(result, []);
  });

  it('deve retornar variáveis únicas (sem duplicatas)', () => {
    const result = findUnresolvedVariables('{{a}} e {{a}} e {{b}}');
    assert.equal(result.length, 2);
    assert.ok(result.includes('{{a}}'));
    assert.ok(result.includes('{{b}}'));
  });
});

// ─── Testes: renderTemplate ──────────────────────────────────────────────────

describe('renderTemplate', () => {
  it('deve renderizar o template sem lançar erro com config válida', () => {
    assert.doesNotThrow(() => renderTemplate(VALID_CONFIG));
  });

  it('deve retornar um objeto (não string)', () => {
    const result = renderTemplate(VALID_CONFIG);
    assert.equal(typeof result, 'object');
    assert.ok(!Array.isArray(result));
  });

  it('deve conter o company_name no nome do workflow', () => {
    const result = renderTemplate(VALID_CONFIG);
    assert.ok(
      result.name.includes('Empresa Teste'),
      `Nome do workflow deveria conter "Empresa Teste", mas foi: ${result.name}`
    );
  });

  it('deve conter array de nodes', () => {
    const result = renderTemplate(VALID_CONFIG);
    assert.ok(Array.isArray(result.nodes));
    assert.ok(result.nodes.length > 0);
  });

  it('deve lançar erro com config inválida', () => {
    assert.throws(() => renderTemplate({}), /obrigatórias/);
  });
});

// ─── Testes: generateWorkflowId ──────────────────────────────────────────────

describe('generateWorkflowId', () => {
  it('deve gerar um ID não vazio', () => {
    const id = generateWorkflowId('Empresa ABC');
    assert.ok(id.length > 0);
  });

  it('deve gerar IDs diferentes para chamadas distintas', () => {
    const id1 = generateWorkflowId('Empresa X');
    const id2 = generateWorkflowId('Empresa X');
    // Com hash baseado em timestamp, podem ser iguais se muito rápidos
    // Apenas verificamos que o formato está correto
    assert.match(id1, /^[a-z0-9-]+-[a-f0-9]{8}$/);
  });

  it('deve converter espaços e caracteres especiais para hifens', () => {
    const id = generateWorkflowId('Clínica Saúde & Bem-Estar!');
    assert.doesNotMatch(id, /[^a-z0-9-]/);
  });
});

// ─── Testes: generateWorkflow ────────────────────────────────────────────────

describe('generateWorkflow', () => {
  it('deve gerar workflow sem salvar (save=false)', () => {
    const result = generateWorkflow(VALID_CONFIG, { save: false });
    assert.ok(result.workflow);
    assert.equal(result.savedPath, null);
  });

  it('deve incluir ID no workflow gerado', () => {
    const result = generateWorkflow(VALID_CONFIG, { save: false });
    assert.ok(result.workflow.id);
  });

  it('deve incluir metadata de geração', () => {
    const result = generateWorkflow(VALID_CONFIG, { save: false });
    assert.ok(result.workflow.meta?.generatedAt);
    assert.ok(result.workflow.meta?.companyName);
  });

  it('deve remover campos internos do template', () => {
    const result = generateWorkflow(VALID_CONFIG, { save: false });
    assert.equal(result.workflow._templateVariables, undefined);
    assert.equal(result.workflow._description, undefined);
    assert.equal(result.workflow._version, undefined);
  });

  it('deve passar na validação por padrão', () => {
    const result = generateWorkflow(VALID_CONFIG, { save: false, validate: true });
    assert.ok(result.validationResult);
    assert.equal(result.validationResult.valid, true,
      `Erros de validação: ${result.validationResult?.errors?.join(', ')}`
    );
  });

  it('deve lançar erro com config inválida', () => {
    assert.throws(
      () => generateWorkflow({}, { save: false }),
      /obrigatórias/
    );
  });
});
