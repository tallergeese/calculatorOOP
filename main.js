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

    //disallow operator entry prior to number entry
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
    if (!this.lastInputWasEqual){
        input = this.inputArray.slice(0, this.inputArray.length);
    }

    //parse the string (this one runs unnecessarily a lot...)
    input = this.parseInput(input);

    //prepare for possible rollover or repeating operations
    this.prevNumberAndOperation = input.slice(input.length-2, input.length);

    //finally do the math
    this.prevAnswerForSuccessiveOperations = this.doMath(input);
    this.inputArray = [this.prevAnswerForSuccessiveOperations];
    this.inputPointer = 0;

    return this.prevAnswerForSuccessiveOperations;
};

Calculator.prototype.parseInput = function (input){

    for (var i = 0; i < input.length ; i+=2){
        if (input[i] !== ''){
            input[i] = parseFloat(input[i]);
        }
    }
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

    this.lastInputWasEqual = true;  //needs to be true so that this.inputArray won't be reassigned in takeEquals()
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
    return sum;
};

Calculator.prototype.multiplication = function(num1,num2){
    if (num2 === '') {
        return num1;
    }
    var product = num1*num2;
    return product;
};

Calculator.prototype.division = function(num1, num2){
    if (num2 === '') {
        return num1;
    }
    if (num2 == 0){
        return "i can't let you do that";
    }

    var quotient = num1/num2;
    return quotient;
};
Calculator.prototype.subtraction = function(num1,num2){
    if (num2 === '') {
        return num1;
    }
    var difference = num1-num2;
    return difference;
};


//DISPLAY CONSTRUCTOR
var Display = function(){
    this.getInputArray = function(){
        var displayInputArray = newCalculation.inputArray.slice(0, newCalculation.inputArray.length);
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
        console.log(this.getInputString());
    };

};

var InputTaker = function(){
    this.numberButtonHandlers = function (){
        $('.number-button, .operator').click(function() {

            //creating an event object to send to sortInput-- sortInput was originally written to only handle keypresses, so there's extensive use of event.which/event.key which we're simulating here
            var event ={};
            if ($(this).text() == '=') {
                console.log('Equal was clicked.');
                event = {
                    which: 13
                }
            } else {
                event = {
                    key: $(this).text(),
                    which: $(this).text().charCodeAt(0)
                };
            }
            userInput.sortInput(event);
        });
    };

    this.takeKeyboardInput = function() {
        $(document).keypress(this.sortInput);
    };

    this.clearEntry = function(){
        //operators create a value for themselves and an empty string, so two pops are necessary
        if (newCalculation.inputArray[newCalculation.inputArray.length-1] === '' && newCalculation.inputArray.length > 1){
            newCalculation.inputArray.pop();
            newCalculation.inputArray.pop();
            newCalculation.inputPointer -= 2;
        }
        else {
            newCalculation.inputArray[newCalculation.inputArray.length-1] = '';
        }
        newDisplay.userInputDisplay();
    };

    this.sortInput= function(event){

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
            //a number after pressing equal means we're starting a new calculation, so we resetCalculator()
            if (newCalculation.lastInputWasEqual){
                newCalculation.resetCalculator();
            }
            newCalculation.takeNumber(event.key);
            newCalculation.lastInputWasEqual = false;
        }

        //checks for equal/enter input
        else if(event.which == 13){
            //does nothing in the case of missing operations
            if (typeof newCalculation.inputArray[0] === 'string' && newCalculation.inputArray.length === 1){
                return;
            }
            newCalculation.inputHasDecimal = false;

            //does nothing in case equal/enter is being pressed prior to any other input-- if there's something in prevAnswer then that means we need to do repeat or rollover operation
            if (newCalculation.inputArray[0] === '' && newCalculation.prevAnswerForSuccessiveOperations === undefined){
                return;
            }

            //checks for rollover operation by determining whether the last two entries in the array correspond to what we would expect from having last entered an operator
            if (newCalculation.acceptedOperators.indexOf(newCalculation.inputArray[newCalculation.inputArray.length-2]) > -1 && newCalculation.inputArray[newCalculation.inputArray.length-1] === ''){
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

        //checks for operator input against our array of operators
        else if (newCalculation.acceptedOperators.indexOf(event.key) > -1){

            //probably don't need this conditional and can just do the assignment to false...
            if (newCalculation.lastInputWasEqual) {
                newCalculation.lastInputWasEqual = false;
            }
            newCalculation.takeOperator(event.key);
        }
        newDisplay.userInputDisplay(); //updates the display after every input from the user regardless of type/content
    };

    this.handleBackspace = function(){
        $(document).keyup(function(event){
            //checks for backspace input
            if (event.which === 8){
                userInput.clearEntry();
            }
        });
        $('.clear-button').click(userInput.clearEntry);
        $('.clear-all-button').click(function(){
            newCalculation.resetCalculator();
            newDisplay.userInputDisplay();
        })
    };
    this.initializeHandlers = function(){
        this.takeKeyboardInput();
        this.numberButtonHandlers();
        this.handleBackspace();
    };
};

var newCalculation;
var newDisplay;
var userInput;

$(document).ready(function(){
    newCalculation = new Calculator();
    newDisplay = new Display();
    userInput = new InputTaker();
    userInput.initializeHandlers();
});