from node:20.5.1-slim

user node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]