const stream = require('stream')

class transformStream extends stream.Transform {
  constructor() {
    super()
    this.tailPiece = ''
  }
  _transform(chunk, encoding, callback) {
    this.tailPiece = chunk
    this.push(this.tailPiece)
    callback()
  }

  _flush(callback) {
    this.push(this.tailPiece)
    callback()
  }
}

module.exports =  transformStream