// js/social.js — Understanding Social Life

// =============================================
// STATE MANAGEMENT
// =============================================
const SocialState = {
    KEY: 'garden_social_people',

    getPeople: function () {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return this._defaults();
            return JSON.parse(raw);
        } catch (e) {
            return this._defaults();
        }
    },

    savePeople: function (data) {
        localStorage.setItem(this.KEY, JSON.stringify(data));
    },

    addPerson: function (person) {
        const people = this.getPeople();
        person.id = Date.now().toString();
        people.push(person);
        this.savePeople(people);
        return person;
    },

    updatePerson: function (id, changes) {
        const people = this.getPeople();
        const idx = people.findIndex(p => p.id === id);
        if (idx !== -1) {
            people[idx] = { ...people[idx], ...changes };
            this.savePeople(people);
        }
    },

    deletePerson: function (id) {
        const people = this.getPeople().filter(p => p.id !== id);
        this.savePeople(people);
    },

    _defaults: function () {
        return [
            { id: '1', name: 'Aarav',  label: 'Close Friend',   closeness: 1, frequency: 'weekly',  lastConnected: this._daysAgo(2),  notes: '', avatarColor: '#f9a8d4' },
            { id: '2', name: 'Meera',  label: 'Best Friend',    closeness: 1, frequency: 'daily',   lastConnected: this._daysAgo(5),  notes: '', avatarColor: '#86efac' },
            { id: '3', name: 'Riya',   label: 'Close Friend',   closeness: 1, frequency: 'weekly',  lastConnected: this._daysAgo(7),  notes: '', avatarColor: '#fdba74' },
            { id: '4', name: 'Kabir',  label: 'Brother',        closeness: 2, frequency: 'weekly',  lastConnected: this._daysAgo(14), notes: '', avatarColor: '#a78bfa' },
            { id: '5', name: 'Tina',   label: 'College Friend', closeness: 2, frequency: 'monthly', lastConnected: this._daysAgo(21), notes: '', avatarColor: '#67e8f9' },
            { id: '6', name: 'Neha',   label: 'Cousin',         closeness: 2, frequency: 'monthly', lastConnected: this._daysAgo(30), notes: '', avatarColor: '#fde68a' },
            { id: '7', name: 'Vikram', label: 'Work Friend',    closeness: 3, frequency: 'rarely',  lastConnected: this._daysAgo(30), notes: '', avatarColor: '#f9a8d4' },
            { id: '8', name: 'Ishita', label: 'Friend',         closeness: 3, frequency: 'rarely',  lastConnected: this._daysAgo(60), notes: '', avatarColor: '#86efac' },
        ];
    },

    _daysAgo: function (n) {
        const d = new Date();
        d.setDate(d.getDate() - n);
        return d.toISOString();
    }
};

// =============================================
// AVATAR COLORS PALETTE
// =============================================
const AVATAR_COLORS = [
    '#f9a8d4','#86efac','#fdba74','#a78bfa',
    '#67e8f9','#fde68a','#c4b5fd','#6ee7b7',
    '#fca5a5','#93c5fd','#d9f99d','#fbcfe8'
];

// =============================================
// NAVIGATION
// =============================================
let currentScreen = 'garden';
let selectedPersonId = null;
let listFilter = 'all';

function showScreen(id) {
    document.querySelectorAll('.social-screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + id);
    if (el) {
        el.classList.add('active');
        currentScreen = id;
    }
}

// =============================================
// GARDEN RENDERING
// =============================================
const RING_RADII = { 1: 95, 2: 165, 3: 235 };
const RING_COLORS = {
    1: { stroke: '#f472b6', glow: 'rgba(244,114,182,0.25)', dot: '#f9a8d4' },
    2: { stroke: '#facc15', glow: 'rgba(250,204,21,0.2)',   dot: '#fde68a' },
    3: { stroke: '#4ade80', glow: 'rgba(74,222,128,0.15)',  dot: '#86efac' },
};

function renderGarden() {
    const people = SocialState.getPeople();
    const svg = document.getElementById('garden-svg');
    if (!svg) return;

    // Clear existing avatars (keep rings/center)
    svg.querySelectorAll('.person-node').forEach(el => el.remove());

    // Group by closeness
    const groups = { 1: [], 2: [], 3: [] };
    people.forEach(p => {
        if (groups[p.closeness]) groups[p.closeness].push(p);
    });

    const cx = 270, cy = 270; // SVG center

    [1, 2, 3].forEach(ring => {
        const persons = groups[ring];
        const radius = RING_RADII[ring];
        const count = persons.length;
        persons.forEach((p, i) => {
            const angle = (2 * Math.PI * i / count) - Math.PI / 2;
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            renderPersonNode(svg, p, x, y);
        });
    });
}

function renderPersonNode(svg, person, x, y) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('person-node');
    g.style.cursor = 'pointer';
    g.setAttribute('transform', `translate(${x},${y})`);
    g.addEventListener('click', () => openPersonDetail(person.id));

    // Glow circle
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('r', '22');
    glow.setAttribute('fill', person.avatarColor || '#f9a8d4');
    glow.setAttribute('opacity', '0.25');
    g.appendChild(glow);

    // Avatar circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', '16');
    circle.setAttribute('fill', person.avatarColor || '#f9a8d4');
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);

    // Initial text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('font-size', '11');
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#1a1a2e');
    text.textContent = person.name.charAt(0).toUpperCase();
    g.appendChild(text);

    // Name label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'hanging');
    label.setAttribute('y', '20');
    label.setAttribute('font-size', '9');
    label.setAttribute('fill', 'rgba(255,255,255,0.85)');
    label.textContent = person.name;
    g.appendChild(label);

    svg.appendChild(g);
}

