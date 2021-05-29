FROM node:14.15.1-alpine3.11 AS frontend

ADD ./static /code/
WORKDIR /code

RUN yarn install && \
    yarn build && \
    yarn cache clean && \
    rm -rf node_modules/

FROM node:14.15.1-alpine3.11 AS backend

ADD . /code/
WORKDIR /code

COPY --from=frontend /code static/

RUN yarn install && \
    yarn build && \
    yarn cache clean

EXPOSE 3000
CMD ["yarn", "start"]
