import {Logger, INFO} from '../utils';
import * as util from 'util';

const inspect = util.inspect;
const logger = new Logger(INFO);

export class Session {

  private readonly session;

  private readonly client;

  constructor(client, session) {
    this.session = session;
    this.client = client;
    logger.notice('Session created');
    this.bindEvents();
  }

  bindEvents(){
    this.session.on('pty', (accept, reject, info) => {
      this.ptyEvent(accept, reject, info);
    });
    this.session.on('shell', accept => {
      this.shellEvent(accept);
    });
    this.session.once('exec', (accept, reject, info) => {
      this.execEvent(accept, reject, info);
    });
  }

  ptyEvent(accept, reject, info) {
    logger.notice('Client asked for PTY');
    logger.debug(info);
    reject();
    logger.info('PTY request rejected');
  }

  shellEvent(accept) {
    logger.notice('Client asked for a shell');
    const stream = accept();
    logger.info('Shell request accepted');
    stream.on('close', () => {
      logger.notice('Stream :: close');
      this.client.end();
    }).on('data', data => {
      logger.debug('Streamed data', data);
      stream.write('[ITBot] Why did u talking here ?\n');
    }).stderr.on('data', data => {
      logger.error('StdErr', data);
    });
    // stream.end('ls -l\nexit\n');
  }

  execEvent(accept, reject, info) {
    logger.notice('Client asked to execute ' + inspect(info.command));
    const stream = accept();
    stream.stderr.write('Oh no, the dreaded errors!\n');
    stream.write('Just kidding about the errors!\n');
    stream.exit(0);
    stream.end();
  }
}
