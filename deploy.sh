#!/bin/bash

# Script de Deploy para IP Management System
# Uso: ./deploy.sh

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do IP Management System..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_DIR="/var/www/ips"
DEPLOY_DIR="/var/www/html/ips"
BACKUP_DIR="/backup/ip-manager"
DATE=$(date +%Y%m%d_%H%M%S)

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "package.json não encontrado. Execute este script no diretório do projeto."
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js não está instalado. Instale Node.js 18+ primeiro."
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    error "npm não está instalado."
fi

log "Verificando dependências..."

# Instalar dependências se node_modules não existir
if [ ! -d "node_modules" ]; then
    log "Instalando dependências..."
    npm install
else
    log "Dependências já instaladas."
fi

# Verificar se vite está disponível
if ! npx vite --version &> /dev/null; then
    error "Vite não está disponível. Reinstalando dependências..."
    rm -rf node_modules package-lock.json
    npm install
fi

log "Compilando aplicação..."

# Build da aplicação
npm run build

if [ ! -d "dist" ]; then
    error "Build falhou. Diretório 'dist' não foi criado."
fi

log "Build concluído com sucesso!"

# Criar backup se o deploy já existir
if [ -d "$DEPLOY_DIR" ]; then
    log "Criando backup do deploy atual..."
    sudo mkdir -p "$BACKUP_DIR"
    sudo tar -czf "$BACKUP_DIR/ip-manager-backup-$DATE.tar.gz" -C "$DEPLOY_DIR" . 2>/dev/null || warning "Falha ao criar backup"
fi

log "Preparando diretório de deploy..."

# Criar diretório de deploy
sudo mkdir -p "$DEPLOY_DIR"
sudo chown -R $USER:$USER "$DEPLOY_DIR"

log "Copiando arquivos..."

# Copiar arquivos compilados
cp -r dist/* "$DEPLOY_DIR/"

# Copiar arquivos do servidor
cp -r server "$DEPLOY_DIR/"

# Copiar arquivos de configuração
cp package*.json "$DEPLOY_DIR/"

# Copiar arquivo de configuração do PM2
cp ecosystem.config.cjs "$DEPLOY_DIR/"

# Criar diretório de dados se não existir
if [ ! -d "$DEPLOY_DIR/data" ]; then
    mkdir -p "$DEPLOY_DIR/data"
    # Copiar dados iniciais se existirem
    if [ -d "data" ]; then
        cp -r data/* "$DEPLOY_DIR/data/"
    fi
fi

log "Ajustando permissões..."

# Ajustar permissões
sudo chown -R www-data:www-data "$DEPLOY_DIR"
sudo chmod -R 755 "$DEPLOY_DIR"
sudo chmod -R 775 "$DEPLOY_DIR/data"

log "Instalando dependências de produção..."

# Instalar dependências de produção
cd "$DEPLOY_DIR"
sudo -u www-data npm ci --omit=dev --silent

log "Configurando PM2..."

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    log "Instalando PM2..."
    sudo npm install -g pm2
fi

# Criar diretório de logs
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Parar aplicação se estiver rodando
if pm2 list | grep -q "ip-manager"; then
    log "Parando aplicação atual..."
    pm2 stop ip-manager 2>/dev/null || true
    pm2 delete ip-manager 2>/dev/null || true
fi

log "Iniciando aplicação..."

# Iniciar aplicação
pm2 start ecosystem.config.cjs

# Configurar para iniciar automaticamente
pm2 startup --silent 2>/dev/null || true
pm2 save --silent

log "Verificando status da aplicação..."

# Aguardar alguns segundos para a aplicação iniciar
sleep 5

# Verificar se a aplicação está rodando
if pm2 list | grep -q "online.*ip-manager"; then
    log "✅ Aplicação iniciada com sucesso!"
else
    error "❌ Falha ao iniciar a aplicação. Verifique os logs: pm2 logs ip-manager"
fi

# Testar API
log "Testando API..."
if curl -f http://localhost:3001/api/health &> /dev/null; then
    log "✅ API respondendo corretamente!"
else
    warning "⚠️  API não está respondendo. Verifique os logs."
fi

log "🎉 Deploy concluído com sucesso!"
echo ""
info "📋 Próximos passos:"
info "   1. Configure o Nginx se ainda não foi feito"
info "   2. Acesse: http://seu-servidor/ips"
info "   3. Login padrão: admin@company.com / admin123"
info "   4. Altere a senha padrão imediatamente!"
echo ""
info "📊 Comandos úteis:"
info "   pm2 status          - Ver status da aplicação"
info "   pm2 logs ip-manager - Ver logs"
info "   pm2 restart ip-manager - Reiniciar aplicação"
echo ""