from base.parser import Parser
import requests
import json
import time
import os
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import urllib.parse
from typing import Dict, Any, Tuple, Union, Iterable
import re

class Parser(Parser):
    def __init__(self, *args, **kwargs):
        # 接受任意参数并传递给父类
        super().__init__(*args, **kwargs)
        
        # 初始化缓存
        self._cache = {}
        
        # 频道映射表
        self.channel_map = {
            'btv4k': 91417,
            'sh4k': 96050,
            'js4k': 95925,
            'zj4k': 96039,
            'sd4k': 95975,
            'hn4k': 96038,
            'gd4k': 93733,
            'sc4k': 95965,
            'sz4k': 93735
        }
        
        # 频道名称映射
        self.channel_name_map = {
            'btv4k': '北京卫视4K',
            'sh4k': '上海卫视4K',
            'js4k': '江苏卫视4K',
            'zj4k': '浙江卫视4K',
            'sd4k': '山东卫视4K',
            'hn4k': '湖南卫视4K',
            'gd4k': '广东卫视4K',
            'sc4k': '四川卫视4K',
            'sz4k': '深圳卫视4K'
        }
        
        # 常量定义
        self.key = '01234567890123450123456789012345'
        self.url1 = 'https://api.chinaaudiovisual.cn/web/user/getVisitor'
        self.url2 = 'https://api.chinaaudiovisual.cn/column/getColumnAllList'
        
        # 重试配置
        self.max_retries = 3
        self.retry_delay = 2  # 秒

    def _aes_encrypt(self, text: str, key: str) -> str:
        """AES-256-ECB加密"""
        try:
            key_bytes = key.encode('utf-8')
            text_bytes = text.encode('utf-8')
            padded_text = pad(text_bytes, AES.block_size)
            cipher = AES.new(key_bytes, AES.MODE_ECB)
            encrypted = cipher.encrypt(padded_text)
            return base64.b64encode(encrypted).decode('utf-8').replace('\n', '')
        except Exception as e:
            raise Exception(f"AES加密失败: {str(e)}")

    def _get_cache(self, key: str, ttl: int) -> Any:
        """获取缓存数据"""
        cache_key = f"cache_{hash(key)}"
        if cache_key in self._cache:
            data, timestamp = self._cache[cache_key]
            if time.time() < timestamp + ttl:
                return data
            else:
                del self._cache[cache_key]
        return None

    def _set_cache(self, key: str, data: Any, ttl_ms: int) -> None:
        """设置缓存数据"""
        cache_key = f"cache_{hash(key)}"
        ttl_seconds = ttl_ms / 1000
        self._cache[cache_key] = (data, time.time() + ttl_seconds)

    def _make_sign(self, url: str, params: str, time_millis: int, key: str) -> str:
        """生成签名"""
        payload = {'url': url, 'params': params, 'time': time_millis}
        payload_json = json.dumps(payload, separators=(',', ':'))
        return self._aes_encrypt(payload_json, key)

    def _fetch_token(self) -> str:
        """获取访问令牌（带重试机制）"""
        for attempt in range(self.max_retries):
            try:
                time1 = int(time.time() * 1000)
                sign1 = self._make_sign(self.url1, '', time1, self.key)
               
                headers = {
                    'Content-Type': 'application/json',
                    'headers': '1.1.3',
                    'sign': sign1
                }
               
                response = requests.post(self.url1, headers=headers, json={}, timeout=10, verify=False)
                if response.status_code != 200:
                    raise Exception(f"HTTP {response.status_code}")
                    
                data = response.json()
                if not data.get('success'):
                    error_msg = data.get('message', '未知错误')
                    raise Exception(f"API返回失败: {error_msg}")
                    
                if not data.get('data', {}).get('token'):
                    raise Exception("无效的响应数据: token缺失")
                    
                token = data['data']['token']
                self._set_cache('visitor_token', token, 86400000)
                return token
               
            except Exception as e:
                if attempt == self.max_retries - 1:  # 最后一次尝试
                    raise Exception(f"获取token失败(尝试{attempt+1}次): {str(e)}")
                time.sleep(self.retry_delay)
               
        raise Exception("获取token失败: 达到最大重试次数")

    def _fetch_channel_list(self, token: str) -> Dict:
        """获取频道列表（带重试机制）"""
        for attempt in range(self.max_retries):
            try:
                column_id = 350
                city_id = 0
                province_id = 0
                version = "1.1.4"
                params_str = f"cityId={city_id}&columnId={column_id}&provinceId={province_id}&token={urllib.parse.quote(token)}&version={version}"
               
                time2 = int(time.time() * 1000)
                sign2 = self._make_sign(self.url2, params_str, time2, self.key)
               
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'okhttp/3.11.0',
                    'headers': '1.1.3',
                    'sign': sign2
                }
               
                response = requests.post(self.url2, headers=headers, data=params_str, timeout=15, verify=False)
                if response.status_code != 200:
                    raise Exception(f"HTTP {response.status_code}")
                    
                data_arr = response.json()
                if not data_arr.get('success'):
                    error_msg = data_arr.get('message', 'API返回失败')
                    raise Exception(f"{error_msg}")
               
                # 验证数据结构
                if not data_arr.get('data') or not isinstance(data_arr['data'], list):
                    raise Exception("API返回数据格式异常")
                    
                self._set_cache('column_all_list_33', data_arr, 600000)
                return data_arr
               
            except Exception as e:
                if attempt == self.max_retries - 1:  # 最后一次尝试
                    raise Exception(f"获取频道列表失败(尝试{attempt+1}次): {str(e)}")
                time.sleep(self.retry_delay)
               
        raise Exception("获取频道列表失败: 达到最大重试次数")

    def _validate_api_response(self, data: Dict) -> bool:
        """验证API响应数据的完整性"""
        try:
            if not isinstance(data, dict):
                return False
            if not data.get('success'):
                return False
            if 'data' not in data:
                return False
            return True
        except:
            return False

    def parse(self, params: Dict[str, str]) -> Dict[str, str]:
        """主要解析方法"""
        try:
            channel_id = params.get('id', '')
            
            # 处理列表请求
            if channel_id == "list":
                base_url = params.get('url', '').split('?')[0]
                content = "4K频道列表,#genre#\n"
                for cid, name in self.channel_name_map.items():
                    content += f"{name},{base_url}?id={cid}\n"
                return {"m3u8": content}
            
            # 检查频道ID是否有效
            if channel_id not in self.channel_map:
                return {"error": f"无效的频道ID: {channel_id}"}
            
            # 获取token（带重试）
            token = self._get_cache('visitor_token', 86400)
            if not token:
                token = self._fetch_token()
            
            # 获取频道列表（带重试）
            data_arr = self._get_cache('column_all_list_33', 600)
            if not data_arr or not self._validate_api_response(data_arr):
                data_arr = self._fetch_channel_list(token)
            
            # 查找播放地址
            target_id = self.channel_map.get(channel_id)
            play_url = None
            
            if data_arr and data_arr.get('data') and isinstance(data_arr['data'], list):
                for item in data_arr['data']:
                    if not isinstance(item, dict):
                        continue
                    media_asset = item.get('mediaAsset', {})
                    if media_asset.get('id') == target_id and media_asset.get('url'):
                        play_url = media_asset['url']
                        break
            
            if play_url:
                # 直接返回M3U8 URL和headers
                return {
                    "url": play_url,
                    "headers": {
                        "Referer": "https://api.chinaaudiovisual.cn/",
                        "User-Agent": "aliplayer",
                        "Origin": "https://api.chinaaudiovisual.cn"
                    }
                }
            else:
                return {"error": f"未找到ID为{channel_id}的频道资源，请检查频道ID或稍后重试"}
               
        except Exception as e:
            # 记录详细错误信息便于调试
            error_msg = f"解析失败: {str(e)}"
            # 清除可能过期的缓存
            self._cache.clear()
            return {"error": error_msg}

    def stop(self):
        """清理资源"""
        self._cache.clear()

    def proxy(self, url: str, headers: Dict[str, Any]) -> Tuple[Union[bytes, Iterable[bytes]], Dict[str, str]]:
        """代理流处理"""
        # 直接返回URL和headers
        return url, headers
        