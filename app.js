const cards = document.querySelectorAll(".memory-card");
const refreshBtn = document.querySelector(".reset-game");

const scoreBoard = document.querySelector(".score-board");
const score = document.getElementById("score");
const maxScore = document.getElementById("max-score");

const aler = document.querySelector(".message");

const minute = document.getElementById("minute");
const second = document.getElementById("second");

const icon = document.getElementById("icon");

let cardIsFlipped = false;
let blockBoard = false;
let firstCard, secondCard;

let currentScore = 0;
const FLIP_TIME = 1000;
const CARD_NUMBER = 12;
const MAX_SCORE = CARD_NUMBER / 2;
const INITIAL_TIME = {
    minute: 1,
    second: 0,
};

function flipCard() {
    // block board
    if (blockBoard) return;

    // when double click
    if (this === firstCard) {
        console.log("double");
        return;
    }

    this.classList.add("flip");

    if (!cardIsFlipped) {
        firstCard = this;
        cardIsFlipped = true;
    } else {
        secondCard = this;
        cardIsFlipped = false;
        checkForMatch();
    }
    // reset
}

function checkForMatch() {
    const isMatched = firstCard.dataset.name === secondCard.dataset.name;
    isMatched ? disableCards() : unFlipCards();
}

const disableCards = () => {
    currentScore++;
    updateIcon(true);
    // update UI
    score.textContent = currentScore;
    checkForWin();

    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetCards();
};

const checkForWin = () => {
    if (currentScore !== MAX_SCORE) return;
    scoreBoard.classList.add("hidden");
    aler.classList.add("show");
    // stop timer
    stopTimer();
};

const unFlipCards = () => {
    updateIcon(false);
    blockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        blockBoard = false;
        resetCards();
    }, FLIP_TIME);
};

const resetCards = () => {
    firstCard = undefined;
    secondCard = undefined;
};

const resetScore = () => {
    currentScore = 0;
    score.textContent = currentScore;
};

cards.forEach(function (card) {
    card.addEventListener("click", flipCard);
});

// shuffling cards
function shuffle() {
    cards.forEach((card) => {
        let randomPosition = Math.floor(Math.random() * 12);
        card.style.order = randomPosition;
    });
}

// reset game
refreshBtn.addEventListener("click", () => {
    icon.textContent = "🙂";
    aler.classList.remove("show");
    scoreBoard.classList.remove("hidden");
    resetScore();

    clearInterval(interValID);

    refreshBtn.disabled = true;
    refreshBtn.textContent = "Loading...";

    resetCards();
    blockBoard = true;
    // unFlip all cards
    cards.forEach((card) => card.classList.remove("flip"));
    // add lại event cho các thẻ giống nhau đã đc click
    cards.forEach(function (card) {
        card.addEventListener("click", flipCard);
    });

    // chờ đến khi lật các thẻ xong
    setTimeout(() => {
        shuffle();
        blockBoard = false;
        refreshBtn.disabled = false;
        refreshBtn.textContent = "Reset";
        resetTimer();
    }, FLIP_TIME);
});

/**** TIMER */
let minutes = INITIAL_TIME.minute;
let seconds = INITIAL_TIME.second;
let interValID;

const startTimer = () => {
    console.log("start timer");
    interValID = setInterval(() => {
        if (seconds === 0) {
            if (minutes > 0) {
                minutes--;
            } else {
                // hết thời gian
                handleTimeUp();
                return;
            }
        }
        seconds--;
        if (seconds === -1) seconds = 59;
        updateTimerUI();
        // console.log(minutes, seconds);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(interValID);
};

const resetTimer = () => {
    console.log("reset time");
    [minutes, seconds] = [INITIAL_TIME.minute, INITIAL_TIME.second];
    updateTimerUI();
    startTimer();
};

const handleTimeUp = () => {
    // nêu hết time : stop timer và hiện thông báo, ẩn score
    stopTimer();
    aler.textContent = "Time up!";
    aler.classList.add("show");
    scoreBoard.classList.add("hidden");
    updateIcon(false);
    // block board
    blockBoard = true;
};

// call every time refresh page
window.addEventListener("load", () => {
    shuffle();
    resetTimer();
});

const updateTimerUI = () => {
    minute.textContent = minutes < 10 ? `0${minutes}` : minutes;
    second.textContent = seconds < 10 ? `0${seconds}` : seconds;
};

// Fun Icon
const updateIcon = (isCorrect) => {
    // update icon
    icon.textContent = isCorrect ? "😍" : "🙁";
};
