let actions = 0
let startTime
let interval
let draggedItem = null
let draggedFrom = null
let isDragging = false
let initialTouchX, initialTouchY

const board = document.querySelector('.board')
const left = document.querySelector('.unshuffled.left')
const right = document.querySelector('.unshuffled.right')

window.addEventListener('resize', handleResize)
handleResize() // Call this function once at the start to set the initial orientation.

generateCards()
setupDragAndDrop()
startTimer()

function generateCards () {
  for (let i = 1; i <= 16; i++) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.style.backgroundImage = `url('images/${i}.jpg')`
    card.setAttribute('draggable', true)
    card.setAttribute('data-id', i)
    if (i <= 8) {
      left.appendChild(card)
    } else {
      right.appendChild(card)
    }

    let placeholder = document.createElement('div')
    placeholder.classList.add('placeholder')
    placeholder.setAttribute('data-id', i)
    board.appendChild(placeholder)
  }
}

function setupDragAndDrop () {
  board.addEventListener('dragover', preventDefault)
  board.addEventListener('drop', handleBoardDrop)
  board.addEventListener('boarddrop', handleBoardDrop) // This line listens for our custom event

  document.addEventListener('dragstart', handleDragStart)
  document.addEventListener('dragend', handleDragEnd)

  left.addEventListener('drop', handleDropToSide)
  right.addEventListener('drop', handleDropToSide)
  left.addEventListener('dragover', preventDefault)
  right.addEventListener('dragover', preventDefault)

  let cards = document.querySelectorAll('.card')
  cards.forEach(card => {
    card.addEventListener('touchstart', handleTouchStart, { passive: false })
    card.addEventListener('touchmove', handleTouchMove, { passive: false })
    card.addEventListener('touchend', handleTouchEnd, { passive: false })
  })
}

function preventDefault (e) {
  e.preventDefault()
}

function handleBoardDrop (e) {
  e.preventDefault()
  const target = e.type === 'boarddrop' ? e.detail.dropTarget : e.target

  if (
    draggedItem &&
    (target.classList.contains('placeholder') || target.closest('.placeholder'))
  ) {
    actions++
    document.getElementById('actions').innerText = actions

    if (target.classList.contains('placeholder')) {
      swapElements(draggedItem, target)
    } else {
      swapElements(draggedItem, target.closest('.placeholder'))
    }
    checkCompletion()
  }
}

function handleDragStart (e) {
  if (e.target.classList.contains('card')) {
    draggedItem = e.target
    draggedFrom = e.target.parentElement
    draggedItem.classList.add('is-dragging')
  }
}

function handleDragEnd (e) {
  draggedItem.classList.remove('is-dragging')
  draggedItem.style.zIndex = '' // Reset the z-index
  draggedItem = null
  draggedFrom = null
}

function handleTouchStart (e) {
  e.preventDefault()
  if (e.target.classList.contains('card')) {
    draggedItem = e.target
    draggedFrom = e.target.parentElement
    isDragging = true

    initialTouchX = e.touches[0].clientX
    initialTouchY = e.touches[0].clientY
  }
}

function handleTouchMove(e) {
    if (!isDragging) return;

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const dx = touchX - initialTouchX - (draggedItem.offsetWidth / 2);
    const dy = touchY - initialTouchY - (draggedItem.offsetHeight / 2);

    draggedItem.style.transform = `translate(${dx}px, ${dy}px)`;
    draggedItem.style.zIndex = '1000'; // Adjust the z-index while dragging
}

function handleTouchEnd(e) {
    if (!isDragging || !draggedItem) return;
    draggedItem.style.transform = '';
    draggedItem.style.zIndex = ''; // Reset the z-index

    let dropTarget = document.elementFromPoint(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
    );

    // Check if the card itself is the detected target and try to get the correct drop target.
    if (draggedItem === dropTarget) {
        const offset = draggedItem.offsetWidth / 2;
        dropTarget = document.elementFromPoint(
            e.changedTouches[0].clientX + offset,
            e.changedTouches[0].clientY + offset
        ) || dropTarget;
    }

    if (
        dropTarget.classList.contains('placeholder') ||
        dropTarget.closest('.placeholder')
    ) {
        const customEvent = new CustomEvent('boarddrop', {
            detail: { dropTarget: dropTarget }
        });
        board.dispatchEvent(customEvent);
    } else if (dropTarget.closest('.unshuffled')) {
        handleDropToSide(e);
    }

    isDragging = false;
}
function handleDropToSide (e) {
  e.preventDefault()
  if (!draggedItem) return

  actions++
  document.getElementById('actions').innerText = actions

  if (
    e.target.classList.contains('placeholder') ||
    e.target.closest('.placeholder')
  ) {
    swapElements(draggedItem, e.target.closest('.placeholder'))
  }
}

function swapElements (elem1, elem2) {
  const temp = document.createElement('div')
  elem1.parentNode.insertBefore(temp, elem1)
  elem2.parentNode.insertBefore(elem1, elem2)
  temp.parentNode.insertBefore(elem2, temp)
  temp.parentNode.removeChild(temp)
}

function startTimer () {
  startTime = Date.now()
  interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    document.getElementById('time').innerText = elapsed
  }, 1000)
}

function checkCompletion () {
  const cards = document.querySelectorAll('.board .card')
  let correct = 0
  cards.forEach(card => {
    if (
      card.getAttribute('data-id') ===
      (Array.from(card.parentNode.children).indexOf(card) + 1).toString()
    ) {
      correct++
    }
  })
  if (correct === 16) {
    clearInterval(interval)
    alert('Congratulations! You completed the puzzle.')
  }
}

/* Handle Resizing*/
function handleResize () {
  const gameElement = document.querySelector('.game')
  if (window.innerHeight > window.innerWidth) {
    // Portrait
    gameElement.style.flexDirection = 'column'
    board.style.margin = '20px 0'
  } else {
    // Landscape
    gameElement.style.flexDirection = 'row'
    board.style.margin = '0 20px'
  }
}
