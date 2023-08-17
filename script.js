let actions = 0;
let startTime;
let interval;
let initialTouchX, initialTouchY;

const board = document.querySelector('.board');
const left = document.querySelector('.unshuffled.left');
const right = document.querySelector('.unshuffled.right');

generateCards();
setupDragAndDrop();
startTimer();

function generateCards() {
    let positions = [
        '0 0', '-60px 0', '-120px 0', '-180px 0',
        '0 -60px', '-60px -60px', '-120px -60px', '-180px -60px',
        '0 -120px', '-60px -120px', '-120px -120px', '-180px -120px',
        '0 -180px', '-60px -180px', '-120px -180px', '-180px -180px'
    ];

    for (let i = 0; i < 16; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundPosition = positions[i];
        card.setAttribute('draggable', true);
        card.setAttribute('data-id', i + 1);
        if (i < 8) {
            left.appendChild(card);
        } else {
            right.appendChild(card);
        }

        let placeholder = document.createElement('div');
        placeholder.classList.add('placeholder');
        placeholder.setAttribute('data-id', i + 1);
        board.appendChild(placeholder);
    }
}

function setupDragAndDrop() {
    let draggedItem = null;
    let draggedFrom = null;

    board.addEventListener('dragover', preventDefault);
    board.addEventListener('drop', handleBoardDrop);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('dragend', handleDragEnd);
    left.addEventListener('drop', handleDropToSide);
    right.addEventListener('drop', handleDropToSide);

    // Mobile touch events
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', preventDefault, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
}

function preventDefault(e) {
    e.preventDefault();
}

function handleBoardDrop(e) {
    e.preventDefault();
    if (draggedItem && e.target.classList.contains('placeholder')) {
        actions++;
        document.getElementById('actions').innerText = actions;

        const target = e.target;
        target.classList.remove('placeholder');
        target.classList.add('card');
        target.style.backgroundImage = "url('images/image.jpg')";
        target.style.backgroundPosition = draggedItem.style.backgroundPosition;
        target.setAttribute('data-id', draggedItem.getAttribute('data-id'));

        draggedItem.style.backgroundPosition = 'center';
        draggedItem.removeAttribute('data-id');
        draggedItem.style.backgroundImage = "none";
        draggedItem.classList.remove('card');
        draggedItem.classList.add('placeholder');

        checkCompletion();
    }
}

function handleDragStart(e) {
    if (e.target.classList.contains('card')) {
        draggedItem = e.target;
        draggedFrom = e.target.parentElement;
        draggedItem.classList.add('is-dragging');
    }
}

function handleDragEnd(e) {
    if (draggedItem) {
        draggedItem.classList.remove('is-dragging');
        draggedItem = null;
        draggedFrom = null;
    }
}

function handleTouchStart(e) {
    if (e.target.classList.contains('card')) {
        draggedItem = e.target;
        draggedFrom = e.target.parentElement;
        draggedItem.classList.add('is-dragging');

        draggedItem.dataset.touchX = e.touches[0].clientX;
        draggedItem.dataset.touchY = e.touches[0].clientY;
    }
}

function handleTouchEnd(e) {
    if (!draggedItem) return; // Add this line to return early if draggedItem doesn't exist

    const touchX = parseFloat(draggedItem.dataset.touchX);
    const touchY = parseFloat(draggedItem.dataset.touchY);

    const distanceX = touchX - e.changedTouches[0].clientX;
    const distanceY = touchY - e.changedTouches[0].clientY;

    if (Math.abs(distanceX) > 30 || Math.abs(distanceY) > 30) {
        if (draggedFrom === board) {
            handleBoardDrop(e);
        } else {
            handleDropToSide(e);
        }
    }

    draggedItem.classList.remove('is-dragging');
    delete draggedItem.dataset.touchX;
    delete draggedItem.dataset.touchY;
    draggedItem = null;
    draggedFrom = null;
}


function handleDropToSide(e) {
    e.preventDefault();
    if (draggedItem) {
        actions++;
        document.getElementById('actions').innerText = actions;

        if (e.target.classList.contains('placeholder')) {
            e.target.classList.remove('placeholder');
            e.target.classList.add('card');
            e.target.style.backgroundImage = "url('images/image.jpg')";
            e.target.style.backgroundPosition = draggedItem.style.backgroundPosition;
            e.target.setAttribute('data-id', draggedItem.getAttribute('data-id'));

            draggedItem.style.backgroundPosition = 'center';
            draggedItem.removeAttribute('data-id');
            draggedItem.style.backgroundImage = "none";
            draggedItem.classList.remove('card');
            draggedItem.classList.add('placeholder');
        } else if (e.target.classList.contains('card')) {
            const tmpBackgroundPos = e.target.style.backgroundPosition;
            const tmpDataId = e.target.getAttribute('data-id');

            e.target.style.backgroundPosition = draggedItem.style.backgroundPosition;
            e.target.setAttribute('data-id', draggedItem.getAttribute('data-id'));

            draggedItem.style.backgroundPosition = tmpBackgroundPos;
            draggedItem.setAttribute('data-id', tmpDataId);
        }
    }
}

function startTimer() {
    startTime = Date.now();
    interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time').innerText = elapsed;
    }, 1000);
}

function checkCompletion() {
    const cards = document.querySelectorAll('.board .card');
    let correct = 0;
    cards.forEach(card => {
        if (card.getAttribute('data-id') === (Array.from(card.parentNode.children).indexOf(card) + 1).toString()) {
            correct++;
        }
    });
    if (correct === 16) {
        clearInterval(interval);
        alert('Congratulations! You completed the puzzle.');
    }
}
