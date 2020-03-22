// 引用依赖
var express = require('express');
var proxy = require('http-proxy-middleware');
var mock = require('mockjs').mock;

// proxy 中间件的选择项
var options = {
  target: 'https://hour.shaoyixiaoshi.cn', // 目标服务器 host
  changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL
  ws: true, // 是否代理websockets
  // pathRewrite: {
  //   '^/api/old-path': '/api/new-path', // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
  //   '^/api/remove/path': '/path' // 同上
  // },
  // router: {
  //   // 如果请求主机 == 'dev.localhost:3000',
  //   // 重写目标服务器 'http://www.example.org' 为 'http://localhost:8000'
  //   'dev.localhost:3000': 'http://localhost:8000'
  // }
};

// 创建代理
// var exampleProxy = proxy(options);

// 使用代理
var app = express();

// app.use((req,res,next)=>{
//   setTimeout(()=>{
//     next();
//   },1000);  
// })

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  next();
})



app.post("/getUserTask", (_, res) => {
  res.send(mock({
    "status": true,
    "data|10": [{
      "status|1": [0, 1, 2, 3, 4],
      "id|+1": 1,
      "title": "@ctitle",
      "price": "@integer(0,1000)",
      "content": "@cparagraph(10)",

    }],
    total: "@integer(30,2000)"
  }));
});
app.post("/task/getTaskByStatus", (_, res) => {
  res.send(mock({
    "status": true,
    "data|10": [{
      "status|1": [0, 1, 2, 3, 4],
      "id|+1": 1,
      "title": "@ctitle",
      "price": "@integer(0,1000)",
      "content": "@cparagraph(10)",

    }],
    total: "@integer(30,2000)"
  }));
});
app.post("/sendsms", (_, res) => {
  res.send({
    "status": true,
    "message": "发送成功"
  });
});


app.post("/login", (_, res) => {
  res.send({
    "status": true,
    "message": "登陆成功",
    "sessionkey": "sessionkey",
    "admin": false
  });
});

app.post("/task/putTask", (_, res) => {
  res.send({
    "status": true,
    "taskid": "",
    "message": "发布成功，等待管理员审核"
  });
});

app.post("/task/getSendTasks", (_, res) => {
  res.send({
    "status": true,
    "data": [{
      "id": "taskid",
      "status": 1,
      "title": "",
      "content": ""
    }]
  });
});

app.post("/task/getTaskById", (_, res) => {
  res.send(mock({
    "status": true,
    "data": {
      "title": "@ctitle",
      "status": "@integer(0,4)",
      price:"@integer(3,20)",
      "content": "@cparagraph"
    }
  }));
});

app.post("/getcash", (_, res) => {
  res.send({
    "sessionkey": "",
    "fee": 52.4
  })
})

app.post("/receiveTask", (_, res) => {
  res.send({
    "status": true,
    "message": "接单成功"
  })
})


app.post("/wxlogin", (_, res) => {
  res.send({
    "status": true,
    "sessionkey": "",
    "hasphonenum": false
  })
})

app.post('/payTask', (_, res) => {
  res.send({
    "status": true,
    "wxdata": {
      "timeStamp": "1557818968759",
      "package": "prepay_id=wx14152928725959d03d01cfa72839770060",
      "paySign": "A2824366A539ADF48D6BC5BCA28E6678",
      "appId": "wxa29ce004daf82d48",
      "signType": "MD5",
      "nonceStr": "d2e24dc8ebde45b3895761658c68243b"
    }
  });
})

app.post('/cancelTask', (_, res) => {
  res.send({
    "status": true,
    "message": "取消成功"
  });
})


app.post('/get_cos_credentials', (_, res) => {
  res.send({
    "status": true,
    "data": {
      "credentials": {
        "tmpSecretId": "AKIDV7Ht5GMyFZrUlHPu1SDXhRTQKqfDYqMz5NMkwDOEc_-4z6Lvuq3ippsMK2kEzzV3",
        "tmpSecretKey": "vMt63Pq6bJMUMWcTN4sgB/K6C3o8cfAvgJ1Lwfztgek=",
        "sessionToken": "y2QE4Z95PUl7SI3TwrKhKGY1laztb76ef0e74b0bd1a3dd6aed7d14c06458d3865x-_ao8k10UidUh40OXFfhFc0SymiEhL7juuKvgd0UHsLPyS9KcFpKFhi6t36_ypzBYttWNj166RIkz3_LsJPPS4mHyrS_YFWVAV3PFEEyr8rTI2qpPa-eHz0FgYLJFkHx-Sm4eYrUjmGBTmAEnj7AHWoIK71UK5Su12V9ZHiB9nxVOqVPZ4piq2rNC6Gtekw1tBmg-j-r6IfW9j_MMlG3gna3KeXkpWuCPij7DnS9I"
      },
      "requestId": "0ae29ed6-ad34-4759-9751-66d00e4fa066",
      "expiration": "2020-03-20T06:59:01Z",
      "startTime": 1584687421,
      "expiredTime": 1584687541
    }
  })
})

app.post('/verifySession', (_, res) => {
  res.send({
    status: true,
    phonenum: '3248927197',
    admin: true
  })
})

app.post('/admin/getAdminList', (_, res) => {
  res.send({
    "status": true,
    "data": [{
        "username": "abc"
      },
      {
        "username": "def"
      }
    ]
  })
})

app.post('/getBalance', (_, res) => {
  res.send(mock({
    "balance": "@float(1,200)",
    "status": true
  }))
})
// app.use('*', exampleProxy);
app.listen(5000);