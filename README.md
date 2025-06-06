# 🌐 Sistema de Gerenciamento de IPs

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18+-green.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)

**Um sistema web profissional de gerenciamento de endereços IP para redes corporativas**

[Demonstração](#demonstração) • [Instalação](#instalação) • [Documentação](#documentação) • [Contribuição](#contribuição)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Demonstração](#demonstração)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Suporte](#suporte)

## 🎯 Sobre o Projeto

O Sistema de Gerenciamento de IPs é uma aplicação web moderna e profissional projetada para facilitar o gerenciamento de endereços IP em redes corporativas. Desenvolvido com foco na simplicidade, segurança e eficiência, oferece uma interface intuitiva para administradores de rede controlarem e documentarem seus recursos de rede.

### 🎨 Características Principais

- **Interface Moderna**: Design responsivo com suporte a tema claro/escuro
- **Sem Banco de Dados**: Armazenamento baseado em arquivos JSON para máxima simplicidade
- **Segurança Robusta**: Autenticação JWT com controle de acesso baseado em funções
- **Multiplataforma**: Compatível com desktop e dispositivos móveis
- **Fácil Implantação**: Configuração simples com Nginx e Node.js

## ✨ Funcionalidades

### 🔐 Autenticação e Segurança
- ✅ Autenticação segura com tokens JWT
- ✅ Controle de acesso baseado em funções (Admin/Usuário)
- ✅ Hash de senhas com bcrypt
- ✅ Limitação de taxa e cabeçalhos de segurança
- ✅ Proteção contra ataques comuns

### 📊 Gerenciamento de IPs
- ✅ Suporte a múltiplas sub-redes com notação CIDR
- ✅ Status de IP: Disponível, Ocupado, Reservado, DHCP
- ✅ Categorização com cores: Servidores, Estações, Impressoras, Câmeras, etc.
- ✅ Informações detalhadas: Hostname, MAC Address, Responsável
- ✅ Sistema de observações e notas
- ✅ Histórico de alterações com timestamps

### 🎨 Interface do Usuário
- ✅ Design responsivo para todos os dispositivos
- ✅ Tema escuro/claro com detecção automática
- ✅ Dashboard com estatísticas em tempo real
- ✅ Filtros avançados e busca inteligente
- ✅ Exportação em JSON e CSV
- ✅ Animações e micro-interações

### 🔧 Recursos Técnicos
- ✅ API RESTful completa
- ✅ Armazenamento em arquivos JSON
- ✅ Configuração pronta para Nginx
- ✅ Logs detalhados e monitoramento
- ✅ Backup automático de dados

## 🛠 Tecnologias

### Frontend
- **React 18.3.1** - Biblioteca para interfaces de usuário
- **TypeScript 5.5.3** - Tipagem estática para JavaScript
- **Tailwind CSS 3.4.1** - Framework CSS utilitário
- **Lucide React** - Ícones modernos e consistentes
- **Vite 5.4.2** - Build tool e dev server

### Backend
- **Node.js 18+** - Runtime JavaScript
- **Express.js 4.18.2** - Framework web minimalista
- **JWT** - Autenticação baseada em tokens
- **bcrypt** - Hash seguro de senhas
- **Helmet** - Cabeçalhos de segurança

### Ferramentas
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Concurrently** - Execução paralela de scripts

## 🖼 Demonstração

### Dashboard Principal
![Dashboard](https://via.placeholder.com/800x400/1f2937/ffffff?text=Dashboard+Principal)

### Gerenciamento de IPs
![IP Management](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Gerenciamento+de+IPs)

### Tema Escuro
![Dark Theme](https://via.placeholder.com/800x400/111827/ffffff?text=Tema+Escuro)

## 🚀 Instalação

### Pré-requisitos

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Nginx** (para produção)

### Desenvolvimento

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/ip-management-system.git
cd ip-management-system
```

2. **Instale as dependências**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173/ips
```

### Produção

#### 1. Preparação do Ambiente

```bash
# Crie o diretório da aplicação
sudo mkdir -p /var/www/html/ips
sudo chown -R $USER:$USER /var/www/html/ips
```

#### 2. Build e Deploy

```bash
# No diretório do projeto, compile a aplicação
npm run build

# Copie todos os arquivos necessários
sudo cp -r dist/* /var/www/html/ips/
sudo cp -r server /var/www/html/ips/
sudo cp -r data /var/www/html/ips/
sudo cp package*.json /var/www/html/ips/

# Ajuste as permissões
sudo chown -R www-data:www-data /var/www/html/ips
sudo chmod -R 755 /var/www/html/ips
sudo chmod -R 775 /var/www/html/ips/data
```

#### 3. Instalar Dependências de Produção

```bash
cd /var/www/html/ips
sudo npm install --production --omit=dev
```

#### 4. Configurar PM2

```bash
# Instale o PM2 globalmente (se não estiver instalado)
sudo npm install -g pm2

# Crie arquivo de configuração do PM2
sudo tee /var/www/html/ips/ecosystem.config.js > /dev/null << 'EOF'
module.exports = {
  apps: [{
    name: 'ip-manager',
    script: './server/index.js',
    cwd: '/var/www/html/ips',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/pm2/ip-manager-error.log',
    out_file: '/var/log/pm2/ip-manager-out.log',
    log_file: '/var/log/pm2/ip-manager.log'
  }]
};
EOF

# Crie diretório de logs
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Inicie a aplicação
cd /var/www/html/ips
pm2 start ecosystem.config.js

# Configure para iniciar automaticamente
pm2 startup
pm2 save
```

#### 5. Verificar Status

```bash
# Verificar se a aplicação está rodando
pm2 status

# Verificar logs
pm2 logs ip-manager

# Testar API
curl http://localhost:3001/api/health
```

## ⚙️ Configuração

### Nginx

Crie o arquivo `/etc/nginx/sites-available/ip-manager`:

```nginx
server {
    listen 80;
    server_name 172.16.0.245;

    # Logs
    access_log /var/log/nginx/ip-manager-access.log;
    error_log /var/log/nginx/ip-manager-error.log;

    # Aplicação IP Manager
    location /ips/ {
        alias /var/www/html/ips/;
        index index.html;
        try_files $uri $uri/ /ips/index.html;
        
        # Cache para arquivos estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API Proxy
    location /ips/api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Outras aplicações podem ser adicionadas aqui
    # Exemplo para Snipe-IT em outro servidor:
    # location / {
    #     proxy_pass http://outro-servidor:8080;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    # }
}
```

Ative a configuração:
```bash
sudo ln -s /etc/nginx/sites-available/ip-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Variáveis de Ambiente

Crie um arquivo `.env` em `/var/www/html/ips/` (opcional):
```env
PORT=3001
JWT_SECRET=seu-jwt-secret-super-seguro-mude-isso-em-producao
NODE_ENV=production
```

### Firewall (UFW)

```bash
# Permitir tráfego HTTP
sudo ufw allow 80/tcp

# Permitir apenas conexões locais na porta da API
sudo ufw allow from 127.0.0.1 to any port 3001
```

## 📖 Uso

### Primeiro Acesso

1. **Acesse a aplicação**: `http://172.16.0.245/ips`
2. **Credenciais padrão**:
   - Email: `admin@company.com`
   - Senha: `admin123`
3. **⚠️ Importante**: Altere a senha padrão imediatamente!

### Gerenciando IPs

#### Adicionar Novo IP
1. Clique em **"Adicionar IP"**
2. Preencha as informações obrigatórias:
   - Endereço IP
   - Sub-rede (CIDR)
   - Status
3. Adicione informações opcionais:
   - Categoria
   - Hostname
   - MAC Address
   - Responsável
   - Observações

#### Filtrar e Buscar
- **Busca por texto**: IP, hostname ou descrição
- **Filtro por status**: Disponível, Ocupado, Reservado, DHCP
- **Filtro por categoria**: Servidores, Estações, Impressoras, etc.

#### Exportar Dados
- **JSON**: Formato estruturado para backup
- **CSV**: Compatível com Excel e outras ferramentas

### Gerenciando Usuários

Apenas administradores podem:
- Criar novos usuários
- Definir permissões
- Gerenciar contas

## 📡 API

### Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "admin123"
}
```

#### Registrar Usuário (Admin)
```http
POST /api/auth/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@company.com",
  "password": "senha123"
}
```

### Gerenciamento de IPs

#### Listar IPs
```http
GET /api/ips
Authorization: Bearer <token>
```

#### Criar IP
```http
POST /api/ips
Authorization: Bearer <token>
Content-Type: application/json

{
  "ip": "192.168.1.10",
  "subnet": "192.168.1.0/24",
  "status": "available",
  "category": "servers",
  "hostname": "server-01",
  "description": "Servidor web principal"
}
```

#### Atualizar IP
```http
PUT /api/ips/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "occupied",
  "assignedTo": "João Silva"
}
```

#### Deletar IP
```http
DELETE /api/ips/:id
Authorization: Bearer <token>
```

### Exportação

#### Exportar JSON
```http
GET /api/export/json
Authorization: Bearer <token>
```

#### Exportar CSV
```http
GET /api/export/csv
Authorization: Bearer <token>
```

## 🔧 Manutenção

### Comandos Úteis

```bash
# Verificar status da aplicação
pm2 status ip-manager

