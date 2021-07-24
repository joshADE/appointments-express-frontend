# Appointments-Express-Frontend
> The front end React Redux Toolkit app for Appointments-Express. The backend code can be seen [here](https://github.com/joshADE/Appointments-Express-Backend).


# Technologies used
* [React JS](https://reactjs.org/) (Javascript Library)
* [Redux](https://redux.js.org/) (State Container)
* [Redux Toolkit](https://redux-toolkit.js.org/) (Package to help in Redux development)
* [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) (Data fetching and caching tool built on top of Redux Toolkit)
* [TypeScript](https://www.typescriptlang.org/) (Static typed superset of JavaScript)
* [Tailwindcss](https://tailwindcss.com/) (Utility-first CSS framework)

# Requirements

* NPM (version 7.x and above) (Download node.js to install npm [here](https://nodejs.org/en/))
* GIT (version 2.x and above) (Download [here](https://git-scm.com/))

# Getting Started

## Clone Repository

Clone the repository to your computer.


```
git clone https://github.com/joshADE/appointments-express-frontend.git
```

## Installation

1. cd to the project directory.
2. run `npm install` to install dependencies.

```
npm install
```

## Setup the connection to the server
Inside the src folder, edit axios.ts and change the baseURL variable to the url of the running backend server. Make sure that '/api' is added at the end of the url.

```
export const baseUrl = (your url here); (i.e. 'https://appointments-express.herokuapp.com/api')
```

The link to the backend source can be seen above. You will need to get it running in your local environment.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode



