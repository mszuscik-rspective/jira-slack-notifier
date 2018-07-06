const _ = require('lodash');

class RepeatQueue {
  constructor(queue, lastElement) {
    this.queue = _.xor(queue);

    if (lastElement) {
      while (_.last(queue) !== lastElement) {
        const element = this.queue.shift();
        this.queue.push(element);
      }
    }
  }

  shift(excluded) {
    if (
      !this.queue.length ||
      (this.queue.length === 1 && excluded === this.queue[0])
    ) {
      return null;
    }

    const element = excluded && excluded == this.queue[0]
      ? this.queue.splice(1, 1)[0]
      : this.queue.shift();

    this.queue.push(element);

    return element;
  }
}

module.exports = RepeatQueue;
