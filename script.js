document.addEventListener('DOMContentLoaded', () => {
  // Manipulating DOM elements
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const gameArea = document.getElementById("game-area");
  const gameOver = document.getElementById("game-over");
  const loader = document.getElementById("loader");
  const scoreBoard = document.getElementById("score-board");
  const roundDisplay = document.getElementById("round-display");
  const finalPoints = document.getElementById("final-points");
  const toast = document.getElementById("toast");
  
  const choices = ["rock", "paper", "scissors"];
  const gameButtons = document.querySelectorAll(".game-btn");
  
  let round = 1;
  let maxRounds = 3;
  let playerScore = 0;
  let computerScore = 0;

  // Hide the footer when the game starts
  startBtn.addEventListener("click", () => {
    document.querySelector('footer').classList.add('hidden');
    document.getElementById("start-display").classList.add("hidden");
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      gameArea.classList.remove("hidden");
      updateRoundDisplay();
    }, 2000);
  });
  
  // Restart game
  restartBtn.addEventListener("click", () => {
    document.querySelector('footer').classList.remove('hidden'); // Show the footer again
    gameOver.classList.add("hidden");
    round = 1;
    playerScore = 0;
    computerScore = 0;
    scoreBoard.textContent = `You: 0 | Computer: 0`;
    gameArea.classList.remove("hidden");
    updateRoundDisplay();
  });
  
  // Update round display
  function updateRoundDisplay() {
    roundDisplay.textContent = `Round ${round}`;
  }
  
  // Show result in toast bar
  function showToast(message, isWinner = false) {
    toast.textContent = message;
    
    if (isWinner) {
      toast.textContent += " 🎉🥳🎉";
    }
  
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }
  
  // Determine the winner of each round
  function playRound(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = "";
    let isWinner = false;
  
    if (playerChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (playerChoice === "rock" && computerChoice === "scissors") ||
      (playerChoice === "paper" && computerChoice === "rock") ||
      (playerChoice === "scissors" && computerChoice === "paper")
    ) {
      result = "You win!";
      playerScore++;
      isWinner = true;
    } else {
      result = "Computer wins!";
      computerScore++;
    }
  
    scoreBoard.textContent = `You: ${playerScore} | Computer: ${computerScore}`;
    showToast(result, isWinner);

    if (round === maxRounds) {
      gameOver.classList.remove("hidden");
      finalPoints.textContent = `Final Score: You ${playerScore} - Computer ${computerScore}`;
      gameArea.classList.add("hidden");
      document.querySelector('footer').classList.remove('hidden'); // Show the footer when the game is over

      if (playerScore > computerScore) {
        showToast("Congratulations! You are the Winner! 🏆", true);
      } else {
        showToast("Better luck next time! 💔", false);
      }
    } else {
      round++;
      updateRoundDisplay();
    }
  }
  
  // Event listeners for game buttons
  gameButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const playerChoice = button.id;
      playRound(playerChoice);
    });
  });
});