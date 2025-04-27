function main(item) {
    const id = item.id || 'fhzw';
    const n = {
        'fhzw': 'cn',  // 凤凰中文 
        'fhzx': 'info', // 凤凰资讯 
        'fhhk': 'hk'   // 凤凰香港 
    };
    const token = "id=cn&prefix";
    const targetUrl = `http://tv.groupshare.com.cn/fhtv?id=${n[id]}&token=${token}`;
    return JSON.stringify({
        url: targetUrl 
    });
}