# Ver logs em tempo real
pm2 logs ip-manager --lines 100

# Reiniciar aplicação
pm2 restart ip-manager

# Parar aplicação
pm2 stop ip-manager

# Verificar uso de recursos
pm2 monit

# Recarregar configuração
pm2 reload ip-manager
```

### Backup

```bash
# Script de backup diário
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/ip-manager"
DATA_DIR="/var/www/html/ips/data"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup dos dados
tar -czf $BACKUP_DIR/ip-manager-data-$DATE.tar.gz -C $DATA_DIR .

# Manter apenas os últimos 30 backups
find $BACKUP_DIR -name "ip-manager-data-*.tar.gz" -mtime +30 -delete

echo "Backup concluído: ip-manager-data-$DATE.tar.gz"
```

### Monitoramento

```bash
# Verificar se a aplicação está respondendo
curl -f http://localhost:3001/api/health > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "API não está respondendo!"
    pm2 restart ip-manager
fi

# Verificar uso de memória
pm2 show ip-manager | grep memory

# Verificar logs de erro
tail -f /var/log/pm2/ip-manager-error.log
```

### Atualizações

```bash
# 1. Parar a aplicação
pm2 stop ip-manager

# 2. Backup dos dados
cp -r /var/www/html/ips/data /backup/ip-manager-data-$(date +%Y%m%d)

