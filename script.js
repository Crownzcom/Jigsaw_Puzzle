let moveCount = 0;

function updateMoveCount() {
    const moveCounter = document.querySelector(".moves");
    moveCounter.textContent = moveCount;
}

document.addEventListener("DOMContentLoaded", function () {
    // Shuffle function
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Get all card elements
    let cards = [];
    for (let i = 1; i <= 16; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', i);
        card.style.backgroundImage = 'url(images/' + i + '.jpg)';
        cards.push(card);
    }

    // Shuffle the cards array
    shuffle(cards);

    // Append shuffled cards to sideboards alternately
    const sideboardLeft = document.getElementById("sideboard-left");
    const sideboardRight = document.getElementById("sideboard-right");

    for (let i = 0; i < 8; i++) {
        const placeholderLeft = document.createElement("div");
        placeholderLeft.classList.add("placeholder");
        sideboardLeft.appendChild(placeholderLeft);
        placeholderLeft.appendChild(cards[i]);

        const placeholderRight = document.createElement("div");
        placeholderRight.classList.add("placeholder");
        sideboardRight.appendChild(placeholderRight);
        placeholderRight.appendChild(cards[i + 8]);
    }

    // Create placeholders for the main board
    const board = document.getElementById("main-board");
    for (let i = 1; i <= 16; i++) {
        const placeholder = document.createElement("div");
        placeholder.classList.add("placeholder");
        placeholder.setAttribute("data-id", i);
        board.appendChild(placeholder);
    }

    setupDragAndDrop();
});

function setupDragAndDrop() {
    const cards = document.querySelectorAll('.card');
    const placeholders = document.querySelectorAll('.placeholder');

    let draggedCard = null;

    cards.forEach(card => {
        card.draggable = true;

        card.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', card.dataset.id);
            card.setAttribute('previous-parent-id', card.parentElement.getAttribute('id'));
            draggedCard = card;
            setTimeout(() => {
                card.classList.add('invisible');
            }, 0);
        });

        card.addEventListener('dragend', function () {
            card.classList.remove('invisible');
            draggedCard = null;
        });
    });

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        placeholder.addEventListener('dragenter', function (e) {
            e.preventDefault();
            this.classList.add('hovered');
        });

        placeholder.addEventListener('dragleave', function () {
            this.classList.remove('hovered');
        });

        placeholder.addEventListener('drop', function (e) {
            e.preventDefault();
            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.querySelector(`.card[data-id="${cardId}"]`);
            
            if (!this.querySelector('.card')) {
                this.appendChild(card);
                moveCount++;
                updateMoveCount();
            } else {
                const previousParentId = card.getAttribute('previous-parent-id');
                const previousParent = document.getElementById(previousParentId);
                previousParent.appendChild(card);
            }

            if (this.parentElement.id.includes('sideboard') && this.parentElement.querySelectorAll('.card').length > 8) {
                const previousParentId = card.getAttribute('previous-parent-id');
                const previousParent = document.getElementById(previousParentId);
                previousParent.appendChild(card);
            }
            
            this.classList.remove('hovered');
        });
    });

    // Touchscreen support
    cards.forEach(card => {
        card.addEventListener('touchstart', function (e) {
            draggedCard = card;
            e.target.classList.add('dragging');
        });

        card.addEventListener('touchmove', function (e) {
            e.preventDefault();  // Prevent the default touch behavior
            let touchLocation = e.targetTouches[0];
            card.style.top = touchLocation.pageY - 50 + 'px';
            card.style.left = touchLocation.pageX - 50 + 'px';
            card.style.position = 'fixed';
        });

        card.addEventListener('touchend', function (e) {
            card.style.position = '';
            card.style.top = '';
            card.style.left = '';
            e.target.classList.remove('dragging');

            const dropTarget = document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY);

            if (dropTarget && dropTarget.classList.contains('placeholder') && !dropTarget.querySelector('.card')) {
                dropTarget.appendChild(draggedCard);
                moveCount++;
                updateMoveCount();
            } else if (draggedCard.getAttribute('previous-parent-id')) {
                const previousParent = document.getElementById(draggedCard.getAttribute('previous-parent-id'));
                previousParent.appendChild(draggedCard);
            }
        });
    });
}
