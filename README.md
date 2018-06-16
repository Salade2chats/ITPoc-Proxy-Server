git clone https://github.com/Salade2chats/ITPoc-Proxy-Server.git
cd ITPoc-Proxy-Server
ssh-keygen ./
yarn install
yarn run start|serve|build-ts
node build

test :
create a listener :

nc -l 3000

create a remote forwarding :

ssh -TR 5002:localhost:3000 foo@127.0.0.1 -p 5022

send data :

nc -v localhost 5002
