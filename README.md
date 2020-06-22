# Sequoia
Sequent calculus proof construction tool

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You need to have [Node.js](http://nodejs.org/), [Bower](https://bower.io/) and [MongoDB](https://www.mongodb.com/download-center?jmp=nav) installed. You also need [Standard ML of New Jersey](https://www.smlnj.org/), [Python3](https://www.python.org/download/releases/3.0/) and [mip](https://pypi.org/project/mip/) installed. You must also use Google chrome as the browser to run Sequoia in.

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
