# Wordle Clone

## Description
This is a clone of the popular word game **Wordle**. In this game, players must guess a mystery 5-letter word. After each guess, hints are provided:
- A letter that is in the mystery word but in the wrong position is highlighted **yellow**.
- A letter that is in the correct position is highlighted **green**.

## Technologies Used
- **Frontend:** React, CSS
- **Backend:** Node.js

## Features
- Users can enter a word using either their keyboard or an on-screen keyboard.
- The game provides feedback based on the guessed word.
- Players can set their own custom mystery word.

## Installation & Usage
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the backend:
   ```sh
   npm start
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## API Endpoints
- **Word Guessing Endpoint:** Processes user guesses and returns feedback on letter positions.
- **Game Over Endpoint:** Handles cases where the player runs out of attempts.

## Environment Variables
No environment variables are required.

## Target Audience
This game is designed for people who enjoy brain teasers and word puzzles.

