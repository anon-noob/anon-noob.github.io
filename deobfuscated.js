// Highly recommend playing the game before looking here!

let validWords;
let guessCount;
let solution;

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

let words = ['0x5A24CD629F6B', '0x5DC81F9B3E54', '0x960B15C1FEB', '0xA781DAC7E73', '0x68B076D38B8C', '0x585235332A05', '0xA46503C0C7B', '0x68B19FE53E2C', '0xA8F4DA2AA2B', '0x593CABBBB42C', '0xE8C375F0A0', '0x9498CA8666D', '0x94963BD16C3', '0x8EC41EA9E83', '0xAE94BD7F1FA', '0x917A2047DBB', '0x5F98DAE5217C', '0x593B45ED316C', '0x68AFC34BFB24', '0x68B341B98D74', '0xA78469DF454', '0xE8C8ABD149', '0x90377A8D4D6', '0x10C024C6BE3', '0x5A2278BE24EC', '0x90377A8E478', '0x6B6A7D223C7B', '0x68B128ECDE25', '0x5A241A923D74', '0xA0076D76418', '0x65F581DC72F4', '0xA78469DE0DA', '0xA323D8A4BC5', '0x1105D6693C5', '0x8EC58EB3ED3', '0x91AA91AABE1', '0xA3226914CA0', '0x6998D34EFB03', '0x699AECB4063A', '0x585236180014', '0x98C0C84C893', '0xA320EAF4B71', '0x68B0B1B73E6D', '0x593A92C13A33', '0x65F493253661', '0x977D019A653', '0xE6C359A91D', '0x9493A0B90DD', '0xA7841839A9C', '0x60835097DD33']

function toChar(str) {
    code = "";
    finalResult = "";
    for (char of str) {
        code += char;
        if (96 < Number(code) && Number(code) < 123) {
            finalResult += String.fromCharCode(code);
            code = "";
        }
    }
    return finalResult
}

function handleSubmit(event) {
    event.preventDefault()
    
    // solution
    let trueSol = "<No Leaking>";

    // get elements
    var inputField = document.getElementById('input-field');
    var displayDiv = document.getElementById('result');

    var inputData = inputField.value.toLowerCase();

    // validation
    if (!/[a-zA-Z]+/.test(inputData) || inputData.length != 5) {
        displayDiv.innerHTML = `<span style='color:red'>There seems to be an error, try again</span>`;
        return;
    }
    if (!validWords.includes(inputData)) {
        displayDiv.innerHTML = `<span style='color:red'>${inputData} is not a valid word</span>`;
        return;
    }

    // reset input field
    inputField.value = "";

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
    if (guessCount === 1) {
        displayCount.textContent = `You guessed ${guessCount} time`
    } else {
        displayCount.textContent = `You guessed ${guessCount} times`
    }

    // display the input
    displayDiv.textContent = `You typed ${inputData}`;
    
    let table = document.getElementById("table");    
    
    // The Main Calculations
    // green letters
    for (let i = 0; i < trueSol.length; i++) {
        if (trueSol[i] === inputData[i]) {
            table.rows[guessCount].cells[i].innerHTML = `<span style="color:green">${inputData[i]}</span>`;
            charCount[inputData[i]]--;
            delete charPos[i];
        }
    }

    // win
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

    // lose
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
            displayCount.textContent = `Lose! Word was ${toChar(parseInt('0x5A24CD629F6B').toString())}.`
            break;
    }

    document.getElementById("extra").textContent = "You probably still tried to cheat"
}
