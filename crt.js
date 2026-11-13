document.addEventListener('DOMContentLoaded', () => {
	const crtScreen = document.getElementById('crtScreen');
	const screenContent = document.getElementById('screenContent');
	const powerBtn = document.getElementById('powerBtn');
	const powerLed = document.getElementById('powerLed');

	let isPoweredOn = true;

	// Helper function to resolve paths consistently across folder depths
	function resolvePath(path) {
		if (!path || path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
			return path;
		}
		const isSubdir = window.location.pathname.includes('/past/');
		const cleanPath = path.replace(/^(\.\.\/|\.\/|\/)+/, '');
		return isSubdir ? '../' + cleanPath : cleanPath;
	}

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

		const droppedData = e.dataTransfer.getData('text/plain');

		if (droppedData && droppedData.includes('games/')) {
			// Resolve the game file path dynamically
			loadGameIntoCRT(resolvePath(droppedData));
		} else {
			flashInvalidDrop();
		}
	});

	function flashInvalidDrop() {
		const originalContent = screenContent.innerHTML;
		screenContent.innerHTML = `<p style="color: #ff3333; font-size: 1.2rem;">[ ERROR: UNSUPPORTED MEDIA ]</p>`;
		setTimeout(() => {
			screenContent.innerHTML = originalContent;
		}, 1200);
	}

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