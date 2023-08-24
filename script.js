let moveCount = 0 // Keeps track of the number of moves made so far
let timerInterval = null
let elapsedTime = 0 // Keeps track of the time a player has taken so far
let userEmailValue = '' // To store the email of the player

document.addEventListener('DOMContentLoaded', function () {
  // Initialize the game
  resetGame()

  //Enables Drga and Drop
  setupDragAndDrop()

  // Initialize the intro modal
  initializeIntroModal()

  // Initialize the restart modal
  initializeRestartModal()
})

//Initialize the intro modal
function initializeIntroModal () {
  // Show the intro modal on initial load
  const introModal = document.getElementById('introModal')
  introModal.style.display = 'flex'

  const userName = document.getElementById('userName')
  const userEmail = document.getElementById('userEmail')
  const startGameBtn = document.getElementById('startGameBtn')

  // Function to validate email
  function validateEmail (email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    return re.test(email)
  }

  // Function to check the form's validity
  function checkFormValidity () {
    if (userName.value && validateEmail(userEmail.value)) {
      startGameBtn.disabled = false
    } else {
      startGameBtn.disabled = true
    }
  }

  // Add event listeners to the input fields
  userName.addEventListener('input', checkFormValidity)
  userEmail.addEventListener('input', checkFormValidity)

  startGameBtn.addEventListener('click', function () {
    // Store the user's email value
    userEmailValue = userEmail.value

    // Close the intro modal
    introModal.style.display = 'none'
  })
}

//Initialize the Game
function resetGame () {
  // Shuffle function
  function shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  // Get all card elements
  let cards = []
  for (let i = 1; i <= 16; i++) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-id', i)
    card.style.backgroundImage = 'url(images/' + i + '.jpg)'
    cards.push(card)
  }

  // Shuffle the cards array
  shuffle(cards)

  // Clear existing cards and placeholders
  document.getElementById('sideboard-left').innerHTML = ''
  document.getElementById('sideboard-right').innerHTML = ''
  document.getElementById('main-board').innerHTML = ''

  // Append shuffled cards to sideboards alternately
  const sideboardLeft = document.getElementById('sideboard-left')
  const sideboardRight = document.getElementById('sideboard-right')

  for (let i = 0; i < 8; i++) {
    const placeholderLeft = document.createElement('div')
    placeholderLeft.classList.add('placeholder')
    sideboardLeft.appendChild(placeholderLeft)
    placeholderLeft.appendChild(cards[i])

    const placeholderRight = document.createElement('div')
    placeholderRight.classList.add('placeholder')
    sideboardRight.appendChild(placeholderRight)
    placeholderRight.appendChild(cards[i + 8])
  }

  // Create placeholders for the main board
  const board = document.getElementById('main-board')
  for (let i = 1; i <= 16; i++) {
    const placeholder = document.createElement('div')
    placeholder.classList.add('placeholder')
    placeholder.setAttribute('data-id', i)
    board.appendChild(placeholder)
  }

  // Reinitialize the drag and drop functionality
  setupDragAndDrop()

  // Reset other game state variables
  elapsedTime = 0
  moveCount = 0
  document.getElementById('time').textContent = formatTime(elapsedTime)
  updateMoveCount()
  stopTimer() // Ensure timer is stopped
}

//For Starting the timer when the game starts
function startTimer () {
  if (!timerInterval) {
    timerInterval = setInterval(function () {
      elapsedTime++
      document.getElementById('time').textContent = formatTime(elapsedTime)
    }, 1000)
  }
}

/* For outputing the appropriate time format to the Counter*/
function formatTime (seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  let timeString = ''
  if (hrs > 0) {
    timeString += `${String(hrs).padStart(2, '0')}:`
  }
  timeString += `${String(mins).padStart(2, '0')}:${String(secs).padStart(
    2,
    '0'
  )}`

  return timeString
}

