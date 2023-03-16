<a name="readme-top"></a>

# Gentle Rain

[![release][release-shield]][release-url]
[![watchers][watchers-shield]][watchers-url]
[![forks][forks-shield]][forks-url]
[![stars][stars-shield]][stars-url]

## Introduction

Gentle Rain is a lightweight website traffic statistics tool for personal websites built on the Cloudflare Workers platform, with the advantages of easy to use, quick to apply, secure and controllable data, zero or low cost, and more, helping webmasters easily grasp website traffic data.

The main functions of Gentle Rain include two parts: one is the statistical service that needs to be deployed on the Cloudflare Worker platform, which is implemented by worker.js; the other is the JavaScript component that needs to be referenced on the site, and is implemented by rain.js.

## Preparations

1. Install Node.js, it is recommended to use the LTS version, e.g: Node.js version 18.12.1, npm version 8.19.2.

   ```bash
   $ node -v
   $ npm -v
   ```

2. Install the Wrangler CLI, it is recommended to use version 2.0 or above, e.g: 2.6.2.

   ```bash
   $ npm install -g wrangler
   $ wrangler version
   ```
   
3. Fork this project and clone it to your local machine.

   ```bash
   $ git clone https://github.com/YOUR_GITHUB_USERNAME/gentle-rain.git
   ```

## Usage

The following is mainly an introduction to the two parts of local debugging and online usage.

### Local Debugging

After you have completed the above preparations, you are ready to start local debugging.

1. Edit the `whitelistUrls`, `counterUrl` and `pageLinkSelector` variables in `src/config.js` to enable the development environment.

   ```javascript
   // Develop environment configuration
   const whitelistUrls = 'http://localhost:8080,http://127.0.0.1:8080';
   
   // Develop environment configuration
   const counterUrl = 'http://127.0.0.1:8787/count';
   
   // Develop environment configuration
   const pageLinkSelector = 'article > div.title > a';
   ```

2. Build the new `rain.min.js` file with webpack.

   ```bash
   $ cd gentle-rain
   $ npm install webpack webpack-cli --save-dev
   $ npx webpack --config webpack.config.js
   # or
   $ npm run build
   ```

3. Start the wrangler local server, the default listening port is 8787.

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

4. Start the local web server, the default listening port is 8080.

   ```bash
   $ cd gentle-rain
   $ npm run server
   # Or
   $ node src/server.js
   Server running at http://127.0.0.1:8080/
   ```

5. Open a browser, visit http://127.0.0.1:8080/ and experience the display effect of Gentle Rain on several sample pages.

### Online Usage

Online usage is mainly divided into two parts, one is the publishing of statistics services, and the other is the deployment of Gentle Rain's JS components to the target website. Among them, there are two ways to release the statistics service, automatic release and manual release, and automatic release is preferred.

#### Automatic Release(Recommend)

The automatic release process is based on GitHub Workflows, and is triggered by committing code to the main branch, which can greatly reduce publishing time. Before triggering automatic publishing, some configuration information needs to be changed.

1. Set up a secret in the GitHub code repository.

   1. Log in to Cloudflare, go to `My Profile`, select `API Tokens` from the left menu, and create a new Token.
   2. After obtaining the token, go to the GitHub repository page. Click `Settings`, select `Secrets and variables` from the left menu, select `Actions`, create a new secret, and name the secret `CF_API_TOKEN`.

2. Edit the `whitelistUrls` variable in `src/config.js` and change it to the correct site address. If there is more than one, separate them with ",".

   ```javascript
   /* Part 1, this config for worker.js */
   // The urls that allow access the counter service
   
   // Production environment configuration, eg: https://www.crudman.cn
   const whitelistUrls = 'https://www.crudman.cn';
   ```

3. Modify the `wrangler.toml` file, including the `account_id`, `zone_id`, `route`, and `id` attributes of kv_namespaces.

   ```toml
   # Replace With Your Account ID
   account_id = "8232125ce8ea42c46f11e2ded2a8e422"
   
   # Replace With Your Zone ID
   zone_id = "3b45eda9555aecf6c720d5538c8393fa"
   # Replace With Your Route Rule, Default is ”*“
   route = "crudman.cn/*"
   # Replace With Your KV Namespace ID
   kv_namespaces = [
       { binding = "VIEWS", id = "66a0161821d84473a12bb45904177b08" }
   ]
   ```
   
4. After you have made the above changes, commit the code to trigger the automatic publishing process.
5. After the release is successful, go to the Cloudflare Workers page, click to enter the just-released `gentle-rain-production`, and click the preview address to verify, usually in the format https://SERVICE_NAME.YOUR_SUBDOMAIN.workers.dev/. Of course, if you have activated your own domain name on Cloudflare, you can also use it by adding a custom domain name, such as https://pv.crudman.cn/.

#### Manual Release

As with the automatic release process, some configuration information must be modified prior to manual publishing, and the steps are the same as above. Once the configuration changes are complete, the manual release process can proceed.

1. First, log in to your Cloudflare account for OAuth authorization. Running the following command will open an authorization page in your default browser, click `Allow`.

   ```bash
   $ wrangler login
    ⛅️ wrangler 2.6.2 (update available 2.12.0)
   --------------------------------------------
   Attempting to login via OAuth...
   Opening a link in your default browser: https://dash.cloudflare.com/oauth2/auth?......
   ```

3. Publish Gentle Rain to the production environment. Since the production environment information is configured in the `wrangler.toml` file, environment variables must be specified when publishing.

   ```bash
   $ wrangler publish --env production
   ```

4. After the above commands are executed, the manual publishing process is completed.

#### Using On Website

After the statistics service is published, in order to use the service in the website, it is also necessary to reference the corresponding JS component in the website page. Before referencing, you should first modify some configuration information to generate correct JS files.

1. Edit the `counterUrl` and `pageLinkSelector` variables in `src/config.js` and configure them according to your actual situation.

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

2. Build the new `rain.min.js` file with webpack.

   ```bash
   $ cd gentle-rain
   $ npm install webpack webpack-cli --save-dev
   $ npx webpack --config webpack.config.js
   # or
   $ npm run build
   ```

3. Introduce the rain.min.js script into the page.

   ```html
   <script src="[YOUR_PATH]/rain.min.js" crossorigin="anonymous"></script>
   ```

4. Insert the following HTML tags into the page, when the page is reloaded, the statistical values will be automatically filled in the `<span>` tag.

   ```html
   <span class="site_pv"></span>
   <span class="page_pv"></span>
   ```

## API

Gentle Rain currently provides an interface for the statistics of the website traffic.

### /count

| Method | Content Type     | Charset |
| ------ | ---------------- | ------- |
| PUT    | application/json | UTF-8   |

Request parameter definition:

| Name      | Type   | Description                                                  |
| --------- | ------ | ------------------------------------------------------------ |
| countType | String | Statistic type:<br/>10，Statistics site page view<br/>11，Statistics site and page view |
| urls      | Array  | Page url list                                                |

Request message example:

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

Response parameter definition:

| Name             | Type   | Description     |
| ---------------- | ------ | --------------- |
| code             | String | Return code     |
| message          | String | Return message  |
| data             | Object | Return data     |
| &#09;sitePV      | Number | Site page views |
| &#09;pages       | Array  | Page list       |
| &#09;&#09;url    | String | Page url        |
| &#09;&#09;pagePV | Number | Page views      |

Response message example:

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

## License

[![MIT][license-shield]][license-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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