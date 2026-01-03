function main(item) {
    // 凤凰卫视
    // 从URL参数获取频道ID，默认为中文台
    const id = item.id || ku9.getQuery(item.url, "id") || 'fhzw';
    
    const channelMap = {
        'fhzx': '7c96b084-60e1-40a9-89c5-682b994fb680',  //资讯
        'fhzw': 'f7f48462-9b13-485b-8101-7b54716411ec',  //中文
        'fhhk': '15e02d92-1698-416c-af2f-3e9a872b4d78'   //香港
    };
    
    const liveId = channelMap[id];
    if (!liveId) return { url: '频道ID不存在' };
    
    // 构建API请求URL
    const apiUrl = `https://m.fengshows.com/api/v3/hub/live/auth-url?stream_type=flv&live_id=${liveId}&live_qa=HD`;
    
    // 设置请求头
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.fengshows.com/',
        'Origin': 'https://www.fengshows.com',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
    };
    
    try {
        // 发送API请求获取认证URL
        const response = ku9.request(apiUrl, "GET", headers, null, true);
        
        if (response.code !== 200 || !response.body) {
            return { url: '获取认证URL失败' };
        }
        
        // 解析JSON响应
        const data = JSON.parse(response.body);
        
        if (!data || !data.data || !data.data.live_url) {
            return { url: 'API返回数据格式错误' };
        }
        
        // 获取认证后的直播URL
        const liveUrl = data.data.live_url;
        
        // 发送GET请求获取最终的FLV地址（处理重定向）
        const finalResponse = ku9.request(liveUrl, "GET", headers, null, true);
        
        // 检查是否是重定向
        if (finalResponse.headers && finalResponse.headers.Location) {
            return { url: finalResponse.headers.Location };
        }
        
        // 如果不是重定向，返回原始URL
        return { url: liveUrl };
        
    } catch (error) {
        console.log("获取凤凰卫视直播地址失败: " + error);
        return { url: '处理过程中出现错误' };
    }
}