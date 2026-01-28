const gallery=document.getElementById('gallery');
const pokenum= document.getElementById('pokenum');
const searchBtn =document.getElementById('search');


async function fetchPokedex() {
    try {
          const response=await fetch('https://pokeapi.co/api/v2/pokemon');
          const data=await response.json();
          const pdetails=[];
      for (const p of data.results) 
      {
              const response = await fetch(p.url);
              const details = await response.json();
              pdetails.push(details);
      }
      gallery.innerHTML = ''; 
      pdetails.forEach(detailData => createPokemonCard(detailData));
    } catch (error) {
        gallery.innerHTML = `<p class="error">Failed to load. Try again.</p>`;
    }
}

function createPokemonCard(pokemon, isFullDetail) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    if (isFullDetail) card.classList.add('detailed-view'); 
    const types = pokemon.types.map(t => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`).join('');
  
    let cardContent = `
        <p class="id-tag">#${pokemon.id.toString()}</p>
        <img class="pokemon-image" src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
        <h3 class="poke-name" style="text-transform: capitalize;">${pokemon.name}</h3>
        <div class="types-container">${types}</div>
    `;

    if (isFullDetail) {
        const weight = pokemon.weight ;
        const height = pokemon.height ;
        const statsHTML = pokemon.stats.map(s => `
            <div class="stat-row">
                <span class="stat-label">${s.stat.name}</span>
                <div class="stat-bar-bg"><div class="stat-bar-fill" style="width: ${Math.min(s.base_stat, 100)}%"></div></div>
                <span class="stat-num">${s.base_stat}</span>
            </div>
        `).join('');

        cardContent += `
            <div class="extra-details">
                <hr>
                <div class="physical">
                    <span><strong>Weight:</strong> ${weight}kg</span>
                    <span><strong>Height:</strong> ${height}m</span>
                </div>
                <div class="stats-box">
                    <strong>Base Stats</strong>
                    ${statsHTML}
                </div>
              </div>
          `;
    }

    card.innerHTML = cardContent;
    gallery.appendChild(card);
}

async function searchPokemon() {
    const query = pokenum.value.toLowerCase().trim();
    gallery.innerHTML = '<div class="status-msg">Searching...</div>';
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok)
          throw new Error('Not found');
        
        const data = await response.json();
        gallery.innerHTML = ''; 
     createPokemonCard(data, true);
    } catch (err) {
        gallery.innerHTML = `<p class="error">No such pokemon exists. </p>`;
    }
}

const randomBtn = document.getElementById('random-btn');
async function getRandomPokemon() {
    gallery.innerHTML = '<p class="loading">Finding a random Pokemon...</p>';
  
    const randomId = Math.floor(Math.random() * 1025) + 1;
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();
        gallery.innerHTML = '';
        createPokemonCard(data);
    } catch (error) {
        gallery.innerHTML = '<p>Error fetching random Pokemon. Try again!</p>';
    }
}

randomBtn.addEventListener('click', getRandomPokemon);
searchBtn.addEventListener('click', searchPokemon);
pokenum.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchPokemon(); });
fetchPokedex();
