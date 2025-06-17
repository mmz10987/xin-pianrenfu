// ====================================================================
//                       新版本 main.js
// ====================================================================

/**
 * 显示复制成功的提示信息
 * @param {HTMLElement} button - 被点击的按钮元素
 */
function showCopySuccess(button) {
    const originalText = button.innerText;
    button.innerText = '已复制!';
    button.disabled = true; // 暂时禁用按钮，防止重复点击
    setTimeout(() => {
        button.innerText = originalText;
        button.disabled = false;
    }, 2000); // 2秒后恢复原状
}

/**
 * 传统的后备复制方法，兼容性更好
 * @param {string} text - 需要复制的文本
 * @returns {boolean} - 返回是否复制成功
 */
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // 避免在屏幕上闪烁
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
    return successful;
}

/**
 * IP地址一键复制功能 (主函数)
 */
function copyIp() {
    const ipAddress = document.getElementById('server-ip').innerText;
    const button = document.querySelector('.ip-copy button');

    // 优先使用现代的 navigator.clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ipAddress).then(() => {
            showCopySuccess(button);
        }).catch(err => {
            console.warn('navigator.clipboard failed, trying fallback...', err);
            // 如果现代API失败，则尝试后备方案
            const success = fallbackCopyTextToClipboard(ipAddress);
            if (success) {
                showCopySuccess(button);
            } else {
                alert('复制失败，请手动复制。');
            }
        });
    } else {
        // 如果浏览器不支持现代API，直接使用后备方案
        const success = fallbackCopyTextToClipboard(ipAddress);
        if (success) {
            showCopySuccess(button);
        } else {
            alert('复制失败，您的浏览器可能不支持该功能，请手动复制。');
        }
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

