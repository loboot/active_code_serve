# 激活码服务

## 部署步骤

1. 运行 `build.sh` 脚本
2. 上传 `ActiveCodeDeploy` 目录到服务器
3. 新建数据库 `activeCode`,导入sql
4. 修改 `ActiveCodeDeploy/.env` 文件
5. 安装依赖 `pnpm install`
6. 运行 `pnpm start` 启动服务
7. 运行 `pm2 logs` 查看日志
