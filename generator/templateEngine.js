'use strict';

/**
 * templateEngine.js
 *
 * Motor de substituição de variáveis para o template de workflow n8n.
 * Carrega o template JSON e substitui todas as ocorrências de {{variavel}}
 * pelos valores fornecidos na configuração.
 *
 * Segurança: não executa código, apenas substituição de strings.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.resolve(
  __dirname,
  '../workflows/template/whatsapp_lead_template.json'
);

// Variáveis obrigatórias no template
const REQUIRED_VARIABLES = ['company_name', 'welcome_message', 'services'];

/**
 * Carrega o template do disco.
 * @returns {string} Conteúdo raw do template como string
 * @throws {Error} Se o arquivo não existir
 */
function loadTemplate() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template não encontrado em: ${TEMPLATE_PATH}`);
  }
  return fs.readFileSync(TEMPLATE_PATH, 'utf8');
}

/**
 * Substitui todas as ocorrências de {{chave}} pelo valor correspondente.
 * Substituição é feita na string raw (antes do JSON.parse) para suportar
 * variáveis em qualquer posição do JSON.
 *
 * @param {string} templateStr - Conteúdo raw do template
 * @param {Object} variables - Mapa de chave → valor
 * @returns {string} Template com variáveis substituídas
 */
function substituteVariables(templateStr, variables) {
  let result = templateStr;

  for (const [key, value] of Object.entries(variables)) {
    // Escapa caracteres especiais de regex no nome da variável
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g');

    // Escapa o valor para uso seguro dentro de JSON strings
    const safeValue = String(value)
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');

    result = result.replace(pattern, safeValue);
  }

  return result;
}

/**
 * Valida que todas as variáveis obrigatórias estão presentes na config.
 * @param {Object} config - Configuração fornecida pelo usuário
 * @throws {Error} Se alguma variável obrigatória estiver ausente ou vazia
 */
function validateConfig(config) {
  const missing = REQUIRED_VARIABLES.filter(
    key => !config[key] || String(config[key]).trim() === ''
  );

  if (missing.length > 0) {
    throw new Error(
      `Variáveis obrigatórias ausentes ou vazias: ${missing.join(', ')}`
    );
  }
}

/**
 * Verifica se ainda existem variáveis não substituídas no resultado.
 * @param {string} renderedStr - String após substituição
 * @returns {string[]} Lista de variáveis ainda presentes
 */
function findUnresolvedVariables(renderedStr) {
  const matches = renderedStr.match(/\{\{[^}]+\}\}/g) || [];
  // Filtra variáveis internas do n8n (que usam $json, $env, etc.) e deduplica
  const filtered = matches.filter(m => !m.includes('$'));
  return [...new Set(filtered)];
}

/**
 * Renderiza o template com as variáveis fornecidas.
 *
 * @param {Object} config - { company_name, welcome_message, services, ...extras }
 * @returns {Object} Workflow n8n como objeto JavaScript pronto para uso
 */
function renderTemplate(config) {
  validateConfig(config);

  const templateStr = loadTemplate();
  const rendered = substituteVariables(templateStr, config);

  // Verifica variáveis não resolvidas (template incompleto)
  const unresolved = findUnresolvedVariables(rendered);
  if (unresolved.length > 0) {
    console.warn(
      `[TemplateEngine] Aviso: variáveis não substituídas encontradas: ${unresolved.join(', ')}`
    );
  }

  // Parse para validar JSON resultante
  try {
    return JSON.parse(rendered);
  } catch (err) {
    throw new Error(
      `Template resultou em JSON inválido após substituição: ${err.message}`
    );
  }
}

module.exports = {
  renderTemplate,
  loadTemplate,
  substituteVariables,
  validateConfig,
  findUnresolvedVariables,
  REQUIRED_VARIABLES,
  TEMPLATE_PATH
};
