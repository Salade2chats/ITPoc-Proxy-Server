import * as fs from 'fs';
import * as ssh2 from 'ssh2';
import {Client, Logger, INFO} from './services';

const logger = new Logger(INFO);

const __PORT__ = 5022;
// client remote forward: ssh -TR 5000:localhost:3000 foo@127.0.0.1 -p 5022
// client: ssh -T foo@127.0.0.1 / bar

new ssh2.Server({
  hostKeys: [fs.readFileSync('./private.key')]
}, client => {
  return new Client(client);
}).listen(__PORT__, '0.0.0.0', function () {
  logger.title('Start SSH server on port ' + this.address().port);
});
