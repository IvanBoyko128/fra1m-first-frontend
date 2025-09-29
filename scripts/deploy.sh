#!/bin/bash

# 🚀 Quick Deploy Script for fra1m Courses
# Usage: ./scripts/deploy.sh [server_ip] [username]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SERVER_IP=${1:-"144.124.225.70"}
USERNAME=${2:-"root"}
APP_DIR="/var/www/fra1m-courses"

echo -e "${BLUE}🚀 Starting deployment to ${SERVER_IP}${NC}"

# Check if SSH key exists
if [ ! -f ~/.ssh/id_rsa ]; then
    echo -e "${RED}❌ SSH key not found at ~/.ssh/id_rsa${NC}"
    echo -e "${YELLOW}💡 Generate SSH key: ssh-keygen -t rsa -b 4096${NC}"
    exit 1
fi

# Build the application
echo -e "${YELLOW}📦 Building application...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed${NC}"

# Test SSH connection
echo -e "${YELLOW}🔐 Testing SSH connection...${NC}"
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes ${USERNAME}@${SERVER_IP} exit; then
    echo -e "${RED}❌ SSH connection failed${NC}"
    echo -e "${YELLOW}💡 Make sure:${NC}"
    echo -e "   - SSH key is added to server: ssh-copy-id ${USERNAME}@${SERVER_IP}"
    echo -e "   - Server is accessible: ping ${SERVER_IP}"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection successful${NC}"

# Create app directory on server
echo -e "${YELLOW}📁 Setting up server directory...${NC}"
ssh ${USERNAME}@${SERVER_IP} "
    sudo mkdir -p ${APP_DIR}
    sudo chown -R \$(whoami):\$(whoami) ${APP_DIR}
"

# Copy files to server
echo -e "${YELLOW}📤 Copying files to server...${NC}"
scp -r dist/ ${USERNAME}@${SERVER_IP}:${APP_DIR}/
scp docker-compose.yml ${USERNAME}@${SERVER_IP}:${APP_DIR}/
scp Dockerfile ${USERNAME}@${SERVER_IP}:${APP_DIR}/
scp .dockerignore ${USERNAME}@${SERVER_IP}:${APP_DIR}/

# Deploy on server
echo -e "${YELLOW}🐳 Deploying on server...${NC}"
ssh ${USERNAME}@${SERVER_IP} "
    cd ${APP_DIR}
    
    # Stop existing containers
    docker-compose down || true
    
    # Build and start new containers
    docker-compose build --no-cache
    docker-compose up -d
    
    # Wait for startup
    sleep 10
    
    # Check status
    docker-compose ps
    
    # Test application
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e '${GREEN}✅ Application is running!${NC}'
    else
        echo -e '${RED}❌ Application health check failed${NC}'
        docker-compose logs --tail=20
        exit 1
    fi
"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Application is available at: http://${SERVER_IP}:3000${NC}"
echo -e "${YELLOW}📊 To check logs: ssh ${USERNAME}@${SERVER_IP} 'cd ${APP_DIR} && docker-compose logs -f'${NC}"
