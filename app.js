const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const searchInput = document.getElementById('searchInput');
const historyList = document.getElementById('historyList');
const toggleDark = document.getElementById('toggleDark');

let files = [];
let history = [];

const icons = {
  'txt': 'icons/txt.png',
  'pdf': 'icons/pdf.png',
  'jpg': '🖼️',
  'png': '🖼️',
  'mp3': '🎵',
  'mp4': '🎬',
  'zip': '📦',
  'js': '💻',
  'html': '💻',
  'default': '❓'
};

function getIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  return icons[ext] || icons['default'];
}

function renderFiles() {
  fileList.innerHTML = '';
  const query = searchInput.value.toLowerCase();

  files
    .filter(file => file.name.toLowerCase().includes(query))
    .forEach(file => {
      const icon = getIcon(file.name);
      const div = document.createElement('div');
      div.className = 'p-2 border rounded flex items-center justify-between bg-gray-50 dark:bg-gray-800';
      div.innerHTML = `
        <span>${icon} ${file.name}</span>
        <button class="text-blue-500 hover:underline" onclick="openFile('${file.name}')">Ouvrir</button>
      `;
      fileList.appendChild(div);
    });
}

function openFile(name) {
  const file = files.find(f => f.name === name);
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    alert(`Contenu de ${file.name} :\n\n${reader.result.slice(0, 500)}...`);
    history.unshift(file.name);
    updateHistory();
  };
  reader.readAsText(file);
}

function updateHistory() {
  historyList.innerHTML = '';
  history.slice(0, 5).forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    historyList.appendChild(li);
  });
}

fileInput.addEventListener('change', (e) => {
  files = Array.from(e.target.files);
  renderFiles();
});

searchInput.addEventListener('input', renderFiles);

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
    
