const http = require('http')
const fs = require('fs')
const path = require('path')
const temp = require('art-template')
const urls = require('url')
const server = http.createServer()

server.listen(9876,() => {
    console.log('服务已启动...')
})

server.on('request',(req,res) => {

    const urlobj = urls.parse(req.url,true)
    // parse()的作用： 用来处理url地址的
        // 参数1：要处理的url地址
        // 参数2：true  --- 将url地址中的数据转为对象；   false（默认） --  将url中的数据转为字符串

    // ! urlobj包含两部分  ：  pathname --- 保存的是url中的地址部分   query --- 保存的是url中的数据部分

    // !封装一个公共的读取文件的方法
    res.sendfile = function(path){
        fs.readFile(path,(err,data) => {
            res.end(data)
        })
    }
    // ? 自定义一个假数据
    var datas = {
        list: [
            {name : '凤女',content : '只要998', time : '2019年6月8日19:35:32'},
            {name : '凤女',content : '只要998', time : '2019年6月8日19:35:32'},
            {name : '凤女',content : '只要998', time : '2019年6月8日19:35:32'},
            {name : '凤女',content : '只要998', time : '2019年6月8日19:35:32'},
            {name : '凤女',content : '只要998', time : '2019年6月8日19:35:32'}
        ] 
    }

    if(urlobj.pathname === '/' || urlobj.pathname === '/index'){
        const result = temp(path.join(__dirname,'view','index.html'),datas)
        res.end(result)
    }else if(urlobj.pathname.startsWith('/public')){
        // url获取的是端口号之后的地址  --- /public/css/index.css
        // 例如： http://127.0.0.1:9876/public/css/index.css?name=zs&age=18
        res.sendfile(path.join(__dirname,urlobj.pathname))
    }else if(urlobj.pathname === '/post'){
        const result = temp(path.join(__dirname,'view','post.html'),datas)
        res.end(result)
    }else if(urlobj.pathname === '/addpost'){
        // ?post表单提交
        // 1.HTML页面一定要有form表单
        //     ①表单中一定要有action属性和method属性
        //     ②表单中要有表单元素，input一定要有name属性和属性值
        //     ③一定要有submit提交按钮
        // 2.node服务器上要接收数据
        // var str = ''
        // req.on('data',(chunk) => {
        //     str += chunk
        // })
        // req.on('end',() => {
        //     console.log(str)
        // })


        // ! get接收数据
        // console.log(32123)
        // console.log(urlobj.query)
        var times = new Date()
        urlobj.query.time = times.toLocaleDateString()
        // return
        datas.list.push(urlobj.query)
        res.end(temp(path.join(__dirname,'view','index.html'),datas))
    }
})