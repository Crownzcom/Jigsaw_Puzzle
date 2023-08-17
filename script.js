let actions = 0;
let startTime;
let interval;

const board = document.querySelector('.board');
const left = document.querySelector('.unshuffled.left');
const right = document.querySelector('.unshuffled.right');

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

    board.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    board.addEventListener('drop', (e) => {
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
    });

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('card')) {
            draggedItem = e.target;
            draggedFrom = e.target.parentElement;
            draggedItem.classList.add('is-dragging');
        }
    });

    document.addEventListener('dragend', (e) => {
        if (draggedItem) {
            draggedItem.classList.remove('is-dragging');
            draggedItem = null;
            draggedFrom = null;
        }
    });

    left.addEventListener('drop', handleDropToSide);
    right.addEventListener('drop', handleDropToSide);
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

generateCards();
setupDragAndDrop();
startTimer();