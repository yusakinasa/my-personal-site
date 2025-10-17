// app.js
const apiBase = '/api';
const itemsEl = document.getElementById('items');
const form = document.getElementById('itemForm');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

async function fetchItems() {
  const res = await fetch(`${apiBase}/items`);
  const data = await res.json();
  renderItems(data);
}

function renderItems(items) {
  itemsEl.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.innerHTML = `<strong>${escapeHtml(item.title)}</strong><div class="small">${escapeHtml(item.content)}</div>`;
    const delBtn = document.createElement('button');
    delBtn.textContent = '删除';
    delBtn.onclick = async () => {
      if (!confirm('确定删除？')) return;
      await fetch(`${apiBase}/items/${item.id}`, { method: 'DELETE' });
      fetchItems();
    };
    li.appendChild(left);
    li.appendChild(delBtn);
    itemsEl.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title) return alert('请填写标题');
  await fetch(`${apiBase}/items`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ title, content })
  });
  titleInput.value = '';
  contentInput.value = '';
  fetchItems();
});

function escapeHtml(s) {
  return (s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// 初始加载
fetchItems();