# 3. Atualizar código (substitua pelos novos arquivos)
# ... copie os novos arquivos ...

# 4. Reinstalar dependências
cd /var/www/html/ips
npm install --production

# 5. Reiniciar aplicação
pm2 start ip-manager
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Aplicação não inicia
```bash
# Verificar logs
pm2 logs ip-manager

# Verificar se a porta está em uso
netstat -tlnp | grep 3001

# Verificar permissões
ls -la /var/www/html/ips/
```

#### 2. Erro 502 Bad Gateway
```bash
# Verificar se o backend está rodando
curl http://localhost:3001/api/health

# Verificar configuração do Nginx
sudo nginx -t

# Verificar logs do Nginx
tail -f /var/log/nginx/error.log
```

#### 3. Problemas de permissão
```bash
# Corrigir permissões
sudo chown -R www-data:www-data /var/www/html/ips
sudo chmod -R 755 /var/www/html/ips
sudo chmod -R 775 /var/www/html/ips/data
```

#### 4. Dados não salvam
```bash
# Verificar se o diretório data existe e tem permissões
ls -la /var/www/html/ips/data/

# Verificar logs da aplicação
pm2 logs ip-manager | grep -i error
```

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Siga estes passos:

1. **Fork o projeto**
2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. **Commit suas mudanças**
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. **Push para a branch**
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. **Abra um Pull Request**

### Diretrizes

- Siga os padrões de código existentes
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos

### Reportar Bugs

Use as [Issues do GitHub](https://github.com/seu-usuario/ip-management-system/issues) para reportar bugs:

- Descreva o problema claramente
- Inclua passos para reproduzir
- Adicione screenshots se relevante
- Especifique o ambiente (OS, browser, versão)

## 📊 Roadmap

- [ ] **v2.0**: Suporte a VLAN
- [ ] **v2.1**: Integração com DHCP servers
- [ ] **v2.2**: Relatórios avançados
- [ ] **v2.3**: API para integração externa
- [ ] **v2.4**: Notificações por email
- [ ] **v2.5**: Auditoria completa

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

### Documentação
- [Wiki do Projeto](https://github.com/seu-usuario/ip-management-system/wiki)
- [FAQ](https://github.com/seu-usuario/ip-management-system/wiki/FAQ)

### Comunidade
- [Discussions](https://github.com/seu-usuario/ip-management-system/discussions)
- [Issues](https://github.com/seu-usuario/ip-management-system/issues)

### Contato
- **Email**: suporte@empresa.com
- **Slack**: #ip-manager

---

<div align="center">

**Desenvolvido com ❤️ para facilitar o gerenciamento de redes corporativas**

[⬆ Voltar ao topo](#-sistema-de-gerenciamento-de-ips)

</div>