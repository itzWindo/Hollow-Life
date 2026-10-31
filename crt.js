// crt.js

document.addEventListener('DOMContentLoaded', () => {
  const crtScreen = document.getElementById('crtScreen');
  const screenContent = document.getElementById('screenContent');
  const powerBtn = document.getElementById('powerBtn');
  const powerLed = document.getElementById('powerLed');

  let isPoweredOn = true;

  // --- LISTEN FOR REWARDS FROM IFRAME GAMES ---
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ARG_ITEM_UNLOCKED') {
      const newItem = event.data.item;
      
      if (typeof addItemToInventory === 'function') {
        addItemToInventory(newItem);
      }
    }
  });

  // --- CRT SCREEN DROP ZONE LOGIC ---
  crtScreen.addEventListener('dragover', (e) => {
    if (!isPoweredOn) return;
    e.preventDefault();
    crtScreen.style.borderColor = '#505050';
  });

  crtScreen.addEventListener('dragleave', () => {
    crtScreen.style.borderColor = '#121217';
  });

  crtScreen.addEventListener('drop', (e) => {
    if (!isPoweredOn) return;
    e.preventDefault();
    crtScreen.style.borderColor = '#121217';

    // Retrieve the payload passed from the dragged slot
    const droppedData = e.dataTransfer.getData('text/plain');

    // ONLY load if it points to a game file path (or check if it contains your games folder structure)
    if (droppedData && droppedData.includes('games/')) {
      loadGameIntoCRT(droppedData);
    } else {
      // If it's a CD or another non-game item, optionally give a subtle visual error feedback
      flashInvalidDrop();
    }
  });

  // Optional: Quick visual flash on the screen to show the item can't be used here
  function flashInvalidDrop() {
    const originalContent = screenContent.innerHTML;
    screenContent.innerHTML = `<p style="color: #ff3333; font-size: 1.2rem;">[ ERROR: UNSUPPORTED MEDIA ]</p>`;
    setTimeout(() => {
      screenContent.innerHTML = originalContent;
    }, 1200);
  }

  // --- LOAD GAME INTO IFRAME & FOCUS ---
  function loadGameIntoCRT(fileUrl) {
    screenContent.innerHTML = `
      <iframe id="gameFrame" src="${fileUrl}" title="CRT Game Display" style="width:100%; height:100%; border:none; background:#000;"></iframe>
    `;

    const gameFrame = document.getElementById('gameFrame');

    gameFrame.addEventListener('load', () => {
      gameFrame.contentWindow.focus();
    });

    crtScreen.addEventListener('click', () => {
      if (gameFrame && gameFrame.contentWindow) {
        gameFrame.contentWindow.focus();
      }
    });
  }

  // --- POWER TOGGLE ---
  powerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPoweredOn = !isPoweredOn;

    if (isPoweredOn) {
      powerLed.classList.add('on');
      screenContent.style.display = 'flex';
    } else {
      powerLed.classList.remove('on');
      screenContent.style.display = 'none';
    }
  });
});