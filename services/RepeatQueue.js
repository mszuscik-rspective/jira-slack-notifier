const _ = require('lodash');

class RepeatQueue {
  constructor(queue, lastElement) {
    this.queue = queue;

    if (lastElement) {
      while (_.last(queue) !== lastElement) {
        const element = this.queue.shift();
        this.queue.push(element);
      }
    }
  }

  shift() {
    const element = this.queue.shift();
    this.queue.push(element);

    return element;
  }
}

module.exports = RepeatQueue;
