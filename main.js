/**
 * Created by Michael on 1/25/2017.
 */
var Calculator = function(){
    this.inputArray = [''];
    this.inputPointer = 0;

    this.acceptedOperators = ['+','-','*','/','x','X','÷'];

    this.inputHasDecimal = false;
    this.lastInputWasEqual = false;

    //properties to enable operation repeats
    this.prevAnswerForSuccessiveOperations;
    this.prevNumberAndOperation = [];
};

Calculator.prototype.takeKeyboardInput = function(){
    $(document).keypress(function(event){

        console.log('key code pressed: ' +event.which + ' key pressed: ' + event.key);

        //checks for number and decimal input
        if (event.which == 46){
            if (newCalculation.inputHasDecimal){
                return;
            }
            newCalculation.takeNumber(event.key);
            newCalculation.inputHasDecimal = true;
        }
        if ((48 <= event.which && event.which <= 57) || (event.which >= 105 && event.which <=105)){
            newCalculation.takeNumber(event.key);
            newCalculation.lastInputWasEqual = false;
        }

        //checks for equal/enter input
        else if(event.which == 13){
            if (newCalculation.inputArray[0] === '' && newCalculation.prevAnswerForSuccessiveOperations === undefined){
                return;
            }
            if(newCalculation.lastInputWasEqual){
                newCalculation.successiveOperations();
            }
            else{
                newCalculation.takeEquals(newCalculation.inputArray);
                newCalculation.lastInputWasEqual = true;
            }
        }

        //checks for operator input
        else if (newCalculation.acceptedOperators.indexOf(event.key) > -1){
            if (newCalculation.lastInputWasEqual) {
                newCalculation.lastInputWasEqual = false;
                newCalculation.inputArray[0] = newCalculation.prevAnswerForSuccessiveOperations;
            }
            newCalculation.takeOperator(event.key);
        }
    })
};

Calculator.prototype.resetCalculator = function(){
    this.inputArray = [''];
    this.inputPointer = 0;
};


//FUNCTIONS FOR CALCULATOR ENTRY/OPERATION BY USER


//takeNumber also takes decimals
Calculator.prototype.takeNumber = function(number){
    this.inputArray[this.inputPointer] += number;
};

Calculator.prototype.takeOperator = function(operator){

    if (this.inputArray[this.inputPointer] === '' && this.inputPointer === 0 ) {
        return;
    }

    //check for multiple operator input and constantly replace the operator with the latest one
    if (this.inputArray[this.inputPointer] === ''){
        this.inputArray[this.inputPointer - 1] = operator;
        return;
    }

    this.inputPointer++;
    this.inputArray[this.inputPointer] = operator;
    this.inputArray[++this.inputPointer] = '';
    this.inputHasDecimal = false;
};

//this function will both detect the equal sign input and then identify and call the correct operation with the numbers passed as parameters
Calculator.prototype.takeEquals = function(input){

    //check to set up for successive operation vs new operation
    if (this.lastInputWasEqual){
        console.log('Buckle up, boys, we are going into successive operations.');
    }
    else{
        input = this.inputArray;
    }

    for (var i = 0; i < input.length ; i+=2){
        if (input[i] !== ''){
            input[i] = parseFloat(input[i]);
        }
    }

    console.log('This is the parsed, cleaned input: ' + input);

    for (var j = 1, prevAnswer = input[j-1]; j < input.length;j+=2) {
        console.log('prevAnswer : '+ prevAnswer);
        switch (input[j]) {
            case "+":
                prevAnswer = this.addition(prevAnswer, input[j + 1]);
                break;
            case 'x':
            case 'X':
            case '*':
                prevAnswer = this.multiplication(prevAnswer, input[j + 1]);
                break;
            case '/':
            case '÷':
                prevAnswer = this.division(prevAnswer, input[j + 1]);
                break;
            case '-':
                prevAnswer = this.subtraction(prevAnswer, input[j + 1]);
                break;
            default:
                console.log('ERROR');
                this.resetCalculator();
                return;
        }
    }

    this.prevAnswerForSuccessiveOperations = prevAnswer;

    //rollover operation check
    if (input[input.length-1] === ''){
        this.rolloverOperation(input);
        return;
    }

    this.prevNumberAndOperation = input.splice(-2, 2);
    console.log('this is the last number and operator ' + this.prevNumberAndOperation + 'and this is the prevAnswerforSuccessiveOperations: ' + this.prevAnswerForSuccessiveOperations);

    this.resetCalculator();
};

Calculator.prototype.successiveOperations = function(){
    this.prevNumberAndOperation.unshift(this.prevAnswerForSuccessiveOperations);
    var successiveOperationCompleteArray = this.prevNumberAndOperation;
    console.log('this is the last number and operator in the successiveOperation ' + this.prevNumberAndOperation + 'and this is the prevAnswerforSuccessiveOperations: ' + this.prevAnswerForSuccessiveOperations);
    console.log('this is the successiveOperationCompleteArray: ' + successiveOperationCompleteArray);
    this.takeEquals(successiveOperationCompleteArray);
};

Calculator.prototype.rolloverOperation = function (input){
    console.log('this is what I am sending to rolloverOperation from takeEquals' + input);

    var rolloverOperator = input[input.length-2];

    console.log('this is the rolloverOperator ' + rolloverOperator);
    input = [this.prevAnswerForSuccessiveOperations, rolloverOperator, this.prevAnswerForSuccessiveOperations];
    console.log('this is what I am sending to takeEquals from rolloverOperation' + input);

    this.lastInputWasEqual = true;

    this.takeEquals(input);
};

//OPERATION FUNCTIONS
Calculator.prototype.addition = function(num1, num2){
    if (num2 === ''){
        return num1;
    }
    var sum = num1+num2;
    console.log('The sum of '+num1+ ' and '+num2+ ' is ' + sum);
    return sum;
};

Calculator.prototype.multiplication = function(num1,num2){
    if (num2 === '') {
        return num1;
    }
    var product = num1*num2;
    console.log('The product of '+num1+ ' and '+num2+ ' is ' + product);
    return product;
};

Calculator.prototype.division = function(num1, num2){
    if (num2 === '') {
        return num1;
    }
    if (num2 == 0){
        console.log('ERROR');
        return "i can't let you destroy the universe";
    }

    var quotient = num1/num2;
    console.log('The quotient of '+num1+ ' and '+num2+ ' is ' + quotient);
    return quotient;
};
Calculator.prototype.subtraction = function(num1,num2){
    if (num2 === '') {
        return num1;
    }
    var difference = num1-num2;
    console.log('The difference of '+num1+ ' and '+num2+ ' is ' + difference);
    return difference;
};

var newCalculation;

$(document).ready(function(){
    newCalculation = new Calculator();
    newCalculation.takeKeyboardInput();
});