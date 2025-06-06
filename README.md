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

1. **Compile a aplicação**
```bash
npm run build
```

2. **Copie para o servidor**
```bash
# Copie os arquivos compilados
sudo cp -r dist/* /var/www/html/ips/
sudo cp -r server /var/www/html/ips/
sudo cp package*.json /var/www/html/ips/

# Instale dependências de produção
cd /var/www/html/ips
sudo npm install --production
```

3. **Configure o PM2** (recomendado)
```bash
# Instale o PM2 globalmente
npm install -g pm2

# Inicie a aplicação
pm2 start server/index.js --name ip-manager

# Configure para iniciar automaticamente
pm2 startup
pm2 save
```

## ⚙️ Configuração

### Nginx

Crie o arquivo `/etc/nginx/sites-available/ip-manager`:

```nginx
server {
    listen 80;
    server_name 172.16.0.254;

    # Aplicação IP Manager
    location /ips/ {
        alias /var/www/html/ips/;
        try_files $uri $uri/ /ips/index.html;
        
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
        }
    }

    # Outras aplicações (ex: Snipe-IT)
    location / {
        proxy_pass http://172.16.0.245:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative a configuração:
```bash
sudo ln -s /etc/nginx/sites-available/ip-manager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Variáveis de Ambiente

Crie um arquivo `.env` (opcional):
```env
PORT=3001
JWT_SECRET=seu-jwt-secret-super-seguro
NODE_ENV=production
```

## 📖 Uso

### Primeiro Acesso

1. **Acesse a aplicação**: `http://172.16.0.254/ips`
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

## 🔧 Manutenção

### Backup

```bash
# Backup diário dos dados
#!/bin/bash
DATE=$(date +%Y%m%d)
cp -r /var/www/html/ips/data /backup/ip-manager-$DATE
```

### Monitoramento

```bash
# Verificar status da aplicação
pm2 status ip-manager

# Ver logs
pm2 logs ip-manager

# Reiniciar se necessário
pm2 restart ip-manager
```

### Atualizações

1. Pare a aplicação
2. Faça backup dos dados
3. Atualize o código
4. Reinstale dependências
5. Reinicie a aplicação

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