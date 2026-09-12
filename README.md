````markdown
# 🐃 RUN MARSOO

RUN MARSOO is a fun and interactive jungle running game where the player controls Marsupilami and tries to survive as long as possible by avoiding obstacles and reacting quickly to different types of fish.

## 🎮 About the Game

In RUN MARSOO, Marsupilami runs continuously through a jungle environment.

The player needs to react quickly to the fish appearing on the screen:

- 🔵 **Blue Fish** – Increases Marsupilami's speed.
- ⚫ **Black Fish** – Decreases Marsupilami's speed.
- 🪽 **Grey & White Winged Fish** – Main obstacle. Touching it causes Game Over.

The winged fish can appear at either the **top or bottom** of the screen.

- If the winged fish appears at the **bottom**, Marsupilami must move to the **top**.
- If the winged fish appears at the **top**, Marsupilami must move to the **bottom**.

The goal is to avoid the obstacle, collect fish, maintain the run, and achieve the highest score possible.

---

## ✨ Features

- 🐃 Marsupilami jungle runner
- 🌴 Jungle-themed environment
- 🔵 Speed-increasing Blue Fish
- ⚫ Speed-decreasing Black Fish
- 🪽 Winged Fish obstacle
- 📊 Score system
- ⚡ Speed display
- 🎮 Simple controls
- 💀 Game Over screen
- 🏠 Start page
- 📱 Responsive design

---

## 🛠️ Technologies Used

### HTML

HTML is used to create the structure of the web pages.

It is used for:
- Start page
- Game page
- Game Over page
- Buttons
- Game elements
- Navigation

### CSS

CSS is used to design and style the game.

It is used for:
- Jungle background
- Character positioning
- Fish appearance
- Buttons
- Layout
- Animations
- Game screen design

### JavaScript

JavaScript is used to make the game interactive.

It controls:
- Marsupilami movement
- Fish movement
- Collision detection
- Score
- Speed changes
- Game Over condition
- Game animations
- User controls

### Flask

Flask is used as the backend framework for the project.

It is used to:
- Run the web application
- Connect different pages
- Create routes
- Serve HTML, CSS, JavaScript and image files

### Images / Assets

Images are used for:
- Marsupilami
- Blue Fish
- Black Fish
- Winged Fish
- Jungle background
- Start screen
- Game Over screen

---

## 📂 Project Structure

```text
RUN-MARSOO/
│
├── app.py
│
├── templates/
│   ├── index.html
│   ├── game.html
│   └── gameover.html
│
└── static/
    │
    ├── css/
    │   └── style.css
    │
    ├── js/
    │   └── game.js
    │
    └── images/
        ├── start.png
        ├── gameover.png
        ├── marsupilami.png
        ├── blue_fish.png
        ├── black_fish.png
        ├── winged_fish.png
        └── jungle.png
````

---

## 📄 Pages

### 1. Start Page

The first page introduces the game.

It contains:

* Game image
* RUN MARSOO title
* Start Game button

Clicking the **Start Game** button opens the game page.

---

### 2. Game Page

This is the main gameplay page.

The player controls Marsupilami while he runs through the jungle.

The screen displays:

* Marsupilami
* Fish
* Winged Fish
* Jungle environment
* Score
* Speed

The player must react quickly and move Marsupilami to the opposite side when the winged fish appears.

---

### 3. Game Over Page

When Marsupilami touches the winged fish, the game ends.

The Game Over page displays:

* Game Over message
* Final score
* Option to play again

---

## 🎮 Game Controls

The game uses simple controls.

### Keyboard

```text
↑  Move to the Top
↓  Move to the Bottom
```

The player can use the keyboard to move Marsupilami between the top and bottom paths.

---

## 🧠 Game Logic

The game follows a simple logic:

```text
Start Game
     ↓
Marsupilami starts running
     ↓
Fish appear
     ↓
Blue Fish → Increase Speed
     ↓
Black Fish → Decrease Speed
     ↓
Winged Fish appears
     ↓
Check its position
     ↓
Bottom → Move to Top
Top → Move to Bottom
     ↓
Avoid Winged Fish
     ↓
Increase Score
     ↓
Continue Running
     ↓
Collision with Winged Fish?
     ↓
    YES
     ↓
 Game Over
```

---

## 📊 Scoring

The score increases while the player successfully continues the run.

The main objective is to survive longer and achieve a higher score.

---

## ⚙️ How to Run the Project

### Step 1: Install Python

Make sure Python is installed on your computer.

Check it using:

```bash
python --version
```

### Step 2: Install Flask

Open the terminal inside the project folder and run:

```bash
pip install flask
```

### Step 3: Open the Project Folder

Open the RUN MARSOO project folder in VS Code or another code editor.

### Step 4: Run Flask

Run:

```bash
python app.py
```

You should see something similar to:

```text
Running on http://127.0.0.1:5000
```

### Step 5: Open the Game

Open the browser and visit:

```text
http://127.0.0.1:5000
```

The RUN MARSOO start page will appear.

---

## 🔧 Development Tools

We used:

* **Visual Studio Code** – Code editor
* **Python** – Programming language for Flask
* **Flask** – Backend framework
* **HTML** – Web page structure
* **CSS** – Styling and animations
* **JavaScript** – Game logic and interaction
* **PNG/JPG Images** – Game graphics and backgrounds
* **Web Browser** – Testing the game

---

## 🎯 Project Objective

The main objective of RUN MARSOO is to create a simple, interactive and entertaining browser game using basic web development technologies.

The project also helps demonstrate how **HTML, CSS, JavaScript and Flask** can work together to create an interactive web application.

---

## 🚀 Future Improvements

Some possible improvements are:

* 🔊 Add background music and sound effects
* 🏆 Add a high-score system
* ❤️ Add multiple lives
* 🎚️ Add difficulty levels
* 📱 Improve mobile controls
* 🌳 Add more jungle animations
* 🐟 Add more types of fish
* 🏅 Add a leaderboard

---

## 👩‍💻 Project

**Project Name:** RUN MARSOO
**Type:** Interactive Web Game
**Theme:** Jungle Running Game
**Built Using:** HTML, CSS, JavaScript & Flask

---

## 🌟 Conclusion

RUN MARSOO is a simple and entertaining jungle running game that combines animation, user interaction, quick reactions and basic web development concepts.

The project demonstrates how different technologies can be combined to create an interactive browser-based game. 

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
