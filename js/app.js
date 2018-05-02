/*
 * Create a list that holds all of your cards
 */


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

const deck = document.querySelector(".deck");

function showCard(event) {
    event.target.classList.add("open", "show");
    // test if cards match
    cardTest(event);
}

function hideCard() {
    const openedCard = document.getElementsByClassName("open");
    openedCard[0].classList.add("no-match");
    openedCard[1].classList.add("no-match");
    setTimeout(function(){
        openedCard[0].classList.remove("open", "show", "no-match");
        openedCard[0].classList.remove("open", "show", "no-match");
    }, 500);
}

function matchCard(element) {
    element.parentElement.classList.remove("open", "show");
    element.parentElement.classList.add("match");
}

let openCardsList = [];
function cardTest(event) {
    // push clicked element (card) to a list
    openCardsList.push(event.target.children);
    // test if the two cards are clicked
    if (openCardsList[1]) {
        // test if clicked cards are a match or not
        if (openCardsList[0].item(0).className == openCardsList[1].item(0).className) {
            matchCard(openCardsList[0].item(0));
            matchCard(openCardsList[1].item(0));
        } else {
            // hide cards
            hideCard();
        }
        // Clear out the list of cards after the test
        openCardsList.splice(0, 2);
    }
}

deck.addEventListener('click', showCard);
