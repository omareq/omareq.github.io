# Github.io

[![Build Status](https://travis-ci.com/omareq/omareq.github.io.svg?branch=master)](https://app.travis-ci.com/github/omareq/omareq.github.io)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fomareq.github.io)
![GitHub repo size](https://img.shields.io/github/repo-size/omareq/omareq.github.io)
[![GitHub](https://img.shields.io/github/license/omareq/omareq.github.io)](https://www.gnu.org/licenses/gpl-3.0.html)

Over the years I have made a lot of very small and fun programs on my computer.
I have decided to start converting a lot of them to use JavaScript so that I can
leave it online for people to enjoy.  I have never been officially taught how to
program so if you see anything that could be improved let me know and I will
give it a go.

For now just enjoy my mini library of fun [here](https://omareq.github.io/).

## Installation

Run the following commands in a terminal.

```
git clone https://github.com/omareq/omareq.github.io.git
cd ./omareq.github.io

# will read package.json and install npm dependencies
# these are only used for testing if you don't want to install them that is fine
npm install

# This is to run a local server to use the project locally
# If you have another server setup then you don't need to install this
# This should come as default with the python standard library
sudo apt-get install python3
pip3 install simple_http_server
```

## Usage

### Run the repo locally
```
cd ./omareq.github.io

python3 -m http.server 8990

```

Open Google Chrome and enter [localhost:8990](http://localhost:8990/) into the
address bar.

### Adding and deleting projects

Project manipulation from the terminal.  This allows you to create and remove
projects at will without having to manually edit HTML.
```
cd ./omareq.github.io

# Add a new project
# Once you have one all set up don't forget to add a 1:1 aspect ratio image to
# the imgs directory with the correct project id.  This will change the preview
# image from a white square to the image you choose.
./control.py add GreatNewProject "The best project of all time"

# Archive Project
./control.py archive MedicoreProject

# Restore archived project
./control.py restore IGuessItWasOkProject

# Remove project permanently
./control.py remove EmbarrassingProject

# Forgot what to do
./control.py --help

```

### Make Docs for a project

The docs for this repo are built using [JSDoc](https://jsdoc.app/).  Each
project has it's own documentation.  This can be built with the command below.
The configuration file will ensure that the docs match the theme of the rest
of the repository.

```
cd ./omareq.github.io/projectDir
jsdoc -c ../.jsdoc-conf.json *.js

```


### Testing
The unit testing is done with [QUnit](https://qunitjs.com/).  All tests are
stored in the "test" directory.  Currently the unit tests only validate the
layout of the repository.  This includes, checking that docs exist for each
project, making sure the projects.json file is correct and linting the js files.

In future this will be expanded to include a headless browser to test the
components of each project individually.

```
cd ./omareq.github.io/
qunit
```


## Todo

- [ ]   Move todo list to github issues
- [ ]   Testing, make sure that all js files are linked in index.html, spell check, markdown validator, html validator
- [ ]   Add "/" to end of links in README files so that Google doesn't ignore them during indexing due to file redirect protocols, redo docs.  Also add "/" to end of links to docs in project index.html files
- [ ]   Adjusting mailto links with subject line for each project
- [ ]   Add links to automated documentation generator at the top of each code file
- [ ]   Check for license at the top of all code files
- [ ]   Local mathjax install with proper fonts etc
- [ ]   alternate js sources
- [ ]   Adjust bootstrap containers to be container-fluid for responsive design
- [ ]	Finish Antenna Calculator
- [ ]	Finish Ninja Game
- [ ]   Finish texType Docs and rest of texType/todo
- [ ]	Knight's Tour Using Warnsdorff's Rule
- [ ]	Mesh Generation Delaunay Triangles
- [ ]	Minesweeper
- [ ]   Missile Command Arcade Game
- [ ]   Monte Carlo Integration
- [ ]   Optical resonator stability
- [ ]   Optics ABCD Matrix
- [ ]	PDE Solver
- [ ]   Perlin noise generation
- [ ]   Projectile Motion - with and without drag
- [ ]   Quadruped Robot IK
- [ ]   Recursive Integration
- [ ]	Super Hexagon
- [ ]	Tetris
- [ ]	Tic Tac Toe
- [ ]	Turtle Draw Program

## License

[GPL v3](https://www.gnu.org/licenses/gpl-3.0.html)

## Author

This repository is created by Omar EQ [omareq08+github@gmail.com](mailto:omareq08+github@gmail.com)
