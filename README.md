# Sequoia
Sequent calculus proof construction tool

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
You need to have [Node.js](http://nodejs.org/), [Bower](https://bower.io/) and [MongoDB](https://www.mongodb.com/download-center?jmp=nav) installed. You also need python3 and [mip 1.3.0](https://pypi.org/project/mip/1.3.0/) installed. You must also use Google chrome as the browser to run Sequoia in.

### Installing

Clone the repo

```
git clone git@github.com:meta-logic/sequoia.git
```

Installing the dependencies

```
cd sequoia
npm install
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
The application should now be running on [localhost:3000](http://localhost:3000/).
