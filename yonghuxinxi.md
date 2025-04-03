---
title: Health777
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# Health777

Base URLs:

# Authentication

# 用户 APP - 用户个人中心

<a id="opIdupdateUser"></a>

## PUT 修改基本信息

PUT /app-api/member/user/update

> Body 请求参数

```json
{
  "nickname": "李四",
  "avatar": "https://www.iocoder.cn/x.png",
  "sex": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenant-id|header|integer(int32)| 否 |租户编号|
|Authorization|header|string| 否 |认证 Token|
|body|body|[AppMemberUserUpdateReqVO](#schemaappmemberuserupdatereqvo)| 否 |none|

> 返回示例

> 200 Response

```
{"code":0,"data":true,"msg":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[CommonResultBoolean](#schemacommonresultboolean)|

<a id="opIdupdateUserPassword"></a>

## PUT 修改用户密码

PUT /app-api/member/user/update-password

用户修改密码时使用

> Body 请求参数

```json
{
  "password": "buzhidao",
  "code": "1024"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenant-id|header|integer(int32)| 否 |租户编号|
|Authorization|header|string| 否 |认证 Token|
|body|body|[AppMemberUserUpdatePasswordReqVO](#schemaappmemberuserupdatepasswordreqvo)| 否 |none|

> 返回示例

> 200 Response

```
{"code":0,"data":true,"msg":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[CommonResultBoolean](#schemacommonresultboolean)|

<a id="opIdupdateUserMobile"></a>

## PUT 修改用户手机

PUT /app-api/member/user/update-mobile

> Body 请求参数

```json
{
  "code": "1024",
  "mobile": "15823654487",
  "oldCode": "1024"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenant-id|header|integer(int32)| 否 |租户编号|
|Authorization|header|string| 否 |认证 Token|
|body|body|[AppMemberUserUpdateMobileReqVO](#schemaappmemberuserupdatemobilereqvo)| 否 |none|

> 返回示例

> 200 Response

```
{"code":0,"data":true,"msg":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[CommonResultBoolean](#schemacommonresultboolean)|

<a id="opIdresetUserPassword"></a>

## PUT 重置密码

PUT /app-api/member/user/reset-password

用户忘记密码时使用

> Body 请求参数

```json
{
  "password": "buzhidao",
  "code": "1024",
  "mobile": "15878962356"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenant-id|header|integer(int32)| 否 |租户编号|
|Authorization|header|string| 否 |认证 Token|
|body|body|[AppMemberUserResetPasswordReqVO](#schemaappmemberuserresetpasswordreqvo)| 否 |none|

> 返回示例

> 200 Response

```
{"code":0,"data":true,"msg":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[CommonResultBoolean](#schemacommonresultboolean)|

<a id="opIdgetUserInfo"></a>

## GET 获得基本信息

GET /app-api/member/user/get

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|tenant-id|header|integer(int32)| 否 |租户编号|
|Authorization|header|string| 否 |认证 Token|

> 返回示例

> 200 Response

```
{"code":0,"data":{"id":1,"nickname":"芋艿","avatar":"https://www.iocoder.cn/xxx.png","mobile":"15601691300","sex":1,"point":10,"experience":1024,"level":{"id":1,"name":"芋艿","level":1,"icon":"https://www.iocoder.cn/yudao.jpg"},"brokerageEnabled":true},"msg":"string"}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[CommonResultAppMemberUserInfoRespVO](#schemacommonresultappmemberuserinforespvo)|

# 数据模型

<h2 id="tocS_AppMemberUserUpdateReqVO">AppMemberUserUpdateReqVO</h2>

<a id="schemaappmemberuserupdatereqvo"></a>
<a id="schema_AppMemberUserUpdateReqVO"></a>
<a id="tocSappmemberuserupdatereqvo"></a>
<a id="tocsappmemberuserupdatereqvo"></a>

```json
{
  "nickname": "李四",
  "avatar": "https://www.iocoder.cn/x.png",
  "sex": 1
}

```

用户 App - 会员用户更新 Request VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|nickname|string|true|none||用户昵称|
|avatar|string|true|none||头像|
|sex|integer(int32)|true|none||性别|

<h2 id="tocS_CommonResultBoolean">CommonResultBoolean</h2>

<a id="schemacommonresultboolean"></a>
<a id="schema_CommonResultBoolean"></a>
<a id="tocScommonresultboolean"></a>
<a id="tocscommonresultboolean"></a>

```json
{
  "code": 0,
  "data": true,
  "msg": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|data|boolean|false|none||none|
|msg|string|false|none||none|

<h2 id="tocS_AppMemberUserUpdatePasswordReqVO">AppMemberUserUpdatePasswordReqVO</h2>

<a id="schemaappmemberuserupdatepasswordreqvo"></a>
<a id="schema_AppMemberUserUpdatePasswordReqVO"></a>
<a id="tocSappmemberuserupdatepasswordreqvo"></a>
<a id="tocsappmemberuserupdatepasswordreqvo"></a>

```json
{
  "password": "buzhidao",
  "code": "1024"
}

```

用户 APP - 修改密码 Request VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|password|string|true|none||新密码|
|code|string|true|none||手机验证码|

<h2 id="tocS_AppMemberUserUpdateMobileReqVO">AppMemberUserUpdateMobileReqVO</h2>

<a id="schemaappmemberuserupdatemobilereqvo"></a>
<a id="schema_AppMemberUserUpdateMobileReqVO"></a>
<a id="tocSappmemberuserupdatemobilereqvo"></a>
<a id="tocsappmemberuserupdatemobilereqvo"></a>

```json
{
  "code": "1024",
  "mobile": "15823654487",
  "oldCode": "1024"
}

```

用户 APP - 修改手机 Request VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|string|true|none||手机验证码|
|mobile|string|true|none||手机号|
|oldCode|string|false|none||原手机验证码|

<h2 id="tocS_AppMemberUserResetPasswordReqVO">AppMemberUserResetPasswordReqVO</h2>

<a id="schemaappmemberuserresetpasswordreqvo"></a>
<a id="schema_AppMemberUserResetPasswordReqVO"></a>
<a id="tocSappmemberuserresetpasswordreqvo"></a>
<a id="tocsappmemberuserresetpasswordreqvo"></a>

```json
{
  "password": "buzhidao",
  "code": "1024",
  "mobile": "15878962356"
}

```

用户 APP - 重置密码 Request VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|password|string|true|none||新密码|
|code|string|true|none||手机验证码|
|mobile|string|true|none||手机号|

<h2 id="tocS_AppMemberUserInfoRespVO">AppMemberUserInfoRespVO</h2>

<a id="schemaappmemberuserinforespvo"></a>
<a id="schema_AppMemberUserInfoRespVO"></a>
<a id="tocSappmemberuserinforespvo"></a>
<a id="tocsappmemberuserinforespvo"></a>

```json
{
  "id": 1,
  "nickname": "芋艿",
  "avatar": "https://www.iocoder.cn/xxx.png",
  "mobile": "15601691300",
  "sex": 1,
  "point": 10,
  "experience": 1024,
  "level": {
    "id": 1,
    "name": "芋艿",
    "level": 1,
    "icon": "https://www.iocoder.cn/yudao.jpg"
  },
  "brokerageEnabled": true
}

```

用户 APP - 用户个人信息 Response VO

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|true|none||用户编号|
|nickname|string|true|none||用户昵称|
|avatar|string|true|none||用户头像|
|mobile|string|true|none||用户手机号|
|sex|integer(int32)|true|none||用户性别|
|point|integer(int32)|true|none||积分|
|experience|integer(int32)|true|none||经验值|
|level|[Level](#schemalevel)|false|none||用户 App - 会员等级|
|brokerageEnabled|boolean|true|none||是否成为推广员|

<h2 id="tocS_Level">Level</h2>

<a id="schemalevel"></a>
<a id="schema_Level"></a>
<a id="tocSlevel"></a>
<a id="tocslevel"></a>

```json
{
  "id": 1,
  "name": "芋艿",
  "level": 1,
  "icon": "https://www.iocoder.cn/yudao.jpg"
}

```

用户 App - 会员等级

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|integer(int64)|true|none||等级编号|
|name|string|true|none||等级名称|
|level|integer(int32)|true|none||等级|
|icon|string|false|none||等级图标|

<h2 id="tocS_CommonResultAppMemberUserInfoRespVO">CommonResultAppMemberUserInfoRespVO</h2>

<a id="schemacommonresultappmemberuserinforespvo"></a>
<a id="schema_CommonResultAppMemberUserInfoRespVO"></a>
<a id="tocScommonresultappmemberuserinforespvo"></a>
<a id="tocscommonresultappmemberuserinforespvo"></a>

```json
{
  "code": 0,
  "data": {
    "id": 1,
    "nickname": "芋艿",
    "avatar": "https://www.iocoder.cn/xxx.png",
    "mobile": "15601691300",
    "sex": 1,
    "point": 10,
    "experience": 1024,
    "level": {
      "id": 1,
      "name": "芋艿",
      "level": 1,
      "icon": "https://www.iocoder.cn/yudao.jpg"
    },
    "brokerageEnabled": true
  },
  "msg": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer(int32)|false|none||none|
|data|[AppMemberUserInfoRespVO](#schemaappmemberuserinforespvo)|false|none||用户 APP - 用户个人信息 Response VO|
|msg|string|false|none||none|