// =============================================
// PERSON DETAIL
// =============================================
function openPersonDetail(id) {
    const people = SocialState.getPeople();
    const person = people.find(p => p.id === id);
    if (!person) return;
    selectedPersonId = id;

    document.getElementById('detail-name').textContent = person.name;
    document.getElementById('detail-label').textContent = person.label || 'Friend';
    document.getElementById('detail-last').textContent = formatLastConnected(person.lastConnected);
    document.getElementById('detail-notes').value = person.notes || '';
    document.getElementById('detail-notes').placeholder = `Something you appreciate about ${person.name}...`;

    // Avatar
    const avatar = document.getElementById('detail-avatar');
    avatar.textContent = person.name.charAt(0).toUpperCase();
    avatar.style.background = person.avatarColor;

    // Closeness slider (1=inner=close=100, 2=middle=50, 3=outer=0)
    const sliderVal = person.closeness === 1 ? 100 : person.closeness === 2 ? 50 : 0;
    document.getElementById('closeness-slider').value = sliderVal;
    updatePlantVisual(sliderVal);

    // Frequency
    document.querySelectorAll('.freq-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.freq === person.frequency);
    });

    showScreen('detail');
}

function updatePlantVisual(val) {
    const plant = document.getElementById('plant-visual');
    // Scale plant based on closeness (bigger = closer)
    const scale = 0.5 + (val / 100) * 0.8;
    const hue = 120 + (val / 100) * 60; // green to teal
    plant.style.transform = `scale(${scale})`;
    plant.style.filter = `hue-rotate(${hue - 120}deg)`;

    // Update label
    const label = document.getElementById('closeness-label');
    if (val > 66) label.textContent = 'Close to me';
    else if (val > 33) label.textContent = 'Somewhat close';
    else label.textContent = 'Farther away';
}

function savePersonDetail() {
    const sliderVal = parseInt(document.getElementById('closeness-slider').value);
    const closeness = sliderVal > 66 ? 1 : sliderVal > 33 ? 2 : 3;
    const activeFreq = document.querySelector('.freq-btn.active');
    const frequency = activeFreq ? activeFreq.dataset.freq : 'weekly';
    const notes = document.getElementById('detail-notes').value;

    SocialState.updatePerson(selectedPersonId, { closeness, frequency, notes });
    renderGarden();
    renderList();
    showScreen('garden');
}

// =============================================
// PEOPLE LIST
// =============================================
function renderList(filter) {
    if (filter !== undefined) listFilter = filter;
    const people = SocialState.getPeople();

    // Update filter pills
    document.querySelectorAll('.filter-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === listFilter);
    });

    const filtered = people.filter(p => {
        if (listFilter === 'all') return true;
        if (listFilter === 'close') return p.closeness === 1;
        if (listFilter === 'somewhat') return p.closeness === 2;
        if (listFilter === 'far') return p.closeness === 3;
        return true;
    });

    const listEl = document.getElementById('people-list');
    listEl.innerHTML = '';

    if (filtered.length === 0) {
        listEl.innerHTML = '<p class="list-empty">No people here yet. Add someone!</p>';
        return;
    }

    filtered.forEach(person => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="list-avatar" style="background:${person.avatarColor}">${person.name.charAt(0)}</div>
            <div class="list-info">
                <span class="list-name">${person.name}</span>
                <span class="list-sub">${person.label || ''}</span>
            </div>
            <div class="list-meta">
                <span class="list-date">${formatLastConnected(person.lastConnected)}</span>
                <span class="list-chevron">›</span>
            </div>
        `;
        item.addEventListener('click', () => openPersonDetail(person.id));
        listEl.appendChild(item);
    });
}

// =============================================
// ADD PERSON
// =============================================
function showAddPerson() {
    document.getElementById('add-form').reset();
    document.getElementById('add-color-preview').style.background = AVATAR_COLORS[0];
    document.getElementById('add-modal').style.display = 'flex';
}

function hideAddPerson() {
    document.getElementById('add-modal').style.display = 'none';
}

function saveNewPerson() {
    const name = document.getElementById('add-name').value.trim();
    if (!name) { alert('Please enter a name.'); return; }

    const label = document.getElementById('add-label').value.trim();
    const closeness = parseInt(document.getElementById('add-closeness').value);
    const frequency = document.getElementById('add-frequency').value;
    const color = document.getElementById('add-color-preview').style.background;

    SocialState.addPerson({ name, label, closeness, frequency, lastConnected: new Date().toISOString(), notes: '', avatarColor: color });
    hideAddPerson();
    renderGarden();
    renderList();
}

// =============================================
// UTILITY
// =============================================
function formatLastConnected(iso) {
    if (!iso) return 'Unknown';
    const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 60) return '1 month ago';
    return `${Math.floor(days / 30)} months ago`;
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    renderGarden();
    renderList();

    // Closeness slider live update
    const slider = document.getElementById('closeness-slider');
    if (slider) slider.addEventListener('input', e => updatePlantVisual(e.target.value));

    // Frequency buttons
    document.querySelectorAll('.freq-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Color picker swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.getElementById('add-color-preview').style.background = swatch.dataset.color;
        });
    });

    showScreen('garden');
});
