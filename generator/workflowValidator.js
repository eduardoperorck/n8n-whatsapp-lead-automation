'use strict';

/**
 * workflowValidator.js
 *
 * Valida a estrutura e segurança de um workflow n8n antes do deploy.
 *
 * Verificações:
 *  1. JSON válido (estrutura de objeto)
 *  2. Campos obrigatórios do n8n (name, nodes, connections)
 *  3. Nodes obrigatórios do pipeline canônico
 *  4. Ausência de credenciais hardcoded (tokens, API keys, senhas)
 *  5. Conexões íntegras (nodes referenciados existem)
 *  6. Variáveis de template não substituídas
 */

// Nodes obrigatórios que todo workflow válido desta família deve conter
const REQUIRED_NODE_NAMES = [
  'WhatsApp Webhook',
  'Message Parser',
  'Intent Router',
  'Lead Qualification',
  'Lead Storage — Google Sheets',
  'Agent Notification'
];

// Campos obrigatórios na raiz do workflow
const REQUIRED_WORKFLOW_FIELDS = ['name', 'nodes', 'connections'];

// Padrões de secrets hardcoded que NÃO devem aparecer no JSON exportado
const SECRET_PATTERNS = [
  // Tokens Bearer reais (comprimento típico > 50 chars, não são env vars)
  /Bearer\s+(?!\{\{)[A-Za-z0-9\-._~+/]{40,}/,
  // API Keys numéricas longas fora de variáveis de ambiente
  /(?<!\$env\.)(?<!\{\{)[A-Za-z0-9]{32,}(?!\}\})/,
  // Padrões específicos de providers
  /EAAl[0-9a-zA-Z]{60,}/,      // Meta/Facebook token
  /ya29\.[0-9A-Za-z\-_]{40,}/, // Google OAuth token
  /sk-[a-zA-Z0-9]{32,}/,       // OpenAI / generic sk- keys
  /AKIA[0-9A-Z]{16}/,           // AWS Access Key
];

// Strings que indicam secret mas são permitidas (são referências a env vars)
const ALLOWED_SECRET_PATTERNS = [
  /\$env\.[A-Z_]+/,
  /\{\{[^}]+\}\}/
];

/**
 * Verifica se uma string contém um possível secret hardcoded.
 * @param {string} str
 * @returns {{ found: boolean, pattern: string|null }}
 */
function detectHardcodedSecret(str) {
  if (typeof str !== 'string') return { found: false, pattern: null };

  for (const pattern of SECRET_PATTERNS) {
    const match = str.match(pattern);
    if (match) {
      // Verifica se o match é uma referência legítima a env var
      const matchStr = match[0];
      const isAllowed = ALLOWED_SECRET_PATTERNS.some(ap => ap.test(matchStr));
      if (!isAllowed) {
        return { found: true, pattern: pattern.toString() };
      }
    }
  }
  return { found: false, pattern: null };
}

/**
 * Percorre recursivamente um objeto e coleta todos os valores string.
 * @param {*} obj
 * @param {string} path - Caminho atual (para mensagens de erro)
 * @returns {{ path: string, value: string }[]}
 */
function collectStrings(obj, path = '') {
  const results = [];
  if (typeof obj === 'string') {
    results.push({ path, value: obj });
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => results.push(...collectStrings(item, `${path}[${i}]`)));
  } else if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      results.push(...collectStrings(value, path ? `${path}.${key}` : key));
    }
  }
  return results;
}

/**
 * Valida que todos os nodes referenciados nas connections existem.
 * @param {Object[]} nodes
 * @param {Object} connections
 * @returns {string[]} Lista de erros encontrados
 */
function validateConnections(nodes, connections) {
  const errors = [];
  const nodeNames = new Set(nodes.map(n => n.name));

  for (const [sourceName, outputs] of Object.entries(connections)) {
    if (!nodeNames.has(sourceName)) {
      errors.push(`Connection source inválido: "${sourceName}" não existe nos nodes`);
      continue;
    }

    for (const outputList of Object.values(outputs)) {
      for (const connectionGroup of outputList) {
        for (const conn of connectionGroup) {
          if (!nodeNames.has(conn.node)) {
            errors.push(
              `Connection target inválido: "${conn.node}" referenciado por "${sourceName}" não existe`
            );
          }
        }
      }
    }
  }

  return errors;
}

/**
 * Valida o workflow completo.
 *
 * @param {Object} workflow - Objeto de workflow n8n
 * @returns {{
 *   valid: boolean,
 *   errors: string[],
 *   warnings: string[]
 * }}
 */
