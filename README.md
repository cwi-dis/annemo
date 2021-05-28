Annemo
======

A simplistic web app for annotating emotions in human speech video recordings.

![annemo screenshot](https://github.com/ilyabo/annemo/raw/master/doc/screenshot.png)

This is a complete rewrite of the original application using Typescript and
React. Moreover the application can now be run inside a Docker container and
with modern versions of Node.js.

To start the application in a production environment, invoke the following
command:

    docker-compose -f docker-compose.prod.yml up

This will start the server on port 3001 on your machine and the results will
become available in the local `results/` directory.

For development, invoke the following command:

    docker-compose up

Keep in mind, that in this case, the directories `bin/`, `views/` and `static/`
are mounted inside the container from the local machine. This means, that you
have to build frontend and backend bundles yourself by first running
`yarn install` followed by `yarn build`, both in the root directory as well as
the directory `static/`.
