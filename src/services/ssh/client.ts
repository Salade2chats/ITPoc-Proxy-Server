import {DataBag, Logger, INFO, IDataBagData} from '../utils';
import {Session} from './index';
import * as net from 'net';
import * as util from 'util';

const inspect = util.inspect;
const logger = new Logger(INFO);

export class Client {

  private readonly client;
  private dataBag: IDataBagData;
  private session;

  constructor(client) {
    this.client = client;
    logger.notice('Client connected');
    this.bindEvents();
  }

  bindEvents() {
    this.client
      .on('authentication', ctx => {
        this.triggerAuthentication(ctx);
      })
      .on('ready', () => {
        logger.notice('Client ready');
        this.client
          .on('session', (accept) => {
            this.triggerSession(accept);
          })
          .on('request', (accept, reject, name, info) => {
            this.triggerRequest(accept, reject, name, info);
          });
      })
      .on('end', () => {
        this.triggerEnd();
      })
      .on('error', error => {
        logger.warning('Client error triggered', inspect(error));
      });
  }

  triggerAuthentication(ctx) {
    if (ctx.method === 'password' && ctx.username === 'foo' && ctx.password === 'bar') {
      this.dataBag = new DataBag();
      ctx.accept();
      logger.notice('Client authenticated');
    } else {
      ctx.reject();
    }
  }

  triggerEnd() {
    logger.notice('Client end connection');
    const server = this.dataBag.get('server');
    if (server) {
      server.close();
      this.dataBag.remove('server');
    }
  }

  triggerRequest(accept, reject, name, info) {
    if (name === 'tcpip-forward') {
      logger.notice('Client asked for a TCPIP-Forward');
      const server = net.createServer(socket => {
        socket.setEncoding('utf8');
        /*socket.on('end', () => {
          console.log('Socket closed');
        });
        socket.on('data', (data) => {
          console.log('Socket receive data');
          console.log(data);
        });*/
        socket.on('end', () => {
          logger.notice('Server closed');
        });
        this.client.forwardOut(
          info.bindAddr, info.bindPort,
          socket.remoteAddress, socket.remotePort,
          (err, upstream) => {
            if (err) {
              socket.end();
              return logger.error('Error when forward out: ' + err);
            }
            logger.debug('Forward data', socket.remoteAddress, socket.remotePort, info.bindAddr, info.bindPort);
            upstream.pipe(socket).pipe(upstream);
          });
      });
      server.listen(info.bindPort); // listen on 127.0.0.1:8100
      server.on('close', () => {
        logger.notice('Server on port ' + info.bindPort + ' stop listening');
      });
      server.on('error', (error: Error) => {
        if (error['code'] === 'EADDRINUSE') {
          logger.warning('Port in used');
        } else {
          logger.warning('Port forwarding failed:', inspect(error));
        }
        // @TODO: this emit an error because on('session') listener fails
        this.client.end();
      });
      logger.info('tcpip-forward accepted');
      logger.notice('Created server that listen on port ' + info.bindPort);
      this.dataBag.set('server', server);
      accept();
    } else {
      reject();
    }
  }

  triggerSession(accept) {
    this.session = new Session(this.client, accept());
  }
}

export default Client;
