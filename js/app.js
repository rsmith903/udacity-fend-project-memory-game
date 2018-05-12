let second, minute, startTimer, isFirstClick, matchedCardsCount, movesCounter, starsNum, openCardsList;

const deck = document.querySelector('.deck');
const seconds = document.querySelector('.second');
const minutes = document.querySelector('.minute');
const movesDisplay = document.querySelector('.moves');
const stars = document.querySelector('.stars');
const star = '<li><i class="fa fa-star"></i></li>';
const restartButton = document.querySelector('.restart');
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-button');
const modalContent = document.querySelector('.game-values');
const playAgainButton = document.querySelector('.play-again-btn');

/*
 * Create a list that holds all of your cards
 */

const cardIcons = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-bolt',
    'fa-cube',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb',
];

const cardsArray = cardIcons.concat(cardIcons);

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

shuffle(cardsArray);

function buildCards() {
    // create and add cards
    cardsArray.forEach(function(faClass) {
        let cardElement = `<li class="card"><i class="fa ${faClass}"></i></li>`;
        deck.insertAdjacentHTML('beforeend', cardElement);
    });
}

buildCards();

// Timer:
second = 0;
minute = 1;

function timer() {
    if (second < 60) {
        seconds.textContent = second.toLocaleString(undefined, {minimumIntegerDigits: 2});
        second++;
    } else {
        second = 0;
        seconds.textContent = second.toLocaleString(undefined, {minimumIntegerDigits: 2});
        minutes.textContent = minute.toLocaleString(undefined, {minimumIntegerDigits: 2});
        minute++;
    }
}

function stopTimer() {
    clearInterval(startTimer);
    second = 0;
    minute = 1;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // start timer on first click
isFirstClick = true;

function showCard(event) {
    // prevent click event code execution on open cards and other parts of deck
    if ((event.target === event.currentTarget) ||
        (event.target.classList.contains('show')) ||
        (event.target.classList.contains('fa')) ||
        (event.target.classList.contains('match'))) {
        return true;
    } else { // prevent timer start if clicked outside cards
        if (isFirstClick) {
            startTimer = setInterval(function() {
                timer();
            }, 1000);
            isFirstClick = false;
        }
        event.target.classList.add('open', 'show');
        // test if cards match
        cardTest(event);
    }
}

function hideCard() {
    const openedCard = document.getElementsByClassName('open');
    openedCard[0].classList.add('no-match');
    openedCard[1].classList.add('no-match');
    setTimeout(function(){
        openedCard[0].classList.remove('open', 'show', 'no-match');
        openedCard[0].classList.remove('open', 'show', 'no-match');
    }, 500);
}

// count matched cards
matchedCardsCount = 0;

function matchCard(element) {
    element.parentElement.classList.remove('open', 'show');
    element.parentElement.classList.add('match');
    matchedCardsCount++;
}

// count number of moves (pair of cards clicked)
movesCounter = 0;

function movesCount() {
    movesCounter += 1;
    movesDisplay.textContent = movesCounter;
}

// Stars rating
// create modal rating value, number of stars at the begining of the game
starsNum = `<ul class="stars">
                ${star}
                ${star}
                ${star}
            </ul>`;

function starsRating() {
    if (movesCounter >= 12 && movesCounter < 20) {
        stars.childNodes[5].firstElementChild.style.color = 'rgba(170, 126, 205, 0.3)';
        starsNum = `<ul class="stars">
                        ${star}
                        ${star}
                    </ul>`;
    }
    if (movesCounter >= 20) {
        stars.childNodes[3].firstElementChild.style.color = 'rgba(170, 126, 205, 0.3)';
        starsNum = `<ul class="stars">
                        ${star}
                    </ul>`;
    }
}

openCardsList = [];

function cardTest(event) {
    // push clicked element (card) to a list
    openCardsList.push(event.target.children);
    // test if the two cards are clicked
    if (openCardsList[1]) {
        // test if clicked cards are a match or not
        if (openCardsList[0].item(0).className == openCardsList[1].item(0).className) {
            matchCard(openCardsList[0].item(0));
            matchCard(openCardsList[1].item(0));
            // check for end of the game
            if (matchedCardsCount === 16) {
                stopTimer();
                insertModalContent();
                toggleModal();
            }
        } else {
            // hide cards
            hideCard();
        }
        // clear out the list of cards after the test
        openCardsList.splice(0, 2);

        // increase moves count
        movesCount();

        // check moves count and apply stars rating
        starsRating();
    }
}

deck.addEventListener('click', showCard);

// Restart game (values)
function restartGame() {
    // remove cards from deck
    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
    // remove modal game values
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    shuffle(cardsArray);
    buildCards();
    stopTimer();
    isFirstClick = true;
    matchedCardsCount = 0;
    movesCounter = 0;
    starsNum = `<ul class="stars">
                    ${star}
                    ${star}
                    ${star}
                </ul>`;
    movesDisplay.textContent = movesCounter;
    stars.childNodes[3].firstElementChild.style.color = 'rgba(170, 126, 205, 1)';
    stars.childNodes[5].firstElementChild.style.color = 'rgba(170, 126, 205, 1)';
    seconds.textContent = '00';
    minutes.textContent = '00';
    openCardsList = [];
}
restartButton.addEventListener('click', restartGame);

// Pop-up modal
function insertModalContent() {
    let countValue = movesCounter + 1; // add 1 to count, to get the correct value of the counter
    // create modal content
    let gameValues = `<p class="moves-num"><strong>Number of moves:  </strong><span>${countValue}</span></p>
    <p class="time-played"><strong>Time played: </strong><span>${minutes.textContent}:${seconds.textContent}</span></p>
    <div class="stars-achieved"><strong>Stars earned: </strong>${starsNum}</div>`;
    modalContent.insertAdjacentHTML('beforeend', gameValues);
}

function toggleModal() {
    modal.classList.toggle('show-modal');
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

closeButton.addEventListener('click', toggleModal);
window.addEventListener('click', windowOnClick);
playAgainButton.addEventListener('click', function() {
    toggleModal();
    restartGame();
});
