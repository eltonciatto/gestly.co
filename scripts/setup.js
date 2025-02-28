#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green : 
                type === 'warning' ? colors.yellow : 
                type === 'error' ? colors.red : '';
  console.log(`${color}${message}${colors.reset}`);
}

function validateEnvVariables(envPath) {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'SUPER_ADMIN_NAME',
    'SUPER_ADMIN_EMAIL',
    'SUPER_ADMIN_PASSWORD'
  ];

  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = [];

  requiredVars.forEach(variable => {
    if (!envContent.includes(`${variable}=`)) {
      missingVars.push(variable);
    }
  });

  return missingVars;
}

async function setup() {
  try {
    log('🚀 Iniciando setup do Gestly...', 'info');

    // Verificar .env
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');

    if (!fs.existsSync(envPath)) {
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        log('✨ Arquivo .env criado a partir do .env.example', 'success');
      } else {
        throw new Error('Arquivo .env.example não encontrado');
      }
    }

    // Validar variáveis de ambiente
    const missingVars = validateEnvVariables(envPath);
    if (missingVars.length > 0) {
      log('⚠️  Variáveis de ambiente obrigatórias não encontradas:', 'warning');
      missingVars.forEach(variable => {
        log(`   - ${variable}`, 'warning');
      });
      throw new Error('Configure as variáveis de ambiente faltantes no arquivo .env');
    }

    // Instalar dependências
    log('📦 Instalando dependências...', 'info');
    execSync('npm install', { stdio: 'inherit' });

    // Inicializar Supabase (se necessário)
    if (fs.existsSync(path.join(process.cwd(), 'supabase'))) {
      log('🔄 Aplicando migrations do Supabase...', 'info');
      execSync('npx supabase db reset', { stdio: 'inherit' });
    }

    log('\n✅ Setup concluído com sucesso!', 'success');
    log('\nPróximos passos:', 'info');
    log('1. Inicie o servidor de desenvolvimento: npm run dev', 'info');
    log('2. Acesse o sistema com as credenciais do super admin', 'info');
    log('3. Configure os dados iniciais do seu negócio', 'info');

  } catch (error) {
    log(`\n❌ Erro durante o setup: ${error.message}`, 'error');
    process.exit(1);
  }
}

setup();