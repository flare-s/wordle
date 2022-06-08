const keyboard = document.querySelector(".keyboard");
const rows = document.querySelector(".rows");

const message = document.querySelector(".message");

// Keyboard inputs 
const strokes = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del'],
];


// Fixed answer for now
const word = "award";

const guessRows = rows.querySelectorAll(".row");
let rowPosition = 0;
let guessPosition = 0;
let gameOver = false;


// Create the keyboard inputs and put it on page
const createButtons = () => {
    // Creating input buttons ffor each row
    let keysRows = keyboard.querySelectorAll(".keys").forEach((keysRow, i) => {
        strokes[i].forEach(letter => {
            let button = document.createElement("button");
            button.textContent = letter;
            button.classList.add("key");
            button.setAttribute("data-value", letter);
            button.addEventListener("click", (e) => handleButton(e, letter));
            keysRow.append(button);
        })
    });
}


// Create rows for the guesses
const createGuessBoxes = () => {
    // Create guess boxex for each row
     guessRows.forEach((guessRow, rowIndex) => {
        guessRow.setAttribute("data-row", rowIndex);
        for (let i = 0; i < 5; i++) {
            let div = document.createElement("div");
            div.classList.add("guess");
            div.setAttribute("data-place", `row-${rowIndex}-guess-${i}`);
            guessRow.append(div);
        }
    })
}



// Adding a letter to the guess row
const addLetter = (letter, button) => {
    let guess = document.querySelector(`[data-place="row-${rowPosition}-guess-${guessPosition}"] `);
    // Add a guessing letter only if the row isn't full
    if (guessPosition < 5 && button.length === 1) {
        guess.textContent = letter;
        guessPosition++;
    }
}


// Delete letter from the guess row
const deleteLetter = () => {
    // Delete a guess letter only if the row isn't empty
    if (guessPosition > 0) {
        guessPosition--;
        let guess = document.querySelector(`[data-place="row-${rowPosition}-guess-${guessPosition}"] `)
        guess.textContent = "";
    }
}


// Checking if the guess matches the answer
const checkFinalAnswer = (guess, answer) => {
    if (guess === answer) {
        // show a success message
        generateMessage("That's right, you guessed correctly.")
    } else {
        rowPosition ++;
        guessPosition = 0;
        // if the final row is full and the answer is wrong, show a game over message.
        if (rowPosition > 5) {
            generateMessage("Game over. Better luck next time.")
            gameOver = true;
            return;
        }
    }
}


// Add color for each guess position. 
const addColor = (answer, guess, wordCopy) => {


    for (let i = 0; i < answer.length; i++) {
        let currentguess = document.querySelector(`[data-place="row-${rowPosition}-guess-${i}"] `);
        // If the guessed letter in the correct position:
        if (answer[i] === guess[i]) {
            // Get input button of the keyboard on screen
            let btn = document.querySelector(`[data-value=${guess[i]}]`);
            // Remove the letter from the copied word
            wordCopy = wordCopy.replace(guess[i], "");
            //Add background color for the guess letter to indicate that it's in the correct position
            currentguess.classList.add("correct-position");
            //Add background color for the the keyboard button to indicate that it's in the correct position
            btn.classList.add("correct-position");
        }
    }

    for (let i = 0; i < word.length; i++) {
        let currentguess = document.querySelector(`[data-place="row-${rowPosition}-guess-${i}"] `);
        // If the guessed letter is part of the answer but not in the correct position:
        if (wordCopy.includes(guess[i]) && guess[i] !== answer[i]) {
            // Get input button of the keyboard on screen
            let btn = document.querySelector(`[data-value=${guess[i]}]`);
            // Remove the letter from the copied word
            wordCopy = wordCopy.replace(guess[i], '');
            //Add background color for the guessed letter to indicate that it's not in the correct position
            currentguess.classList.add("wrong-position");
            //Add background color for the the keyboard button to indicate that it's not in the correct position
            btn.classList.add("wrong-position");
        // If the guessed letter isn' correct:
        } else if(!wordCopy.includes(guess[i]) && guess[i] !== answer[i]) {
            // Get input button of the keyboard on screen
            let btn = document.querySelector(`[data-value=${guess[i]}]`);
            //Add background color for the guessed letter to indicate that it's not correct
            currentguess.classList.add("wrong");
            //Add background color for the the keyboard button to indicate that it's not correct
            btn.classList.add("wrong");
            
        }   
    } 


    
    
}


// checking the guess
const checkGuess = (answer) => {
    //Check the current row's answer only if all the guess boxes are full
    if (guessPosition > 4) {
        // Create an array and add all the guessed letters to it
        let guess = [];
        document.querySelectorAll(`[data-row="${rowPosition}"] .guess`).forEach(guessed => guess.push(guessed.textContent));
        guess = guess.join("");
        // Make a copy of the answer to check if the guessed letter are correct and their position
        let wordCopy = answer;
        // Add the appropriate background to the buttons and guessed letters
        addColor(answer, guess, wordCopy);
        // Check if the guess matches the answer
        checkFinalAnswer(guess, answer);
    }
}


// Generate a message depending on if the the player wins or looses
const generateMessage = (messageContent) => {
    let div = document.createElement("message");
    div.textContent = messageContent;
    message.append(div);
    message.classList.add("show");
    setTimeout(() => {
        message.classList.remove("show");
        message.removeChild(div);
    }, 3000);
    
}


// Binding the functionality to the generated keyboard (page keyboard) 
const handleButton = (e, letter) => {
    e.target.blur()
    if (!gameOver) {
         addLetter(letter, e.target.textContent );

        if (e.target.textContent === "del"  ) {
            deleteLetter();
        }

        if (e.target.textContent === "enter") {
            checkGuess(word);
        }
    }
    
}

// Binding the functionality to the device keyboard
const handlePress = (e) => {
    let key = e.key.toLowerCase();
    if (!gameOver) {
        let isLetter =  key.match(/[a-z]/gi);
        if (isLetter) {
            addLetter(key, key);
        }

        if (key === "enter") {
            checkGuess(word);
        }

        if (key === "backspace") {
            deleteLetter();
        }
    }
}



window.addEventListener("keyup", (e) => handlePress(e));

createButtons();
createGuessBoxes();