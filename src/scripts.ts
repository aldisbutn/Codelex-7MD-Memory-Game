const cardBoard = document.querySelector<HTMLDivElement>(".card-board");
const homeScreen = document.querySelector<HTMLDivElement>(".home-screen");
const gameScreen = document.querySelector<HTMLDivElement>(".game-screen");
const endScreen = document.querySelector<HTMLDivElement>(".end-screen");
const startButton = document.querySelector<HTMLButtonElement>(".button-start");
const resetButtons = document.querySelectorAll<HTMLButtonElement>(".button-reset");
const timer = document.querySelector<HTMLTextAreaElement>(".timer");
const score = document.querySelector<HTMLTextAreaElement>(".score");
const totalScore = document.querySelector<HTMLTextAreaElement>(".total-score");

const cards = ["blackcat", "orangecat", "whitecat"];
const cardsDoubled = [...cards, ...cards];
const cardCount = cardsDoubled.length;

let correctCards = 0;
let selectedCard: HTMLDivElement = null;
let activeMove = false;
let startTime = 0;
let timeInterval: NodeJS.Timeout;
let moveCount = 0;
let totalScoreCount = 0;

// Timer
// Start for the timer
const startTimer = () => {
  startTime = Date.now();
  timeInterval = setInterval(updateTimer, 1000);
};

// Timer gets updated every second and updates the text in the HTML
const updateTimer = () => {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  timer.textContent = timer ? `${elapsedTime}s` : "";
};

// Function to stop the timer, this is called when all of the cards are matched
const stopTimer = (): void => {
  clearInterval(timeInterval);
};

// Score
// Move counter, updates the score after every move
const moveCounter = () => {
  moveCount += 1;
  score.textContent = score ? `Score: ${moveCount}` : "";
};

// Game creation
// Creating the cards, adding background to them, adding match checker and setting it to false
const createCards = (card: string): HTMLDivElement => {
  // Creating a div element and adding the class card, a background image and the match checker
  const element = document.createElement("div");
  element.classList.add("card");
  element.style.backgroundImage = `url(assets/images/background.png)`;
  element.setAttribute("matched", "false");

  // If a card is pressed then the card click function runs
  element.addEventListener("click", () => {
    handleCardClick(element, card);
  });

  // Returns a created card
  return element;
};

// Handling card click
const handleCardClick = (cardElement: HTMLDivElement, card: string): void => {
  const match = cardElement.getAttribute("matched");

  // Check if it's an active move, the card is already matched, or it's the selected card
  if (activeMove || match === "true" || cardElement === selectedCard) {
    return;
  }

  // Reveal this card
  cardElement.style.backgroundImage = `url(assets/images/${card}.png)`;

  // If there already isnt a selected card then the current card is the selected one
  if (!selectedCard) {
    selectedCard = cardElement;
    return;
  }

  checkMatchedCards(cardElement, card);
};

// Checking for matched cards
const checkMatchedCards = (cardElement: HTMLDivElement, card: string): void => {
  // Getting the name of the image
  const cardToMatch = selectedCard.style.backgroundImage
    .split("/")
    .pop()
    .split(".")[0];

  // If the cards match, the game attributes are updated
  if (cardToMatch === card) {
    cardElement.setAttribute("matched", "true");
    selectedCard.setAttribute("matched", "true");

    selectedCard = null;
    activeMove = false;
    correctCards += 2;
    moveCounter();

    // If all cards are correct then the timer stops, the total score is calculated and the end screen is displayed with the total score
    if (correctCards === cardCount) {
      stopTimer();
      totalScoreCount = calculateElapsedTime() + moveCount;
      gameScreen.style.display = "none";
      endScreen.style.display = "flex";
      displayTotalScore();
    }

    return;
  }

  // If cards dont match then there is a delay and cards are hidden + game attributes updated
  activeMove = true;

  setTimeout(() => {
    selectedCard.style.backgroundImage = "url(assets/images/background.png)";
    cardElement.style.backgroundImage = "url(assets/images/background.png)";

    activeMove = false;
    selectedCard = null;
    moveCounter();
  }, 1000);
};

// Calculation for the elapsed time
const calculateElapsedTime = (): number => {
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  return elapsedTime;
};

// Total score display
const displayTotalScore = (): void => {
  if (totalScore) {
    totalScore.textContent = `Total score: ${totalScoreCount}`;
  }
};

// Start button function, displays the game screen, starts the timer and creates the cards
startButton.addEventListener("click", () => {
  homeScreen.style.display = "none";
  gameScreen.style.display = "flex";
  endScreen.style.display = "none";

  startTimer();

  // For loop that creates the cards, creates a random index number, selects a card from the double array, and creates a card
  for (let i = 0; i < cardCount; i++) {
    const randomIndex = Math.floor(Math.random() * cardsDoubled.length);
    const cards = cardsDoubled[randomIndex];
    const card = createCards(cards);

    // Removes the created card from the array so there arent any duplicates
    cardsDoubled.splice(randomIndex, 1);

    // Adds the created card to the card board
    cardBoard.appendChild(card);
  }

  // Reset the cardsDoubled array to its original state
  cardsDoubled.splice(0, cardsDoubled.length);
  cardsDoubled.push(...cards, ...cards);
});

// Reset button function - there are two buttons thats why there is a forEach
resetButtons.forEach((resetButton) => {
  resetButton.addEventListener("click", () => {
    // Reset game attributes and start the timer again
    correctCards = 0;
    selectedCard = null;
    activeMove = false;
    moveCount = 0;
    totalScoreCount = 0;
    timer.textContent = "0s";
    score.textContent = `Score: 0`;
    startTimer();

    // Remove all cards from the board
    while (cardBoard.firstChild) {
      cardBoard.removeChild(cardBoard.firstChild);
    }

    // Create new cards for the next game
    for (let i = 0; i < cardCount; i++) {
      const randomIndex = Math.floor(Math.random() * cardsDoubled.length);
      const cardType = cardsDoubled[randomIndex];
      const card = createCards(cardType);
      cardsDoubled.splice(randomIndex, 1);
      cardBoard.appendChild(card);
    }

    // Reset the cardsDoubled array to its original state
    cardsDoubled.splice(0, cardsDoubled.length);
    cardsDoubled.push(...cards, ...cards);

    // Display the game screen
    homeScreen.style.display = "none";
    gameScreen.style.display = "flex";
    endScreen.style.display = "none";
  });
});

