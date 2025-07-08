# 🌡️ Temperature Guessing Game

A mobile game built with React Native where you guess whether the next city is hotter or colder.

## 🎮 Concept

You're shown a random city and its current temperature. Then comes the challenge:

> “Is the next city's temperature hotter or colder?”

The game uses real-time data and tests your intuition about global climates — a fast-paced twist on geography and weather.

Inspired by the [Higher Lower Game](https://www.higherlowergame.com/), but with a meteorological consept

## 🔧 Features

- 🌍 Guess temperatures between real-world cities
- 🌡️ Real-time temperature data using Open-Meteo API
- 🖼️ Wikipedia-sourced images of cities
- 📈 Local game stats tracking
- ⚛️ Built with React Native + Expo

## 🧪 Tech Stack

- React Native (with Expo)
- Open-Meteo API
- Wikipedia API
- SQLite (via Expo SQLite)

## 📸 Screenshots

<div align="left">
  <img src="screenshots/game-starting-screen.png" width="200" alt="Game Starting Screen" style="margin: 10px;" />
  <img src="screenshots/gameplay-screen.png" width="200" alt="Gameplay Screen" style="margin: 10px;" />
</div>

## 🚀 How to Run

To run this app locally using Expo:

1. **Clone the repository**

    ```bash
    git clone https://github.com/simoalanne/HotterOrColderGame
    cd HotterOrColderGame/app
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Start the development server**

    ```bash
    npx expo start
    # Depending on your setup, you may need to add the --tunnel flag
    ```

## 🖥️ Additional setup

 If you want to customize what cities are available for the app ```HotterOrColderGame/setup ``` contains a simple python script and original csv file that was used to populate the apps database. The database file ```cities.db``` the app uses is included in this repository and is inside ```HotterOrColderGame/app/src/assets``` directory.
