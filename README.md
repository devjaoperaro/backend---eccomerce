# Ecommerce Realtime Com AdonisJS, Node.JS e MySQL

![E-Commerce Real Time Com Adonis, Node.js e MySQL](thumbnail.jpg)

Esta aplicação está em desenvolvimento, caso tenha interesse em saber como ela foi criada acesse: [https://www.udemy.com/e-commerce-em-tempo-real-com-nodejs-adonis-e-websocket/](https://www.udemy.com/e-commerce-em-tempo-real-com-nodejs-adonis-e-websocket/)

## Pacotes inclusos

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds
6. Adonis Bumblebee
7. Adonis ACL
8. Adonis Validator
9. MYSQL

## Setup

Para executar esta aplicação em modo desenvolvimento você precisa ter o pacote `@adonijs/cli` instalado em sua máquina.

> Development

```bash
    git clone git@github.com:NeroOficial/ecommerce-realtime.git
    cd ecommerce-realtime
    npm install
    adonis serve --dev
```

> Production

```bash
    git clone git@github.com:NeroOficial/ecommerce-realtime.git
    cd ecommerce-realtime
    npm install
    npm start
```

Saída do terminal:

```bash
> adonis-ecommerce-realtime@4.1.0 start /path/to/ecommerce-realtime
> node server.js
> info: serving app on http://127.0.0.1:3333
```

### Migrations

Execute o seguinte comando para executar as migrations:

```js
adonis migration:run
```
