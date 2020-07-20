const stream = require('stream');
const util = require('util');

class transformStream extends stream.Transform {
  constructor() {
    super();
    this.tailPiece = '';
  }

  _transform(chunk, encoding, callback) {
    this.tailPiece = chunk
    console.log(chunk.length)

    this.push(this.tailPiece);       //[3]
    callback();
  }

  _flush(callback) {
    this.push(this.tailPiece);
    callback();
  }
}

module.exports =  transformStream;