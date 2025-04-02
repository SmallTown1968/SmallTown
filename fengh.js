function main(item) {
    const id = item.id;

    const channelMap = {
        'fhzw': 'f7f48462-9b13-485b-8101-7b54716411ec',
        'fhzx': '7c96b084-60e1-40a9-89c5-682b994fb680',
        'fhhk': '15e02d92-1698-416c-af2f-3e9a872b4d78'
    };

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiIzMWUzZmVjMC1lY2IzLTExZWQtOWUxNS1mM2FiZjliZjhkOTYiLCJuYW1lIjoiIiwidmlwIjowLCJqdGkiOiJqQm5nMXBvZlQiLCJpYXQiOjE2ODM0NDg5ODksImV4cCI6MTY4NjA0MDk4OX0.0r8PuLetMiusCJul2tuPRzU8fnhxhqxBoycDV0_vKxI";
    const headers = {
        'User-Agent': 'okhttp/3.14.9',
        'token': token
    };

    let apiUrl = `https://api.fengshows.cn/hub/live/auth-url?live_qa=fhd&live_id=${channelMap[id]}`;
    let res = ku9.request(apiUrl, "GET", headers);
    
    if (!res.body.includes('http')) {
        apiUrl = `https://api.fengshows.cn/hub/live/auth-url?live_qa=hd&live_id=${channelMap[id]}`;
        res = ku9.request(apiUrl, "GET", headers);
    }

    const json = JSON.parse(res.body);
    return JSON.stringify({
        url: json.data.live_url,
        headers: { referer: 'https://api.fengshows.cn/' }
    });
}