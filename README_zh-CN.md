<a name="readme-top"></a>

# Gentle Rain

[![release][release-shield]][release-url]
[![watchers][watchers-shield]][watchers-url]
[![forks][forks-shield]][forks-url]
[![stars][stars-shield]][stars-url]

## 简介

Gentle Rain是一款基于Cloudflare Workers平台构建的、面向个人站点的轻量级网站流量统计工具，具有使用简单、接入快捷、数据安全可控、零成本或低成本等优势，帮助站长轻松掌握站点流量数据。

Gentle Rain主要功能包括两部分：一部分是需要部署到Cloudflare Worker平台的统计服务，由worker.js实现；另一部分是需要在站点引用的JavaScript组件，由rain.js实现。

## 准备

1. 安装Node.js，推荐使用LTS版本，例如：Node.js版本18.12.1，npm版本8.19.2。

   ```bash
   $ node -v
   $ npm -v
   ```
   
2. 安装Wrangler命令行界面，推荐使用2.0以上版本，例如：2.6.2。

   ```bash
   $ npm install -g wrangler
   $ wrangler version
   ```
   
3. Fork本项目，并Clone至本地。

   ```bash
   $ git clone https://github.com/YOUR_GITHUB_USERNAME/gentle-rain.git
   ```

## 使用

下面主要从本地调试和线上使用两块进行介绍。

### 本地调试

完成上述准备工作之后，就可以开始进行本地调试。

1. 修改`src/config.js`中的`whitelistUrls`，`counterUrl`和`pageLinkSelector`变量，启用开发环境。

   ```javascript
   // Develop environment configuration
   const whitelistUrls = 'http://localhost:8080,http://127.0.0.1:8080';
   
   // Develop environment configuration
   const counterUrl = 'http://127.0.0.1:8787/count';
   
   // Develop environment configuration
   const pageLinkSelector = 'article > div.title > a';
   ```

2. 使用webpack构建新的`rain.min.js`文件。

   ```bash
   $ cd gentle-rain
   $ npm install webpack webpack-cli --save-dev
   $ npx webpack --config webpack.config.js
   # or
   $ npm run build
   ```

3. 启动Wrangler本地服务器，默认监听端口是8787。

   ```bash
   $ cd gentle-rain
   $ wrangler dev --local
    ⛅️ wrangler 2.6.2 (update available 2.12.0)
   --------------------------------------------
   Your worker has access to the following bindings:
   - KV Namespaces:
     - VIEWS: c33224aa7d85416c8579bf5d8b95c2f7
   ⎔ Starting a local server...
   ```

4. 启动本地WEB服务器，默认监听端口是8080。

   ```bash
   $ cd gentle-rain
   $ npm run server
   # Or
   $ node src/server.js
   Server running at http://127.0.0.1:8080/
   ```

5. 打开浏览器，访问http://127.0.0.1:8080/，体验Gentle Rain在不同示例页面的展示效果。

### 线上接入

线上接入主要分为两部分，一是统计服务的发布，二是在目标站点引入Gentle Rain的JS组件。其中，统计服务的发布有两种方式，自动发布和手动发布，优先推荐使用自动发布。

#### 自动发布（推荐）

自动发布流程基于GitHub Workflows构建，通过提交代码到主干分支进行触发，可以极大的节省发布时间。在触发自动发布之前，需要修改部分配置信息。

1. 在GitHub代码仓库中设置Secret。

   1. 登录Cloudflare，进入My Profile，左侧菜单选择API Tokens，创建新的Token。
   2. 获得Token后，进入GitHub仓库页面。点击Settings，左侧菜单选择Secrets and variables，然后选择Actions，创建新的仓库Secret，Secret Name命名为`CF_API_TOKEN`。

2. 修改`src/config.js`中的`whitelistUrls`变量，改成正确的站点地址，如有多个，以”,“分隔。

   ```javascript
   /* Part 1, this config for worker.js */
   // The urls that allow access the counter service
   
   // Production environment configuration, eg: https://www.crudman.cn
   const whitelistUrls = 'https://www.crudman.cn';
   ```

3. 修改`wrangler.toml`文件，包括account_id，zone_id，route和kv_namespaces的id属性。

   ```toml
   # Cloudflare账号的Account ID
   account_id = "8232125ce8ea42c46f11e2ded2a8e422"
   
   # Cloudflare账号的Zone ID
   zone_id = "3b45eda9555aecf6c720d5538c8393fa"
   # 路由规则，默认为”*“
   route = "crudman.cn/*"
   # Workers KV Namespace ID
   kv_namespaces = [
       { binding = "VIEWS", id = "66a0161821d84473a12bb45904177b08" }
   ]
   ```
   
4. 完成上述修改后，提交代码即可触发自动发布流程。
5. 发布成功后，进入Cloudflare Workers后台，点击进入刚刚发布的gentle-rain-production，点击预览地址进行验证，通常格式为https://SERVICE_NAME.YOUR_SUBDOMAIN.workers.dev/。当然，如果你在Cloudflare上激活了自己的域名，也可以通过添加自定义域名的方式来使用，例如https://pv.crudman.cn/。

