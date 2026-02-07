const form = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');

let posts = [];

// Загрузка из localStorage
function loadPosts() {
  const stored = localStorage.getItem('posts');
  if (stored) {
    posts = JSON.parse(stored);
    renderPosts();
  }
}

// Сохранение
function savePosts() {
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Отрисовка всех постов и комментариев
function renderPosts() {
  postsContainer.innerHTML = '';

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    const dateStr = new Date(post.date).toLocaleString();

    // HTML для поста
    postDiv.innerHTML = `
      <div class="post-header">
        <span class="date">${dateStr}</span>
      </div>
      <div class="post-content">
        ${post.imageUrl ? `<a href="${post.imageUrl}" target="_blank"><img src="${post.imageUrl}" alt="post image"/></a>` : ''}
        <p>${post.comment}</p>
      </div>
      <div class="comments" id="comments-${i}">
        <!-- комментарии сюда -->
      </div>
      <form class="comment-form" data-index="${i}">
        <input type="text" placeholder="Добавить комментарий" required />
        <button type="submit">Отправить</button>
      </form>
    `;

    // добавляем в контейнер
    postsContainer.appendChild(postDiv);

    // ренд684ер комментариев
    renderComments(i);
  }

  // Навешиваем обработчики на формы комментариев
  document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const index = parseInt(this.dataset.index);
      const input = this.querySelector('input');
      const commentText = input.value.trim();
      if (commentText) {
        // Добавляем комментарий к посту
        if (!posts[index].comments) {
          posts[index].comments = [];
        }
        posts[index].comments.push({
          text: commentText,
          date: new Date().toISOString()
        });
        savePosts();
        renderPosts(); // перерисовываем
      }
    });
  });
}

// Вспомогательная функция для отображения комментариев к посту
function renderComments(postIndex) {
  const commentsDiv = document.getElementById(`comments-${postIndex}`);
  commentsDiv.innerHTML = '';

  const comments = posts[postIndex].comments || [];
  for (let comment of comments) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    const dateStr = new Date(comment.date).toLocaleString();
    commentDiv.innerHTML = `
      <div class="comment-text">${comment.text}</div>
      <div class="comment-date">${dateStr}</div>
    `;
    commentsDiv.appendChild(commentDiv);
  }
}

// Обработка формы добавления поста
form.addEventListener('submit', e => {
  e.preventDefault();

  const comment = document.getElementById('comment').value.trim();
  const imageUrl = document.getElementById('imageUrl').value.trim();

  if (!comment) return;

  const newPost = {
    comment,
    imageUrl,
    date: new Date().toISOString(),
    comments: [] // для комментариев
  };

  posts.unshift(newPost);
  savePosts();
  renderPosts();

  form.reset();
});

// Загружаем посты при загрузке
loadPosts();