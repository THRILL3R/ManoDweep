// Main Logic for Garden App
window.app = {
    currentScreen: 0,
    totalScreens: 6,

    // Sidebar Quotes
    quotes: [
        "Welcome to your garden.", // Screen 0 (hidden sidebar)
        "Even one quiet minute is a gift to yourself.",
        "Gratitude turns what we have into enough.",
        "How you start your day shapes how you live it.",
        "Small steps every day lead to big change.",
        "You deserve the kindness you give to others.",
        "You showed up today." // Screen 6 (hidden sidebar)
    ],

    screenTitles: [
        "", // 0
        "Meditation",
        "Gratitude",
        "Intentions",
        "Daily Goals",
        "Take What You Need",
        "" // 6
    ],

    isNight: false,

    init: function () {
        this.injectSVGs();
        this.setDayPill();

        // Time logic
        const hour = new Date().getHours();
        if (hour >= 18 || hour < 5) {
            this.isNight = true;
            document.body.classList.add('theme-night');
        }

        this.loadState();
        this.updateSidebar();
        this.updateProgress();

        // Setup Video Play button
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playBtn.classList.toggle('playing');
                const fill = document.getElementById('meditation-progress');
                if (playBtn.classList.contains('playing')) {
                    fill.style.width = '100%';
                    fill.style.transition = 'width 60s linear';
                } else {
                    fill.style.width = '0%';
                    fill.style.transition = 'none';
                }
            });
        }
    },

    injectSVGs: function () {
        // Mascot
        document.getElementById('puppy-mascot-left').innerHTML = svgs.puppy;
        document.getElementById('puppy-mascot-mobile').innerHTML = svgs.puppy;
        document.getElementById('puppy-sprout-art').innerHTML = svgs.puppy;

        // Art
        document.getElementById('meditation-svg').innerHTML = svgs.meditation;
        document.getElementById('seed-jar-art').innerHTML = svgs.jar;

        // Cups
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`cup-${i}`).innerHTML = svgs.cups[i - 1];
        }
    },

    setDayPill: function () {
        const days = [
            "Slow Sunday",
            "Motivation Monday",
            "Thoughtful Tuesday",
            "Wellness Wednesday",
            "Thankful Thursday",
            "Feel-Good Friday",
            "Serene Saturday"
        ];
        const today = new Date().getDay();
        document.getElementById('day-pill').textContent = days[today];
    },

    nextScreen: function () {
        let next = this.currentScreen + 1;

        // Nighttime routing: skip 3 and 4, show 'evening'
        if (this.isNight) {
            if (this.currentScreen === 2) next = 'evening';
            if (this.currentScreen === 'evening') next = 5;
        }

        if (next <= this.totalScreens || next === 'evening') {
            this.transition(this.currentScreen, next);
        }

        if (next === this.totalScreens) {
            // On complete, add seeds
            const newCount = GardenState.addSeeds(20);
            this.updateSeedsDisplay(newCount);
            this.startConfetti();
        }
    },

    prevScreen: function () {
        let prev = this.currentScreen - 1;

        // Nighttime backward routing
        if (this.isNight) {
            if (this.currentScreen === 5) prev = 'evening';
            if (this.currentScreen === 'evening') prev = 2;
        }

        if (prev >= 0 || prev === 'evening') {
            this.transition(this.currentScreen, prev, true);
        }
    },

    transition: function (from, to, isBack = false) {
        console.log(`Transitioning from ${from} to ${to}`);
        const fromEl = document.getElementById(`screen-${from}`);
        const toEl = document.getElementById(`screen-${to}`);
        console.log("fromEl:", fromEl, "toEl:", toEl);

        // Exit from screen
        fromEl.classList.remove('active');
        toEl.classList.remove('exit-right', 'exit-left', 'enter-left');

        if (isBack) {
            fromEl.classList.add('exit-right');
            toEl.classList.add('enter-left');
        } else {
            fromEl.classList.add('exit-left');
        }

        // Force reflow
        void toEl.offsetWidth;

        if (isBack) {
            toEl.classList.remove('enter-left');
        }

        toEl.classList.add('active');

        this.currentScreen = to;
        this.updateProgress();
        this.updateSidebar();
    },

    updateProgress: function () {
        const container = document.getElementById('progress-container');
        if ((typeof this.currentScreen === 'number' && this.currentScreen >= 1 && this.currentScreen <= 5) || this.currentScreen === 'evening') {
            container.classList.remove('hidden');
            const dots = document.querySelectorAll('.dot');
            dots.forEach(dot => {
                const step = parseInt(dot.getAttribute('data-step'));
                if (step === this.currentScreen || (this.currentScreen === 'evening' && (step === 3 || step === 4))) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        } else {
            container.classList.add('hidden');
        }

        // Hide sidebars on screen 0 and 6
        if (this.currentScreen === 0 || this.currentScreen === 6) {
            document.body.classList.add('hide-sidebars');
        } else {
            document.body.classList.remove('hide-sidebars');
        }
    },

    updateSidebar: function () {
        const leftSidebar = document.getElementById('sidebar-left');
        const rightSidebar = document.getElementById('sidebar-right');

        if (!leftSidebar || !rightSidebar) return; // Exit if user removed sidebars

        if (this.currentScreen === 'evening') {
            document.getElementById('sidebar-step-name').textContent = `Step 3 of 5 — Evening Reflection`;
            document.getElementById('sidebar-quote').textContent = `"Rest your mind. The day is done."`;
        } else if (this.currentScreen >= 1 && this.currentScreen <= 5) {
            document.getElementById('sidebar-step-name').textContent = `Step ${this.currentScreen} of 5 — ${this.screenTitles[this.currentScreen]}`;
            document.getElementById('sidebar-quote').textContent = `"${this.quotes[this.currentScreen]}"`;
        }
        this.updateSeedsDisplay(GardenState.getSeedCount());
    },

    updateSeedsDisplay: function (count) {
        document.getElementById('sidebar-seed-count').textContent = `🌿 ${count} seeds`;
    },

    playMeditation: function () {
        const btn = document.getElementById('play-btn');
        if (!btn.classList.contains('playing')) {
            btn.click();
        }
    },

    // --- State Logic ---
    loadState: function () {
        // Load Intentions
        const intentions = GardenState.getIntentions();
        intentions.forEach((isChecked, i) => {
            if (isChecked) this.toggleIntention(i, true);
        });

        // Load Cups
        const cups = GardenState.getSelectedCups();
        cups.forEach(cupId => {
            this.toggleCup(cupId, true);
        });

        // Load Goals
        const goals = GardenState.getGoals();
        document.querySelectorAll('.dotted-input').forEach(input => {
            const cat = input.getAttribute('data-cat');
            const idx = input.getAttribute('data-idx');
            if (goals[cat] && goals[cat][idx]) {
                input.value = goals[cat][idx].text;
                input.previousSibling.checked = goals[cat][idx].checked;
            }
        });

        // Load Gratitude
        const gratitude = GardenState.getGratitude();
        gratitude.forEach((g, i) => {
            const input = document.getElementById(`gratitude-input-${i + 1}`);
            if (input) {
                input.value = g.name;
            }
        });
    },

    saveGratitude: function () {
        const gratitude = GardenState.getGratitude();
        for (let i = 1; i <= 3; i++) {
            gratitude[i - 1].name = document.getElementById(`gratitude-input-${i}`).value;
        }
        GardenState.saveGratitude(gratitude);
    },

    // Screen 3
    toggleIntention: function (index, bypassSave = false) {
        const items = document.querySelectorAll('.intention-item');
        if (items[index]) {
            items[index].classList.toggle('checked');

            if (!bypassSave) {
                const states = Array.from(items).map(item => item.classList.contains('checked'));
                GardenState.saveIntentions(states);
            }
        }
    },

    // Screen 4
    saveGoals: function () {
        const goals = GardenState.getGoals();
        document.querySelectorAll('.dotted-input').forEach(input => {
            const cat = input.getAttribute('data-cat');
            const idx = input.getAttribute('data-idx');
            if (!goals[cat]) goals[cat] = [];
            goals[cat][idx] = {
                text: input.value,
                checked: input.previousSibling.checked
            };
        });
        GardenState.saveGoals(goals);
    },

    // Screen 5
    toggleCup: function (id, bypassSave = false) {
        const cup = document.querySelectorAll('.cup-item')[id - 1];
        if (cup) {
            cup.classList.toggle('selected');

            if (!bypassSave) {
                const cups = GardenState.getSelectedCups();
                const index = cups.indexOf(id);
                if (index > -1) {
                    cups.splice(index, 1);
                } else {
                    cups.push(id);
                }
                GardenState.saveSelectedCups(cups);
            }
        }
    },

    // Screen 6
    goToIsland: function () {
        alert("Navigating back to ManoDweep Island... 🌴");
        // window.location.href = '/island';
    },

    startConfetti: function () {
        const container = document.getElementById('confetti-container');
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '50';

        for (let i = 0; i < 50; i++) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.width = '8px';
            sparkle.style.height = '8px';
            sparkle.style.backgroundColor = ['#F9C74F', '#43AA8B', '#ADE3F5', '#FFF'][Math.floor(Math.random() * 4)];
            sparkle.style.borderRadius = '50%';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.opacity = Math.random();
            sparkle.style.animation = `sparkle ${Math.random() * 2 + 1}s linear infinite`;
            container.appendChild(sparkle);
        }

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes sparkle {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(100px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

window.onload = () => {
    window.app.init();
};
