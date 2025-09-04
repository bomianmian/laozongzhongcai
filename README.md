# 劳动仲裁证据文档生成工具 - Docker部署指南

## 服务器准备
1. 确保服务器已安装Docker和docker-compose
   ```bash
   docker --version
   docker-compose --version
   ```
2. 如未安装，请先安装：
   ```bash
   # 安装Docker
   curl -fsSL https://get.docker.com | sh
   # 安装docker-compose
   sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

## 部署步骤

1. 将项目代码上传到服务器
   ```bash
   git clone [您的仓库地址]
   cd [项目目录]
   ```

2. 构建Docker镜像
   ```bash
   docker-compose build
   ```

3. 启动服务
   ```bash
   docker-compose up -d
   ```

4. 查看运行状态
   ```bash
   docker-compose ps
   ```

5. 停止服务
   ```bash
   docker-compose down
   ```

## 访问应用
应用将在以下地址运行：
```
http://您的服务器IP:3000
```

## 配置说明

### 端口修改
如需修改端口，编辑`docker-compose.yml`文件：
```yaml
ports:
  - "新端口:80"
```

### 环境变量
可在`.env`文件中添加环境变量：
```
NODE_ENV=production
```

## 常见问题

### 端口冲突
如果端口已被占用，请修改`docker-compose.yml`中的端口映射

### 构建失败
1. 检查网络连接
2. 确保服务器资源充足
3. 查看详细错误日志：
   ```bash
   docker-compose logs
   ```

### 应用无法访问
1. 检查服务器防火墙设置
2. 确认容器正在运行：
   ```bash
   docker ps
   ```
3. 查看应用日志：
   ```bash
   docker-compose logs app
   ```
