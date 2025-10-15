function main(item) {
    try {
        var id = ku9.getQuery(item.url, "id") || "608807420";
        console.log("请求咪咕频道ID: " + id);
        
        var playUrl = handleMiguMainRequest(id);
        if (!playUrl) {
            return { error: "无法获取播放地址" };
        }
        
        console.log("成功获取播放地址");
        return {
            url: playUrl,
            headers: {
                'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 13)',
                'Referer': 'https://play.miguvideo.com/'
            }
        };
        
    } catch (error) {
        console.error("咪咕源解析失败: " + error.message);
        return { error: "解析失败: " + error.message };
    }
}

function saltTable() {
    return [
        "b3bdac8bf67042f2965d92d9c1437053", "770fafdf5ba04d279a59ef1600baae98", "eee6aac1191e4e84afda27d1d6aa6b59",
        "b7fab2cdbe9c44a08c3e9eb2af93d4bb", "d2a987144aba48469e66bbbda63ba1c8", "deb34b761e704a31b65845c5f7b12886",
        "a8a868c3d290462496ebf041ff1f7bc9", "8324a239ed934d8bb88bdf031a09b9cf", "bf54dd9616fb4e6080bc985b0016921a",
        "9b8aceb24a674d00ad1e86c97bb40d00", "d3dadb4e177b40bd86d1ecd756bc1088", "c74abfa0ddf249118146f88aec97e77a",
        "d11c62e83baf4879bc089ec762df2e86", "8b7732373fa448ca89dd82cc630b92e9", "2d475c19231c4367b77d9d0d71acb0b7",
        "484d02e8aee54b2e8129c899f8a75eff", "bec179d5a34f482fb5bd4fe4cc4bbfc9", "3a9ee5d981544035bffa84ef662b6328",
        "ba5a6383024a4e198914ff64331d3519", "b40b343fe73c453399c50b06bff690c4", "e1900f69412c466fbfa4243d8cb57af5",
        "5e3bfc21c00846aa8dcc3e0cb4231c0d", "7ab8582a2efe41fc978041dbda1fbc53", "5f93c5bcd01b4d8ba870a5d524f65322",
        "efb0fa2362034750935dbe9c88e8a4d9", "5bf8a59b3b7846458d2928494f21f531", "32f25ab9dd2f4b3a9614cffaddaf2994",
        "186d0e0f31a64460bd99f09db5135a8a", "bc23a5de295e4efc8a58b0a1e331f87b", "da4523ed7163432596e6f583e5eee9bf",
        "6bba2c3e7a12401494638b8fcc3ccb32", "62c0f04c3a914ab0a237c66f00ac1c87", "3d58f0ffcfa9479ba627b56a1f966cde",
        "95f54cd474ed418da264fdc62d3f0eca", "032f69bc6bbb4183a0ca6860ff7a5b80", "2678ca342220416e9831bf21028bb3b4",
        "904aa38a9d584ae998db226b66f9150a", "534718e3ff1745979416bfd1d98860e2", "5b4fd6946f694ff79617fcb4f0d53913",
        "454a302947ef4635a14234946e850f20", "320104ad02ff487b8c83761c71b344ee", "acdcc42ae086442f99d2152d665b2cac",
        "e888d7b620854e45abbe85c1d7754921", "6298f3fec8eb4273ab6ac52c6b763dcb", "898d52af841b4a54b0cbcbc49faa1d47",
        "6678bd9767e3468eb85522435eacbce3", "53c5ef2f866a49eaa74825e70d8db3ac", "59d1cc6b9265407f954f48e5d8f1ac69",
        "f12d498fc4704b85b4759277c1f80212", "75f62d8f88134d468ffc5d15a0cf57cc", "69b949623bb047c9bdb38b6636a1daad",
        "ade7a1bf7f3d4da3bd77ee0427cf91c9", "35d54a787ef54bb3bdd1eb3fe806fa8f", "7af240a3b0d74e5190f684e5cf14b5ea",
        "0f4b448f661642aeaf20fc50ae18e132", "78a9543e97224952ada17316ed1f1e4b", "86b2007310ef4bdf9a95f84cacce79d3",
        "009da9f69d1b477eb4c8bacd479fb437", "d18bbc0e9d6a458b8181d10c64f69bf9", "2e69fb35e7e54fe3b50ae42f2c33a355",
        "2ba256cecade41ba8b0b38fb82485ba4", "a472331c09b5486fbe7642afe3d5e564", "00376402f9c642029350f4299877b8a7",
        "682c4f83c66540c0b16e84252f00c959", "772a60fe9c494963992ad4a3b7e42310", "f155a35565fa47f3911fa4610aaccfc0",
        "ef2519f7334e437d97f9245073a7be6b", "2a7bf4efd63c4ebea0d5052797f79e93", "1d7c3a46c1564500946d88c581ffde03",
        "3d4b0be7872b45ee984bac6b748b91fe", "0be9723300b64e0d8602fb326e6d8dfe", "8b36b81555274b29912e188bb90f9f21",
        "de652c1802f045bfa2baa8c9ac37a8d1", "43fcd2564c094bc3b992995022a7dedb", "5cd89e5b39c34c819b9a6d5b9303dc80",
        "0a6eebc249a748dbaf44e77f83979ec4", "35c290379d204b3d83cbb3985fc007cb", "0c23c3e73e1342bdb04edccd67fdb26b",
        "730a1a2fd81643cdad26c22dc6a6220f", "a0ab6d06ddfd4bf795292f8c2dc7077a", "f2f53bd144e14f6e92f996b9ca40765c",
        "6edd9d658900444ab93770aa3cb21f70", "687de5ae53944922835d711a5d137ace", "7aeb21c41c71461cb5aeb9c53bec429c",
        "20fd4caf8fce4210928374bea1cadde9", "2e63e91f276840dfa54055234ef178f6", "ac5cacc2d3164078a0a2a09ff45efb57",
        "9e11aaa8db234e37a91e340757a939c1", "5ce23be6515345b1b758af58511d7ba5", "7944802dfc734bb2857cd36f99dbde8e",
        "2ae4114c91e34591949261d5c4408d4f", "7a3134777d9f45ffbb69e0d1d508c588", "bd1ff2c60a384c0bb9dc48dd3fa78372",
        "6512fd685dbf4052942561a659af42f4", "9a0f1dd156e44959b5598bf7f9d6aa33", "7a2414c185334d76837d38f44709681e",
        "2ff0ef10c83b403baa7d506a6963730e", "71446601613d49f28e13619a0f7c0d81", "aa47ca4afbc148038f0f7ec609196cf3",
        "de955dd1a8aa44ca9076c2af9def94da"
    ];
}

