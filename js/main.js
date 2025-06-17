// ====================================================================
//                       js/main.js (最终兼容版)
// ====================================================================

/**
 * IP地址一键复制功能
 * 使用兼容性最广的 document.execCommand('copy') 方法
 */
function copyIp() {
    const ipAddress = document.getElementById('server-ip').innerText;
    const button = document.querySelector('.ip-copy button');

    // 创建一个临时的 <textarea> 元素
    const textArea = document.createElement("textarea");
    
    // 设置其值为需要复制的文本
    textArea.value = ipAddress;

    // 将元素在视觉上隐藏起来
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    
    // 将元素添加到DOM中
    document.body.appendChild(textArea);
    
    // 选中 <textarea> 中的文本
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
        // 执行复制命令
        successful = document.execCommand('copy');
    } catch (err) {
        console.error('复制操作失败:', err);
    }

    // 从DOM中移除临时元素
    document.body.removeChild(textArea);

    // 根据复制结果给用户反馈
    if (successful) {
        const originalText = button.innerText;
        button.innerText = '已复制!';
        button.disabled = true;
        setTimeout(() => {
            button.innerText = originalText;
            button.disabled = false;
        }, 2000); // 2秒后恢复
    } else {
        // 如果 document.execCommand 都失败了，说明环境限制非常严格
        // 通常会提示用户手动复制
        prompt("复制失败! 请手动复制以下地址:", ipAddress);
    }
}


// ====================================================================
//                动态加载公告 (这部分代码保持不变)
// ====================================================================
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
