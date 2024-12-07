#!/bin/bash

set -e

pnpm build

rm -rf ActiveCodeDeploy/dist/*  ActiveCodeDeploy/views/*

mkdir -p ActiveCodeDeploy/dist  ActiveCodeDeploy/views

cp ./pm2.conf.json ActiveCodeDeploy/pm2.conf.json
cp ./package.json ActiveCodeDeploy/package.json
cp ./.env ActiveCodeDeploy/.env

cp -r ./views/* ActiveCodeDeploy/views
cp -r ./dist/* ActiveCodeDeploy/dist

echo "打包完成"
