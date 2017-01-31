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
//LFZ START
    //check to set up for successive/rollover operation vs new operation
        //check for bool this.lastInputwasEqual to see if we need to call successive operations function
         //console log this is happening on a successive operation

     // if lastInputWasEqual is false, we don't go to successive operations
        //  make a whole copy of the user's input array, rather than using the array passed in as a parameter (which would generally be from a sucessive operation


    //parse the string (this one runs unnecessarily a lot...)
    //turn the strings into floats that we can do math on
    //console log the array with parsed floats

    //prepare for possible rollover or repeating operations
    //create an array of the last operator and number of the current user input so that we can use it in a successive operation or rollover operation

    //finally do the math
    //set this.prevAnswer to the calculation output done by doMath on the array in input
    //set this.inputArray to the solution arrived at previously, so that we can combine it with this.prevAnswer for successive/rollover operations
    // reset the pointer to the first spot, so that we can continue modifying the array without creating random array values of undefined
    //console log the answer of the operation

    // console log the last number and operator as well as the answer, which we can later join for successive operations

    //return the answer of the operation so that we can display it to the user via a different function
    //LFZ END
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

    this.lastInputWasEqual = true;  //needs to be true so that this.inputArray won't be reassigned in takeEquals()
    var tempAnswer = this.takeEquals(input);
    input = [tempAnswer, rolloverOperator, tempAnswer];
    return this.takeEquals(input);
};

//OPERATION FUNCTIONS
Calculator.prototype.addition = function(num1, num2){
    //LFZ START
    //check if the second parameter passed to the addition function is an empty string, which would mean that the last actual entry in the array with a value is an operator
    // don't do math on it so that we don't get an error doing math with an empty string-- the check for rollover operations happens elsewhere

    // do the addition and set it to sum
    // console log the operation and result
    //return sum (usually to the takeEquals function) so that the answer can be added to this.prevAnswer and also be displayed
    //LFZ END
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
    //LFZ START
      //this gets the current inputArray from the Calculator object, which always holds the user input or answer depending on whether takeEquals has been called yet
         // make a copy of the inputArray -- I probably could have just returned the inputArray directly, but I was originally thinking of making some readability changes to it. I also wanted it to have its own copy for a potential two-line display in future versions
         // console logs the displayInputArray
         //returns displayInputArray, which is just at this point a copy of inputArray in the Calculator object

    //create a property to hold the eventual string that gets displayed to the user -- probably shouldn't be called displayInputArray
    // this method is going to take the inputArray, turn it into a string, and remove all of the commas from the stringified array
         //put a copy of the InputArray in displayInputArray
         //turn the array into a string
         //remove all of the commas from the stringified array. yay regex
         //console log the string that will be displayed to the user
         //return the string

     //this function actually takes the string generated by getInputString and puts it on the DOM
         //change the text of the display div to the output string from getInputString
         //console log ths string that will be displayed to the user should be the same as the string currently in displayInputArray

    //LFZ END
};

var InputTaker = function(){
    this.numberButtonHandlers = function (){
        $('.number-button, .operator').click(function() {
            console.log('this is the button being clicked ' + $(this).text());

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
            console.log('this is the button handler event', event);
            userInput.sortInput(event);
        });
    };

    this.takeKeyboardInput = function() {
        $(document).keypress(this.sortInput);
    };

    this.clearEntry = function(){
        console.log('clearEntry is being run');
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
    //LFZ START
     //this function takes an event object from the click handlers and keypress handlers, determines whether they're numbers, operators, or equals, and sends them to the appropriate function to handle them. It also does a lot of the input sanitization and checks to prevent erroneous or problematic input.

         //console log the .which and .key properties of the event object passed into the function

        //checks for decimal input
         //checks for decimal input/keycode 46
             //check if there is already a decimal somewhere in the current string in the current index of the array, e.g. ['123.4']
                 //doesn't take input if there's already a decimal, since no real number has multiple decimals

            //sends the decimal to the takeNumber function, which handles both numbers and decimals, since they get concatenated into the same strings
            //sets the inputHasDecimal flag to true, since either the current number already had a decimal or just got one

        //checks for number input
         //checks if the key codes match up to numbers
            //a number after pressing equal means we're starting a new calculation, so we resetCalculator()
              //check if we just did an operation
                  //a number after pressing equal means we're starting a new calculation, so we resetCalculator(),


             //send the number to the takeNumber function, which will add the number input to the current string in the array
            //if we're entering in a new number, then we're not going into successive or rollover operation


        //checks for equal/enter input
         //check the keycode of the event object for the Enter key
            //does nothing in the case of missing operations
             //does nothing in the caes of missing operations (this covers having entered numbers and pressing Enter or just pressing Enter before anything else). this DOES NOT block successive operations, because the array will hold a value of type number, not string. It's only string in an empty array or via user input
                 //do nothing with the user input

            //if we press enter, that means we're completing an operation-- the next entry will either be an operator for rollover operations or a new number, which means we need to reset the decimal flag

            //does nothing in case equal/enter is being pressed prior to any other input-- if there's something in prevAnswer then that means we need to do repeat or rollover operation
            //see above
                 //see above


            //checks for rollover operation by determining whether the last two entries in the array correspond to what we would expect from having last entered an operator
             //checks that the last entry by the user was in fact an operator against the operator array
                 //console logs the operator
                //calls the rolloverOperation function which performs the rollover operation (e.g. 1+1+ = 4)

             //if it's not invalid input, but lastInputWasEqual, do a successive operation (prevAnswer + prevNumberAndOperation);
                 //call successive operations
                 //set the lastinputwasequal to true

             //else
                 //call takeEquals to actually do the math if the user input gets through all of the above checks
                 // set lastInputWasEqual to true, since we just completed an operation



        //checks for operator input against our array of operators
         //check for operator input against our array of operators

            //probably don't need this conditional and can just do the assignment to false...
             //check if lastInputWasEqual
                 //set it to false

            // call the takeOperator function

         //updates the display after every input from the user regardless of type/content

    //LFZ END
    this.handleBackspace = function(){
        $(document).keyup(function(event){
            //checks for backspace input
            if (event.which === 8){
                console.log('backspace was pressed');
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