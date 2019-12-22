/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.height * this.width;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify((obj));
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const argObj = JSON.parse(json);
  const values = Object.values(argObj);
  return new proto.constructor(...values);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.selectors = [];
    this.repeatError = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.orderError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  add(type, value, priority) {
    this.selectors.push({
      type,
      value,
      priority,
    });

    return this;
  }

  element(value) {
    if (this.isSelectorExist('element')) {
      throw new Error(this.repeatError);
    }
    if (this.isPriorityRight(1)) {
      throw new Error(this.orderError);
    }
    this.add('element', `${value}`, 1);
    return this;
  }

  id(value) {
    if (this.isSelectorExist('id')) {
      throw new Error(this.repeatError);
    }
    if (this.isPriorityRight(2)) {
      throw new Error(this.orderError);
    }
    this.add('id', `#${value}`, 2);
    return this;
  }

  class(value) {
    if (this.isPriorityRight(3)) {
      throw new Error(this.orderError);
    }
    this.add('class', `.${value}`, 3);
    return this;
  }

  attr(value) {
    if (this.isPriorityRight(4)) {
      throw new Error(this.orderError);
    }
    this.add('attr', `[${value}]`, 4);
    return this;
  }

  pseudoClass(value) {
    if (this.isPriorityRight(5)) {
      throw new Error(this.orderError);
    }
    this.add('pseudoClass', `:${value}`, 5);
    return this;
  }

  pseudoElement(value) {
    if (this.isSelectorExist('pseudoElement')) {
      throw new Error(this.repeatError);
    }
    if (this.isPriorityRight(6)) {
      throw new Error(this.orderError);
    }
    this.add('pseudoElement', `::${value}`, 6);
    return this;
  }

  isSelectorExist(type) {
    return this.selectors.some((obj) => obj.type === type);
  }

  isPriorityRight(priority) {
    return (this.selectors.length !== 0)
      && (this.selectors[this.selectors.length - 1].priority > priority);
  }

  raw(value) {
    this.add('raw', value);
    return this;
  }

  stringify() {
    let string = '';
    for (let i = 0; i < this.selectors.length; i += 1) {
      string += this.selectors[i].value;
    }
    this.selectors = [];
    return string;
  }
}


const cssSelectorBuilder = {
  element(value) {
    return (new Builder()).element(value);
  },

  id(value) {
    return (new Builder()).id(value);
  },

  class(value) {
    return (new Builder()).class(value);
  },

  attr(value) {
    return (new Builder()).attr(value);
  },

  pseudoClass(value) {
    return (new Builder()).pseudoClass(value);
  },

  pseudoElement(value) {
    return (new Builder()).pseudoElement(value);
  },

  // eslint-disable-next-line no-unused-vars
  combine(selector1, combinator, selector2) {
    return (new Builder()).raw(selector1.stringify()).raw(` ${combinator} `).raw(selector2.stringify());
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
