### Installation

Clone the project

```sh
git clone https://github.com/Salade2chats/ITPoc-Proxy-Server.git
```

Install dependencies

```sh
cd ITPoc-Proxy-Server
yarn install
```

Create a private key

```sh
openssl req -nodes -newkey rsa:2048 -keyout private.key -subj "/C=FR/ST=Val d'Oise/L=Franconville/O=Salade2chats/OU=IT Department/CN=itpoc.io"
```

Build and/or run the project

```sh
yarn run start|serve|build-ts
```

#### Test

Create a listener

```sh
nc -l 3000
```

Create a remote forwarding

```sh
ssh -TR 5002:localhost:3000 foo@127.0.0.1 -p 5022
```

Send data

```sh
nc -v localhost 5002
```
