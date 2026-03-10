'use strict';

/**
 * generateWorkflow.js
 *
 * Módulo principal de geração de workflow n8n.
 * Orquestra: carregamento do template → substituição de variáveis →
 * validação → customização → exportação.
 *
 * Uso via CLI:
 *   node generator/generateWorkflow.js --company "Nome" --welcome "Msg" --services "S1,S2"
 *
 * Uso via API:
 *   const { generateWorkflow } = require('./generator/generateWorkflow');
 *   const workflow = generateWorkflow({ company_name, welcome_message, services });
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { renderTemplate } = require('./templateEngine');
const { validateWorkflow } = require('./workflowValidator');

const OUTPUT_DIR = path.resolve(__dirname, '../workflows/production');

/**
 * Gera um ID único para o workflow baseado no nome da empresa e timestamp.
 * @param {string} companyName
 * @returns {string}
 */
function generateWorkflowId(companyName) {
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
  const hash = crypto
    .createHash('sha256')
    .update(`${companyName}${Date.now()}`)
    .digest('hex')
    .substring(0, 8);
  return `${slug}-${hash}`;
}

/**
 * Aplica customizações pós-renderização no objeto de workflow.
 * - Gera ID único
 * - Atualiza versionId
 * - Remove campos internos do template (_templateVariables, _description, _version)
 *
 * @param {Object} workflow - Workflow renderizado
 * @param {Object} config - Configuração original
 * @returns {Object} Workflow finalizado
 */
function applyPostProcessing(workflow, config) {
  const processed = { ...workflow };

  // Gera ID único para este workflow
  processed.id = generateWorkflowId(config.company_name);
  processed.versionId = crypto.randomUUID();

  // Remove campos internos do template
  delete processed._templateVariables;
  delete processed._description;
  delete processed._version;

  // Adiciona metadata de geração
  processed.meta = {
    ...(processed.meta || {}),
    generatedAt: new Date().toISOString(),
    generatedBy: 'generateWorkflow.js',
    companyName: config.company_name,
    templateVersion: workflow._version || '1.0.0'
  };

  return processed;
}

/**
 * Salva o workflow gerado em disco.
 *
 * @param {Object} workflow - Workflow finalizado
 * @param {string} [outputPath] - Caminho de saída customizado
 * @returns {string} Caminho onde o arquivo foi salvo
 */
function saveWorkflow(workflow, outputPath) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const fileName = outputPath || path.join(
    OUTPUT_DIR,
    `lead_qualification_workflow_${workflow.id}.json`
  );

  fs.writeFileSync(fileName, JSON.stringify(workflow, null, 2), 'utf8');
  return fileName;
}

/**
 * Função principal: gera um workflow n8n customizado a partir da configuração.
 *
 * @param {Object} config
 * @param {string} config.company_name     - Nome da empresa
 * @param {string} config.welcome_message  - Mensagem de boas-vindas
 * @param {string} config.services         - Serviços separados por vírgula
 * @param {Object} [options]
 * @param {boolean} [options.save=false]   - Salvar automaticamente em disco
 * @param {string}  [options.outputPath]   - Caminho de saída (se save=true)
 * @param {boolean} [options.validate=true] - Executar validação antes de retornar
 *
 * @returns {{ workflow: Object, savedPath: string|null, validationResult: Object }}
 */
function generateWorkflow(config, options = {}) {
  const { save = false, outputPath = null, validate = true } = options;

  // 1. Renderiza o template com as variáveis
  console.log(`[Generator] Renderizando template para: ${config.company_name}`);
  const workflow = renderTemplate(config);

  // 2. Aplica pós-processamento
  const finalWorkflow = applyPostProcessing(workflow, config);

  // 3. Valida (opcional mas recomendado)
  let validationResult = null;
  if (validate) {
    validationResult = validateWorkflow(finalWorkflow);
    if (!validationResult.valid) {
      throw new Error(
        `Workflow inválido após geração:\n${validationResult.errors.join('\n')}`
      );
    }
    console.log(`[Generator] Validação OK (${validationResult.warnings.length} avisos)`);
    if (validationResult.warnings.length > 0) {
      validationResult.warnings.forEach(w => console.warn(`[Generator] Aviso: ${w}`));
    }
  }

  // 4. Salva em disco se solicitado
  let savedPath = null;
  if (save) {
    savedPath = saveWorkflow(finalWorkflow, outputPath);
    console.log(`[Generator] Workflow salvo em: ${savedPath}`);
  }

  return { workflow: finalWorkflow, savedPath, validationResult };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const idx = args.indexOf(flag);
    return idx !== -1 ? args[idx + 1] : null;
  };

  // Suporte a --env para carregar .env
  const envFile = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.substring(0, eqIdx).trim();
      const value = trimmed.substring(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  }

  const config = {
    company_name:    getArg('--company')  || process.env.COMPANY_NAME    || 'Minha Empresa',
    welcome_message: getArg('--welcome')  || process.env.WELCOME_MESSAGE || 'Bem-vindo! Como posso ajudar?',
    services:        getArg('--services') || process.env.SERVICES        || 'Serviço A,Serviço B'
  };

  const outputPath = getArg('--output');

  try {
    const result = generateWorkflow(config, { save: true, outputPath });
    console.log(`\n✅ Workflow gerado com sucesso!`);
    console.log(`   ID: ${result.workflow.id}`);
    console.log(`   Nome: ${result.workflow.name}`);
    console.log(`   Arquivo: ${result.savedPath}`);
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ Erro ao gerar workflow: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { generateWorkflow, saveWorkflow, applyPostProcessing, generateWorkflowId };
