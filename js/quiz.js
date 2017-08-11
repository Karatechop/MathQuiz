"use strict";

/****************************************************************
** Declare a module using Revealing Module Pattern.**************
** Use Immediately Invoked Function Expression*******************
***(protects scope, returns all necessary elements and methods)**
****************************************************************/
var quizModule = (function() {
	
	/*
	       Grab all necessary DOM elements.
	*/
    var domElements = {

    
        checkLH:                document.getElementById('localhost'),
        quiz:                   document.getElementById('quizAndButtons'),
        quizBox:                document.getElementById('quizBox'),
        quizQuestionBox:        document.getElementById('quizQuestionBox'),
        radioMessage:           document.getElementById('radioMessage'),
        quizResultsBox:         document.getElementById("quizResultsBox"),
        projectDetailsButton:   document.getElementById('projectDetailsButton'),
        startQuizButton:        document.getElementById('startQuizButton'),
        reStartQuizButton:      document.getElementById('reStartQuizButton'),
        backQuestionButton:     document.getElementById('backQuestionButton'),
        nextQuestionButton:     document.getElementById('nextQuestionButton'),
        showResultsButton:      document.getElementById('showResultsButton'),
        details:                document.getElementById('projectDetails')

    };
    
    
    
    /*
	       Declare methods that should be exposed as 'public'.
	*/
    
    
    var publicMethods = {
		
        /*
                Create a method that displays an alert 
                if the app is not running on local server.
        */
        checkLocalhost: function(){
            if (window.location.hostname !== "localhost") {
                domElements.checkLH.style.display = "block";
            }
        },
       
        
		/*
                Create a function that makes an AJAX call 
                to a local JSON file containing quiz data, 
                parses it and creates an array of question objects.
                Function returns a callback function that takes said array
                as argument. Callback function contains all application code.
                This way application does not run before question 
                objects are created.
        */
		loadQuizDataAfterAjaxCall: function(callback) {
		
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://localhost/quiz/math_quiz.json", true); 
			xhr.send();

			xhr.onreadystatechange = function(e) {
				
                if (this.readyState == 4 && this.status == 200) {
					var aq = JSON.parse(this.responseText);

					return callback(aq)
				}
			}
		},
		
        
		/*
                Create a set of functions that display relevant DOM 
                elements for major functional parts of the application.
                These methods make use of utility display methods.
        */
        
		displayProjectDetails: function(questionIndex, questionIndexMax) {
			privateDisplayUtil.displayQuizResultsDetails(questionIndex, questionIndexMax);
		},
		
		
		displayQuiz: function(allQuestions, questionIndex, questionIndexMax) {
	
			privateDisplayUtil.displayQuizResultsDetails(questionIndex, questionIndexMax);
			privateDisplayUtil.displayNavigationButtons(questionIndex, questionIndexMax);
			privateDisplayUtil.displayQuizQuestion(allQuestions, questionIndex);
		},
		
		
		displayQuizResults: function(allQuestions, questionIndex, questionIndexMax) {
	
			privateDisplayUtil.displayQuizResultsDetails(questionIndex, questionIndexMax);
			privateDisplayUtil.displayNavigationButtons(questionIndex, questionIndexMax);
			privateDisplayUtil.displayQuizScoreAndAnswers(allQuestions, questionIndex);
		},		
		
		/*
                Create a uniform that serves as event handler for 
                all buttons.
        */
		buttonScript: function(b, aQ, qI, qIm) {
			
			switch(b) {
				
				case "details":
					privateGeneralUtil.setDetailsDisplayStatus("show");
                    publicMethods.displayProjectDetails(qI, qIm);
					
					break;
				
                case "start":
                        // fall-through
				case "reStart":
					privateGeneralUtil.setDetailsDisplayStatus("hide");
                    privateGeneralUtil.clearLocalStorage(aQ);
					privateDisplayUtil.displayNoRadioMessage();
					localStorage.setItem("questionIndex", 0);

					privateGeneralUtil.fadeOutUpdateFadeIn(domElements.quizBox, 
                                                           'fadein', 
                                                           publicMethods.displayQuiz, 
                                                           600, 
                                                           aQ, 
                                                           qI, 
                                                           qIm)

					break;

				case "back":
					privateDisplayUtil.displayNoRadioMessage();

					if (0 < qI && qI <= qIm) {
						qI -= 1;
						localStorage.setItem("questionIndex", qI);

						privateGeneralUtil.fadeOutUpdateFadeIn(domElements.quizBox, 
                                                               'fadein', 
                                                               publicMethods.displayQuiz, 
                                                               600, 
                                                               aQ, 
                                                               publicMethods.storedQuestionIndex(), 
                                                               qIm)

					}

					break;

				case "next":
					privateDisplayUtil.displayNoRadioMessage();

					if (0 <= qI && qI < qIm) {

						if (privateGeneralUtil.radioChecked(qI) === true) {

							localStorage.setItem("question_"+qI+"_answer index", privateGeneralUtil.checkedRadioIndex(qI));

							qI += 1;
							localStorage.setItem("questionIndex", qI);

							privateGeneralUtil.fadeOutUpdateFadeIn(domElements.quizBox, 
                                                                   'fadein', 
                                                                   publicMethods.displayQuiz, 600, 
                                                                   aQ, 
                                                                   publicMethods.storedQuestionIndex(), 
                                                                   qIm);

						} else {

							privateDisplayUtil.displayRadioMessage();
						}
					}

					break;

				case "showResults":
					if (privateGeneralUtil.radioChecked(qI) === true) {

						localStorage.setItem("question_"+qI+"_answer index", privateGeneralUtil.checkedRadioIndex(qI));
						qI += 1;
						localStorage.setItem("questionIndex", qI)

						privateGeneralUtil.fadeOutUpdateFadeIn(domElements.quizBox, 
                                                               'fadein', 
                                                               publicMethods.displayQuizResults, 
                                                               600, 
                                                               aQ, publicMethods.storedQuestionIndex(), 
                                                               qIm);

					} else {

						privateDisplayUtil.displayRadioMessage();
					}

					break;
			} //switch
			
		}, //buttonScript
		
        
		/*
                Create a method that returns the value of 
                question index stored in localStorage.
        */
		storedQuestionIndex: function() {
			
			return Number(localStorage.getItem("questionIndex"))
		}
	
	
		
	}; // publicMethods
	
	
	
	/*
            Declare helper methods that assist other methods' logic.
    */
    
    
	var privateGeneralUtil = {
		
		/*
                Create a method that sets the display status 
                of project details DIV in localStorage
        */
        setDetailsDisplayStatus: function(ds) {
            localStorage.setItem("display", ds);
        },
        
        
        /*
                Create a method that takes an array,
                iterates over its elements and removes any 
                associated localStorage variables.
        */
		clearLocalStorage: function(data) {
			
			data.forEach(function(e,i){
				localStorage.removeItem("question_"+i+"_answer index");
			});
		},
		
		/*
                Create a method that fades out a DOM element,
                updates it and fades it back in rendering changes.
        */
		fadeOutUpdateFadeIn: function(el, eff, fn, t, aQ, qI, qIm){
			
			el.classList.remove(eff);
			setTimeout(function(){fn(aQ, qI, qIm)}, t);
			setTimeout(function(){el.classList.add(eff)}, t-100);
	
		},
	
		/*
                Create a method that returns true if a DOM element 
                containing a quiz question has a checked answer option.
        */
		radioChecked: function(questionIndex) {
			
			var rc = [];
			var a = document.getElementsByName("answer_" + questionIndex);
	
			a.forEach(function(e){

				if (e.checked === true) {
					rc.push(e)
				}
			});
	
			if (rc.length > 0) {
				return true;
			} else {
				return false;
			};
		},

		/*
                Create a method that returns the index of a 
                checked answer option for a given quiz question.
        */
		checkedRadioIndex: function(questionIndex) {
			
			var a = document.getElementsByName("answer_" + questionIndex)
			var cri
			a.forEach(function(e,i){

				if (e.checked === true) {
					cri = i
				}
			});
			return cri
		},

		/*
                Create a function that sets an answer option 
                as checked if it has been already checked before.
        */
		setCheckedOnRadio: function(qI) {
			
			if (localStorage.getItem("question_"+qI+"_answer index")) {
			var index = localStorage.getItem("question_"+qI+"_answer index");
			var a = document.getElementsByName("answer_" + qI);
			a[index].checked = true;	
			}
		},
	
		/*
                Create a method that calculates total score by 
                comparing correct answers from question objects
                with user's answer stored in localStorage.
        */
		resultsCalculateScore: function(data){
			
			var totalScore = 0;
			data.forEach(function(e,i) {
				var lsa = Number(localStorage.getItem("question_"+i+"_answer index"))
				var ca = Number(data[i].correctAnswerIndex);
				if (lsa === ca){totalScore+=1}
			});
			return totalScore;
		},
		
		/*
                Create a method that iterates over a collection 
                of DOM elements and runs a function on each element.
        */
		iterateCollection: function(collection) {
				return function(f) {
					for(var i = 0; collection[i]; i++) {
						f(collection[i], i);
						}
				}
		},
		
		/*
                Create a function that traverses DOM starting at
                provided element, looks for a string in traversed elements
                and styles text in case of a match.
        */
		traverseAndStyle: function(el, str, settings) {
    
				if (el.nodeType == 3 && el.nodeValue.includes(str)) {
				el.parentNode.style.fontSize = settings.fontSize;
					if(el.nodeValue.includes(settings.trueString)) {
						el.parentNode.style.color = settings.correctColor;
					} else {
						el.parentNode.style.color = settings.wrongColor;
					}
				}

				for (var i = 0; i < el.childNodes.length; i++) {
					privateGeneralUtil.traverseAndStyle(el.childNodes[i], str, settings);
				}

		}
	
	}; //privateGeneralUtil
	
	
    
	/*
            Create a set of utility methods that display
            blocks of DOM elements displaying, hiding or creating new ones
    */
    
    
	var privateDisplayUtil = {
        
        
        
		displayQuizQuestion: function(data, questionIndex) {
			            
			var questionText = document.createTextNode(data[questionIndex].question)
			var form = document.createElement("FORM");
			var legend = document.createElement("LEGEND");
			
			domElements.quiz.style.display = "block";
			domElements.details.style.display = "none";
			
			domElements.quizQuestionBox.innerHTML = "";
			
			legend.appendChild(questionText);
			form.appendChild(legend);

			data[questionIndex].choices.forEach(function(e,i) {
				privateDisplayUtil.displayQuestionRadios(e, i, form, questionIndex)})

			domElements.quizQuestionBox.appendChild(form);
			privateGeneralUtil.setCheckedOnRadio(questionIndex);
		},
		
		displayQuizScoreAndAnswers: function(data, questionIndex) {
			
			privateDisplayUtil.displayNoRadioMessage();
			privateDisplayUtil.displayQuizScore(data);
			privateDisplayUtil.displayQuizAnswers(data);
		},
		
		
		displayQuestionRadios: function(e, i, f, qi) {
			var d = document.createElement("DIV");
				d.setAttribute("class", "radio");
			var l = document.createElement("LABEL");
			
			var x = document.createElement("INPUT");
					x.setAttribute("type", "radio");
					x.setAttribute("name","answer_"+qi);
					x.setAttribute("id", i);

			var t = document.createTextNode(e);
			
			l.appendChild(x);
			l.appendChild(t);
			d.appendChild(l);
			f.appendChild(d);
		},
		
		
		displayRadioMessage: function() {
			
            domElements.radioMessage.style.display = "block"
		},

		
		displayNoRadioMessage: function() {
			
			domElements.radioMessage.style.display = "none"
		},
		
		
		displayQuizScore: function(data) {
			
            domElements.quizResultsBox.innerHTML = "";
			var scoreBox = document.createElement("DIV");
			var totalScore = privateGeneralUtil.resultsCalculateScore(data);
			var t = document.createTextNode("Your score: " + totalScore + " out of " + data.length);
			var s = document.createElement("H3");

			s.appendChild(t)
			scoreBox.appendChild(s)
			domElements.quizResultsBox.appendChild(scoreBox)
		},
	
		/*
                Create a method that displays all questions
                with answers and marks on user answer and correct answer.
        */
		displayQuizAnswers: function(data) {
			
			data.forEach(function(e, i){
				var questionAnswer = document.createElement("DIV");
					
				var correctAnswer = Number(e.choices[Number(e.correctAnswerIndex)]);
				var userAnswer = Number(e.choices[Number(localStorage.getItem("question_"+i+"_answer index"))]);
				
				var dh = document.createElement("DIV");
					dh.setAttribute("class", "panel-heading");
				var h4 = document.createElement("H4");
					h4.setAttribute("class", "panel-title");
				var q = document.createTextNode("Question " + Number(i+1) + ": " + e.question);
				var db = document.createElement("DIV");
					db.setAttribute("class", "panel-body")
				var o = document.createTextNode("Options:");
				var u = document.createElement("UL");
                
                /*
                        Create answers with span comments
                */
				e.choices.forEach(function(ce, ci) {

					var l = document.createElement("LI");
					var ct = document.createTextNode(ce);
					var s = document.createElement("SPAN");
						s.setAttribute.class = "answer-message"

					if (correctAnswer === Number(ce)){
						var st = document.createTextNode(" Correct answer");
						s.appendChild(st)
					}

					if (userAnswer === Number(ce) && userAnswer === correctAnswer) {		
						questionAnswer.setAttribute("class", "panel panel-success")
					}

					if (userAnswer === Number(ce) && userAnswer !== correctAnswer) {
						var st = document.createTextNode(" Your answer");
						s.appendChild(st)

						questionAnswer.setAttribute("class", "panel panel-danger")
					}


					l.appendChild(ct);
					l.appendChild(s);
					u.appendChild(l);
				})
				
				// Append panel title text to h4 and h4 to panel title
				h4.appendChild(q);
				dh.appendChild(h4);
				
				// Append "Options:" and UL to panel body
				db.appendChild(o);
				db.appendChild(u);
				
				// Append panel heading and body to questionAnswers div
				// Append questionAnswers div to quizResultsBox div
				questionAnswer.appendChild(dh);
				questionAnswer.appendChild(db);
				domElements.quizResultsBox.appendChild(questionAnswer);
				
			}) // forEach

			var answerPanels = document.getElementsByClassName("panel");
			
            /*
                    Add event listeners to each answer panel
            */
			privateGeneralUtil.iterateCollection(answerPanels)(function(e){	 
				e.addEventListener("mouseenter", function(event){
					var s = {fontSize: "130%", trueString: "Correct", correctColor: "#3FAD46", wrongColor: "#d9534f"}
					
					privateGeneralUtil.traverseAndStyle(event.target, "answer", s);
				})
			})
			
			privateGeneralUtil.iterateCollection(answerPanels)(function(e){	 
				e.addEventListener("mouseleave", function(event){
					var s = {fontSize: "100%", trueString: "Correct", correctColor: "#333", wrongColor: "#333"}
					
					privateGeneralUtil.traverseAndStyle(event.target, "answer", s);
				})
			})

		},

		/*
                Create a function that handles button display 
                based on user's quiz progression.
        */
		displayNavigationButtons: function(questionIndex, questionIndexMax) {

			domElements.startQuizButton.style.display = 'none';
			domElements.reStartQuizButton.style.display = 'inline';

			if (questionIndex !== 0 && questionIndex <= questionIndexMax) {
				domElements.backQuestionButton.style.display = 'inline';
			} else if (questionIndex === 0) {
				domElements.backQuestionButton.style.display = 'none';
			} else {
				domElements.backQuestionButton.style.display = 'none';
				domElements.nextQuestionButton.style.display = 'none';
				domElements.showResultsButton.style.display = 'none';
			}

			if (questionIndex !== questionIndexMax && questionIndex < questionIndexMax) {
				domElements.nextQuestionButton.style.display = 'inline';
				domElements.showResultsButton.style.display = 'none';
			} else if (questionIndex === questionIndexMax) {
				domElements.nextQuestionButton.style.display = 'none';
				domElements.showResultsButton.style.display = 'inline';
			}
		},

		
		displayQuizResultsDetails: function(questionIndex, questionIndexMax) {           
			
            var details = localStorage.getItem("display");
            
            if (details === 'hide') {
                if(questionIndex < questionIndexMax+1) {
                    domElements.quizQuestionBox.style.display = 'block';
                    domElements.quizResultsBox.style.display = 'none';
                } else {
                    domElements.quizQuestionBox.style.display = 'none';
                    domElements.quizResultsBox.style.display = 'block';
                }
            } else if (details === 'show') {
                domElements.quiz.style.display = "none";
                domElements.details.style.display = "block";	
                domElements.startQuizButton.style.display = 'inline';	domElements.reStartQuizButton.style.display = 'none';
            }
		}
	
		
		
	} //privateDisplayUtil
	
    // Return an object containing pointers to private functions
    return {
        
        // DOM elements
        checkLH:                    domElements.checkLH,
        quiz:                       domElements.quiz,
        quizBox:                    domElements.quizBox,
        quizQuestionBox:            domElements.quizQuestionBox,
        radioMessage:               domElements.radioMessage,
        quizResultsBox:             domElements.quizResultsBox,
        projectDetailsButton:       domElements.projectDetailsButton,
        startQuizButton:            domElements.startQuizButton,
        reStartQuizButton:          domElements.reStartQuizButton,
        backQuestionButton:         domElements.backQuestionButton,
        nextQuestionButton:         domElements.nextQuestionButton,
        showResultsButton:          domElements.showResultsButton,
        details:                    domElements.details,
        
        // Methods
        checkLocalhost:             publicMethods.checkLocalhost,
        displayProjectDetails:		publicMethods.displayProjectDetails,
		loadQuizDataAfterAjaxCall:	publicMethods.loadQuizDataAfterAjaxCall,
        displayQuiz:				publicMethods.displayQuiz,
		displayQuizResults:			publicMethods.displayQuizResults,
		buttonScript:				publicMethods.buttonScript,
		storedQuestionIndex:		publicMethods.storedQuestionIndex
        
    };

})();