#### 手动发布

同自动发布流程一样，在手动发布之前，也需要修改部分配置信息，步骤同上。完成配置修改后，即可进行手动发布流程。

1. 首先登录Cloudflare账号进行OAuth授权。执行以下命令，会在默认浏览器打开一个授权页面，点击允许。

   ```bash
   $ wrangler login
    ⛅️ wrangler 2.6.2 (update available 2.12.0)
   --------------------------------------------
   Attempting to login via OAuth...
   Opening a link in your default browser: https://dash.cloudflare.com/oauth2/auth?......
   ```

3. 发布Gentle Rain到生产环境，由于在`wrangler.toml`文件中配置了生产环境信息，发布时需指定环境变量。

   ```bash
   $ wrangler publish --env production
   ```

4. 上述命令执行完后，即完成手动发布流程。

#### 网站接入

统计服务发布完之后，为了在网站中使用该服务，还需要在网站页面中引用对应的JS组件。在引用之前，首先修改部分配置信息，以生成正确的JS文件。

1. 修改`src/config.js`中的`counterUrl`和`pageLinkSelector`，按照你的实际情况进行配置。

   ```javascript
   /* Part 2, this config for rain.js */
   // Counter service url, eg: https://SERVICE_NAME.YOUR_SUBDOMAIN.workers.dev/count
   // Or a custom domain, eg: https://pv.crudman.cn/count
   
   // Production environment configuration
   const counterUrl = 'https://pv.crudman.cn/count';
   
   // The <a> tag list selector, aim to get page url list
   
   // Production environment configuration
   const pageLinkSelector = 'article > div > h1 > a';
   ```

2. 使用webpack构建新的`rain.min.js`文件。

   ```bash
   $ cd gentle-rain
   $ npm install webpack webpack-cli --save-dev
   $ npx webpack --config webpack.config.js
   # or
   $ npm run build
   ```

3. 在页面中引入rain.min.js脚本。

   ```html
   <script src="[YOUR_PATH]/rain.min.js" crossorigin="anonymous"></script>
   ```

4. 在页面中插入以下HTML标签，当页面刷新时，会在`<span>`标签内自动填充统计数值。

   ```html
   <span class="site_pv"></span>
   <span class="page_pv"></span>
   ```

## API

Gentle Rain目前对外提供一个接口，用于网站流量统计。

### /count

| 方法 | 内容类型         | 字符编码 |
| ---- | ---------------- | -------- |
| PUT  | application/json | UTF-8    |

请求参数定义：

| 参数名称  | 参数类型 | 参数描述                                                     |
| --------- | -------- | ------------------------------------------------------------ |
| countType | String   | 统计类型：<br/>10，统计site，不统计page<br/>11，统计site，统计page |
| urls      | Array    | 页面URL数组                                                  |

请求报文示例：

```json
{
    "countType": "10",
    "urls": [
        "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-1/",
        "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-2/",
        "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-3/"
    ]
}
```

应答参数定义：

| 参数名称         | 参数类型 | 参数描述     |
| ---------------- | -------- | ------------ |
| code             | String   | 返回码       |
| message          | String   | 返回消息     |
| data             | Object   | 返回数据     |
| &#09;sitePV      | Number   | 站点PV       |
| &#09;pages       | Array    | 页面浏览数据 |
| &#09;&#09;url    | String   | 页面URL      |
| &#09;&#09;pagePV | Number   | 页面PV       |

应答报文示例：

```json
{
    "code": "200",
    "message": "OK",
    "data": {
        "sitePV": 3453,
        "pages": [
            {
                "url": "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-1/",
                "pagePV": 123,
            },
            {
                "url": "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-2/",
                "pagePV": 123,
            },
            {
                "url": "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-3/",
                "pagePV": 123,
            }
        ]
    }
}
```

## 许可证

[![MIT][license-shield]][license-url]

<p align="right">(<a href="#readme-top">回到顶部</a>)</p>

<!-- reference links -->

[release-shield]: https://img.shields.io/github/v/release/flysoloing/gentle-rain?style=flat-square
[release-url]: https://github.com/flysoloing/gentle-rain/releases

[last-commit-shield]: https://img.shields.io/github/last-commit/flysoloing/gentle-rain?style=flat-square

[contributors-shield]: https://img.shields.io/github/contributors/flysoloing/gentle-rain?style=flat-square
[contributors-url]: https://github.com/flysoloing/gentle-rain/graphs/contributors

[watchers-shield]: https://img.shields.io/github/watchers/flysoloing/gentle-rain?style=flat-square
[watchers-url]: https://github.com/flysoloing/gentle-rain/watchers

[forks-shield]: https://img.shields.io/github/forks/flysoloing/gentle-rain?style=flat-square
[forks-url]: https://github.com/flysoloing/gentle-rain/network/members

[stars-shield]: https://img.shields.io/github/stars/flysoloing/gentle-rain?style=flat-square
[stars-url]: https://github.com/flysoloing/gentle-rain/stargazers

[license-shield]: https://img.shields.io/github/license/flysoloing/gentle-rain?style=flat-square
[license-url]: https://choosealicense.com/licenses/mit/