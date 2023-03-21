const inputSlider = document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-length]")
const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");

// set password Length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max - min)) + '%';
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRandInteger(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandNumber(){
    return getRandInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65,91));
}
function generateSymbol() {
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSys = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSys = true;
    if(hasUpper && hasLower && (hasNum || hasSys) && passwordLength >= 8) {
        setIndicator("#0f0");
    }else if( (hasLower || hasUpper) && (hasNum || hasSys) && passwordLength >= 6){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value, passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make Copied Message span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}
inputSlider.addEventListener('input',(event) => {
    passwordLength = event.target.value;
    handleSlider();
});
copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value){
        copyContent();
    }
}); 
function handleCheckBox() {
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked) checkCount++;
    });
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}
allCheckBox.forEach( (checkBox) => {
    checkBox.addEventListener('change',handleCheckBox);
});
function shufflePassword(array) {
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math. floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array [j];
        array [j] = temp;
    }
    let str = "";
    array.forEach((el) =>(str += el));
    return str;
}
generateBtn.addEventListener('click',() => {
    if(checkCount <= 0) return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    // remove old password
    password = "";
    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }
    // compulsory addition
    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    // remaining addition
    for(let i = 0; i<passwordLength - funcArr.length; i++){
        let randIndex = getRandInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }
    // shuffle the array
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    // calculate strength
    calcStrength();
});