/****************************************************************
**************On window load check for Web Storage,************** 
**********load quiz data, check it, add event listeners********** 
*****************to quiz navigation buttons and****************** 
***********************display landing page.*********************
****************************************************************/

window.addEventListener("load", function() {
	
    /*
            Check if Web Storage is available.
            Alert if it is not.
    */
	if (typeof(Storage) !== "undefined") {
		
        /*
                Check if the app is running on local server.
                Display a message if it is not.
        */
        quizModule.checkLocalhost()
        
        /*
                Load in quiz data and make sure 
                the rest of the code runs after this.
        */
        quizModule.loadQuizDataAfterAjaxCall(function(allQ){
		
		var allQuestions = allQ;

		/*
                Check that quiz data has been loaded and 
                parsed properly and has correct format.
                Alert if any of this is false.
        */
		if (typeof(allQuestions) !== 'undefined' &&
			allQuestions.length > 0 && 
			allQuestions[0].question &&
			allQuestions[0].choices.length > 0 && 				
			allQuestions[0].correctAnswerIndex) {
            
            /*
                    Declare and set necessary question index 
                    variables that track quiz progression
            */
			var questionIndex = 0;
			var questionIndexMax = allQuestions.length-1;
            
			localStorage.setItem("questionIndex", questionIndex);
            
            /*
                    Add event listeners to all buttons
            */
            quizModule.projectDetailsButton.addEventListener("click", function() {
				
				quizModule.buttonScript("details")
			});
			
			quizModule.startQuizButton.addEventListener("click", function() {

				quizModule.buttonScript("start", allQuestions, 0, questionIndexMax);
			});


			quizModule.reStartQuizButton.addEventListener("click", function() {

				quizModule.buttonScript("reStart", allQuestions, 0, questionIndexMax);
			});


			quizModule.backQuestionButton.addEventListener("click", function() { 

				quizModule.buttonScript("back", allQuestions, quizModule.storedQuestionIndex(), questionIndexMax);
			});


			quizModule.nextQuestionButton.addEventListener("click", function() {
				
				quizModule.buttonScript("next", allQuestions, quizModule.storedQuestionIndex(), questionIndexMax);
			});


			quizModule.showResultsButton.addEventListener("click", function() {

				quizModule.buttonScript("showResults", allQuestions, quizModule.storedQuestionIndex(), questionIndexMax);
			});
		
		} else {
			alert("No input data or data in wrong format!");
		}
            
		}) //loadQuizDataAfterAjaxCall
		
	} else {
		
		alert("No Web Storage. Please enable Web Storage (Local Storage) and try again!");
	}

}) //window
	


