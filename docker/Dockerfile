# FROM node:16.20.1
# FROM nginx:1.21.1-alpine
# COPY dist/ /usr/share/nginx/html/
# COPY nginx.conf /etc/nginx/conf.d/default.conf


# 第一阶段：构建应用程序
FROM node:14 as builder

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用程序源代码
COPY . .

# 构建应用程序
RUN npm run build

# 第二阶段：生成最终镜像
FROM nginx:alpine

# 将第一阶段中构建的应用程序复制到最终镜像中
COPY --from=builder /app/dist /usr/share/nginx/html

# 可选：添加自定义的nginx配置文件
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx服务
CMD ["nginx", "-g", "daemon off;"]