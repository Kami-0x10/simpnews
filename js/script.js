// Yahoo JapanニュースRSSフィードのURL（国内ニュース）
var RSS_URL = 'https://news.yahoo.co.jp/rss/categories/domestic.xml'; // 国内ニュースのRSS

// CORSプロキシURL
var CORS_PROXY = 'https://cors-0x10.online/';

// ニュースを表示する関数
function displayNews(items) {
    var newsList = document.getElementById('newsList');
    newsList.innerHTML = ''; // 既存のニュースをクリア

    if (items.length > 0) {
        items.forEach(function(item) {
            var newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            
            var newsTitle = document.createElement('h2');
            newsTitle.textContent = item.title;
            newsItem.appendChild(newsTitle);

            var newsDescription = document.createElement('p');
            newsDescription.textContent = item.description;
            newsItem.appendChild(newsDescription);

            var newsLink = document.createElement('a');
            newsLink.href = item.link;
            newsLink.textContent = '続きを読む';
            newsItem.appendChild(newsLink);

            newsList.appendChild(newsItem);
        });
    } else {
        // ニュースが1件もない場合
        newsList.innerHTML = '<p>ニュースは見つかりませんでした。</p>';
    }
}

// RSSを取得し、XMLをパースしてニュースアイテムを表示
function fetchRSS() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', CORS_PROXY + RSS_URL, true);
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var text = xhr.responseText;

            // 取得したRSSをXML形式でパース
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(text, 'text/xml');

            // RSSフィードからアイテムを取得
            var items = Array.prototype.slice.call(xmlDoc.querySelectorAll('item')).map(function(item) {
                return {
                    title: item.querySelector('title').textContent,
                    description: item.querySelector('description').textContent,
                    link: item.querySelector('link').textContent
                };
            });

            // 最大100件に制限
            var limitedItems = items.slice(0, 100);

            // ニュースアイテムを表示
            displayNews(limitedItems);
        } else {
            console.error('RSSフィードの取得に失敗しました。');
            document.getElementById('newsList').innerHTML = '<p>ニュースの取得に失敗しました。</p>';
        }
    };
    xhr.onerror = function() {
        console.error('ネットワークエラーが発生しました。');
        document.getElementById('newsList').innerHTML = '<p>ニュースの取得に失敗しました。</p>';
    };
    xhr.send();
}

// ページが読み込まれたときにRSSを取得
window.onload = function() {
    fetchRSS();
};
