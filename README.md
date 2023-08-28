# Jigsaw Puzzle Game

This is a simple yet engaging Jigsaw Puzzle game built with HTML, CSS, and JavaScript. The game involves dragging and dropping puzzle pieces onto the correct placeholders on the game board. The game tracks the player's time and move count, and it features a leaderboard that displays the top 5 players.

## Setup

1. Clone the repository to your local machine.
git clone <repository-url>

2. Navigate to the project directory.
cd jigsaw-puzzle

3. Open the `index.html` file in your web browser to start the game.

## Usage

1. Enter your name and email to start the game.
2. Drag and drop the puzzle pieces from the sideboard onto the correct placeholders on the game board.
3. The game ends when all the puzzle pieces are placed in the correct positions.
4. Your score (time taken to complete the puzzle) will be saved and you will be redirected to a winning modal that displays the top 5 players and your position.

## Deployment

To deploy the game on a server, simply upload the entire project directory to your server's public HTML directory. The game can then be accessed via the server's public URL.

## How the Game Works

The game starts when the player enters their name and email and clicks the "OK" button. The puzzle pieces are randomly placed on the sideboard and the player must drag and drop them onto the correct placeholders on the game board.

The game tracks the player's time and move count. The timer starts when the player starts dragging a puzzle piece and stops when all the puzzle pieces are placed in the correct positions.

When the game ends, the player's score (time taken to complete the puzzle) is saved and the player is redirected to a winning modal that displays the top 5 players and the player's position. If the player's score is among the top 5, their score will be highlighted in the leaderboard.

The player can choose to restart the game with the same email or a different email. If the player restarts the game with the same email and their new score is better than their previous score, their previous score will be replaced with the new score in the leaderboard.