function validateWorkflow(workflow) {
  const errors = [];
  const warnings = [];

  // ── 1. Tipo básico ─────────────────────────────────────────────────────────
  if (!workflow || typeof workflow !== 'object' || Array.isArray(workflow)) {
    return { valid: false, errors: ['Workflow deve ser um objeto JSON válido'], warnings };
  }

  // ── 2. Campos obrigatórios na raiz ─────────────────────────────────────────
  for (const field of REQUIRED_WORKFLOW_FIELDS) {
    if (!(field in workflow)) {
      errors.push(`Campo obrigatório ausente na raiz: "${field}"`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }

  // ── 3. Nodes ───────────────────────────────────────────────────────────────
  if (!Array.isArray(workflow.nodes)) {
    errors.push('"nodes" deve ser um array');
  } else {
    if (workflow.nodes.length === 0) {
      errors.push('Workflow não contém nenhum node');
    }

    // Verifica nodes obrigatórios do pipeline
    const nodeNames = workflow.nodes.map(n => n.name);
    for (const required of REQUIRED_NODE_NAMES) {
      if (!nodeNames.includes(required)) {
        errors.push(`Node obrigatório ausente: "${required}"`);
      }
    }

    // Valida estrutura mínima de cada node
    workflow.nodes.forEach((node, idx) => {
      if (!node.id)   warnings.push(`Node[${idx}] "${node.name || '?'}" sem ID`);
      if (!node.name) errors.push(`Node[${idx}] sem campo "name"`);
      if (!node.type) errors.push(`Node[${idx}] "${node.name || '?'}" sem campo "type"`);
    });
  }

  // ── 4. Connections ─────────────────────────────────────────────────────────
  if (typeof workflow.connections !== 'object') {
    errors.push('"connections" deve ser um objeto');
  } else if (Array.isArray(workflow.nodes)) {
    const connErrors = validateConnections(workflow.nodes, workflow.connections);
    errors.push(...connErrors);
  }

  // ── 5. Secrets hardcoded ──────────────────────────────────────────────────
  const allStrings = collectStrings(workflow);
  for (const { path: strPath, value } of allStrings) {
    // Pula strings muito curtas (improvável serem secrets)
    if (value.length < 20) continue;

    const detection = detectHardcodedSecret(value);
    if (detection.found) {
      errors.push(
        `Possível secret hardcoded detectado em "${strPath}". ` +
        `Use variáveis de ambiente ($env.VAR) em vez de valores literais.`
      );
    }
  }

  // ── 6. Variáveis de template não substituídas ─────────────────────────────
  const workflowStr = JSON.stringify(workflow);
  const unresolvedVars = (workflowStr.match(/\{\{[^$][^}]*\}\}/g) || [])
    .filter(v => !v.includes('$'))
    .filter((v, i, arr) => arr.indexOf(v) === i); // unique

  if (unresolvedVars.length > 0) {
    errors.push(
      `Variáveis de template não substituídas: ${unresolvedVars.join(', ')}`
    );
  }

  // ── 7. Avisos não bloqueantes ──────────────────────────────────────────────
  if (!workflow.name || workflow.name.trim() === '') {
    warnings.push('Workflow sem nome definido');
  }

  if (workflow.active === true) {
    warnings.push('Workflow está marcado como "active: true" — verifique antes de importar');
  }

  if (!workflow.settings?.executionOrder) {
    warnings.push('settings.executionOrder não definido — recomendado "v1"');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Valida um arquivo JSON de workflow lido do disco.
 * @param {string} filePath - Caminho absoluto para o arquivo
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
function validateWorkflowFile(filePath) {
  const fs = require('fs');

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`Arquivo não encontrado: ${filePath}`], warnings: [] };
  }

  let workflow;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    workflow = JSON.parse(raw);
  } catch (err) {
    return { valid: false, errors: [`JSON inválido: ${err.message}`], warnings: [] };
  }

  return validateWorkflow(workflow);
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Uso: node workflowValidator.js <caminho-do-workflow.json>');
    process.exit(1);
  }

  const result = validateWorkflowFile(filePath);

  if (result.valid) {
    console.log('✅ Workflow válido!');
    if (result.warnings.length > 0) {
      console.log('\n⚠️  Avisos:');
      result.warnings.forEach(w => console.log(`   - ${w}`));
    }
    process.exit(0);
  } else {
    console.error('❌ Workflow inválido!\n');
    console.error('Erros:');
    result.errors.forEach(e => console.error(`   - ${e}`));
    if (result.warnings.length > 0) {
      console.warn('\nAvisos:');
      result.warnings.forEach(w => console.warn(`   - ${w}`));
    }
    process.exit(1);
  }
}

module.exports = {
  validateWorkflow,
  validateWorkflowFile,
  detectHardcodedSecret,
  REQUIRED_NODE_NAMES,
  REQUIRED_WORKFLOW_FIELDS
};
