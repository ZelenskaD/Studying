/** Node: node for a stack. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */
class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  /** push(val): add new value to end of the stack. Returns undefined. */
  push(val) {
    const newNode = new Node(val);
    if (!this.first) {
      this.first = newNode;
      this.last = newNode;
    } else {
      newNode.next = this.first;
      this.first = newNode;
    }
    this.size += 1;
  }

  /** pop(): remove the node from the top of the stack
   * and return its value. Should throw an error if the stack is empty. */
  pop() {
    if (!this.first) throw new Error("Stack is empty");
    const removedNode = this.first;
    this.first = this.first.next;
    if (!this.first) {
      this.last = null;
    }
    this.size -= 1;
    return removedNode.val;
  }

  /** peek(): return the value of the first node in the stack. */
  peek() {
    if (!this.first) throw new Error("Stack is empty");
    return this.first.val;
  }

  /** isEmpty(): return true if the stack is empty, otherwise false */
  isEmpty() {
    return this.size === 0;
  }
}

module.exports = Stack;

// Example usage:
const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.pop());    // 3
console.log(stack.peek());   // 2
console.log(stack.isEmpty());// false
console.log(stack.size);     // 2
