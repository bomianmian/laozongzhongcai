# 劳动仲裁证据文档生成工具

## Netlify部署指南

### 准备工作
1. 注册并登录Netlify账号: https://app.netlify.com
2. 将项目推送到GitHub仓库

### 部署步骤
1. 在Netlify中点击"New site from Git"
2. 选择您的GitHub仓库
3. 构建设置:
   - 构建命令: `pnpm build`
   - 发布目录: `dist`
4. 点击"Deploy site"开始部署

### 本地开发
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 本地构建
```bash
pnpm build
```

构建后的文件将在`dist`目录中。