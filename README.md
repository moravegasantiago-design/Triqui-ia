Triqui AI – Impossible Mode

Triqui (Tic-Tac-Toe) built with React and TypeScript.
This project features an artificial intelligence powered by the Minimax algorithm, making the AI play perfectly and therefore impossible to beat.

The best possible outcome for the player is a draw.

Technologies

React

TypeScript

Tailwind CSS

Vite

Minimax Algorithm

Artificial Intelligence

The AI is based on the Minimax algorithm, a classic decision-making algorithm for turn-based games.

How it works

Evaluates all possible board states

Simulates future moves recursively

Always selects the optimal move

Never makes mistakes

Possible outcomes:

Player loses if a mistake is made

Draw if the player plays perfectly

Player victory is not possible

Features

Impossible difficulty AI

Automatic win, loss, and draw detection

Visual alerts for each game result

Board locking when the game ends

Clean and responsive UI

Clear separation between game logic and UI logic

Installation
Requirements

Node.js version 18 or higher

npm

Steps

Clone the repository
git clone https://github.com/your-username/your-repository.git

Navigate into the project folder
cd your-repository

Install dependencies
npm install

Start the development server
npm run dev

Open the app in your browser
http://localhost:5173

Project Structure

src/
├─ game/
│ ├─ minimax.ts
│ ├─ checkWinner.ts
│ └─ playTurn.ts
├─ components/
│ ├─ Board.tsx
│ ├─ Modals.tsx
│ └─ Card.tsx
├─ types/
│ └─ game.ts
└─ main.tsx

Project Purpose

This project was built for educational and demonstration purposes in order to:

Implement the Minimax algorithm in a real application

Practice state management in React

Apply TypeScript to complex game logic

Maintain a clean and scalable architecture

Build a deterministic, error-free AI

Notes

The AI has no randomness.
Every move is calculated to maximize the outcome.

If the player loses, it is the direct result of a suboptimal move.