function parseUrlParams(url) {
    var params = {};
    var queryIndex = url.indexOf('?');
    if (queryIndex === -1) return params;
    
    var queryString = url.substring(queryIndex + 1);
    var pairs = queryString.split('&');
    
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        if (pair.length === 2) {
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    return params;
}

function urlSign(md5string) {
    var salt = Math.floor(10000000 + Math.random() * 90000000).toString();
    var saltInt = parseInt(salt.substring(6), 10);
    var idx = saltInt % 100;
    var table = saltTable();
    var text = md5string + table[idx] + "migu" + salt.substring(0, 4);
    var sign = ku9.md5(text);
    return [salt, sign];
}

function getSignConfig(contId) {
    var appVersion = "2600000900";
    var tm = Date.now().toString();
    var md5string = ku9.md5(tm + contId + appVersion.substring(0, 8));
    return [tm, urlSign(md5string)];
}
function miguEncryptedUrl(str) {
    if (!str || typeof str !== 'string') {
        return "";
    }
    
    try {
        var params = parseUrlParams(str);
        var S = params.puData || "";
        var U = params.userid || "";
        var T = params.timestamp || "";
        var P = params.ProgramID || "";
        var C = params.Channel_ID || "";
        var V = params.playurlVersion || "";

        var sArray = S.split('');
        var N = sArray.length;
        var half = Math.floor((N + 1) / 2);
        var sb = "";

        for (var i = 0; i < half; i++) {
            if (N % 2 === 1 && i === half - 1) {
                sb += sArray[i];
                break;
            }

            sb += sArray[N - 1 - i];
            sb += sArray[i];

            switch (i) {
                case 1:
                    var uArray = U.split('');
                    if (uArray.length > 2) {
                        sb += uArray[2];
                    } else {
                        var vArray = V.split('');
                        if (vArray.length > 0) {
                            sb += vArray[vArray.length - 1].toLowerCase();
                        }
                    }
                    break;
                case 2:
                    var tArray = T.split('');
                    if (tArray.length > 6) {
                        sb += tArray[6];
                    } else {
                        sb += sArray[i];
                    }
                    break;
                case 3:
                    var pArray = P.split('');
                    if (pArray.length > 2) {
                        sb += pArray[2];
                    } else {
                        sb += sArray[i];
                    }
                    break;
                case 4:
                    var cArray = C.split('');
                    if (cArray.length >= 4) {
                        sb += cArray[cArray.length - 4];
                    } else {
                        sb += sArray[i];
                    }
                    break;
            }
        }

        var baseUrl = str.split('?')[0];
        var result = baseUrl + "?" + Object.keys(params).map(function(key) {
            return key + "=" + encodeURIComponent(params[key]);
        }).join("&") + "&ddCalcu=" + sb;
        
        return result;
        
    } catch (error) {
        console.error("URL加密处理失败: " + error.message);
        return "";
    }
}

function handleMiguMainRequest(id) {
    try {
        var signConfig = getSignConfig(id);
        var tm = signConfig[0];
        var salt = signConfig[1][0];
        var sign = signConfig[1][1];

        var url = "https://play.miguvideo.com/playurl/v1/play/playurl?contId=" + id + 
                 "&dolby=true&isMultiView=true&xh265=true&os=13&ott=false&rateType=3" +
                 "&salt=" + salt + "&sign=" + sign + "&timestamp=" + tm + 
                 "&ua=oneplus-12&vr=true";

        var headers = {
            "Host": "play.miguvideo.com",
            "appId": "miguvideo",
            "terminalId": "android",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13)",
            "MG-BH": "true",
            "appVersionName": "6.0.9.00",
            "appVersion": "2600000900",
            "Phone-Info": "oneplus-13|13",
            "X-UP-CLIENT-CHANNEL-ID": "2600000900-99000-200300140100004",
            "APP-VERSION-CODE": "25000653",
            "Accept": "*/*"
        };

        console.log("发送请求到咪咕API");
        var response = ku9.request(url, "GET", headers, null, true);
        
        if (!response || response.code !== 200) {
            throw new Error("API请求失败，状态码: " + (response ? response.code : "无响应"));
        }

        var jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            throw new Error("JSON解析失败: " + e.message);
        }

        if (!jsonData || !jsonData.body || !jsonData.body.urlInfo) {
            throw new Error("无效的API响应格式");
        }

        var rawUrl = jsonData.body.urlInfo.url;
        if (!rawUrl) {
            throw new Error("未找到播放地址");
        }

        var ottUrl = miguEncryptedUrl(rawUrl);
        if (!ottUrl) {
            throw new Error("URL加密处理失败");
        }
        
        return ottUrl;
        
    } catch (error) {
        console.error("处理咪咕请求失败: " + error.message);
        return null;
    }
}