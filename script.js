document.addEventListener('DOMContentLoaded', () => {
  const RPS = "https://rps101.pythonanywhere.com/api/v1/objects/all";

  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const gameArea = document.getElementById("game-area");
  const gameOver = document.getElementById("game-over");
  const loader = document.getElementById("loader");
  const scoreBoard = document.getElementById("score-board");
  const roundDisplay = document.getElementById("round-display");
  const finalPoints = document.getElementById("final-points");
  const toast = document.getElementById("toast");
  const darkModeToggle = document.getElementById("dark-mode-toggle");

  let round = 1;
  const maxRounds = 3;
  let playerScore = 0;
  let computerScore = 0;

  const choiceIcons = {
    Rock: '🪨',
    Paper: '📄',
    Scissors: '✂️'
  };

  const choices = ["Rock", "Paper", "Scissors"];

  // Start Game
  startBtn.addEventListener("click", () => {
    document.querySelector('footer').classList.add('hidden');
    document.getElementById("start-display").classList.add("hidden");
    loader.classList.remove("hidden");

    setTimeout(() => {
      loader.classList.add("hidden");
      gameArea.classList.remove("hidden");
      renderButtons(choices);
      updateRoundDisplay();
    }, 2000);
  });

  // Render RPS buttons
  function renderButtons(choices) {
    const gameButtonsContainer = document.getElementById('game-buttons');
    gameButtonsContainer.innerHTML = '';

    choices.forEach(choice => {
      const button = document.createElement('button');
      button.textContent = choiceIcons[choice] || choice;
      button.classList.add('game-btn');
      button.setAttribute('aria-label', choice);
      button.id = choice.toLowerCase();
      button.addEventListener('click', () => handlePlayerChoice(choice));
      gameButtonsContainer.appendChild(button);
    });
  }

  // Handle player click
  function handlePlayerChoice(choice) {
    playRound(choice);
  }

  // Play 1 round
  function playRound(playerChoice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = "";
    let isWinner = false;

    if (playerChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (playerChoice === "Rock" && computerChoice === "Scissors") ||
      (playerChoice === "Paper" && computerChoice === "Rock") ||
      (playerChoice === "Scissors" && computerChoice === "Paper")
    ) {
      result = "You win!";
      playerScore++;
      isWinner = true;
    } else {
      result = "Computer wins!";
      computerScore++;
    }

    scoreBoard.textContent = `You: 🧍 ${playerScore} | Computer: 💻 ${computerScore}`;
    showToast(result, isWinner);

    if (round === maxRounds) {
      gameOver.classList.remove("hidden");
      finalPoints.textContent = `Final Score: You ${playerScore} - Computer ${computerScore}`;
      gameArea.classList.add("hidden");
      document.querySelector('footer').classList.remove('hidden');

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

  // Update Round UI
  function updateRoundDisplay() {
    roundDisplay.textContent = `Round ${round}`;
  }

  // Restart Button
  restartBtn.addEventListener("click", () => {
    resetGame();
  });

  function resetGame() {
    document.querySelector('footer').classList.remove('hidden');
    gameOver.classList.add("hidden");
    round = 1;
    playerScore = 0;
    computerScore = 0;
    scoreBoard.textContent = `You: 🧍 0 | Computer: 💻 0`;
    gameArea.classList.remove("hidden");
    updateRoundDisplay();
    showToast("Game restarted 🔁");
  }

  // Show Toast Notification
  function showToast(message, isWinner = false) {
    toast.textContent = message;
    if (isWinner) toast.textContent += " 🎉🥳🎉";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // Dark mode toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      document.body.classList.toggle('dark-mode', e.target.checked);
      showToast(e.target.checked ? "Dark Mode Enabled 🌙" : "Light Mode Enabled ☀️");
    });
  }

  // Keyboard shortcut to restart
  document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
      if (gameOver.classList.contains("hidden")) return;
      resetGame();
    }
  });
});