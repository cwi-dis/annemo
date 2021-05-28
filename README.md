# Annemo

A simplistic web app for annotating emotions in human speech video recordings.

![annemo screenshot](https://github.com/cwi-dis/annemo/raw/master/doc/screenshot.png)

This is a complete rewrite of the original application using modern JS APIs,
Typescript and React. Moreover the application can now be run inside a Docker
container and with modern versions of Node.js.

## Setup

Before starting the application, make sure to copy or rename the file
`config.json.sample` to `config.json` and fill in your desired values. The
application will refuse to start if there is no `config.json` present.

To start the application in a production environment, invoke the following
command:

    docker-compose -f docker-compose.prod.yml up

This will start the server on port 3001 on your machine and the results will
become available in the local `results/` directory.

## Development

If you want to modify the application youself, it's easier to start the
container with the development configuration. To do this, invoke the following
command:

    docker-compose up

Keep in mind, that in this case, the directories `bin/`, `views/` and `static/`
are mounted inside the container from the local machine. This means, that you
have to build frontend and backend bundles yourself by first running
`yarn install` followed by `yarn build`, in both, the root directory as well as
the directory `static/`.
