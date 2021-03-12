> Youtube Downloader GUI

**Table of Contents**

<!-- TOC -->

- [07 - Youtube Downloader GUI Documentation](#07---youtube-downloader-gui-documentation)
  - [Quick Start](#quick-start)
  - [Installation](#installation)
  - [Main Files](#main-files)

<!-- /TOC -->

# 07 - Youtube Downloader GUI Documentation

## Quick Start

1. **Configure:** In the app's directory, run `yarn install` and `pip install bottle bottle-websocket future whichcraft pyinstaller`
2. **Demo:** Build static files with `yarn build` then run the application with `python main.py`. A Chrome-app window should open running the built code from `build/`
3. **Distribute:** (Run `yarn build` first) Build a binary distribution with PyInstaller using `python -m eel main.py build --onefile` (See more detailed PyInstaller instructions at bottom of [the main README](https://github.com/ChrisKnott/Eel))
4. **Develop:** Open two prompts. In one, run  `python main.py true` and the other, `yarn start`. A browser window should open in your default web browser at: [http://localhost:3000/](http://localhost:3000/). As you make changes to the JavaScript in `src/` the browser will reload. Any changes to `main.py` will require a restart to take effect. You may need to refresh the browser window if it gets out of sync with eel.

## Installation
 
```shell
python -m venv .

.\pip\Scripts\activate

pip install -r requirement.txt

yarn install
```


## Main Files

Critical files for this demo

- `src/App.tsx`: Modified to demonstrate exposing a function from JavaScript and how to use callbacks from Python to update React GUI
- `main.py`: Basic `eel` file
  - If run without arguments, the `eel` script will load `index.html` from the build/ directory (which is ideal for building with PyInstaller/distribution)
  - If any 2nd argument (i.e. `true`) is provided, the app enables a "development" mode and attempts to connect to the React server on port 3000
- `public/index.html`: Added location of `eel.js` file based on options set in main.py

  ```html
  <!-- Load eel.js from the port specified in the eel.start options -->
  <script type="text/javascript" src="http://localhost:8080/eel.js"></script>
  ```

- `src/react-app-env.d.ts`: This file declares window.eel as a valid type for tslint. Note: capitalization of `window`
- `src/App.css`: Added some basic button styling
