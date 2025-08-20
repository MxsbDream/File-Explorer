const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const searchInput = document.getElementById('searchInput');
const historyList = document.getElementById('historyList');
const toggleDark = document.getElementById('toggleDark');
const preview = document.getElementById('preview');
const markdownEditor = document.getElementById('markdownEditor');
const markdownPreview = document.getElementById('markdownPreview');

let files = [];
let history = [];
let fileTags = {};

const iconLinks = {
  'txt': 'https://cdn-icons-png.flaticon.com/512/3022/3022256.png',
  'md': 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png',
  'pdf': 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
  'jpg': 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'jpeg': 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'png': 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'webp': 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'gif': 'https://cdn-icons-png.flaticon.com/512/136/136524.png',
  'mp3': 'https://cdn-icons-png.flaticon.com/512/727/727245.png',
  'mp4': 'https://cdn-icons-png.flaticon.com/512/727/727240.png',
  'zip': 'https://cdn-icons-png.flaticon.com/512/2306/2306184.png',
  'js':  'https://cdn-icons-png.flaticon.com/512/919/919828.png',
  'html':'https://cdn-icons-png.flaticon.com/512/919/919827.png',
  'default': 'https://cdn-icons-png.flaticon.com/512/565/565547.png'
};

function getIconURL(name) {
  const ext = name.split('.').pop().toLowerCase();
  return iconLinks[ext] || iconLinks['default'];
}

function renderFiles() {
  fileList.innerHTML = '';
  const query = searchInput.value.toLowerCase();

  files
    .filter(file => file.name.toLowerCase().includes(query) || (fileTags[file.name]?.includes(query)))
    .forEach(file => {
      const iconURL = getIconURL(file.name);
      const div = document.createElement('div');
      div.className = 'p-2 border rounded bg-gray-50 dark:bg-gray-800';

      const tags = fileTags[file.name]?.join(', ') || 'Aucun tag';

      div.innerHTML = `
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <img src="${iconURL}" alt="icon" class="w-6 h-6" />
            <span>${file.name}</span>
          </div>
          <button class="text-blue-500 hover:underline" onclick="openFile('${file.name}')">Ouvrir</button>
        </div>
        <div class="mt-1 text-sm text-gray-500">🏷️ Tags : ${tags}</div>
        <input type="text" placeholder="Ajouter un tag..." class="mt-1 p-1 border rounded w-full" 
          onkeydown="if(event.key==='Enter'){addTag('${file.name}', this.value); this.value='';}">
      `;
      fileList.appendChild(div);
    });
}

function openFile(name) {
  const file = files.find(f => f.name === name);
  if (!file) return;

  const ext = name.split('.').pop().toLowerCase();
  const reader = new FileReader();

  reader.onload = () => {
    preview.innerHTML = '';

    if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
      const img = document.createElement('img');
      img.src = reader.result;
      img.className = 'max-w-full rounded shadow';
      preview.appendChild(img);
    } else if (ext === 'mp3') {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = reader.result;
      preview.appendChild(audio);
    } else if (ext === 'mp4' || ext === 'gif') {
      const video = document.createElement('video');
      video.controls = true;
      video.src = reader.result;
      video.className = 'max-w-full';
      preview.appendChild(video);
    } else if (ext === 'txt' || ext === 'md') {
      const text = document.createElement('pre');
      text.textContent = reader.result;
      text.className = 'bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto';
      preview.appendChild(text);
      markdownEditor.value = reader.result;
      markdownPreview.innerHTML = marked.parse(reader.result);
    } else {
      alert("Type de fichier non pris en charge pour l'aperçu.");
    }

    history.unshift(file.name);
    updateHistory();
  };

  if (['txt', 'md'].includes(ext)) {
    reader.readAsText(file);
  } else {
    reader.readAsDataURL(file);
  }
}

function updateHistory() {
  historyList.innerHTML = '';
  history.slice(0, 5).forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    historyList.appendChild(li);
  });
}

function addTag(fileName, tag) {
  if (!fileTags[fileName]) fileTags[fileName] = [];
  fileTags[fileName].push(tag.toLowerCase());
  renderFiles();
}

fileInput.addEventListener('change', (e) => {
  files = Array.from(e.target.files);
  renderFiles();
});

searchInput.addEventListener('input', renderFiles);

toggleDark.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

markdownEditor?.addEventListener('input', () => {
  markdownPreview.innerHTML = marked.parse(markdownEditor.value);
});

document.body.addEventListener('dragover', e => e.preventDefault());
document.body.addEventListener('drop', e => {
  e.preventDefault();
  if (e.dataTransfer.files.length) {
    files = Array.from(e.dataTransfer.files);
    renderFiles();
