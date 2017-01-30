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
        if (48 <= event.which && event.which <= 57){
            if (newCalculation.lastInputWasEqual){
                newCalculation.resetCalculator();
            }
            newCalculation.takeNumber(event.key);
            newCalculation.lastInputWasEqual = false;
        }

        //checks for equal/enter input
        else if(event.which == 13){
            if (typeof newCalculation.inputArray[0] === 'string' && newCalculation.inputArray.length === 1){
                return;
            }
            newCalculation.inputHasDecimal = false;

            if (newCalculation.inputArray[0] === '' && newCalculation.prevAnswerForSuccessiveOperations === undefined){
                return;
            }
            if (newCalculation.acceptedOperators.indexOf(newCalculation.inputArray[newCalculation.inputArray.length-2]) > -1 && newCalculation.inputArray[newCalculation.inputArray.length-1] === ''){
                console.log('going to rolloverOperations and this is the operator I see ' + newCalculation.inputArray[newCalculation.inputArray.length-2]);
                newCalculation.rolloverOperation(newCalculation.inputArray);
            }
            else if(newCalculation.lastInputWasEqual){
                newCalculation.successiveOperations();
                newCalculation.lastInputWasEqual = true;
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
            }
            newCalculation.takeOperator(event.key);
        }
        newDisplay.userInputDisplay();
    });
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

    //parse the string (this one runs unnecessarily a lot...)
    input = this.parseInput(input);
    console.log('this.inputArray has been changed to current input: ' + this.inputArray);

    //prepare for possible rollover or repeating operations
    this.prevNumberAndOperation = input.slice(input.length-2, input.length);

    //finally do the math
    this.prevAnswerForSuccessiveOperations = this.doMath(input);
    this.inputArray = [this.prevAnswerForSuccessiveOperations];
    this.inputPointer = 0;
    console.log('THIS IS THE ANSWER FOR THE OPERATION: ' + this.prevAnswerForSuccessiveOperations);

    console.log('this is the last number and operator ' + this.prevNumberAndOperation + 'and this is the prevAnswerforSuccessiveOperations: ' + this.prevAnswerForSuccessiveOperations);

    return this.prevAnswerForSuccessiveOperations;
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

    input = this.inputArray.slice(0,this.inputArray.length);
    input.pop();
    var rolloverOperator = input.pop();

    console.log('this is what I am sending to takeEquals from rolloverOperation' + input);

    this.lastInputWasEqual = true;
    var tempAnswer = this.takeEquals(input);
    input = [tempAnswer, rolloverOperator, tempAnswer];
    return this.takeEquals(input);
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


//DISPLAY CONSTRUCTOR
var Display = function(){
    this.getInputArray = function(){
        var displayInputArray = newCalculation.inputArray.slice(0, newCalculation.inputArray.length);
        console.log('getInputArray called and displaying this: ' + displayInputArray);
        return displayInputArray;
    };
    this.displayInputArray;
    this.getInputString = function(){
        this.displayInputArray = this.getInputArray();
        this.displayInputArray = this.displayInputArray.join();
        this.displayInputArray = this.displayInputArray.replace(/,/g,'');
        console.log(this.displayInputArray);
        return this.displayInputArray;
    };
    this.userInputDisplay = function(){
        $('.input-display').text(this.getInputString());
        console.log('this.getInputString');
    };
    this.numberButtonHandlers = function (){
        $('.number-button').click(function(){
            console.log('this is the button being clicked ' + $(this).text());
            return $('.number-button').text();
        });
    }
};

var newCalculation;
var newDisplay;

$(document).ready(function(){
    newCalculation = new Calculator();
    newCalculation.takeKeyboardInput();
    newDisplay = new Display();
    newDisplay.numberButtonHandlers();
});