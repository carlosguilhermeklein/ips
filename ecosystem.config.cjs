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
    log_file: '/var/log/pm2/ip-manager.log',
    time: true
  }]
};