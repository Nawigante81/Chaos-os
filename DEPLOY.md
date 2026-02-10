# Deploy (PM2)

This project runs as a Next.js production server via PM2.

## On the server

```bash
cd /home/ubuntu/kreator-wymowek
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

## One-command deploy

```bash
bash scripts/deploy.sh
```

## Auto-start on reboot

Run once:

```bash
pm2 startup
```

Then follow the printed instructions, and finally:

```bash
pm2 save
```
