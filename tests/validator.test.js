'use strict';

/**
 * validator.test.js
 *
 * Testes unitários para workflowValidator.js
 * Usa o Node.js built-in test runner (node:test) — sem dependências externas.
 *
 * Executar: node tests/validator.test.js
 * Ou: node --test tests/
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const {
  validateWorkflow,
  validateWorkflowFile,
  detectHardcodedSecret,
  REQUIRED_NODE_NAMES
} = require('../generator/workflowValidator');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Cria um workflow mínimo válido para usar como base nos testes */
function makeValidWorkflow(overrides = {}) {
  const nodes = REQUIRED_NODE_NAMES.map((name, i) => ({
    id: `node-${i + 1}`,
    name,
    type: 'n8n-nodes-base.code',
    typeVersion: 2,
    position: [i * 200, 300],
    parameters: {}
  }));

  const connections = {};

  return {
    name: 'Test Workflow',
    nodes,
    connections,
    active: false,
    settings: { executionOrder: 'v1' },
    ...overrides
  };
}

// ─── Testes: validateWorkflow ─────────────────────────────────────────────────

describe('validateWorkflow — estrutura básica', () => {
  it('deve aceitar um workflow válido completo', () => {
    const result = validateWorkflow(makeValidWorkflow());
    assert.equal(result.valid, true, `Erros: ${result.errors.join(', ')}`);
  });

  it('deve rejeitar null', () => {
    const result = validateWorkflow(null);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  });

  it('deve rejeitar array', () => {
    const result = validateWorkflow([]);
    assert.equal(result.valid, false);
  });

  it('deve rejeitar string', () => {
    const result = validateWorkflow('{}');
    assert.equal(result.valid, false);
  });

  it('deve rejeitar workflow sem campo "name"', () => {
    const wf = makeValidWorkflow();
    delete wf.name;
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"name"')));
  });

  it('deve rejeitar workflow sem campo "nodes"', () => {
    const wf = makeValidWorkflow();
    delete wf.nodes;
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"nodes"')));
  });

  it('deve rejeitar workflow sem campo "connections"', () => {
    const wf = makeValidWorkflow();
    delete wf.connections;
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('"connections"')));
  });
});

describe('validateWorkflow — nodes obrigatórios', () => {
  it('deve rejeitar workflow sem nodes', () => {
    const wf = makeValidWorkflow({ nodes: [] });
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('nenhum node')));
  });

  for (const nodeName of REQUIRED_NODE_NAMES) {
    it(`deve rejeitar workflow sem node obrigatório: "${nodeName}"`, () => {
      const wf = makeValidWorkflow();
      wf.nodes = wf.nodes.filter(n => n.name !== nodeName);
      const result = validateWorkflow(wf);
      assert.equal(result.valid, false);
      assert.ok(
        result.errors.some(e => e.includes(nodeName)),
        `Esperava erro mencionando "${nodeName}", mas erros foram: ${result.errors.join('; ')}`
      );
    });
  }

  it('deve emitir aviso para node sem ID', () => {
    const wf = makeValidWorkflow();
    delete wf.nodes[0].id;
    const result = validateWorkflow(wf);
    assert.ok(result.warnings.some(w => w.includes('sem ID')));
  });

  it('deve rejeitar node sem "type"', () => {
    const wf = makeValidWorkflow();
    delete wf.nodes[0].type;
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('sem campo "type"')));
  });
});

describe('validateWorkflow — connections', () => {
  it('deve rejeitar connection referenciando node inexistente como source', () => {
    const wf = makeValidWorkflow({
      connections: {
        'Node Inexistente': { main: [[{ node: 'WhatsApp Webhook', type: 'main', index: 0 }]] }
      }
    });
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('source inválido')));
  });

  it('deve rejeitar connection com target inexistente', () => {
    const wf = makeValidWorkflow({
      connections: {
        'WhatsApp Webhook': { main: [[{ node: 'Node Fantasma', type: 'main', index: 0 }]] }
      }
    });
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('target inválido')));
  });

  it('deve aceitar connections válidas entre nodes existentes', () => {
    const wf = makeValidWorkflow({
      connections: {
        'WhatsApp Webhook': { main: [[{ node: 'Message Parser', type: 'main', index: 0 }]] }
      }
    });
    const result = validateWorkflow(wf);
    assert.equal(result.valid, true, `Erros: ${result.errors.join(', ')}`);
  });
});

