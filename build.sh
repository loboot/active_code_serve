#!/bin/bash

set -e


# 构建步骤
pnpm install
pnpm build

# 清理并创建部署目录
rm -rf ActiveCodeDeploy/dist/* ActiveCodeDeploy/views/*
mkdir -p ActiveCodeDeploy/dist ActiveCodeDeploy/views

# 复制文件
cp .env ActiveCodeDeploy/.env
cp ./pm2.conf.json ActiveCodeDeploy/
cp ./package.json ActiveCodeDeploy/
cp ./README.md ActiveCodeDeploy/
cp -r ./views/* ActiveCodeDeploy/views/
cp -r ./dist/* ActiveCodeDeploy/dist/

# 数据库迁移
echo "执行数据库迁移..."
# 这里可以添加 TypeORM 迁移命令

echo "部署完成"
