/**
 * 相关配置信息放在此处
 */

/* Part 1, this config for worker.js */
// The urls that allow access the counter service

// Production environment configuration
const whitelistUrls = 'https://www.crudman.cn';

// Develop environment configuration
// const whitelistUrls = 'http://localhost:1313,http://127.0.0.1:1313,http://localhost:8080,http://127.0.0.1:8080';

/* Part 2, this config for rain.js */
// Counter service url, eg: https://gentle-rain-production.YOUR_SUBDOMAIN.workers.dev/count
// Or a custom domain, eg: https://pv.crudman.cn/count

// Production environment configuration
const counterUrl = 'https://pv.crudman.cn/count';

// Develop environment configuration
// const counterUrl = 'http://127.0.0.1:8787/count';

// The <a> tag list selector, aim to get page url list

// Production environment configuration
const pageLinkSelector = 'article > div > h1 > a';

// Develop environment configuration
// const pageLinkSelector = 'article > div.title > a';

/* Part 3, export the parameters */
export {whitelistUrls, counterUrl, pageLinkSelector}