// SVG Assets for Garden App
const svgs = {
    // A cute golden labrador puppy SVG
    puppy: `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- Body -->
        <path d="M 30 70 C 30 40, 70 40, 70 70 L 70 85 C 70 90, 30 90, 30 85 Z" fill="#F9C74F" />
        <!-- Head -->
        <circle cx="50" cy="45" r="25" fill="#F9C74F" />
        <!-- Ears -->
        <path d="M 25 40 C 15 45, 15 65, 25 65 C 30 65, 30 45, 25 40 Z" fill="#D4A33B" />
        <path d="M 75 40 C 85 45, 85 65, 75 65 C 70 65, 70 45, 75 40 Z" fill="#D4A33B" />
        <!-- Eyes -->
        <circle cx="40" cy="40" r="4" fill="#333" />
        <circle cx="60" cy="40" r="4" fill="#333" />
        <!-- Snout -->
        <ellipse cx="50" cy="52" rx="12" ry="8" fill="#FFF8EC" />
        <!-- Nose -->
        <ellipse cx="50" cy="49" rx="4" ry="3" fill="#333" />
        <!-- Mouth -->
        <path d="M 45 53 Q 50 58 55 53" fill="none" stroke="#333" stroke-width="2" />
        <!-- Collar -->
        <path d="M 32 60 Q 50 70 68 60" fill="none" stroke="#F94144" stroke-width="4" />
        <!-- Tag -->
        <circle cx="50" cy="65" r="5" fill="#F9C74F" stroke="#D4A33B" stroke-width="1" />
        <!-- Paws -->
        <ellipse cx="35" cy="85" rx="8" ry="5" fill="#D4A33B" />
        <ellipse cx="65" cy="85" rx="8" ry="5" fill="#D4A33B" />
    </svg>`,

    // Meditating boy
    meditation: `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Background Sky -->
        <rect width="200" height="200" fill="#ADE3F5" />
        <!-- Hills -->
        <path d="M 0 150 Q 50 100 100 150 T 200 150 L 200 200 L 0 200 Z" fill="#B5D99C" />
        <path d="M 0 170 Q 80 130 150 170 T 200 180 L 200 200 L 0 200 Z" fill="#8cb96e" />
        <!-- Mat -->
        <ellipse cx="100" cy="180" rx="60" ry="10" fill="#90BE6D" />
        <!-- Boy Body -->
        <path d="M 70 160 L 75 110 L 125 110 L 130 160 Z" fill="#277DA1" />
        <!-- Legs (crossed) -->
        <path d="M 50 170 Q 100 190 150 170" fill="none" stroke="#1C3B5E" stroke-width="12" stroke-linecap="round" />
        <!-- Head -->
        <circle cx="100" cy="80" r="20" fill="#fcd7b6" />
        <!-- Hair -->
        <path d="M 80 80 Q 100 50 120 80" fill="#7D4E2D" />
        <!-- Closed Eyes -->
        <path d="M 90 82 Q 95 85 100 82" fill="none" stroke="#333" stroke-width="1.5" />
        <path d="M 105 82 Q 110 85 115 82" fill="none" stroke="#333" stroke-width="1.5" />
        <!-- Arms -->
        <path d="M 75 110 Q 50 140 60 160" fill="none" stroke="#fcd7b6" stroke-width="8" stroke-linecap="round" />
        <path d="M 125 110 Q 150 140 140 160" fill="none" stroke="#fcd7b6" stroke-width="8" stroke-linecap="round" />
    </svg>`,

    // Thank You Jar
    jar: `
    <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        <!-- Cork -->
        <path d="M 30 10 L 70 10 L 65 20 L 35 20 Z" fill="#8c603f" />
        <rect x="35" y="0" width="30" height="10" rx="2" fill="#a37551" />
        <!-- Glass Body Background -->
        <path d="M 35 20 C 10 20, 10 110, 20 110 L 80 110 C 90 110, 90 20, 65 20 Z" fill="#e0f7fa" opacity="0.6" />
        <!-- Folded notes inside -->
        <rect x="30" y="80" width="20" height="15" fill="#F9C74F" transform="rotate(-15 40 85)" />
        <rect x="45" y="70" width="25" height="15" fill="#f4d03f" transform="rotate(10 55 75)" />
        <rect x="50" y="90" width="20" height="15" fill="#F9C74F" transform="rotate(-5 60 95)" />
        <rect x="25" y="95" width="25" height="15" fill="#f4d03f" transform="rotate(5 35 100)" />
        <!-- Glass Highlight -->
        <path d="M 25 40 C 20 60, 25 100, 30 105" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" opacity="0.7" />
        <!-- Glass Body Outline -->
        <path d="M 35 20 C 10 20, 10 110, 20 110 L 80 110 C 90 110, 90 20, 65 20 Z" fill="none" stroke="#80deea" stroke-width="3" />
    </svg>`,

    // Cups Array
    cups: [
        `<svg viewBox="0 0 100 100"><path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill="#F94144"/><path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke="#F94144" stroke-width="6"/><circle cx="40" cy="50" r="5" fill="white"/><circle cx="60" cy="50" r="5" fill="white"/><circle cx="50" cy="30" r="5" fill="white"/><circle cx="50" cy="70" r="5" fill="white"/></svg>`, // Polka dot
        `<svg viewBox="0 0 100 100"><path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill="#F9C74F"/><path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke="#F9C74F" stroke-width="6"/><circle cx="40" cy="45" r="4" fill="#333"/><circle cx="60" cy="45" r="4" fill="#333"/><path d="M 40 60 Q 50 70 60 60" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/></svg>`, // Smiley
        `<svg viewBox="0 0 100 100"><path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill="#F3722C"/><path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke="#F3722C" stroke-width="6"/><path d="M 50 65 L 40 55 C 35 50, 45 40, 50 50 C 55 40, 65 50, 60 55 Z" fill="white"/></svg>`, // Heart
        `<svg viewBox="0 0 100 100"><path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill="#43AA8B"/><path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke="#43AA8B" stroke-width="6"/><polygon points="35,40 65,40 50,65" fill="white"/></svg>`, // Geometric
        `<svg viewBox="0 0 100 100"><path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill="#277DA1"/><path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke="#277DA1" stroke-width="6"/></svg>`, // Plain
        `<svg viewBox="0 0 100 100"><rect x="55" y="0" width="6" height="50" fill="#ccc" transform="rotate(15 55 0)"/><ellipse cx="45" cy="55" rx="10" ry="5" fill="#ccc" transform="rotate(15 45 55)"/><path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill="#90BE6D"/><path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke="#90BE6D" stroke-width="6"/></svg>`  // Spoon
    ]
};
