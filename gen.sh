#!/usr/bin/env bash

browserify  -r ./src/ens.js:ens  > ./dist/ens.js
browserify  -r ./src/hex-utils.js:hex-utils  > ./dist/hex-utils.js
browserify  -r ./src/keystore.js:keystore  > ./dist/keystore.js
browserify  -r ./src/privateKey.js:privateKey  > ./dist/privateKey.js
browserify  -r ./src/validator.js:validator  > ./dist/validator.js
browserify  -r ./src/order.js:order  > ./dist/order.js
browserify -r ethereumjs-util -r ./src/relay.js:relay  > ./dist/relay.js
