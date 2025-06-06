# Sistema de Gerenciamento de IPs

Um sistema web profissional de gerenciamento de endereços IP projetado para redes corporativas. Esta aplicação fornece ferramentas abrangentes para gerenciar alocações de IP, rastrear recursos de rede e manter documentação de rede.

## Funcionalidades

### 🔐 Autenticação e Segurança
- Autenticação segura de usuários com tokens JWT
- Controle de acesso baseado em funções
- Hash de senhas com bcrypt
- Limitação de taxa e cabeçalhos de segurança

### 📊 Gerenciamento de IPs
- Suporte a múltiplas sub-redes com notação CIDR
- Rastreamento de status de IP (Disponível, Ocupado, Reservado, DHCP)
- Organização baseada em categorias com codificação por cores
- Armazenamento abrangente de informações de dispositivos
- Rastreamento de endereços MAC e gerenciamento de hostnames

### 🎨 Interface do Usuário
- Design moderno e responsivo otimizado para todos os dispositivos
- Suporte a tema escuro/claro com detecção de preferência do sistema
- Dashboard profissional com visão geral estatística
- Capacidades avançadas de filtragem e busca
- Funcionalidade de exportação (formatos JSON/CSV)

### 🔧 Recursos Técnicos
- Armazenamento baseado em arquivos (não requer banco de dados)
- API RESTful com backend Express.js
- Frontend React com TypeScript
- Tailwind CSS para estilização consistente
- Configuração pronta para Nginx para implantação

## Instalação e Implantação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Nginx (para implantação em produção)

### Configuração de Desenvolvimento

1. **Clone e instale as dependências:**
```bash
npm install
```

2. **Inicie os servidores de desenvolvimento:**
```bash
npm run dev
```

Isso iniciará tanto o servidor da API backend (porta 3001) quanto o servidor de desenvolvimento frontend com Vite.

### Implantação em Produção

1. **Compile a aplicação:**
```bash
npm run build
```

2. **Copie os arquivos para o servidor web:**
```bash
# Copie os arquivos compilados para seu servidor web
cp -r dist/* /var/www/html/ips/
cp -r server /var/www/html/ips/
cp package*.json /var/www/html/ips/
```

3. **Instale as dependências de produção:**
```bash
cd /var/www/html/ips
npm install --production
```

4. **Inicie o servidor backend:**
```bash
# Usando PM2 (recomendado)
pm2 start server/index.js --name ip-manager

# Ou usando node diretamente
node server/index.js
```

### Configuração do Nginx

Crie uma configuração do Nginx para servir a aplicação em `/ips`:

```nginx
server {
    listen 80;
    server_name 172.16.0.254;

    # Aplicação IP Manager
    location /ips/ {
        alias /var/www/html/ips/;
        try_files $uri $uri/ /ips/index.html;
        
        # Manipular requisições da API
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

    # Aplicação Snipe-IT (porta 8080)
    location / {
        proxy_pass http://172.16.0.245:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Uso

### Primeiro Login
- **URL:** `http://172.16.0.254/ips`
- **Credenciais Padrão:** 
  - Email: `admin@company.com`
  - Senha: `admin123`

### Gerenciando Endereços IP

1. **Adicionando IPs:** Clique no botão "Adicionar IP" para criar novas entradas
2. **Editando:** Clique no ícone de edição em qualquer cartão de IP para modificar detalhes
3. **Filtrando:** Use a barra de filtros para buscar por status, categoria ou texto
4. **Exportando:** Exporte seus dados em formato JSON ou CSV

### Armazenamento de Dados

Todos os dados são armazenados em arquivos JSON no diretório `/data`:
- `users.json` - Informações de contas de usuário
- `ips.json` - Base de dados de endereços IP

### Considerações de Segurança

- Altere as credenciais padrão do administrador imediatamente
- Use HTTPS em ambientes de produção
- Implemente regras de firewall para restringir acesso
- Backup regular dos arquivos de dados
- Monitore logs de acesso

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/register` - Criar novo usuário (apenas admin)

### Gerenciamento de IPs
- `GET /api/ips` - Listar todos os IPs
- `POST /api/ips` - Criar nova entrada de IP
- `PUT /api/ips/:id` - Atualizar entrada de IP
- `DELETE /api/ips/:id` - Deletar entrada de IP

### Exportação de Dados
- `GET /api/export/json` - Exportar como JSON
- `GET /api/export/csv` - Exportar como CSV

## Requisitos do Sistema

### Requisitos Mínimos
- **RAM:** 512MB
- **Armazenamento:** 1GB de espaço livre
- **CPU:** 1 vCPU

### Recomendado para Produção
- **RAM:** 2GB+
- **Armazenamento:** 5GB+ de espaço livre
- **CPU:** 2+ vCPUs
- **Rede:** Ethernet gigabit

## Suporte e Manutenção

### Estratégia de Backup
```bash
# Backup dos arquivos de dados
cp -r /var/www/html/ips/data /backup/ip-manager-$(date +%Y%m%d)
```

### Monitoramento de Logs
- Logs da aplicação: Logs do PM2 ou saída do console
- Logs de acesso do Nginx: `/var/log/nginx/access.log`
- Logs de erro do Nginx: `/var/log/nginx/error.log`

### Atualizações
1. Pare a aplicação
2. Faça backup dos arquivos de dados
3. Implante a nova versão
4. Reinicie os serviços

## Licença

Este projeto é projetado para uso corporativo interno. Modifique e distribua de acordo com as políticas da sua organização.