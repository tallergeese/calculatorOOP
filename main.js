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

    this.display = new Display(this);
    this.userInput = new InputTaker(this);
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
var Display = function(parent){
    this.parent = parent;
    this.getInputArray = function(){
        var displayInputArray = this.parent.inputArray.slice(0, this.parent.inputArray.length);
        return displayInputArray;
    };
    this.displayInputArray;
    this.getInputString = function(){
        this.displayInputArray = this.getInputArray();
        console.log(this.displayInputArray)
        this.displayInputArray = this.displayInputArray.join();
        this.displayInputArray = this.displayInputArray.replace(/,/g,'');
        console.log(this.displayInputArray)
        return this.displayInputArray;
    };
    this.userInputDisplay = function(){
        console.log('this.getInputString', this.getInputString())
        $('.input-display').text(this.getInputString());
    };

};

var InputTaker = function(parent){
    this.parent = parent;
    this.numberButtonHandlers = function (){
        $('.number-button, .operator').click(function() {
            //creating an event object to send to sortInput-- sortInput was originally written to only handle keypresses, so there's extensive use of event.which/event.key which we're simulating here
            if ($(event.target).text() == '=') {
                event = {
                    which: 13
                }
            } else {
                event = {
                    key: $(event.target).text(),
                    which: $(event.target).text().charCodeAt(0)
                };
            }
            this.sortInput(event);
        }.bind(this, event));
    };

    this.takeKeyboardInput = function() {
        $(document).keypress(this.sortInput);
    };

    this.clearEntry = function(){
        //operators create a value for themselves and an empty string, so two pops are necessary
        if (this.parent.inputArray[this.parent.inputArray.length-1] === '' && this.parent.inputArray.length > 1){
            this.parent.inputArray.pop();
            this.parent.inputArray.pop();
            this.parent.inputPointer -= 2;
        }
        else {
            this.parent.inputArray[this.parent.inputArray.length-1] = '';
        }
        this.parent.display.userInputDisplay();
    }.bind(this);

    this.sortInput= function(){

        //checks for decimal input
        if (event.which == 46){
            if (this.parent.inputHasDecimal){
                return;
            }
            this.parent.takeNumber(event.key);
            this.parent.inputHasDecimal = true;
        }
        //checks for number input
        if (48 <= event.which && event.which <= 57){
            //a number after pressing equal means we're starting a new calculation, so we resetCalculator()
            if (this.parent.lastInputWasEqual){
                this.parent.resetCalculator();
            }
            this.parent.takeNumber(event.key);
            this.parent.lastInputWasEqual = false;
        }

        //checks for equal/enter input
        else if(event.which == 13){
            //does nothing in the case of missing operations
            if (typeof this.parent.inputArray[0] === 'string' && this.parent.inputArray.length === 1){
                return;
            }
            this.parent.inputHasDecimal = false;

            //does nothing in case equal/enter is being pressed prior to any other input-- if there's something in prevAnswer then that means we need to do repeat or rollover operation
            if (this.parent.inputArray[0] === '' && this.parent.prevAnswerForSuccessiveOperations === undefined){
                return;
            }

            //checks for rollover operation by determining whether the last two entries in the array correspond to what we would expect from having last entered an operator
            if (this.parent.acceptedOperators.indexOf(this.parent.inputArray[this.parent.inputArray.length-2]) > -1 && this.parent.inputArray[this.parent.inputArray.length-1] === ''){
                this.parent.rolloverOperation(this.parent.inputArray);
            }
            else if(this.parent.lastInputWasEqual){
                this.parent.successiveOperations();
                this.parent.lastInputWasEqual = true;
            }
            else{
                this.parent.takeEquals(this.parent.inputArray);
                this.parent.lastInputWasEqual = true;
            }
        }

        //checks for operator input against our array of operators
        else if (this.parent.acceptedOperators.indexOf(event.key) > -1){

            //probably don't need this conditional and can just do the assignment to false...
            if (this.parent.lastInputWasEqual) {
                this.parent.lastInputWasEqual = false;
            }
            this.parent.takeOperator(event.key);
        }
        this.parent.display.userInputDisplay(); //updates the display after every input from the user regardless of type/content
    }.bind(this);

    this.handleBackspace = function(){
        $(document).keyup(function(){
            //checks for backspace input
            if (event.which === 8){
                this.clearEntry();
            }   
        }.bind(this, event));
        $('.clear-button').click(this.clearEntry);
        $('.clear-all-button').click(function(){
            this.parent.resetCalculator();
            this.parent.display.userInputDisplay();
        }.bind(this))
    };
    this.initializeHandlers = function(){
        this.takeKeyboardInput();
        this.numberButtonHandlers();
        this.handleBackspace();
    };
    this.initializeHandlers();
};

$(document).ready(function(){
    var calculator = new Calculator();
});