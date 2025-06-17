// 功能1: IP地址一键复制
function copyIp() {
    const ipAddress = document.getElementById('server-ip').innerText;
    navigator.clipboard.writeText(ipAddress).then(() => {
        const button = document.querySelector('.ip-copy button');
        const originalText = button.innerText;
        button.innerText = '已复制!';
        setTimeout(() => {
            button.innerText = originalText;
        }, 2000); // 2秒后恢复原状
    }).catch(err => {
        console.error('无法复制IP地址: ', err);
        alert('复制失败，请手动复制。');
    });
}

// 功能2: 动态加载公告
document.addEventListener('DOMContentLoaded', () => {
    // 检查当前页面是否是公告页
    if (document.getElementById('posts-container')) {
        loadPosts();
    }
});

function loadPosts() {
    fetch('data/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络错误，无法加载公告');
            }
            return response.json();
        })
        .then(posts => {
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = ''; // 清空“正在加载”提示

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>暂无公告。</p>';
                return;
            }

            posts.forEach(post => {
                const postElement = document.createElement('article');
                postElement.classList.add('post');

                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <div class="date">${post.date}</div>
                    <div class="content">
                        ${post.content}
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('加载公告失败:', error);
            const postsContainer = document.getElementById('posts-container');
            postsContainer.innerHTML = '<p>无法加载公告，请稍后再试。</p>';
        });
}
