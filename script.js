let currentPage = 0;
let titleFilter = "";
let artistFilter = "";
let freeTextFilter = "";
let languageFilter = "";
let duetFilter = "";
const songsPerPage = 16;

function normalizeSongCover(song) {
  return {
    ...song,
    thumbnail: `media/${song.id}.jpg`
  };
}

function fetchLanguages() {
  const languageFilter = document.getElementById('languageFilter');
  const languagesAvailable = new Set();
  languageFilter.innerHTML = '';
  SONGS.forEach(song => {
    const lang = song.language;
    if (SKIPPABLE_LANGUAGES.includes(lang)) return;
    const mapped = LANGUAGES.find(item => item.query.includes(lang));
    const value = mapped ? mapped.query : lang;
    if (languagesAvailable.has(value)) return;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = mapped ? mapped.name : lang;
    languageFilter.appendChild(option);
    languagesAvailable.add(value);
  });
  const nullOption = document.createElement('option');
  nullOption.value = '';
  nullOption.textContent = '-';
  languageFilter.appendChild(nullOption);
}


function fetchSongs(
  title = titleFilter,
  artist = artistFilter,
  freeText = freeTextFilter,
  language = languageFilter,
  duet = duetFilter,
  page = currentPage
) {
  const offset = page * songsPerPage;
  const limit = songsPerPage;
  const titleStr = (title ?? '').toString().trim().toLowerCase();
  const artistStr = (artist ?? '').toString().trim().toLowerCase();
  const freeTextStr = (freeText ?? '').toString().trim().toLowerCase();
  const langs =
    (language !== '' && (language?.split?.(',')?.length ?? 0) > 0)
      ? language.split(',').map(s => s.trim()).filter(Boolean)
      : [];
  const duetBool = (duet === '' || duet === null || duet === undefined)
    ? null
    : (duet === true || duet === 'true' || duet === 1 || duet === '1');
  let filtered = SONGS.slice();
  if (titleStr) {
    filtered = filtered.filter(s => s.title?.toLowerCase().includes(titleStr));
  }
  if (artistStr) {
    filtered = filtered.filter(s => s.artist?.toLowerCase().includes(artistStr));
  }
  if (freeTextStr) {
    filtered = filtered.filter(s => {
      const t = s.title?.toLowerCase() ?? '';
      const a = s.artist?.toLowerCase() ?? '';
      return t.includes(freeTextStr) || a.includes(freeTextStr);
    });
  }
  if (langs.length > 0) {
    filtered = filtered.filter(s => langs.includes(s.language));
  }
  if (duetBool !== null) {
    filtered = filtered.filter(s => Boolean(s.duet) === duetBool);
  }
  const paged = filtered.slice(offset, offset + limit).map(normalizeSongCover);
  console.log({
    data: paged,
    total: filtered.length,
    offset,
    limit
  });
  return {
    data: paged,
    total: filtered.length,
    offset,
    limit
  };
}

function normalizeSongsInput(input) {
  if (Array.isArray(input)) {
    return { songsArray: input, total: input.length, meta: null };
  }
  const songsArray = Array.isArray(input?.data) ? input.data : [];
  const total = (typeof input?.total === 'number') ? input.total : songsArray.length;
  return { songsArray, total, meta: input };
}


function displaySongs(songs) {
    const grid = document.getElementById('grid');
    const results = document.getElementById('results');
    grid.innerHTML = '';
    const { songsArray, total } = normalizeSongsInput(songs);
    results.innerHTML = `
        <p>${(total === 0) ? "Sin resultados." :
            (total === 1) ? "1 resultado." :
            total + " resultados."}</p>
    `;
    songsArray.forEach(song => {
        const div = document.createElement('div');
        div.className = 'song';
        const language = LANGUAGES.find(item => item.query.includes(song.language));
        let languageAltText = language ? language.name : song.language
        let languageFlag = language ? language.icon : "icons/unknown.svg"
        let year = song.year ? song.year : "‎"
        let duet = song.duet ? '<img src="icons/duet.svg" alt="Dueto">' : ''
        div.innerHTML = `
            <img src="${song.thumbnail}" class="thumbnail" alt="${song.title}" />
            <h3>${song.title}</h3>
            <p>${song.artist}</p>
            <div class="footer">
                <img src="${languageFlag}" alt="${languageAltText}">
                ${duet}
                <p>${year} </p>
            </div>
        `;
        
        grid.appendChild(div);
    });
console.log("total");
console.log(total);
    updatePagination(total);
}

function findValidMargin(totalPages, currentPage) {

    let start;
    let end;
    for (let margin = 2; margin <= 5; margin++) {
        start = Math.max(1, currentPage - margin);
        end = Math.min(totalPages - 2, currentPage + margin);
        const numberOfElements = end - start + 1;
        if (numberOfElements >= 5) {
            return { start, end };
        }
    }
    return { start, end };
}

function updatePagination(totalSongs) {
    const totalPages = Math.ceil(totalSongs / songsPerPage);
console.log("totalPages");
console.log(totalPages);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages > 1) {
        pagination.innerHTML = '';
        const buttons = [];
        buttons.push(0);
        const result = findValidMargin(totalPages, currentPage);
        for (let i = result.start; i <= result.end; i++) {
            buttons.push(i);
        }
        buttons.push(totalPages - 1);
        buttons.forEach((page, index) => {
            if (index > 0 && buttons[index] - buttons[index - 1] > 1) {
                const dotsButton = document.createElement('button');
                dotsButton.innerText = '⋯';
                dotsButton.style.fontSize = '10px';
                dotsButton.disabled = true;
                dotsButton.style.backgroundColor = '#444';
                pagination.appendChild(dotsButton);
            }
            const button = document.createElement('button');
            button.innerText = page + 1;
            button.onclick = () => {
                currentPage = page;
                loadSongs();
            };
            if (page === currentPage) {
                button.style.fontWeight = 'bold';
                button.style.backgroundColor = "#0263cc";
            }
            pagination.appendChild(button);
        });
    }
}

function loadSongs() {
  const result = fetchSongs();
  displaySongs(result);
}

document.getElementById('filterButton').addEventListener('click', () => {
  titleFilter = document.getElementById('titleFilter').value;
  artistFilter = document.getElementById('artistFilter').value;
  freeTextFilter = document.getElementById('freeTextFilter').value;
  languageFilter = document.getElementById('languageFilter').value;
  duetFilter = document.getElementById('duetFilter').value;

  currentPage = 0;
  const result = fetchSongs();
  displaySongs(result);
});

fetchLanguages();
loadSongs();

