# Gentle Rain

网站流量统计API定义

路径：/count

方法：PUT

内容类型：application/json

字符编码：UTF-8

请求参数定义：

| 字段名称  | 字段类型 | 字段描述                                                     |
| --------- | -------- | ------------------------------------------------------------ |
| countType | String   | 统计类型：<br>10，统计site，不统计page<br>11，统计site，统计page<br>01，不统计site，统计page<br>00，不统计site，不统计page |
| urls      | Array    | 页面URL数组                                                  |

请求报文示例：

```json
{
    "countType": "10"
    "urls": [
        "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-1/",
        "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-2/",
        "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-3/"
    ]
}
```

应答参数定义：

| 字段名称       | 字段类型 | 字段描述     |
| -------------- | -------- | ------------ |
| code           | String   | 返回码       |
| message        | String   | 返回消息     |
| data           | Object   | 返回数据     |
| /---sitePV     | Number   | 站点PV       |
| /---siteUV     | Number   | 站点UV       |
| /---pages      | Array    | 页面浏览数据 |
| /---/---url    | String   | 页面URL      |
| /---/---pagePV | Number   | 页面PV       |
| /---/---pageUV | Number   | 页面UV       |

应答报文示例：

```json
{
    "code": "200",
    "message": "OK",
    "data": {
        "sitePV": 3453,
        "siteUV": 234,
        "pages": [
            {
                "url": "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-1/",
                "pagePV": 123,
		        "pageUV": 34
            },
            {
                "url": "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-2/",
                "pagePV": 123,
		        "pageUV": 34
            },
            {
                "url": "https://www.crudman.cn/posts/xxxx-xxxx-xxxx-3/",
                "pagePV": 123,
		        "pageUV": 34
            }
        ]
    }
}
```

