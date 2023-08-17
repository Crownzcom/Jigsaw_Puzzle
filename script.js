let actions = 0;
let startTime;
let interval;
let draggedItem = null;
let draggedFrom = null;
let isDragging = false;
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
    board.addEventListener('touchmove', handleTouchMove, { passive: false });

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

function handleTouchMove(e) {
    console.log('Touch move triggered');
    if (!isDragging) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // Calculate the distance moved
    const dx = touchX - initialTouchX;
    const dy = touchY - initialTouchY;

    // Move the dragged item
    draggedItem.style.transform = `translate(${dx}px, ${dy}px)`;
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
    e.preventDefault(); // Explicitly Prevents Default Behavior for touchstart
    console.log('Touch start triggered');
    if (e.target.classList.contains('card')) {
        e.preventDefault();

        draggedItem = e.target;
        draggedFrom = e.target.parentElement;

        isDragging = true;

        initialTouchX = e.touches[0].clientX;
        initialTouchY = e.touches[0].clientY;
    }
}

function handleTouchEnd(e) {
    console.log('Touch end triggered');
    if (!isDragging || !draggedItem) return;

    draggedItem.style.transform = ''; // Reset the transform
    isDragging = false;

    // Now determine if the dragged item was released over any of the drop targets
    const dropTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    
    if (dropTarget.classList.contains('placeholder')) {
        handleBoardDrop(e);
    } else if (dropTarget === left || dropTarget === right || dropTarget.closest('.unshuffled')) {
        handleDropToSide(e);
    }
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
