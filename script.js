document.addEventListener('DOMContentLoaded', () => {
  const RPS_API = "https://rps101.pythonanywhere.com/api/v1/objects/all";

  // DOM Manipulation Elements
  const startBtn = document.getElementById("start-btn");
  const gameArea = document.getElementById("game-area");
  const loader = document.getElementById("loader");
  const startDisplay = document.getElementById("start-display");
  const roundDisplay = document.getElementById("round-display");
  const gameButtons = document.getElementById("game-buttons");
  const outcome = document.getElementById("outcome");
  const scoreBoard = document.getElementById("score-board");
  const gameOver = document.getElementById("game-over");
  const finalPoints = document.getElementById("final-points");
  const restartBtn = document.getElementById("restart-btn");
  const toast = document.getElementById("toast");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const playerNameInput = document.getElementById("player-name");
  const pageFooter = document.getElementById("page-footer");

  let round = 1;
  let userScore = 0;
  let computerScore = 0;
  const maxRounds = 3;
  let currentChoices = ["Rock", "Paper", "Scissors"];
  let playerName = "";

  const emojiMap = {
    Rock: "🪨",
    Paper: "📄",
    Scissors: "✂️"
  };

  // Set dark mode from localStorage
  const isDarkMode = localStorage.getItem('dark-mode') === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
  });

  startBtn.addEventListener("click", async () => {
    playerName = playerNameInput.value.trim();

    if (playerName === "") {
      showToast("Please enter your name to play the game.");
      return;
    }

    startDisplay.classList.add("hidden");
    loader.classList.remove("hidden");

    try {
      const res = await fetch(RPS_API);
      const data = await res.json();

      const filtered = data.filter(item =>
        ["rock", "paper", "scissors"].includes(item.toLowerCase())
      ).map(item => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase());

      currentChoices = filtered;
      renderButtons(filtered);
    } catch (err) {
      console.error("API error:", err);
      showToast("Using default choices due to API error");
      renderButtons(currentChoices);
    }

    loader.classList.add("hidden");
    gameArea.classList.remove("hidden");

    // Hide footer when the game is being played
    pageFooter.classList.add("hidden");

    // Update score display with the player's name
    scoreBoard.textContent = `${playerName}:🧍 ${userScore} | Computer:💻 ${computerScore}`;
  });

  function renderButtons(choices) {
    gameButtons.innerHTML = "";
    choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = `${emojiMap[choice] || " "} ${choice}`;
      btn.classList.add("choice-btn");
      btn.addEventListener("click", () => playRound(choice));
      gameButtons.appendChild(btn);
    });
    roundDisplay.textContent = `Round ${round} - ${playerName} vs Computer`;
  }

  function playRound(playerChoice) {
    if (round > maxRounds) {
 
      return;
    }

    const computerChoice = currentChoices[Math.floor(Math.random() * currentChoices.length)];
    let result = "";

    // Logic to calculate the result of the round
    if (playerChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (playerChoice === "Rock" && computerChoice === "Scissors") ||
      (playerChoice === "Paper" && computerChoice === "Rock") ||
      (playerChoice === "Scissors" && computerChoice === "Paper")
    ) {
      result = "You win this round!";
      userScore++;
    } else {
      result = "Computer wins this round!";
      computerScore++;
    }

    outcome.innerHTML = `You chose ${emojiMap[playerChoice] || playerChoice}, Computer chose ${emojiMap[computerChoice] || computerChoice}.<br>${result}`;

    outcome.style.color = result.includes("win") ? "green" : result.includes("tie") ? "orange" : "black";

    // Update score board
    scoreBoard.textContent = `${playerName}:🧍 ${userScore} | Computer:💻 ${computerScore}`;

    round++;
    if (round > maxRounds) {
      endGame();
      
    } else {
      roundDisplay.textContent = `Round ${round}`;
    }
  }

  function endGame() {
    // Prevent further round clicks by disabling pointer events on buttons
    gameButtons.style.pointerEvents = 'none'; 
  
    gameArea.classList.add("hidden");
    gameOver.classList.remove("hidden");
  
    // Hide the footer when the game ends
    pageFooter.classList.add("hidden");
  
    // Determine the winner and show the result with emojis
    if (userScore > computerScore) {
      finalPoints.textContent = `🎉 ${playerName} is the winner! 🎉\nYour Score: ${userScore} - ${computerScore} 💻`;
    } else if (userScore < computerScore) {
      finalPoints.textContent = `💻 Computer wins the game! 💻\nScore: ${userScore} - ${computerScore} 🎉`;
    } else {
      finalPoints.textContent = `🤝 It's a draw! 🤝\nScore: ${userScore} - ${computerScore}`;
    }
  
    // Update leaderboard after the game ends
    let leaderboard = JSON.parse(localStorage.getItem("rpsLeaderboard")) || [];
    leaderboard.push({ name: playerName, score: userScore });
    localStorage.setItem("rpsLeaderboard", JSON.stringify(leaderboard));
  }
  
  restartBtn.addEventListener("click", () => {
    round = 1;
    userScore = 0;
    computerScore = 0;
    roundDisplay.textContent = `Round ${round}`;
    outcome.textContent = "";
    scoreBoard.textContent = `${playerName}:🧍 0 | Computer:💻 0`;
    gameOver.classList.add("hidden");
    startDisplay.classList.remove("hidden");
  
    // Enable the buttons for the new game
    gameButtons.style.pointerEvents = 'auto'; 
  
    // Show footer again after restarting the game
    pageFooter.classList.remove("hidden");
  });
  
  function showToast(message, duration = 3000) {
    toast.textContent = message;
    toast.className = "show";
    setTimeout(() => {
      toast.className = toast.className.replace("show", "");
    }, duration);
  }

  // 🎹 Keyboard shortcuts: R, P, S
  document.addEventListener("keydown", (e) => {
    if (!gameArea.classList.contains("hidden")) {
      const key = e.key.toLowerCase();
      if (key === "r") playRound("Rock");
      else if (key === "p") playRound("Paper");
      else if (key === "s") playRound("Scissors");
    }
  });
});