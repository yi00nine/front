###### 环境配置的难题

软件开发最大的难题就是环境配置,需要软件正常的运行就需要对系统进行设置,以及各种库和组件的安装,因此有人想到能不能从根本上解决问题,让软件带上环境一起安装

###### 虚拟机

虚拟机就是带环境安装的一个解决方案,但是有以下几种缺点

- 资源占用过多
- 冗余步骤较多
- 启动的较慢

###### Linux 容器

Linux 容器不是模拟一个完善的操作系统,而是对进程进行隔离

- 启动快
- 资源占用少
- 体积小

###### Docker

Docker 属于是 Linux 容器的一种封装,提供一种简单易用的容器使用接口.
Docker 将应用程序和该程序的依赖打包到一个文件里面,运行文件就会产生一个虚拟容器

- container:容器是机器上的一个沙盒进程,与主机的上的所有进程进行隔离,总的来说
  - container 是一个可以运行的镜像实例
  - 可以在本地机器,虚拟机上运行或者部署到云端
  - 是方便移植的
  - 与其他容器隔离,运行自己的软件,二进制文件和配置
- image:运行容器的时候,它使用一个隔离的文件系统,这个自定义的文件系统由容器镜像提供,镜像需要包含应用程序所需要的一切依赖

###### 用 docker 打包一个前端镜像

- 创建一个 Dockerfile 文件

  ```
  # FROM node:16.20.1
  FROM nginx:1.21.1-alpine
  COPY dist/ /usr/share/nginx/html/
  COPY nginx.conf /etc/nginx/conf.d/default.conf

  ```

- 创建 nginx 配置文件

  ```
  server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
  }
  ```

- 打包镜像 `docker build -t docker-demo .`
- 最后在运行起来就好了 `docker run -p 3000:3000  docker-demo`

###### 卷挂载

- 每个容器的启动都是从镜像定义开始的,容器可以创建更新,删除文件,但是删除容器的时候,这些变化就会丢失,Docker 会将所有的变化隔离到这个容器里面,通过卷可以改变这个事情
- 假设程序的数据存储在容器的 /`etc/demo/demo.db` 目录下,如果你可以在主机持久化这个 todo.db 文件,并对下一个容器进行使用,就可以实现状态的保留.可以通过创建一个卷 ` docker volumn create demo-db`,并将它挂载到存储数据的目录,Docker 完全管理这个卷,包括在磁盘中的位置,我们只需要记住卷的名字,最后运行并且挂载卷 `docker run -dp 3000:3000 --mount type=volumn,src=demo-db,target=/etc/demo docker-demo`

###### 绑定挂载 bind mount

- 允许你从主机的文件系统共享一个目录到容器中,可以使用绑定挂载挂载源代码到容器中
- `docker run -it --mount type=bind,src="${pwd}",target=/src docker-demo bash` 将主机目录和容器中的 src 目录挂载到一起,可以用绑定挂载进行本地开发