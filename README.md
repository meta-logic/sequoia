# Sequoia
Sequent calculus proof construction tool

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](http://nodejs.org/)
- [MongoDB](https://www.mongodb.com/download-center?jmp=nav)
- [Bower](https://bower.io/) (note that Bower can be installed via `npm` once Node.js is installed)
- [Standard ML of New Jersey](https://www.smlnj.org/)
- [Python3](https://www.python.org/download/releases/3.0/) 
- [mip](https://pypi.org/project/mip/)

### Installing

Clone the repo

```
git clone git@github.com:meta-logic/sequoia.git
```

Installing the dependencies

```
cd sequoia
npm install
npm install nodemon
bower install
```

### Running

Run mongoDB

```
mongod
```
Then, run the server

```
npm start
```
The application should now be running on [localhost:8080/sequoia](http://localhost:8080/sequoia).
