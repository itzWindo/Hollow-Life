const TRACK_COUNT = 12;
const audio = document.getElementById('audio');
const status = document.getElementById('status');
const playerDropZone = document.getElementById('cdPlayerDropZone');

let track = 1;
let loaded = false;

// Check localStorage to see if the CD was previously loaded onto the player
let hasCD = localStorage.getItem('player_has_cd') === 'true';

// Set initial status message based on CD state
if (!hasCD) {
    status.textContent = 'Insert CD into player to begin.';
} else {
    status.textContent = 'CD loaded. Ready to play.';
}

// --- DRAG AND DROP HANDLING FOR THE CD ---
playerDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
});

playerDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggedItemId = e.dataTransfer.getData('text/plain');

    // Check if the dropped item is the audio CD
    if (draggedItemId === 'item_cd') {
        hasCD = true;
        localStorage.setItem('player_has_cd', 'true');
        status.textContent = 'CD inserted successfully. Ready to play.';
        console.log("CD loaded into player.");
    }
});

// --- AUDIO PLAYER CONTROLS ---
function loadTrack() {
    if (!hasCD) return;
    audio.src = `john/${track}.opus`;
    audio.load();
    loaded = true;
    status.textContent = `Track ${track} of ${TRACK_COUNT}`;
}

async function play() {
    if (!hasCD) {
        status.textContent = 'Error: No CD inserted in the player.';
        return;
    }
    if (!loaded) loadTrack();
    try {
        await audio.play();
    }
    catch (error) {
        console.warn('Playback failed:', error);
        status.textContent = 'Unable to play this track.';
    }
}

function togglePlay() {
    if (!hasCD) {
        status.textContent = 'Error: No CD inserted in the player.';
        return;
    }
    if (audio.paused) play();
    else audio.pause();
}

function changeTrack(delta) {
    if (!hasCD) return;
    track = ((track - 1 + delta + TRACK_COUNT) % TRACK_COUNT) + 1;
    loadTrack();
    play();
}

function stop() {
    if (!hasCD) return;
    audio.pause();
    audio.currentTime = 0;
    status.textContent = 'Player stopped.';
}

const actions = { 
    previous: () => changeTrack(-1), 
    next: () => changeTrack(1), 
    play: togglePlay, 
    stop 
};

// Bind actions to hotspots
document.querySelectorAll('[data-action]').forEach(control => {
    const activate = () => {
        if (!hasCD) {
            status.textContent = 'Error: No CD inserted in the player.';
            return;
        }
        actions[control.dataset.action]();
    };
    control.addEventListener('click', activate);
    control.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault(); 
            activate(); 
        }
    });
});

audio.addEventListener('ended', () => changeTrack(1));
audio.addEventListener('error', () => {
    status.textContent = `Could not load track ${track}.`;
});

if (new URLSearchParams(location.search).has('debug')) document.body.classList.add('debug');