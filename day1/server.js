const express = require("express")
const cors = require("cors")
const app = express();
app.use(cors());

// SSE接口
app.get('/stream', (req, res) => {
    // 设置sse必须的响应头
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // res.write('event:msg\ndata:测试自定义事件\n\n')
    // // 每隔500ms推送一段文字，模拟大模型逐字输出
    // let count = 0;
    // const timer = setInterval(() => {
    //     count++;
    //     // 标准sse格式 data:内容 + 两个换行
    //     res.write(`data: 流式输出第${count}条消息\n\n`);
    //     // 推送10条后结束流
    //     if (count >= 10) {
    //         res.write(`data: [DONE]\n\n`);
    //         clearInterval(timer);
    //         res.end();
    //     }
    // }, 500);



    // 模拟AI逐段输出文字
    const textArr = ['前', '端', '遇', '到', 'AI', '冲', '击', '要', '学', 'RAG'];
    let i = 0;
    const timer = setInterval(() => {
        if (i >= textArr.length) {
            res.write(`data: [DONE]\n\n`);
            clearInterval(timer);
            res.end();
            return;
        }
        // 构造大模型标准分片JSON
        const chunk = {
            choices: [{ delta: { content: textArr[i] }, index: 0 }]
        };
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        i++;
    }, 300);

    // 前端关闭页面时销毁定时器，防止内存泄漏
    req.on('close', () => {
        clearInterval(timer);
    });
})

app.listen(3000, () => {
    console.log('sse服务启动：http://localhost:3000');
})