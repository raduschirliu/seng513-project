# backend

## Setup

If this is the first time running/building the backend, run
```
npm install
```
(this will take a while, but you should only need to do this once)  

  
Create a file in the `backend/` folder called `.env`, and copy-paste the contents of `.env.template` into it.  
Set the empty fields to valid values to avoid any errors.  
  
Alternatively, set the values within the machine's environment instead of using a `.env` file.

## Developing
  
To start the server in development mode (will restart any time you make changes to files) run:
```
npm run dev
```

## Building

To build the backend without starting it, run:
```
npm run build
```

The build artifacts can then be found in the `build/` folder.