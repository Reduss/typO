/**
 * each word is in it's own div
 * parse each word by single letter
 * get keyboard input
 * if event.key matches the parsed letter, move to next letter <-- repeat until last letter
 * is space is pressed any time, go to next word, unles current letter the first one in the word
 * navigation with the keyboard (like on monkeytype)
 * calculate raw wpm
 *      ALGORITHM:
 *          after the first keystroce the clock is started, after the final one it's stopped.
 *          WPM_raw = (numOfTypedCharacters / 5) / minutesSpent
 * calculate accuracy
 *      ALGORITHM:
 *          acc = numOfCorrectChars / numOfTotalChars [multiply by 100 for percentage]
 * calculate wpm (with accuracy)
 *      ALGORITHM:
 *          WPM = WPM_raw * accuracy
 * Sources:
 *  https://www.speedtypingonline.com/typing-equations
 *  https://www.typing.com/blog/what-is-words-per-minute/
 * N words and 1min modes first but make sure the architecture is scalable and it will be easy to add more modes and word sources
 *  en and uk on start, add more later
 * NOTE !!! it is probably possible to fetch the words from github (or other remote source) directly, 
 *      keeping them localy seems a bit stupid
 * 
 * HOW TO RECORD STATS:
 *  - we need total number of characters, number of typed charactes and time
 *  - total num can be calculated any time considering we're having an array of words we're working with
 *  - for modes depending on time, but not on word num, we will be fetching a fixed amount of words 
 *      and than adding them to the pool. 
 * ON INPUT
 * if correct letter pressed
 *  letter.color = correct_color
 *  goto next letter
 * else if incorrect letter pressed
 *  letter.color = incorrect_color
 *  goto next letter
 * if space pressed
 *  goto next word;
 * if letter ended && !space pressed
 *  add typed letters (color = incorrect_color) to htlm until space is pressed
 * 
 * 
 * goto next word only on space pressed !!
 * backspace works as usual but only on current word
 * 
 * #activeWord
 * #currentLetter
 *      
*/

/*
кароч покишо забиваємо болт на обробку преформатед коду,
добавимо просто тоді поверх існуючих нові функції.

обробка слів:
штмл структура:
слово
    буква
    буква
    ...
    буква
слово
чому так? удобніший переход зі слова на слово, і удобний трек курсора

онКійДаун курсор (:біфор) слайде вправо і перехде в біфор наступної букви
спейс переводе на наступне слово
бекпейс працює тіки на активному слові

інкорект строук: курсор далі й сет колор на інкоректКолор
аналогічно з корект
якшо слово закінчилось, а нажимається не спейс, просто апендим в слово нові леттерс (ті, що нажимаються)

*/


const CONTAINER = document.getElementById("words-container");

let WORDS = [];
let CURRENT_WORD = null;
let CURRENT_CHAR = null;  


function addContainerTest(){
    let e = document.createElement("div")
    e.classList.add("container")
    document.body.appendChild(e);
}


// TODO: the button should reload the test, not start it 
// TODO: can store code  (multiline) files in an object in a separate .js file LOOOOOOOOOLWAIT  
// TODO: прочекай як це зроблено на манкітайпі (інпут і тд), модливо можна і нам так переписати


async function fetchWords(langCode){
    clearWords();
    let res = await fetch(`data/${langCode}.json`);
    let data = await res.json();
    if(langCode === "en")
        data.words.forEach(el => WORDS.push(el.englishWord));
    else
        data.words.forEach(el => WORDS.push(el.targetWord));
}


function init(mode, lang){
    //fetch depending on mode and event listener here
}

//parameters fro start function: mode and language
async function startTest(){
    // start clock with the first keystroke (space or letter)
    // 
    try{
        await fetchWords("en")
    }catch(e){
        console.log("Couldn't fetch the data")
        console.log("Exiting...")
        return;
    }
    appendWords(10);
    CURRENT_WORD = CONTAINER.firstElementChild;
    CURRENT_CHAR = CURRENT_WORD.firstElementChild;
    CURRENT_WORD.id = "active-word"
    CURRENT_CHAR.id = "current-letter"
    addEventListener("keydown", event=> handleInput(event))
}

function setNextActiveWord(){
    if(CURRENT_WORD.nextSibling !== null){
        let temp = CURRENT_WORD.nextSibling 
        CURRENT_WORD.removeAttribute("id")
        CURRENT_WORD = temp
        CURRENT_WORD.id = "active-word"
        CURRENT_CHAR.removeAttribute("id");
        CURRENT_CHAR = CURRENT_WORD.firstElementChild;
        CURRENT_CHAR.id = "current-letter"

    }else{
        // TODO: handle this better
        console.log("End of word list")
        return -1;
    }
}

function appendToWordEnd(char){
    /*
    let letter = document.createElement("div")
    letter.classList.add("letter")
    letter.classList.add("letter-incorrect")
    letter.innerHTML = "#"
    // char into innerhtml
    
    CONTAINER.appendChild(str).after(CURRENT_WORD);
    */
}

// TODO: я блять такого спагетті кода ще давно не бачив, фікси



function setNextChar(){

    if(CURRENT_CHAR.nextSibling === null){
        // TODO: gotta change the :before position to the end of the word
        console.log("No next char")
        appendToWordEnd();
        return;
    }
    let temp = CURRENT_CHAR.nextSibling;
    CURRENT_CHAR.removeAttribute("id")
    CURRENT_CHAR = temp;
    CURRENT_CHAR.id = "current-letter";
}

function setPrevChar(){
    if(CURRENT_CHAR.previousSibling === null)
        return;
    let temp = CURRENT_CHAR.previousSibling;
    CURRENT_CHAR.previousSibling.style = "color: var(--font-color)";
    CURRENT_CHAR.removeAttribute("id")
    CURRENT_CHAR = temp;
    CURRENT_CHAR.id = "current-letter";
}

function onCorrectKeyStroke(){
    CURRENT_CHAR.style = "color: var(--letter-correct-color);"
    setNextChar()
}

function onIncorrectKeyStroke(char){
    CURRENT_CHAR.style = "color: var(--letter-incorrect-color);"
    setNextChar()
}

function handleInput(event){
    console.log(event.key)
    switch(event.key){
        case " ":
            setNextActiveWord();
            break;
        case "Backspace":
            setPrevChar();
            break;
        case "Tab":
            break;
        case "Escape":
            break;
        case "Enter":
            break;
        default:
            if(event.key === CURRENT_CHAR.innerHTML)
                onCorrectKeyStroke(event.key);
            else
                onIncorrectKeyStroke();
            break;
    }
}


function appendWords(numOfWords){
    for(let i = 0; i < numOfWords; i++){
        let randInd = Math.floor(Math.random() * (WORDS.length));
        renderWord(WORDS[randInd]);
    }
}


function renderWord(strWord){
    let str = "";
    str = strWord;
    let wordElem = document.createElement("div")
    wordElem.classList.add("word");
    wordElem.id=
    CONTAINER.appendChild(wordElem);
    for(let i = 0; i < strWord.length; i++){
        let letterElem = document.createElement("div")
        letterElem.classList.add("letter");
        letterElem.innerHTML += strWord[i];
        wordElem.appendChild(letterElem);
    }
}


function clearWords(){
    while(WORDS.length !== 0)
        WORDS.pop();
}


//startTest();
//console.log(WORDS)
//appendWords(10);



