/**
 * Created by Michael on 1/25/2017.
 */
var inputArray = [''];
var inputPointer = 0;

function takeKeyboardInput(){
    $('body').keypress(function(event){
        console.log('key presses are registered : '+ event.which);
        if ((48 <= event.which && event.which <= 57) || (event.which >= 105 && event.which <=105 || event.which == 46)){
            console.log('this is the number being passed' + event.key);
            takeNumber(event.key);
        }
        else if(event.which == 13){
            console.log('Your answer is...');
            takeEquals();
        }
        else{
            console.log('this is the operator being passed' + event.key);
            takeOperator(event.key);
        }
    })
}

function resetCalculator(){
    inputArray = [''];
    inputPointer = 0;
}


//FUNCTIONS FOR CALCULATOR ENTRY/OPERATION BY USER

//takeNumber will take decimal points as well
function takeNumber(number){
    inputArray[inputPointer] += number;
}

function takeOperator(operator){
    inputPointer++;
    inputArray[inputPointer] = operator;
    inputArray[++inputPointer] = '';
}

//this function will both detect the equal sign input and then identify and call the correct operation with the numbers passed as parameters
function takeEquals(){
    for (var i = 0; i < inputArray.length ; i+=2){
        if (inputArray[i] !== ''){
            inputArray[i] = parseFloat(inputArray[i]);
        }
    }
    console.log('This is the parsed inputArray: ' + inputArray);

    for (var j = 1, prevOperationAnswer = inputArray[j-1] ; j < inputArray.length;j+=2) {
        console.log('parsedNumbers[j+1] : '+ inputArray[j + 1]);
        switch (inputArray[j]) {
            case '+':
                prevOperationAnswer = addition(prevOperationAnswer, inputArray[j + 1]);
                break;
            case 'x':
            case 'X':
            case '*':
                prevOperationAnswer = multiplication(prevOperationAnswer, inputArray[j + 1]);
                break;
            case '/':
            case '÷':
                prevOperationAnswer = division(prevOperationAnswer, inputArray[j + 1]);
                break;
            case '-':
                prevOperationAnswer = subtraction(prevOperationAnswer, inputArray[j + 1]);
                break;
            default:
                console.log('ERROR');

        }
    }
    resetCalculator();
}

//OPERATION FUNCTIONS
function addition(num1, num2){
    var sum = num1+num2;
    console.log('The sum of '+num1+ ' and '+num2+ ' is ' + sum);
    return sum;
}

function multiplication(num1,num2){
    var product = num1*num2;
    console.log('The product of '+num1+ ' and '+num2+ ' is ' + product);
    return product;
}

function division(num1, num2){
    var quotient = num1/num2;
    console.log('The quotient of '+num1+ ' and '+num2+ ' is ' + quotient);
    return quotient;
}
function subtraction(num1,num2){
    var difference = num1-num2;
    console.log('The difference of '+num1+ ' and '+num2+ ' is ' + difference);
    return difference;
}

$(document).ready(function(){
    resetCalculator();
    takeKeyboardInput();
});