describe('validateWorkflow — segurança (secrets hardcoded)', () => {
  it('deve rejeitar workflow com token Bearer hardcoded', () => {
    const wf = makeValidWorkflow();
    wf.nodes[0].parameters = {
      auth: 'Bearer EAAl1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    };
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('secret hardcoded')));
  });

  it('deve aceitar referência a env var ($env.TOKEN)', () => {
    const wf = makeValidWorkflow();
    wf.nodes[0].parameters = {
      auth: 'Bearer $env.WHATSAPP_ACCESS_TOKEN'
    };
    const result = validateWorkflow(wf);
    assert.equal(result.valid, true, `Erros: ${result.errors.join(', ')}`);
  });

  it('deve rejeitar workflow com variável de template não substituída', () => {
    const wf = makeValidWorkflow();
    wf.nodes[0].parameters = { message: 'Bem-vindo à {{company_name}}!' };
    const result = validateWorkflow(wf);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('não substituídas')));
  });
});

describe('validateWorkflow — avisos não bloqueantes', () => {
  it('deve emitir aviso quando active=true', () => {
    const wf = makeValidWorkflow({ active: true });
    const result = validateWorkflow(wf);
    assert.ok(result.warnings.some(w => w.includes('active: true')));
    // Não deve bloquear
    assert.equal(result.valid, true);
  });

  it('deve emitir aviso quando executionOrder não definido', () => {
    const wf = makeValidWorkflow({ settings: {} });
    const result = validateWorkflow(wf);
    assert.ok(result.warnings.some(w => w.includes('executionOrder')));
  });
});

// ─── Testes: detectHardcodedSecret ────────────────────────────────────────────

describe('detectHardcodedSecret', () => {
  it('deve detectar token Facebook/Meta', () => {
    const result = detectHardcodedSecret('EAAl1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN');
    assert.equal(result.found, true);
  });

  it('deve detectar AWS Access Key', () => {
    const result = detectHardcodedSecret('AKIA1234567890ABCDEF');
    assert.equal(result.found, true);
  });

  it('não deve detectar referência a env var', () => {
    const result = detectHardcodedSecret('Bearer $env.WHATSAPP_ACCESS_TOKEN');
    assert.equal(result.found, false);
  });

  it('não deve detectar strings curtas normais', () => {
    const result = detectHardcodedSecret('hello world');
    assert.equal(result.found, false);
  });
});

// ─── Testes: validateWorkflowFile ────────────────────────────────────────────

describe('validateWorkflowFile', () => {
  it('deve retornar erro para arquivo inexistente', () => {
    const result = validateWorkflowFile('/caminho/inexistente/workflow.json');
    assert.equal(result.valid, false);
    assert.ok(result.errors.some(e => e.includes('não encontrado')));
  });

  it('deve validar o template base sem erros de estrutura', () => {
    const templatePath = path.resolve(
      __dirname,
      '../workflows/template/whatsapp_lead_template.json'
    );
    const result = validateWorkflowFile(templatePath);
    // O template TEM variáveis não substituídas — isso é esperado
    // Verificamos apenas que não há erros de ESTRUTURA (nodes, connections)
    const structuralErrors = result.errors.filter(
      e => !e.includes('não substituídas') && !e.includes('secret')
    );
    assert.deepEqual(
      structuralErrors,
      [],
      `Erros estruturais inesperados no template: ${structuralErrors.join(', ')}`
    );
  });
});
