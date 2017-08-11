#### Harvard University Extension School, December 2016
### CSCI E-3 Web Programming Using JavaScript  Final Project
# MathQuiz


## Final project implementation details

**Implementation of following topics is discussed below:**
* Creating and handling a data structure
* Closures
* AJAX
* LocalStorage
* Capturing and handling events
* DOM element creation, deletion or modification
* DOMtraversal
* Form validation
* Effects

## Creating and handling a data structure
* Application code organization follows Revealing Module Pattern, all variables and methods are stored in hashes.
* All questions are stored in an array. Each question with its options and correct answer index is stored in an object.
* These objects are accessed by application methods in order to create quiz functionalities.
* You might want to review :
    1. quiz/math_quiz.json file
    2.publicMethods.loadQuizDataAfterAjaxCall

## Closures
* Application code organization follows Revealing Module Pattern in order to simulate 'private/public'-like behaviour of variables and functions. This pattern relies on closures to achieve this.
* Closures are used in multiple methods to meet multiple goals. Most notable examples would be - making sure none of the quiz logic starts before quiz data is loaded, iteration over a collection of nodes.
* Methods you might want to review :
    1. publicMethods.loadQuizDataAfterAjaxCall
    2. privateGeneralUtil.iterateCollection

## AJAX
* Application loads quiz data from a JSON file in project directory though an AJAX call.
* Method you might want to review :
    1. publicMethods.loadQuizDataAfterAjaxCall

## LocalStorage
* LocalStorage is used to store variables that track record of user's progression through the quiz. This allows user to return back as many quiz questions as possible and see or change previous answers.
* Methods you might want to review :
    1. privateGeneralUtil.checkedRadioIndex
    2. privateGeneralUtil.setCheckedOnRadio

## Capturing and handling events
* Application methods are executed as call-back subroutine when "load" event on window object is handled.
* All app navigation relys on handling "click" events on a variety of buttons
* You can read about handling 'mouseenter' and 'mouseleave' events in "DOM traversal" section.
* Methods you might want to review :
    1. privateGeneralUtil.traverseAndStyle
    2. Window object "load" event call-back function

## DOM element creation, deletion or modification
* Quiz questions as well as quiz results are displayed dynamically. All necessary elements are created, properly appended among themselves and then appended to the DOM in one go with no unnecessary reflows caused.
* Multiple methods use this technique. Here are some examples you might want to review :
    1. privateDisplayUtil.displayQuestionRadios
    2. privateDisplayUtil.displayQuizScore
    3. privateDisplayUtil.displayQuizAnswers

## DOM traversal
* Quiz results are displayed in panels. One panel per question. "User" answer and "correct" answer are marked. 'Mouseenter' and 'mouseleave' events on these panels trigger DOM traversal routine that changes the way "user" and "correct" answers are displayed.
* Methods you might want to review :
    1. privateGeneralUtil.traverseAndStyle
    2. privateDisplayUtil.displayQuizAnswers

## Form validation
* When questions are displayed, question options are presented as form radios. If no radio is checked user cannot proceed to the next question and a warning message appears.
* Methods you might want to review :
    1. publicMethods.buttonScript

## Effects
* Combination of JavaScript and CSS is used to create a fade-in/fade-out effect of quiz elements when navigation buttons are used. The script makes sure necessary updates to appropriate variable are made after fade-out of currently displayed quiz question and before next question fades-in.
* Methods you might want to review :
    1. privateGeneralUtil.fadeOutUpdateFadeIn