/* For outputing the appropriate time format of the player to be submitted to the backend through POST*/
function formatTimePlayerScore (seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  let timeString = ''

  timeString += `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
    2,
    '0'
  )}:${String(secs).padStart(2, '0')}`

  return timeString
}

/*For outputing the appropriate time format to the Winning modal*/
function formatTimeForModal (seconds) {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  let hourMin = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
    2,
    '0'
  )}.`
  return {
    hourMin: hourMin,
    seconds: String(secs).padStart(2, '0')
  }
}

//For stopping the timer when the game has ended successfully
function stopTimer () {
  clearInterval(timerInterval)
  timerInterval = null
}

//For updating the move counts
function updateMoveCount () {
  const moveCounter = document.querySelector('.moves')
  moveCounter.textContent = moveCount
}

// Checks if all the cards have been placed correctly on the board
function checkGameCompletion () {
  const mainBoardCards = document.querySelectorAll('#main-board .card')
  if (mainBoardCards.length === 16) {
    stopTimer()
    const userName = document.getElementById('userName').value
    const userEmail = document.getElementById('userEmail').value

    const userScore = formatTimePlayerScore(elapsedTime)
    console.log('User score time with  formatTimePlayerScore(): ' + userScore)

    savePlayerScore(userName, userEmail, userScore)
    showWinningModal()
  }
}

//Sets up the drag and drop functionality on devices that support touch devices, and those that use a mouse
function setupDragAndDrop () {
  const cards = document.querySelectorAll('.card')
  const placeholders = document.querySelectorAll('.placeholder')

  let draggedCard = null

  cards.forEach(card => {
    card.draggable = true

    card.addEventListener('dragstart', function (e) {
      startTimer()
      e.dataTransfer.setData('text/plain', card.dataset.id)
      card.setAttribute(
        'previous-parent-id',
        card.parentElement.getAttribute('id')
      )
      draggedCard = card
      setTimeout(() => {
        card.classList.add('invisible')
      }, 0)
    })

    card.addEventListener('dragend', function () {
      card.classList.remove('invisible')
      draggedCard = null
    })
  })

  placeholders.forEach(placeholder => {
    placeholder.addEventListener('dragover', function (e) {
      e.preventDefault()
    })

    placeholder.addEventListener('dragenter', function (e) {
      e.preventDefault()
      this.classList.add('hovered')
    })

    placeholder.addEventListener('dragleave', function () {
      this.classList.remove('hovered')
    })

    placeholder.addEventListener('drop', function (e) {
      e.preventDefault()
      const cardId = e.dataTransfer.getData('text/plain')
      const card = document.querySelector(`.card[data-id="${cardId}"]`)

      if (!this.querySelector('.card')) {
        this.appendChild(card)
        moveCount++
        updateMoveCount()
      } else {
        const previousParentId = card.getAttribute('previous-parent-id')
        const previousParent = document.getElementById(previousParentId)
        previousParent.appendChild(card)
      }

      if (
        this.parentElement.id.includes('sideboard') &&
        this.parentElement.querySelectorAll('.card').length > 8
      ) {
        const previousParentId = card.getAttribute('previous-parent-id')
        const previousParent = document.getElementById(previousParentId)
        previousParent.appendChild(card)
      }

      this.classList.remove('hovered')

      checkGameCompletion()
    })
  })

  // Touchscreen support
  cards.forEach(card => {
    card.addEventListener('touchstart', function (e) {
      draggedCard = card
      e.target.classList.add('dragging')
      startTimer()
    })

    card.addEventListener('touchmove', function (e) {
      e.preventDefault() // Prevent the default touch behavior
      let touchLocation = e.targetTouches[0]
      card.style.top = touchLocation.pageY - 50 + 'px'
      card.style.left = touchLocation.pageX - 50 + 'px'
      card.style.position = 'fixed'
    })

    card.addEventListener('touchend', function (e) {
      card.style.position = ''
      card.style.top = ''
      card.style.left = ''
      e.target.classList.remove('dragging')

      const dropTarget = document.elementFromPoint(
        e.changedTouches[0].pageX,
        e.changedTouches[0].pageY
      )

      if (
        dropTarget &&
        dropTarget.classList.contains('placeholder') &&
        !dropTarget.querySelector('.card')
      ) {
        dropTarget.appendChild(draggedCard)
        moveCount++
        updateMoveCount()
      } else if (draggedCard.getAttribute('previous-parent-id')) {
        const previousParent = document.getElementById(
          draggedCard.getAttribute('previous-parent-id')
        )
        previousParent.appendChild(draggedCard)
      }
      checkGameCompletion()
    })
  })
}

//This function displays the winning modal when the game is completed
function showWinningModal () {
  const winningModal = document.querySelector('.winning-modal')
  winningModal.style.display = 'flex'
  const formattedTime = formatTimeForModal(elapsedTime)
  document.getElementById(
    'winningTime'
  ).innerHTML = `<span class="HoursMins">${formattedTime.hourMin}</span><span class="smaller-seconds">${formattedTime.seconds}</span>`
}

//This is for Restarting the game. It's activated when the restart button is clicked on the winnining modal.
function initializeRestartModal () {
  const winningModal = document.querySelector('.winning-modal')
  const restartModal = document.getElementById('restartModal')
  const sameEmailBtn = document.getElementById('restartSameEmail')
  const diffEmailBtn = document.getElementById('restartDiffEmail')

  document
    .getElementById('restartButton')
    .addEventListener('click', function () {
      winningModal.style.display = 'none' // Hide the Win modal

      restartModal.style.display = 'flex' // Show the restart modal
    })

  sameEmailBtn.addEventListener('click', function () {
    restartModal.style.display = 'none' // Hide the restart modal
    resetGame()
    console.log(userEmailValue) // Checking whether the user email is actually saved. This isjust for debugging purposes
  })

  diffEmailBtn.addEventListener('click', function () {
    restartModal.style.display = 'none' // Hide the restart modal
    document.getElementById('introModal').style.display = 'flex' // Show the intro modal to get new details
  })
}

/*Function to send player's data to the backend through POST and receive back a response*/
function savePlayerScore (name, email, time) {
  const endpoint = 'https://puzzle-game.derrickmal123.workers.dev/' // Replace with your Cloudflare Worker's URL
  const data = {
    name: name,
    email: email,
    scores: time
  }

  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        console.log('Score saved successfully!')

        // Display the top 5 scores
        displayTopScores(data.top5)

        if (data.playerPosition > 5) {
          //Display Player's Position
          const playerResultSection = document.querySelector(
            '.player-result .result-entry'
          )
          console.log(data.playerPosition) //Display the player's position
          playerResultSection.querySelector('span:nth-child(1)').textContent =
            data.playerPosition // Set the player's position
          playerResultSection.querySelector('span:nth-child(3)').textContent =
            name // Set the player's name
          playerResultSection.querySelector('span:nth-child(4)').textContent =
            time // Set the player's timer
        } else {
          const playerResultSection = document.querySelector('.player-result')
          playerResultSection.style.display = 'none' // Hide the Player Results Section
        }
      } else {
        console.error('Error saving score:', data.message)
      }
    })
    .catch(error => {
      console.error('Error sending score:', error)
    })
}

/* Function to display top 5 players*/
function displayTopScores(scores) {
  const topResultsDiv = document.querySelector('.top-results');
  // Clear previous results
  const existingEntries = topResultsDiv.querySelectorAll('.result-entry');
  existingEntries.forEach(entry => entry.remove());

  scores.forEach(score => {
      const entry = document.createElement('div');
      entry.className = 'result-entry';
      
      // Check if the current top player's email matches the player's email
      if (score.email === userEmailValue) {
          entry.classList.add('highlighted-player');
      }

      entry.innerHTML = `
          <span>${score.position}</span>
          <img src="images/user-circle-o.png" alt="User ${score.position}">
          <span>${score.name}</span>
          <span>${score.scores}</span>
      `;
      topResultsDiv.appendChild(entry);
  });
}

