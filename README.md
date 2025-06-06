# IP Management System

A professional web-based IP address management system designed for enterprise networks. This application provides comprehensive tools for managing IP allocations, tracking network resources, and maintaining network documentation.

## Features

### 🔐 Authentication & Security
- Secure user authentication with JWT tokens
- Role-based access control
- Password hashing with bcrypt
- Rate limiting and security headers

### 📊 IP Management
- Multiple subnet support with CIDR notation
- IP status tracking (Available, Occupied, Reserved, DHCP)
- Category-based organization with color coding
- Comprehensive device information storage
- MAC address tracking and hostname management

### 🎨 User Interface
- Modern, responsive design optimized for all devices
- Dark/light theme support with system preference detection
- Professional dashboard with statistical overview
- Advanced filtering and search capabilities
- Export functionality (JSON/CSV formats)

### 🔧 Technical Features
- File-based storage (no database required)
- RESTful API with Express.js backend
- React frontend with TypeScript
- Tailwind CSS for consistent styling
- Nginx-ready configuration for deployment

## Installation & Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Nginx (for production deployment)

### Development Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start development servers:**
```bash
npm run dev
```

This will start both the backend API server (port 3001) and the frontend development server with Vite.

### Production Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Copy files to web server:**
```bash
# Copy built files to your web server
cp -r dist/* /var/www/html/ips/
cp -r server /var/www/html/ips/
cp package*.json /var/www/html/ips/
```

3. **Install production dependencies:**
```bash
cd /var/www/html/ips
npm install --production
```

4. **Start the backend server:**
```bash
# Using PM2 (recommended)
pm2 start server/index.js --name ip-manager

# Or using node directly
node server/index.js
```

### Nginx Configuration

Create an Nginx configuration to serve the application at `/ips`:

```nginx
server {
    listen 80;
    server_name 172.16.0.254;

    # IP Manager Application
    location /ips/ {
        alias /var/www/html/ips/;
        try_files $uri $uri/ /ips/index.html;
        
        # Handle API requests
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

    # Snipe-IT Application (port 8080)
    location / {
        proxy_pass http://172.16.0.245:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Usage

### First Login
- **URL:** `http://172.16.0.254/ips`
- **Default Credentials:** 
  - Email: `admin@company.com`
  - Password: `admin123`

### Managing IP Addresses

1. **Adding IPs:** Click the "Add IP" button to create new entries
2. **Editing:** Click the edit icon on any IP card to modify details
3. **Filtering:** Use the filter bar to search by status, category, or text
4. **Exporting:** Export your data in JSON or CSV format

### Data Storage

All data is stored in JSON files in the `/data` directory:
- `users.json` - User account information
- `ips.json` - IP address database

### Security Considerations

- Change default admin credentials immediately
- Use HTTPS in production environments
- Implement firewall rules to restrict access
- Regular backup of data files
- Monitor access logs

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Create new user (admin only)

### IP Management
- `GET /api/ips` - List all IPs
- `POST /api/ips` - Create new IP entry
- `PUT /api/ips/:id` - Update IP entry
- `DELETE /api/ips/:id` - Delete IP entry

### Data Export
- `GET /api/export/json` - Export as JSON
- `GET /api/export/csv` - Export as CSV

## System Requirements

### Minimum Requirements
- **RAM:** 512MB
- **Storage:** 1GB free space
- **CPU:** 1 vCPU

### Recommended for Production
- **RAM:** 2GB+
- **Storage:** 5GB+ free space
- **CPU:** 2+ vCPUs
- **Network:** Gigabit ethernet

## Support & Maintenance

### Backup Strategy
```bash
# Backup data files
cp -r /var/www/html/ips/data /backup/ip-manager-$(date +%Y%m%d)
```

### Log Monitoring
- Application logs: PM2 logs or console output
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`

### Updates
1. Stop the application
2. Backup data files
3. Deploy new version
4. Restart services

## License

This project is designed for internal enterprise use. Modify and distribute according to your organization's policies.