#!/bin/sh

cd "$(dirname "$0")"

docker network create msamlin || true

docker run --init --rm \
-p 13306:3306 \
-v "$PWD"/mysqldata:/var/lib/mysql \
--network msamlin \
--name msamlin-mysql \
-e MYSQL_ROOT_PASSWORD=my-secret-pw \
-it mysql:8


