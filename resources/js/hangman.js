class Hangman {
    constructor(_canvas) {
      if (!_canvas) {
        throw new Error(`invalid canvas provided`);
      }
  
      this.canvas = _canvas;
      this.ctx = this.canvas.getContext(`2d`);
    }
  
    /**
     * This function takes a difficulty string as a patameter
     * would use the Fetch API to get a random word from the Hangman
     * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
     * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
     * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
     * The results is a json object that looks like this:
     *    { word: "book" }
     * */
    
    getRandomWord(difficulty) {
      return fetch(
        `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
      )
        .then((r) => r.json())
        .then((r) => r.word);
    }
  
    /**
     *
     * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
     * @param {function} next callback function to be called after a word is reveived from the API.
     */
    async start(difficulty, next) {
      this.word = await this.getRandomWord(difficulty);
      console.log(`Generated word is : ${this.word}`)
      // get word and set it to the class's this.word
      // clear canvas
      this.clearCanvas();
      // draw base
      this.drawBase();
      // reset this.guesses to empty array
      // reset this.isOver to false
  
      // reset this.didWin to false
      this.guesses = [];
      this.isOver = false;
      this.didWin = false;
      next();
    }
  
    /**
     *
     * @param {string} letter the guessed letter.
     */
    guess(letter) {
      
      // Check if nothing was provided and throw an error if so
      // Check for invalid cases (numbers, symbols, ...) throw an error if it is
      // Check if more than one letter was provided. throw an error if it is.
      // if it's a letter, convert it to lower case for consistency.
      // check if this.guesses includes the letter. Throw an error if it has been guessed already.
      // add the new letter to the guesses array.
      // check if the word includes the guessed letter:
      //    if it's is call checkWin()
      //    if it's not call onWrongGuess()
  
      if(letter.length < 1) throw new Error("You must enter at least one character");
      if (!letter.match(/^[a-zA-Z]*$/)) throw new Error(`invalid symbol`);
      if(letter.length > 1) alert("You must enter one character one time");
      if(this.guesses.includes(letter)) alert("you already try this letter");
  
      this.guesses.push(letter);
  
      if(this.word.includes(letter)){
        this.checkWin()
      }else{
        this.onWrongGuess()
      }
  
    }
  
    checkWin() {
      // using the word and the guesses array, figure out how many remaining unknowns.
      // if zero, set both didWin, and isOver to true
      const unknownLetters = this.word
        .split(``)
        .filter(letter => !this.guesses.includes(letter))
        .length;
  
        if(unknownLetters == 0 ){
          this.isOver = true;
          this.didWin = true;
        }
    }
  
    /**
     * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
     * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
     * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
     */
    onWrongGuess() {
      const wrongGusees = this.guesses
        .filter(letter => !this.word.includes(letter))
        .length;
  
        if(wrongGusees == 1){ this.drawHead()};
        if(wrongGusees == 2){ this.drawBody()};
        if(wrongGusees == 3){ this.drawLeftArm()};
        if(wrongGusees == 4){ this.drawRightArm()};
        if(wrongGusees == 5){ this.drawLeftLeg()};
        if(wrongGusees == 6){ this.drawRightLeg()};
  
    }
  
    /**
     * This function will return a string of the word placeholder
     * It will have underscores in the correct number and places of the unguessed letters.
     * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
     */
    getWordHolderText() {
      let placeholder = "";
      let wordArray = this.word.split("");
  
      for (let i = 0; i < this.word.length; i++) {
        if (this.guesses.includes(wordArray[i])) {
          placeholder += wordArray[i];
        } else {
          placeholder += " _ ";
        }
      }
      console.log(`placehold is ${placeholder}`)
      return placeholder;
    }
  
    /**
     * This function returns a string of all the previous guesses, seperated by a comma
     * This would return something that looks like
     * (Guesses: A, B, C)
     * Hint: use the Array.prototype.join method.
     */
    getGuessesText() {
      return `Previous Guesses: ${this.guesses.join(', ')}`;
    }
  
    /**
     * Clears the canvas
     */
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    /**
     * Draws the hangman base
     */
    drawBase() {
      this.ctx.fillRect(95, 10, 150, 10); // Top
      this.ctx.fillRect(245, 10, 10, 50); // Noose
      this.ctx.fillRect(95, 10, 10, 400); // Main beam
      this.ctx.fillRect(10, 410, 175, 10); // Base
    }
  
    drawHead() {
      this.ctx.beginPath();
      this.ctx.arc(250,85,25,0,2*Math.PI);
      this.ctx.stroke();
    }
  
    drawBody() {
      this.ctx.fillRect(245, 110, 10, 125);
    }
  
    drawLeftArm() {
      this.ctx.beginPath();
      this.ctx.moveTo(250, 175);
      this.ctx.lineTo(200, 100);
      this.ctx.stroke();
    }
  
    drawRightArm() {
      this.ctx.beginPath();
      this.ctx.moveTo(250, 175);
      this.ctx.lineTo(170, 100);
      this.ctx.stroke();
    }
  
    drawLeftLeg() {
       this.ctx.beginPath();
      this.ctx.moveTo(250, 140);
      this.ctx.lineTo(200, 120);
      this.ctx.stroke();
    }
  
    drawRightLeg() {
      this.ctx.beginPath();
      this.ctx.moveTo(250, 140);
      this.ctx.lineTo(200, 190);
      this.ctx.stroke();
    }
  }