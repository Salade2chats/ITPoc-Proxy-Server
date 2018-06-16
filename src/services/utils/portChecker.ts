import * as net from 'net';

export class PortChecker {

  private readonly port: number;

  constructor(port) {
    this.port = port;
  }

  isAvailable(callback) {
    const tester = net.createServer()
      .once('error', (e: Error) => {
        if (e['code'] !== 'EADDRINUSE') {
          return callback(e);
        }
        callback(null, true);
      })
      .once('listening', () => {
        tester.once('close', () => {
          callback(null, false);
        }).close();
      })
      .listen(this.port);
  }
}

export default PortChecker;
