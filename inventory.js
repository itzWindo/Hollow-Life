function getInventory() {
	const saved = localStorage.getItem('arg_inventory');
	return saved ? JSON.parse(saved) : [];
}

function saveInventory(inventoryArray) {
  	localStorage.setItem('arg_inventory', JSON.stringify(inventoryArray));
}

function addItemToInventory(item) {
	let inventory = getInventory();
	if (!inventory.some(i => i.id === item.id)) {
		inventory.push(item);
		saveInventory(inventory);
		renderInventory();
	}
}

function renderInventory() {
	const grid = document.getElementById('inventory-grid');
	if (!grid) return;

	const inventory = getInventory();
	grid.innerHTML = '';

	const displayCount = Math.max(inventory.length, 1);

	for (let i = 0; i < displayCount; i++) {
		const slot = document.createElement('div');
		slot.className = 'inv-slot';

	if (inventory[i]) {
	const item = inventory[i];
	slot.setAttribute('data-item-name', item.name);
	
	const img = document.createElement('img');
	img.src = item.image;
	img.alt = item.name;
	slot.appendChild(img);

	// Allow dragging games OR the CD item
	if (item.type === 'game' || item.id === 'item_cd') {
		slot.setAttribute('draggable', 'true');
		
slot.addEventListener('dragstart', (e) => {
    // CONDITIONAL PAYLOAD: Send the game file path if it's a game, otherwise send the item ID
    if (item.type === 'game') {
      e.dataTransfer.setData('text/plain', item.gameFile);
    } else {
      e.dataTransfer.setData('text/plain', item.id);
    }});

		slot.addEventListener('dragend', () => {
		slot.style.opacity = '1';
		});
	}
	}

		grid.appendChild(slot);
	}
}

document.addEventListener('DOMContentLoaded', () => {
  	renderInventory();
});