// Highly recommend not looking at this before you play!!!

let validWords;
let guessCount;
let solution;
let trueSol;

function readTextFile() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    validWords = xhr.responseText;
                    resolve(validWords);
                } else {
                    reject(new Error(`Failed to load the file. Status: ${xhr.status}`));
                }
            }
        };

        xhr.open('GET', '5 letter words.txt', true);
        xhr.send();
    });
}

readTextFile()
    .then((value) => {
        console.log(`Loaded dictionary`);
        guessCount = 0;
        // trueSol = words[Math.floor((Math.random() * words.length))];
        trueSol = "glass";
        solution = "Did you really think you can get away with this";
        return Promise.resolve();
    })
    .then(() => {
        console.log(`Guess counter is ready`);
        console.log(`The solution has been decided`);
    })
    .catch((error) => {
        console.error(error);
    });

let words = ["jumps", "sneak", "shift", "burst", "strat", "tiers", "slime", "block", "cocoa", "input", "chest", "water", "anvil", "grind", "skull", "cross", "angle", "pitch", "champ", "glass", "hands", "penta", "truer", "catch", "coord", "pessi", "delay", "snipe", "panes", "blips", "chain", "plate", "slabs", "fence", "cakes", "speed", "boost", "vines", "sword", "doors", "flick", "cacti", "heads", "stair", "table", "frame", "stand", "boats", "pixel", "ticks", "manip"];

function handleSubmit(event) {
    event.preventDefault()
    
    // Get the input value
    var inputData = document.getElementById('input-field').value;
    
    var displayDiv = document.getElementById('result');

    // validation
    if (!/[a-zA-Z]+/.test(inputData) || inputData.length != 5) {
        displayDiv.innerHTML = `<span style='color:red'>There seems to be an error</span>`;
        return;
    }
    if (!validWords.includes(inputData)) {
        displayDiv.innerHTML = `<span style='color:red'>${inputData} is not a valid word</span>`;
        return;
    }

    // reset
    document.getElementById('input-field').value = "";

    let charPos = {};
    for (let i = 0; i < trueSol.length; i++) {
        charPos[i] = inputData[i];
    }

    let charCount = {};
    for (let char of trueSol) {
        charCount[char] = (charCount[char] || 0) + 1;
    }


    guessCount++;
    var displayCount = document.getElementById('count');
    displayCount.textContent = `You guessed ${guessCount} times`

    // Display the input data in a div
    
    displayDiv.textContent = "Entered Data: " + inputData;
    
    let table = document.getElementById("table");             

    // green letters
    for (let i = 0; i < trueSol.length; i++) {
        if (trueSol[i] === inputData[i]) {
            table.rows[guessCount].cells[i].innerHTML = `<span style="color:green">${inputData[i]}</span>`;
            charCount[inputData[i]]--;
            delete charPos[i];
        }

    }

    if (inputData === trueSol) {
        result("win");
        return
    }

    // yellow and gray letters
    Object.entries(charPos).forEach( ([index, char]) => {
        if (trueSol.includes(char) && charCount[char] > 0) {
            table.rows[guessCount].cells[index].innerHTML = `<span style="color:gold">${char}</span>`;
            charCount[char]--;
        } else {
            table.rows[guessCount].cells[index].innerHTML = `<span style="color:gray">${char}</span>`;
        }
    })

    if (guessCount === 6) {
        result("lose")
        return
    }
}

function result(str) {
    document.getElementById('input-field').disabled = true;
    document.getElementById('submit').disabled = true;

    switch (str) {
        case "win":
            var displayCount = document.getElementById('count');
            displayCount.textContent = `Win! Took ${guessCount} guesses.`
            break;
        
        case "lose":
            var displayCount = document.getElementById('count');
            displayCount.textContent = `Lose! Word was ${trueSol}.`
            break;
    }

    document.getElementById("extra").textContent = "More updates will come! (yea this is my first time touching html and js)"
}
