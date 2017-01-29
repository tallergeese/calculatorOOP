/**
 * Created by Michael on 1/25/2017.
 */
var Calculator = function(){
    this.inputArray = [''];
    this.inputPointer = 0;

    this.acceptedOperators = ['+','-','*','/','x','X','÷'];

    this.inputHasDecimal = false;
    this.lastInputWasEqual = false;

    //properties to enable operation repeats//rollovers
    this.prevAnswerForSuccessiveOperations = null;
    this.prevNumberAndOperation = [];
};

Calculator.prototype.takeKeyboardInput = function(){
    $(document).keypress(function(event){

        console.log('key code pressed: ' +event.which + ' key pressed: ' + event.key);

        //checks for decimal input
        if (event.which == 46){
            if (newCalculation.inputHasDecimal){
                return;
            }
            newCalculation.takeNumber(event.key);
            newCalculation.inputHasDecimal = true;
        }
        //checks for number input
        if ((48 <= event.which && event.which <= 57) || (event.which >= 105 && event.which <=105)){
            newCalculation.takeNumber(event.key);
            if (newCalculation.lastInputWasEqual){
                newCalculation.resetCalculator();
            }
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

//FUNCTIONS FOR CALCULATOR ENTRY/OPERATION BY USER

Calculator.prototype.resetCalculator = function(){
    this.inputArray = [''];
    this.inputPointer = 0;
};

//takeNumber also takes decimals
Calculator.prototype.takeNumber = function(number){
    this.inputArray[this.inputPointer] += number;
};

Calculator.prototype.takeOperator = function(operator){

    this.inputHasDecimal = false;


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
};

//this function will both detect the equal sign input and then identify and call the correct operation with the numbers passed as parameters
Calculator.prototype.takeEquals = function(input){

    //check to set up for successive/rollover operation vs new operation
    if (this.lastInputWasEqual){
        console.log('Buckle up, boys, we are going into successive operations.');
    }
    else{
        input = this.inputArray.slice(0, this.inputArray.length);
    }

    input = this.parseInput(input);

    this.prevAnswerForSuccessiveOperations = this.doMath(input);

    console.log('THIS IS THE ANSWER FOR THE OPERATION: ' + this.prevAnswerForSuccessiveOperations);

    this.prevNumberAndOperation = this.inputArray.slice(this.inputArray.length-2, this.inputArray.length);
    console.log('this is the last number and operator ' + this.prevNumberAndOperation + 'and this is the prevAnswerforSuccessiveOperations: ' + this.prevAnswerForSuccessiveOperations);

    // //rollover operation check
    // if (input[input.length-1] === ''){
    //     this.rolloverOperation(input);
    //     return;
    // }
};

Calculator.prototype.parseInput = function (input){

    for (var i = 0; i < input.length ; i+=2){
        if (input[i] !== ''){
            input[i] = parseFloat(input[i]);
        }
    }
    console.log('This is the parsed, cleaned input: ' + input);
    return input;

};

Calculator.prototype.doMath = function(input){
    var counter = 1;
    var prevAnswer = input[counter -1];
    while (counter < input.length){
        switch (input[counter]){
            case 'x':
            case 'X':
            case '*':
                prevAnswer = this.multiplication(input[counter-1], input[counter+1]);
                input.splice(counter-1, 3, prevAnswer);
                break;
            case '/':
            case '÷':
                prevAnswer = this.division(input[counter-1], input[counter+1]);
                input.splice(counter-1, 3, prevAnswer);
                break;
            default:
                counter +=2;
        }
    }

    while (input.length > 1){
        switch (input[1]){
            case '+':
                prevAnswer = this.addition(input[0], input[2]);
                input.splice(0,3, prevAnswer);
                break;
            case '-':
                prevAnswer = this.subtraction(input[0], input[2]);
                input.splice(0,3, prevAnswer);
                break;
        }
    }
    return prevAnswer;
};

Calculator.prototype.successiveOperations = function(){
    this.prevNumberAndOperation.unshift(this.prevAnswerForSuccessiveOperations);
    this.takeEquals(this.prevNumberAndOperation);
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
        return "i can't let you do that";
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

//CALL CALCULATOR OBJECT AND INITIALIZE APPLICATION

var newCalculation;

$(document).ready(function(){
    newCalculation = new Calculator();
    newCalculation.takeKeyboardInput();
});