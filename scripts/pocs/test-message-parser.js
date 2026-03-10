#!/usr/bin/env node
/**
 * PoC: test-message-parser.js
 *
 * Prova de Conceito para validar a lógica de parsing de mensagens WhatsApp
 * ANTES de embutir o código no n8n Code node.
 *
 * Simula os payloads reais da WhatsApp Business API e valida que
 * o parser defensivo lida corretamente com todos os edge cases.
 *
 * Executar: node scripts/pocs/test-message-parser.js
 */

'use strict';

// ─── Parser (cópia do código que vai para o n8n Code node) ───────────────────

const MAX_PAYLOAD_BYTES = 65536;
const SUPPORTED_TYPES = ['text'];
const GREETING_WORDS = [
  'oi', 'olá', 'ola', 'hello', 'hi',
  'bom dia', 'boa tarde', 'boa noite',
  'início', 'inicio', 'começar', 'comecar',
  'start', 'menu'
];

function parseMessage(body) {
  const payloadSize = JSON.stringify(body).length;
  if (payloadSize > MAX_PAYLOAD_BYTES) {
    return { valid: false, error: 'PAYLOAD_TOO_LARGE', size: payloadSize };
  }

  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messageObj = value?.messages?.[0];

    if (!messageObj && value?.statuses) {
      return { valid: false, error: 'STATUS_UPDATE', ignore: true };
    }

    if (!messageObj) {
      return { valid: false, error: 'NO_MESSAGE_IN_PAYLOAD' };
    }

    const msgType = messageObj.type;
    const from = messageObj.from;
    const timestamp = messageObj.timestamp;
    const messageId = messageObj.id;
    const waBusinessId = entry?.id;

    if (!SUPPORTED_TYPES.includes(msgType)) {
      return { valid: false, error: 'UNSUPPORTED_MESSAGE_TYPE', messageType: msgType, from, waBusinessId };
    }

    const text = messageObj.text?.body?.trim();
    if (!text) {
      return { valid: false, error: 'EMPTY_TEXT', from };
    }

    const lowerText = text.toLowerCase();
    const isGreeting = GREETING_WORDS.some(w => lowerText.includes(w));

    return { valid: true, from, text, messageType: msgType, timestamp, messageId, waBusinessId, isGreeting };

  } catch (err) {
    return { valid: false, error: 'PARSE_ERROR', message: err.message };
  }
}

// ─── Payloads de Teste ────────────────────────────────────────────────────────

const testCases = [
  {
    name: '✅ Mensagem de texto válida',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            messages: [{
              id: 'msg-001',
              from: '5511999887766',
              type: 'text',
              timestamp: '1709982000',
              text: { body: 'Olá, gostaria de saber mais sobre os serviços' }
            }]
          }
        }]
      }]
    },
    expect: { valid: true, isGreeting: true }
  },
  {
    name: '✅ Texto sem saudação (pergunta direta)',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            messages: [{
              id: 'msg-002',
              from: '5511999887766',
              type: 'text',
              timestamp: '1709982001',
              text: { body: 'Quero agendar uma consulta' }
            }]
          }
        }]
      }]
    },
    expect: { valid: true, isGreeting: false }
  },
  {
    name: '❌ Mensagem de áudio (tipo não suportado)',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            messages: [{
              id: 'msg-003',
              from: '5511999887766',
              type: 'audio',
              timestamp: '1709982002',
              audio: { id: 'audio-id', mime_type: 'audio/ogg' }
            }]
          }
        }]
      }]
    },
    expect: { valid: false, error: 'UNSUPPORTED_MESSAGE_TYPE' }
  },
  {
    name: '❌ Imagem enviada',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            messages: [{
              id: 'msg-004',
              from: '5511999887766',
              type: 'image',
              timestamp: '1709982003',
              image: { id: 'img-id', mime_type: 'image/jpeg' }
            }]
          }
        }]
      }]
    },
    expect: { valid: false, error: 'UNSUPPORTED_MESSAGE_TYPE' }
  },
  {
    name: '❌ Texto vazio (apenas espaços)',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            messages: [{
              id: 'msg-005',
              from: '5511999887766',
              type: 'text',
              timestamp: '1709982004',
              text: { body: '   ' }
            }]
          }
        }]
      }]
    },
    expect: { valid: false, error: 'EMPTY_TEXT' }
  },
  {
    name: '❌ Payload sem mensagens (status update)',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            statuses: [{ id: 'msg-001', status: 'delivered', timestamp: '1709982005' }]
          }
        }]
      }]
    },
    expect: { valid: false, error: 'STATUS_UPDATE' }
  },
  {
    name: '❌ Payload vazio',
    payload: {},
    expect: { valid: false, error: 'NO_MESSAGE_IN_PAYLOAD' }
  },
  {
    name: '❌ null como payload',
    payload: null,
    expect: { valid: false, error: 'NO_MESSAGE_IN_PAYLOAD' }
  },
  {
    name: '❌ Payload muito grande (> 64KB)',
    payload: {
      entry: [{
        id: '123456789',
        changes: [{
          value: {
            messages: [{
              id: 'msg-large',
              from: '5511999887766',
              type: 'text',
              timestamp: '1709982006',
              text: { body: 'A'.repeat(MAX_PAYLOAD_BYTES + 1) }
            }]
          }
        }]
      }]
    },
    expect: { valid: false, error: 'PAYLOAD_TOO_LARGE' }
  }
];

// ─── Runner ───────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

console.log('\n🔬 PoC: WhatsApp Message Parser\n');
console.log('─'.repeat(60));

for (const tc of testCases) {
  const result = parseMessage(tc.payload);
  let ok = true;
  const checks = [];

  if ('valid' in tc.expect && result.valid !== tc.expect.valid) {
    ok = false;
    checks.push(`valid: esperado=${tc.expect.valid}, obtido=${result.valid}`);
  }
  if ('error' in tc.expect && result.error !== tc.expect.error) {
    ok = false;
    checks.push(`error: esperado="${tc.expect.error}", obtido="${result.error}"`);
  }
  if ('isGreeting' in tc.expect && result.isGreeting !== tc.expect.isGreeting) {
    ok = false;
    checks.push(`isGreeting: esperado=${tc.expect.isGreeting}, obtido=${result.isGreeting}`);
  }

  if (ok) {
    console.log(`  ✅ ${tc.name}`);
    passed++;
  } else {
    console.log(`  ❌ ${tc.name}`);
    checks.forEach(c => console.log(`     └─ ${c}`));
    console.log(`     └─ Resultado completo:`, JSON.stringify(result));
    failed++;
  }
}

console.log('─'.repeat(60));
console.log(`\n  Total: ${testCases.length} | Passou: ${passed} | Falhou: ${failed}\n`);

if (failed > 0) {
  console.log('❌ PoC FALHOU — revise a lógica do parser antes de embutir no n8n.\n');
  process.exit(1);
} else {
  console.log('✅ PoC APROVADA — lógica do parser validada. Pronto para o n8n.\n');
  process.exit(0);
}
