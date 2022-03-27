// data_binding/types.ts
var dictionary = Symbol("Beako");
var reactiveKey = Symbol("Reactive");
var arrayKey = Symbol("Array");
var isLocked = Symbol("Beako-lock");

// data_binding/watch.ts
function watch(data, keyOrCallback, callback) {
  if (typeof data === "object" && data !== null && (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))) {
    const obj = data;
    if (!obj[isLocked]) {
      invade(obj);
      if (callback === void 0) {
        const callbacks = obj[dictionary][reactiveKey][1];
        if (typeof keyOrCallback === "function") {
          callbacks.add(keyOrCallback);
        }
        for (const key in obj) {
          invade(obj, key, obj[dictionary][reactiveKey][0]);
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            if (callbacks.size) {
              callbacks.forEach((callback2) => {
                if (!(dictionary in value) || !value[dictionary][reactiveKey][1].has(callback2)) {
                  watch(value, callback2);
                }
              });
            } else {
              if (!(dictionary in value)) {
                watch(value);
              }
            }
          }
        }
        if (Array.isArray(obj)) {
          const len = obj[dictionary][arrayKey].length;
          if (obj.length < len) {
            for (let index = obj.length; index < len; index++) {
              invade(obj, index);
            }
          }
          obj.length = len;
        }
      } else {
        const spy = typeof callback === "function" ? ["spy", callback] : callback;
        if (Array.isArray(keyOrCallback)) {
          keyOrCallback.forEach((key) => invade(obj, key, spy));
        } else {
          invade(obj, keyOrCallback, spy);
        }
      }
    }
  }
  return data;
}
function invade(obj, key, arm) {
  if (!obj[isLocked]) {
    if (!(dictionary in obj)) {
      const reactiveCallback = () => {
        obj[dictionary][reactiveKey][1].forEach((callback) => callback());
      };
      obj[dictionary] = {
        [reactiveKey]: [["bio", reactiveCallback], /* @__PURE__ */ new Set()]
      };
      if (Array.isArray(obj)) {
        const array = obj[dictionary][arrayKey] = obj.slice();
        const reactive = (value) => {
          reactiveCallback();
          return value;
        };
        const rewatch = (value) => {
          watch(obj);
          reactiveCallback();
          return value;
        };
        Object.defineProperties(obj, {
          unshift: {
            get() {
              return (...items) => rewatch(Array.prototype["unshift"].call(array, ...items));
            }
          },
          push: {
            get() {
              return (...items) => rewatch(Array.prototype["push"].call(array, ...items));
            }
          },
          splice: {
            get() {
              return (start, deleteCount, ...items) => rewatch(deleteCount === void 0 ? Array.prototype["splice"].call(array, start, array.length - start) : Array.prototype["splice"].apply(array, [start, deleteCount, ...items]));
            }
          },
          pop: {
            get() {
              return () => rewatch(Array.prototype["pop"].call(array));
            }
          },
          shift: {
            get() {
              return () => rewatch(Array.prototype["shift"].call(array));
            }
          },
          sort: {
            get() {
              return (compareFn) => reactive(compareFn === void 0 ? Array.prototype["sort"].call(array) : Array.prototype["sort"].call(array, compareFn));
            }
          },
          reverse: {
            get() {
              return () => reactive(Array.prototype["reverse"].call(array));
            }
          },
          copyWithin: {
            get() {
              return (target, start, end) => reactive(Array.prototype["copyWithin"].call(array, target, start !== void 0 ? start : 0, end !== void 0 ? end : array.length));
            }
          }
        });
      }
    }
    if (key !== void 0) {
      if (!Array.isArray(obj) || typeof key !== "number" && isNaN(key)) {
        if (!(key in obj[dictionary])) {
          obj[dictionary][key] = [obj[key], /* @__PURE__ */ new Set()];
          Object.defineProperty(obj, key, {
            get() {
              return this[dictionary][key][0];
            },
            set(value) {
              obj[dictionary][reactiveKey][1].forEach((callback) => watch(value, callback));
              attack(this[dictionary][key], value);
            }
          });
        }
        if (arm) {
          for (const item of obj[dictionary][key][1]) {
            if (item[1] === arm[1])
              return;
          }
          obj[dictionary][key][1].add(arm);
        }
      } else {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (!descriptor || "value" in descriptor) {
          if (key in obj[dictionary][arrayKey]) {
            Object.defineProperty(obj, key, {
              get() {
                return this[dictionary][arrayKey][key];
              },
              set(value) {
                obj[dictionary][reactiveKey][1].forEach((callback) => watch(value, callback));
                const old = this[dictionary][arrayKey][key];
                this[dictionary][arrayKey][key] = value;
                if (old !== value) {
                  obj[dictionary][reactiveKey][0][1]();
                }
              },
              configurable: true,
              enumerable: true
            });
          }
        }
      }
    }
  }
}
function attack(page, value) {
  const old = page[0];
  page[0] = value;
  if (old !== value) {
    page[1].forEach((arm) => {
      switch (arm[0]) {
        case "bio":
          arm[1]();
          break;
        case "bom":
          page[1].delete(arm);
        case "spy":
          arm[1](value, old);
          break;
      }
    });
  }
}

// data_binding/receive.ts
async function receive(obj, key) {
  if (!obj[isLocked]) {
    const keys = Array.isArray(key) ? key : [key];
    const values = await Promise.all(keys.map((key2) => {
      if (obj[key2] === void 0) {
        return new Promise((resolve) => {
          invade(obj, key2, ["bom", resolve]);
        });
      } else {
        return obj[key2];
      }
    }));
    return keys.reduce((obj2, key2, index) => {
      obj2[key2] = values[index];
      return obj2;
    }, {});
  }
  return {};
}

// data_binding/unwatch.ts
function unwatch(data, keyOrCallback, callback) {
  if (typeof data === "object" && data !== null) {
    const obj = data;
    if (!obj[isLocked]) {
      if (callback === void 0) {
        if (keyOrCallback) {
          const reactiveCallback = keyOrCallback;
          if (obj[dictionary]) {
            obj[dictionary][reactiveKey][1].delete(reactiveCallback);
          }
          for (const key in obj) {
            unwatch(obj[key], reactiveCallback);
          }
        } else {
          for (const key in obj) {
            unwatch(obj[key]);
          }
          retreat(obj);
        }
      } else {
        if (Array.isArray(keyOrCallback)) {
          keyOrCallback.forEach((key) => retreat(obj, key, callback));
        } else {
          retreat(obj, keyOrCallback, callback);
        }
      }
    }
  }
  return data;
}
function retreat(obj, key, callback) {
  if (key !== void 0) {
    if (dictionary in obj) {
      if (key in obj[dictionary]) {
        if (callback) {
          obj[dictionary][key][1].forEach((arm) => {
            if (arm[1] === callback) {
              obj[dictionary][key][1].delete(arm);
            }
          });
        } else {
          obj[dictionary][key][1].clear();
        }
      }
    }
  } else {
    for (const key2 in obj[dictionary]) {
      Object.defineProperty(obj, key2, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: obj[dictionary][key2][0]
      });
      delete obj[dictionary][key2];
    }
    if (Array.isArray(obj)) {
      delete obj.push;
      delete obj.sort;
      delete obj.splice;
    }
    delete obj[dictionary];
  }
}

// data_binding/reach.ts
function reach(data, callback) {
  if (typeof data === "object" && data !== null && (Object.getPrototypeOf(data) === Object.prototype || Array.isArray(data))) {
    const obj = data;
    if (!obj[isLocked]) {
      if (dictionary in obj) {
        obj[dictionary][reactiveKey][1].add(callback);
      }
      for (const key in obj) {
        reach(obj[key], callback);
      }
    }
  }
  return data;
}

// data_binding/lock.ts
function lock(obj) {
  obj[isLocked] = true;
  return obj;
}

// data_binding/unlock.ts
function unlock(obj) {
  delete obj[isLocked];
  return obj;
}

// virtual_dom/event_types.ts
var destroy = "destroy";
var patch = "patch";
var eventTypes = Object.seal({
  get destroy() {
    return destroy;
  },
  set destroy(value) {
    if (typeof value === "string" && value !== "") {
      destroy = value;
    } else {
      throw Error("Event type must be string");
    }
  },
  get patch() {
    return patch;
  },
  set patch(value) {
    if (typeof value === "string" && value !== "") {
      patch = value;
    } else {
      throw Error("Event type must be string");
    }
  }
});

// virtual_dom/load.ts
function load(el2) {
  const tree = { el: el2 };
  loadChildren(tree);
  return tree;
}
function loadElement(el2) {
  const ve = {
    tag: el2.tagName.toLowerCase(),
    el: el2
  };
  loadAttr(ve);
  loadChildren(ve);
  return ve;
}
function loadAttr(ve) {
  if (ve.el.hasAttributes()) {
    const props = {};
    ve.el.getAttributeNames().forEach((name) => {
      if (name.startsWith("on"))
        return;
      const value = ve.el.getAttribute(name);
      switch (name) {
        case "class":
        case "part":
          return ve[name] = value.split(/\s+/);
        case "style":
        case "is":
          return ve[name] = value;
        default:
          return props[name] = value;
      }
    });
    if (Object.keys(props).length) {
      ve.props = props;
    }
  }
}
function loadChildren(tree) {
  if (tree.el.hasChildNodes()) {
    const nodeList = tree.el.childNodes;
    tree.children = [];
    for (let i = 0; i < nodeList.length; i++) {
      switch (nodeList[i].nodeType) {
        case 1:
          if (nodeList[i].tagName === "SCRIPT") {
            break;
          }
          tree.children.push(loadElement(nodeList[i]));
          break;
        case 3:
          tree.children.push(nodeList[i].data);
          break;
      }
    }
  }
}

// virtual_dom/destroy.ts
function destroy2(tree) {
  if (!tree.invalid?.children && tree.el instanceof Node) {
    tree.children?.forEach((child) => typeof child === "object" && destroy2(child));
  }
  if (!tree.insert) {
    tree.el.dispatchEvent(new CustomEvent(eventTypes.destroy, {
      bubbles: false
    }));
  }
  if (!tree.invalid?.on) {
    patchOn(tree, {});
  }
  if (!tree.invalid?.props && tree.el instanceof Element) {
    patchClass(tree, {});
    patchPart(tree, {});
    patchStyle(tree, {});
    patchProps(tree, {});
    patchForm(tree, {});
  }
}

// virtual_dom/patch.ts
function patch2(tree, newTree) {
  patchChildren(tree, newTree);
  tree.el.dispatchEvent(new CustomEvent(eventTypes.patch, {
    bubbles: true,
    composed: true
  }));
  return tree;
}
function patchElement(ve, newVe) {
  if (!ve || ve.tag !== newVe.tag || ve.is !== newVe.is || newVe.new) {
    ve = newVe.is ? {
      tag: newVe.tag,
      is: newVe.is,
      el: document.createElement(newVe.tag, { is: newVe.is })
    } : {
      tag: newVe.tag,
      el: document.createElement(newVe.tag)
    };
  }
  patchClass(ve, newVe);
  patchPart(ve, newVe);
  patchStyle(ve, newVe);
  patchProps(ve, newVe);
  patchForm(ve, newVe);
  patchOn(ve, newVe);
  patchChildren(ve, newVe);
  if ("key" in newVe) {
    ve.key = newVe.key;
  } else {
    delete ve.key;
  }
  return ve;
}
function patchRealElement(ve, newVe) {
  if (!ve || ve.el !== newVe.el) {
    ve = {
      el: newVe.el
    };
    if ("insert" in newVe) {
      ve.insert = newVe.insert;
    }
    if ("invalid" in newVe) {
      ve.invalid = { ...newVe.invalid };
    }
  }
  if (!ve.invalid?.props && ve.el instanceof Element) {
    patchClass(ve, newVe);
    patchPart(ve, newVe);
    patchStyle(ve, newVe);
    patchProps(ve, newVe);
    patchForm(ve, newVe);
  }
  if (!ve.invalid?.on) {
    patchOn(ve, newVe);
  }
  if (!ve.invalid?.children && ve.el instanceof Node) {
    patchChildren(ve, newVe);
  }
  return ve;
}
function patchClass(ve, newVe) {
  const currentClass = (ve.class || []).join(" ");
  const newClass = (newVe.class || []).join(" ");
  if (currentClass !== newClass) {
    ve.el.className = newClass;
  }
  if (newClass.length) {
    ve.class = (newVe.class || []).slice();
  } else {
    delete ve.class;
  }
}
function patchPart(ve, newVe) {
  const currentPart = ve.part || [];
  const newPart = newVe.part || [];
  const shortage = newPart.filter((part) => !currentPart.includes(part));
  if (shortage.length) {
    ve.el.part.add(...shortage);
  }
  const surplus = currentPart.filter((part) => !newPart.includes(part));
  if (surplus.length) {
    ve.el.part.remove(...surplus);
  }
  if (newPart.length) {
    ve.part = newPart.slice();
  } else {
    delete ve.part;
  }
}
function patchStyle(ve, newVe) {
  if (ve.el instanceof HTMLElement) {
    const style = ve.style || "";
    const newStyle = newVe.style || "";
    if (style != newStyle) {
      ve.el.style.cssText = newStyle;
      if (newStyle != "") {
        ve.style = newStyle;
      } else {
        delete ve.style;
      }
    }
  }
}
function patchProps(ve, newVe) {
  const currentProps = ve.props || {};
  const newProps = newVe.props || {};
  const currentPropsKeys = Object.keys(currentProps);
  const newPropsKeys = Object.keys(newProps);
  newPropsKeys.filter((key) => !currentPropsKeys.includes(key) || currentProps[key] !== newProps[key]).forEach((key) => ve.el.setAttribute(key, newProps[key]));
  currentPropsKeys.filter((key) => !newPropsKeys.includes(key)).forEach((key) => ve.el.removeAttribute(key));
  if (newPropsKeys.length) {
    ve.props = { ...newProps };
  } else {
    delete ve.props;
  }
}
function patchOn(ve, newVe) {
  const currentOn = ve.on || {};
  const newOn = newVe.on || {};
  const currentOnKeys = Object.keys(currentOn);
  const newOnKeys = Object.keys(newOn);
  newOnKeys.filter((type) => !currentOnKeys.includes(type)).forEach((type) => {
    newOn[type].forEach((listener) => {
      ve.el.addEventListener(type, listener);
    });
  });
  currentOnKeys.filter((type) => !newOnKeys.includes(type)).forEach((type) => {
    currentOn[type].forEach((listener) => {
      ve.el.removeEventListener(type, listener);
    });
  });
  newOnKeys.filter((type) => currentOnKeys.includes(type)).forEach((type) => {
    const news = newOn[type];
    const currents = currentOn[type];
    news.filter((listener) => !currents.includes(listener)).forEach((listener) => ve.el.addEventListener(type, listener));
    currents.filter((listener) => !news.includes(listener)).forEach((listener) => ve.el.removeEventListener(type, listener));
  });
  if (newOnKeys.length) {
    ve.on = newOnKeys.reduce((on, type) => {
      on[type] = [...newOn[type]];
      return on;
    }, {});
  } else {
    delete ve.on;
  }
}
function patchForm(ve, newVe) {
  if (Object.prototype.isPrototypeOf.call(HTMLInputElement.prototype, ve.el)) {
    const input = ve.el;
    if (input.value !== newVe.props?.value) {
      if (newVe.props && "value" in newVe.props) {
        if (input.value !== (newVe.props?.value).toString()) {
          input.value = newVe.props.value;
        }
      } else {
        if (ve.el.value !== "") {
          ve.el.value = "";
        }
      }
    }
    if (!input.checked && newVe.props && "checked" in newVe.props) {
      input.checked = true;
    } else if (input.checked && !(newVe.props && "checked" in newVe.props)) {
      input.checked = false;
    }
  }
  if (Object.prototype.isPrototypeOf.call(HTMLOptionElement.prototype, ve.el)) {
    const option = ve.el;
    if (!option.selected && newVe.props && "selected" in newVe.props) {
      option.selected = true;
    } else if (option.selected && !(newVe.props && "selected" in newVe.props)) {
      option.selected = false;
    }
  }
}
var Stock = class {
  constructor() {
    this.stock = /* @__PURE__ */ new Map();
  }
  has(key) {
    return this.stock.get(key)?.length;
  }
  push(key, value) {
    if (this.stock.has(key)) {
      this.stock.get(key).push(value);
    } else {
      this.stock.set(key, [value]);
    }
  }
  shift(key) {
    return this.stock.get(key).shift();
  }
};
function patchChildren(tree, newTree) {
  const children = tree.children || [];
  const newChildren = newTree.children || [];
  const stock = new Stock();
  let index = 0;
  let node = tree.el.firstChild;
  const numbers = newChildren.filter((vNode) => typeof vNode === "number").reverse();
  let number = numbers.pop();
  const add = (vNode) => {
    const tmp2 = patchElement(null, vNode);
    tree.el.insertBefore(tmp2.el, node || null);
    return tmp2;
  };
  const replace = (vNode) => {
    const tmp2 = patchElement(children[index], vNode);
    if (tmp2 !== children[index]) {
      destroy2(children[index]);
      tree.el.replaceChild(tmp2.el, children[index].el);
    }
    node = tmp2.el.nextSibling;
    index++;
    return tmp2;
  };
  const remove = (useStore = false) => {
    if (typeof children[index] !== "number") {
      if (typeof children[index] === "object") {
        if (node !== children[index].el) {
          destroy2(children[index++]);
          return;
        }
        if (useStore && "key" in children[index]) {
          stock.push(children[index].key, children[index]);
        } else {
          destroy2(children[index]);
        }
      }
      const old = node;
      node = old.nextSibling;
      tree.el.removeChild(old);
    }
    index++;
  };
  const tmp = newChildren.map((vNode) => {
    switch (typeof vNode) {
      case "string": {
        if (typeof children[index] === "string") {
          if (node.data !== vNode) {
            node.data = vNode;
          }
          node = node.nextSibling;
          index++;
        } else {
          tree.el.insertBefore(document.createTextNode(vNode), node || null);
        }
        return vNode;
      }
      case "object": {
        if ("el" in vNode) {
          if (typeof children[index] === "object" && vNode.el === children[index].el) {
            const tmp2 = patchRealElement(children[index], vNode);
            if (tmp2.el === node && tmp2.el instanceof Element && tmp2.el.getRootNode() === node.getRootNode()) {
              node = node.nextSibling;
            }
            index++;
            return tmp2;
          } else {
            const tmp2 = patchRealElement(null, vNode);
            if (tmp2.el instanceof Element && tmp2.el.parentNode === null) {
              tree.el.insertBefore(tmp2.el, node || null);
            }
            return tmp2;
          }
        }
        if ("key" in vNode) {
          if (stock.has(vNode.key)) {
            const tmp2 = patchElement(stock.shift(vNode.key), vNode);
            tree.el.insertBefore(tmp2.el, node || null);
            return tmp2;
          } else {
            while (index < children.length && children[index] !== number) {
              if (typeof children[index] === "object" && vNode.key === children[index].key) {
                return replace(vNode);
              }
              remove(true);
            }
            return add(vNode);
          }
        } else {
          if (typeof children[index] === "object" && !("el" in vNode) && !("key" in children[index])) {
            return replace(vNode);
          } else {
            return add(vNode);
          }
        }
      }
      case "number": {
        while (index < children.length && children[index] !== vNode) {
          remove();
        }
        index++;
        number = numbers.pop();
        stock.stock.forEach((queue) => queue.forEach((ve) => destroy2(ve)));
        stock.stock.clear();
        return vNode;
      }
    }
  });
  while (index < children.length) {
    remove();
  }
  if (tmp.length) {
    tree.children = tmp;
  } else {
    delete tree.children;
  }
}

// template_engine/pickup.ts
function pickup(stack, name, start = stack.length - 1) {
  for (let i = start; i >= 0; i--) {
    if (name in stack[i])
      return [stack[i][name], i];
  }
  return [void 0, -1];
}

// template_engine/loop.ts
var Loop = class {
  constructor(_key, _value, _index, _entries, _stack) {
    this._key = _key;
    this._value = _value;
    this._index = _index;
    this._entries = _entries;
    this._stack = _stack;
  }
  get key() {
    return this._key;
  }
  get value() {
    return this._value;
  }
  get index() {
    return this._index;
  }
  get size() {
    return this._entries.length;
  }
  get isFirst() {
    return this._index === 0;
  }
  get isLast() {
    return this._index === this._entries.length - 1;
  }
  get parent() {
    return pickup(this._stack, "loop")[0];
  }
};

// template_engine/types.ts
var isRef = Symbol("Beako-ref");
function instanceOfTemplate(object) {
  return typeof object === "object" && object !== null && typeof object.type === "string";
}
function instanceOfRef(object) {
  return typeof object === "object" && object !== null && object[isRef] === true;
}
function instanceOfTemporaryElement(node) {
  return "tag" in node;
}

// template_engine/lexer.ts
var Lexer = class {
  constructor(text, field, index = 0, token = null) {
    this.text = text;
    this.field = field;
    this.index = index;
    this.token = token;
  }
  _next(start) {
    const token = ["", ""];
    for (this.index = start; this.index < this.text.length; this.index++) {
      const nextType = distinguish(this.field, token[1] + this.text[this.index]);
      if (nextType === "other") {
        return token;
      } else {
        token[0] = nextType;
        token[1] = token[1] + this.text[this.index];
      }
    }
    return token;
  }
  skip() {
    let value = "";
    if (!this.token) {
      for (let i = this.index; i < this.text.length; i++) {
        if (distinguish(this.field, this.text[i]) === "other") {
          value += this.text[i];
        } else {
          this.token = this._next(i);
          if (this.token && this.token[0] === "partial") {
            value += this.token[1];
            this.token = null;
          } else {
            return value;
          }
        }
      }
    }
    return value;
  }
  nextIs(type) {
    this.skip();
    if (this.token) {
      return type ? this.token[0] === type : this.token[0];
    } else {
      return false;
    }
  }
  pop() {
    this.skip();
    const token = this.token;
    this.token = null;
    return token ? token : null;
  }
  expand(field, func2) {
    const parent = this.field;
    this.field = field;
    func2();
    if (this.token) {
      this.index -= this.token[1].length;
      this.token = null;
    }
    this.field = parent;
  }
  must(type) {
    const token = this.pop();
    if (!token || token[0] !== type)
      throw Error(type + " is required.");
    return token;
  }
};
function distinguish(field, value) {
  switch (field) {
    case "html":
      switch (value) {
        case ">":
        case "<!--":
        case "/":
          return value;
        case "<":
        case "</":
        case "<!":
        case "<!-":
          return "partial";
      }
      switch (true) {
        case /^\/\/.*$/.test(value):
          return "//";
        case /^<[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(value):
          return "start";
        case /^<\/[_\-a-zA-Z][_\-a-zA-Z0-9]*$/.test(value):
          return "end";
      }
      break;
    case "attr":
      switch (value) {
        case "@if":
        case "@else":
        case "@for":
        case "@each":
          return "@";
        case "=":
        case ":=":
        case "&=":
        case "*=":
          return "assign";
        case ">":
        case "/":
        case "'":
        case '"':
          return value;
        case ":":
        case "&":
        case "*":
          return "partial";
      }
      switch (true) {
        case /^on[_\$\-a-zA-Z0-9]+$/.test(value):
          return "on";
        case /^[_\$\-@a-zA-Z0-9]+$/.test(value):
          return "name";
      }
      break;
    case "comment":
      switch (value) {
        case "-->":
          return value;
        case "-":
        case "--":
          return "partial";
      }
      break;
    case "script":
      switch (value) {
        case "+":
        case "-":
          return "multi";
        case "void":
        case "typeof":
        case "~":
        case "!":
          return "unary";
        case "/":
        case "*":
        case "%":
        case "**":
        case "in":
        case "instanceof":
        case "<":
        case ">":
        case "<=":
        case ">=":
        case "==":
        case "!=":
        case "===":
        case "!==":
        case "<<":
        case ">>":
        case ">>>":
        case "&":
        case "|":
        case "^":
        case "&&":
        case "||":
        case "??":
          return "binary";
        case "=":
        case "*=":
        case "**=":
        case "/=":
        case "%=":
        case "+=":
        case "-=":
        case "<<=":
        case ">>=":
        case ">>>=":
        case "&=":
        case "^=":
        case "|=":
        case "&&=":
        case "||=":
        case "??=":
          return "assign";
        case "++":
        case "--":
          return "crement";
        case "false":
        case "true":
          return "boolean";
        case "null":
        case "undefined":
        case ".":
        case "?.":
        case "[":
        case "]":
        case "{":
        case "}":
        case "(":
        case ")":
        case "...":
        case "?":
        case ":":
        case ",":
        case "'":
        case '"':
        case "`":
          return value;
      }
      switch (true) {
        case /^\/\/.*$/.test(value):
          return "//";
        case /^[_\$a-zA-Z][_\$a-zA-Z0-9]*$/.test(value):
          return "word";
        case /^\d+\.?\d*$|^\.?\d+$/.test(value):
          return "number";
      }
      break;
    case "template":
      switch (value) {
        case "$":
          return "partial";
        case "${":
          return value;
        case "}":
          return value;
        case "`":
          return "`";
        case "\r":
        case "\n":
        case "\r\n":
          return "other";
      }
    case "single":
    case "double":
      switch (value) {
        case "\\":
          return "partial";
        case "\r":
        case "\n":
        case "\r\n":
          return "return";
        case "\\\r\n":
          return "escape";
        case "'":
          if (field === "single")
            return value;
          break;
        case '"':
          if (field === "double")
            return value;
          break;
      }
      switch (true) {
        case /^\\u[0-9a-fA-F]{0,3}$/.test(value):
        case /^\\x[0-9a-fA-F]{0,1}$/.test(value):
        case /^\\u\{(0?[0-9a-fA-F]{0,5}|10[0-9a-fA-F]{0,4})$/.test(value):
          return "partial";
        case /^\\.$/.test(value):
        case /^\\u[0-9a-fA-F]{4}$/.test(value):
        case /^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(value):
        case /^\\x[0-9a-fA-F]{2}$/.test(value):
          return "escape";
      }
      break;
    case "text":
      switch (value) {
        case "{":
        case "}":
          return "partial";
        case "{{":
        case "}}":
          return value;
      }
      break;
  }
  return "other";
}
function unescape(value) {
  switch (value) {
    case "\\n":
      return "\n";
    case "\\r":
      return "\r";
    case "\\v":
      return "\v";
    case "\\t":
      return "	";
    case "\\b":
      return "\b";
    case "\\f":
      return "\f";
  }
  switch (true) {
    case /^\\u[0-9a-fA-F]{4}$/.test(value):
    case /^\\x[0-9a-fA-F]{2}$/.test(value):
      return String.fromCodePoint(parseInt(value.slice(2), 16));
    case /^\\u\{(0?[0-9a-fA-F]{1,5}|10[0-9a-fA-F]{1,4})\}$/.test(value):
      return String.fromCodePoint(parseInt(value.slice(3, -1), 16));
  }
  return value.slice(1);
}

// template_engine/expression.ts
function expression(script) {
  const lexer = typeof script === "string" ? new Lexer(script, "script") : script;
  return assignment(lexer);
}
function assignment(lexer) {
  const left = conditional(lexer);
  if (lexer.nextIs("assign")) {
    if (left.type !== "get") {
      throw Error("The left operand is not variable");
    }
    const operator = lexer.pop()[1];
    const right = expression(lexer);
    return { type: "assign", operator, left: left.value, right };
  } else {
    return left;
  }
}
function conditional(lexer) {
  let condition = arithmetic(lexer);
  while (lexer.nextIs("?")) {
    lexer.pop();
    const truthy = expression(lexer);
    lexer.must(":");
    const falsy = arithmetic(lexer);
    condition = { type: "if", condition, truthy, falsy };
  }
  return condition;
}
function arithmetic(lexer) {
  const list = new Array();
  list.push(unary(lexer));
  while (lexer.nextIs("multi") || lexer.nextIs("binary")) {
    list.push(lexer.pop()[1]);
    list.push(unary(lexer));
  }
  while (list.length > 1) {
    for (let index = 0; index + 1 < list.length; index += 2) {
      if (index + 3 >= list.length || precedence(list[index + 1]) > precedence(list[index + 3])) {
        const node = { type: "binary", operator: list[index + 1], left: list[index], right: list[index + 2] };
        list.splice(index, 3, node);
      }
    }
  }
  return typeof list[0] === "string" ? { type: "variable", name: list[0] } : list[0];
}
function precedence(operator) {
  switch (operator) {
    default:
      return 0;
    case "||":
    case "??":
      return 4;
    case "&&":
      return 5;
    case "|":
      return 6;
    case "^":
      return 7;
    case "&":
      return 8;
    case "==":
    case "!=":
    case "===":
    case "!==":
      return 9;
    case "in":
    case "instanceof":
    case "<":
    case ">":
    case "<=":
    case ">=":
      return 10;
    case "<<":
    case ">>":
    case ">>>":
      return 11;
    case "+":
    case "-":
      return 12;
    case "*":
    case "/":
    case "%":
      return 13;
    case "**":
      return 14;
  }
}
function unary(lexer) {
  switch (lexer.nextIs()) {
    case "multi":
    case "unary":
      return { type: "unary", operator: lexer.pop()[1], operand: unary(lexer) };
    default:
      return func(lexer);
  }
}
function func(lexer) {
  let template = term(lexer);
  while (true) {
    switch (lexer.nextIs()) {
      case "(": {
        lexer.pop();
        const params = [];
        while (!lexer.nextIs(")")) {
          params.push(expression(lexer));
          if (lexer.nextIs(","))
            lexer.pop();
          else
            break;
        }
        lexer.must(")");
        template = { type: "function", name: template, params };
        continue;
      }
      case ".": {
        lexer.pop();
        const key = lexer.must("word");
        template = { type: "get", value: { type: "hash", object: template, key: { type: "literal", value: key[1] } } };
        continue;
      }
      case "[": {
        lexer.pop();
        const key = expression(lexer);
        lexer.must("]");
        template = { type: "get", value: { type: "hash", object: template, key } };
        continue;
      }
    }
    break;
  }
  return template;
}
function term(lexer) {
  const token = lexer.pop();
  switch (token[0]) {
    case "word":
      return { type: "get", value: { type: "variable", name: token[1] } };
    case "number":
      return { type: "literal", value: Number(token[1]) };
    case "boolean":
      return { type: "literal", value: token[1] === "true" ? true : false };
    case "undefined":
      return { type: "literal", value: void 0 };
    case "null":
      return { type: "literal", value: null };
    case '"':
      return stringLiteral(lexer, "double", token[0]);
    case "'":
      return stringLiteral(lexer, "single", token[0]);
    case "`":
      return stringLiteral(lexer, "template", token[0]);
    case "(": {
      const node = expression(lexer);
      lexer.must(")");
      return node;
    }
    case "[": {
      const values = [];
      while (!lexer.nextIs("]")) {
        values.push(expression(lexer));
        if (lexer.nextIs(",")) {
          lexer.pop();
        } else if (lexer.nextIs("]")) {
          lexer.pop();
          break;
        } else {
          throw Error("']' is required");
        }
      }
      return { type: "array", values };
    }
    case "{": {
      const entries = [];
      while (!lexer.nextIs("}")) {
        const entry = Array(2);
        const token2 = lexer.pop();
        if (token2[0] === "word") {
          entry[0] = { type: "literal", value: token2[1] };
        } else if (token2[0] === '"') {
          entry[0] = stringLiteral(lexer, "double", token2[0]);
        } else if (token2[0] === "'") {
          entry[0] = stringLiteral(lexer, "single", token2[0]);
        } else if (token2[0] === "[") {
          entry[0] = expression(lexer);
          lexer.must("]");
        }
        if (token2[0] === "word" && (lexer.nextIs(",") || lexer.nextIs("}"))) {
          entry[1] = { type: "get", value: { type: "variable", name: token2[1] } };
        } else {
          lexer.must(":");
          entry[1] = expression(lexer);
        }
        entries.push(entry);
        if (lexer.nextIs(",")) {
          lexer.pop();
        } else if (lexer.nextIs("}")) {
          lexer.pop();
          break;
        } else {
          throw Error("'}' is required");
        }
      }
      return { type: "object", entries };
    }
    default:
      throw new Error(token[0] + " is invalid");
  }
}
function stringLiteral(lexer, field, type) {
  const texts = [""];
  let i = 0;
  lexer.expand(field, () => {
    loop:
      while (true) {
        texts[i] += lexer.skip();
        const token = lexer.pop();
        switch (token[0]) {
          case type:
            break loop;
          case "return":
            throw Error("Newline cannot be used");
          case "escape":
            texts[i] += unescape(token[1]);
            continue;
          case "${":
            lexer.expand("script", () => {
              texts.push(expression(lexer));
            });
            lexer.must("}");
            texts.push(lexer.skip());
            i += 2;
        }
      }
  });
  if (i === 0) {
    return { type: "literal", value: texts[0] };
  } else {
    return { type: "join", values: texts.filter((value) => value !== ""), separator: "" };
  }
}

// template_engine/is_primitive.ts
function isPrimitive(tag) {
  switch (tag) {
    case "html":
    case "base":
    case "head":
    case "link":
    case "meta":
    case "style":
    case "title":
    case "body":
    case "address":
    case "article":
    case "aside":
    case "footer":
    case "header":
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "main":
    case "nav":
    case "section":
    case "blockquote":
    case "dd":
    case "div":
    case "dl":
    case "dt":
    case "figcaption":
    case "figure":
    case "hr":
    case "li":
    case "ol":
    case "p":
    case "pre":
    case "ul":
    case "a":
    case "abbr":
    case "b":
    case "bdi":
    case "bdo":
    case "br":
    case "cite":
    case "code":
    case "data":
    case "dfn":
    case "em":
    case "i":
    case "kbd":
    case "mark":
    case "q":
    case "rp":
    case "rt":
    case "ruby":
    case "s":
    case "samp":
    case "small":
    case "span":
    case "strong":
    case "sub":
    case "sup":
    case "time":
    case "u":
    case "var":
    case "wbr":
    case "area":
    case "audio":
    case "img":
    case "map":
    case "track":
    case "video":
    case "embed":
    case "iframe":
    case "object":
    case "param":
    case "picture":
    case "portal":
    case "source":
    case "svg":
    case "math":
    case "canvas":
    case "noscript":
    case "script":
    case "del":
    case "ins":
    case "caption":
    case "col":
    case "colgroup":
    case "table":
    case "tbody":
    case "td":
    case "tfoot":
    case "th":
    case "thead":
    case "tr":
    case "button":
    case "datalist":
    case "fieldset":
    case "form":
    case "input":
    case "label":
    case "legend":
    case "meter":
    case "optgroup":
    case "option":
    case "output":
    case "progress":
    case "select":
    case "textarea":
    case "details":
    case "dialog":
    case "menu":
    case "summary":
    case "slot":
    case "template":
      return true;
  }
  return false;
}
function notHasEnd(tag) {
  switch (tag) {
    case "br":
    case "hr":
    case "img":
    case "input":
    case "meta":
    case "area":
    case "base":
    case "col":
    case "embed":
    case "keygen":
    case "link":
    case "param":
    case "source":
      return true;
  }
  return false;
}

// template_engine/dom.ts
function dom(html) {
  const lexer = typeof html === "string" ? new Lexer(html, "html") : html;
  const text = { text: lexer.skip() };
  while (lexer.nextIs("<!--")) {
    lexer.pop();
    lexer.expand("comment", () => lexer.must("-->"));
    text.text += lexer.skip();
    continue;
  }
  if (lexer.nextIs("start")) {
    const next = el(lexer);
    if (next) {
      if (instanceOfTemporaryElement(next)) {
        text.next = next;
      } else {
        text.text = next.text;
        if (next.next) {
          text.next = next.next;
        }
      }
    }
  }
  return text.text ? text : text.next ? text.next : void 0;
}
function el(lexer) {
  const el2 = {
    tag: lexer.pop()[1].slice(1).toLocaleLowerCase()
  };
  const attrs = attr(lexer);
  if (attrs.length) {
    el2.attrs = attrs;
  }
  if (lexer.nextIs("/")) {
    lexer.pop();
    lexer.must(">");
  } else if (notHasEnd(el2.tag)) {
    lexer.must(">");
  } else {
    lexer.must(">");
    const child = dom(lexer);
    if (child) {
      el2.child = child;
    }
    if (lexer.must("end")[1].slice(2) !== el2.tag) {
      throw Error("end is required.");
    }
    lexer.must(">");
  }
  const next = dom(lexer);
  if (next) {
    el2.next = next;
  }
  if (el2.tag === "script") {
    return el2.next ? el2.next : el2;
  } else {
    return el2;
  }
}
function attr(lexer) {
  const attrs = [];
  lexer.expand("attr", () => {
    lexer.skip();
    while (lexer.nextIs()) {
      if (lexer.nextIs(">")) {
        break;
      } else {
        const attr2 = new Array(3);
        if (lexer.nextIs("name")) {
          attr2[0] = lexer.pop()[1];
          if (lexer.nextIs("assign")) {
            attr2[1] = lexer.must("assign")[1];
          } else if (lexer.nextIs("name") || lexer.nextIs(">") || lexer.nextIs("/")) {
            attr2[1] = "=";
            attr2[2] = attr2[0];
          } else {
            throw Error("assign is required.");
          }
        } else {
          if (lexer.nextIs("on")) {
            attr2[0] = lexer.pop()[1];
            attr2[1] = "on";
          } else if (lexer.nextIs("@")) {
            attr2[0] = lexer.pop()[1];
            attr2[1] = "@";
          } else {
            break;
          }
          if (attr2[0] === "@else") {
            attr2[2] = attr2[0];
          } else {
            const token = lexer.must("assign");
            if (token[1] !== "=") {
              throw Error("= is required.");
            }
          }
        }
        if (attr2[2] === void 0) {
          if (lexer.nextIs('"')) {
            attr2[2] = string(lexer, "double", lexer.pop()[0]);
          } else if (lexer.nextIs("'")) {
            attr2[2] = string(lexer, "single", lexer.pop()[0]);
          }
        }
        attrs.push(attr2);
        lexer.skip();
      }
    }
  });
  return attrs;
}
function string(lexer, field, type) {
  let text = "";
  lexer.expand(field, () => {
    loop:
      while (true) {
        text += lexer.skip();
        const token = lexer.pop();
        switch (token[0]) {
          case type:
            break loop;
          case "return":
            throw Error("Newline cannot be used");
          case "escape":
            text += unescape(token[1]);
            continue;
        }
      }
  });
  return text;
}

// template_engine/parse.ts
function parse(html) {
  const node = dom(html);
  const children = node ? parseTree(node) : [];
  return children.length ? { type: "tree", children } : { type: "tree" };
}
var DomLexer = class {
  constructor(node) {
    this.node = node;
  }
  isSkippable(prop) {
    for (let node = this.node; node; node = node.next) {
      if (instanceOfTemporaryElement(node)) {
        return hasAttr(node, prop);
      } else {
        if (!/^\s*$/.test(node.text)) {
          return false;
        }
      }
    }
    return false;
  }
  skip() {
    while (true) {
      if (instanceOfTemporaryElement(this.node)) {
        return this;
      }
      this.node = this.node.next;
    }
  }
  pop() {
    const node = this.node;
    this.node = this.node?.next;
    return node;
  }
};
function parseTree(node) {
  const lexer = new DomLexer(node);
  const children = [];
  while (lexer.node) {
    const result = parseNode(lexer);
    if (result !== void 0) {
      children.push(result);
    }
  }
  return children;
}
function parseNode(lexer) {
  if (!lexer.node) {
    lexer.pop();
  } else if (instanceOfTemporaryElement(lexer.node)) {
    return parseFor(lexer);
  } else {
    return parseText(new Lexer(lexer.pop().text, "text"));
  }
}
function parseChild(lexer) {
  return parseFor(lexer);
}
function parseFor(lexer) {
  const el2 = lexer.node;
  if (hasAttr(el2, "@for")) {
    const each = getAttr(el2, "@each") || void 0;
    const array = expression(getAttr(el2, "@for"));
    return { type: "for", each, array, value: parseIf(lexer) };
  } else {
    return parseIf(lexer);
  }
}
function parseIf(lexer) {
  const el2 = lexer.node;
  if (hasAttr(el2, "@if")) {
    const condition = expression(getAttr(el2, "@if"));
    const truthy = parseGroup(el2);
    lexer.pop();
    const template = { type: "if", condition, truthy };
    if (lexer.isSkippable("@else")) {
      template.falsy = parseChild(lexer.skip());
    }
    return template;
  } else {
    return parseGroup(lexer.pop());
  }
}
function parseGroup(el2) {
  if (el2.tag === "group") {
    const template = {
      type: "group"
    };
    el2.attrs?.forEach(([name, , value]) => {
      if (name.match(/^@(if|else|for|each)$/))
        return;
      if (name.match(/^@.*$/)) {
        if (!template.props) {
          template.props = {};
        }
        template.props[name] = value;
      }
    });
    if (el2.child) {
      const children = parseTree(el2.child);
      if (children.length) {
        template.children = children;
      }
    }
    return template;
  } else {
    return parseElement(el2);
  }
}
function parseElement(el2) {
  const template = {
    type: "element",
    tag: el2.tag
  };
  {
    const style = [];
    el2.attrs?.forEach(([name, assign, value]) => {
      switch (assign) {
        case "=": {
          switch (name) {
            case "is": {
              if (!(name in template)) {
                template.is = value;
              }
              return;
            }
            case "class":
            case "part": {
              return (template[name] ?? (template[name] = [])).push(value.split(/\s+/));
            }
            case "style": {
              return style.push(value);
            }
          }
          if (!(name in (template.props ?? (template.props = {})))) {
            return template.props[name] = value;
          }
          return;
        }
        case ":=": {
          switch (name) {
            case "is":
              return template.is = expression(value);
            case "class":
            case "part": {
              return (template[name] ?? (template[name] = [])).push({ type: "flags", value: expression(value) });
            }
            case "style": {
              return style.push(expression(value));
            }
          }
          return (template.props ?? (template.props = {}))[name] = expression(value);
        }
        case "*=": {
          let ref = expression(value);
          if (instanceOfTemplate(ref) && ref.type === "get") {
            ref = ref.value;
          }
          return (template.props ?? (template.props = {}))[name] = ref;
        }
        case "on": {
          const type = name.slice(2);
          const handler = { type: "handler", value: expression(value) };
          return ((template.on ?? (template.on = {}))[type] ?? (template.on[type] = [])).push(handler);
        }
      }
    });
    if (style.length) {
      if (style.length === 1 && typeof style[0] === "string") {
        template.style = style[0];
      } else {
        template.style = { type: "join", values: style.filter((value) => value !== ""), separator: ";" };
      }
    }
    el2.attrs?.forEach(([name, assign, value]) => {
      if (assign === "&=") {
        (template.bools ?? (template.bools = {}))[name] = expression(value);
        if (template.props) {
          delete template.props[name];
          if (!Object.keys(template.props).length) {
            delete template.props;
          }
        }
      }
    });
  }
  if (el2.child) {
    const children = parseTree(el2.child);
    if (children.length) {
      template.children = children;
    }
  }
  if (!isPrimitive(template.tag) || template.is) {
    template.type = "custom";
  }
  return template;
}
function hasAttr(el2, prop) {
  return el2.attrs?.some((attr2) => attr2[0] === prop);
}
function getAttr(el2, prop) {
  const attr2 = el2.attrs?.find((attr3) => attr3[0] === prop);
  return attr2 ? attr2[2] : "";
}
function parseText(lexer) {
  const values = [];
  values.push(lexer.skip());
  while (lexer.nextIs()) {
    if (lexer.nextIs("{{")) {
      lexer.pop();
      lexer.expand("script", () => {
        values.push({ type: "draw", value: expression(lexer) });
      });
      lexer.must("}}");
      values.push(lexer.skip());
    } else {
      lexer.pop();
    }
  }
  if (values.length === 1 && typeof values[0] === "string") {
    return values[0];
  } else {
    return { type: "flat", values };
  }
}

// template_engine/evaluate.ts
var plugins = new Array();
var evaluate = function(template, stack = [], cache = {}) {
  const temp = template;
  switch (temp.type) {
    case "literal":
      return temp.value;
    case "array":
      return temp.values.map((value) => evaluate(value, stack, cache));
    case "object":
      return Object.fromEntries(temp.entries.map((entry) => entry.map((value) => evaluate(value, stack))));
    case "variable": {
      const [, index] = pickup(stack, temp.name);
      if (index >= 0) {
        return { record: stack[index], key: temp.name, [isRef]: true };
      }
      return void 0;
    }
    case "unary":
      return operateUnary(temp.operator, evaluate(temp.operand, stack, cache));
    case "binary": {
      const left = evaluate(temp.left, stack, cache);
      if (noCut(temp.operator, left)) {
        return operateBinary(temp.operator, left, evaluate(temp.right, stack, cache));
      } else {
        return left;
      }
    }
    case "assign": {
      const value = evaluate(temp.left, stack, cache);
      if (!value) {
        throw Error(temp.left ? temp.left.name : "key is not defined");
      }
      const { record, key } = value;
      const right = evaluate(temp.right, stack, cache);
      if (temp.operator.length > 1) {
        const operator = temp.operator.slice(0, -1);
        if (noCut(operator, record[key])) {
          return record[key] = operateBinary(operator, record[key], right);
        } else {
          return record[key];
        }
      } else {
        return record[key] = right;
      }
    }
    case "function": {
      if (temp.name.type === "get" && temp.name.value.type === "hash") {
        const value = evaluate(temp.name.value, stack, cache);
        if (!value) {
          throw Error(evaluate(temp.name.value.key, stack, cache) + " is not defined");
        }
        const f = value.record[value.key];
        if (typeof f === "function") {
          return f.apply(value.record, temp.params.map((param) => evaluate(param, stack, cache)));
        }
      } else {
        const f = evaluate(temp.name, stack, cache);
        if (typeof f === "function") {
          return f(...temp.params.map((param) => evaluate(param, stack, cache)));
        }
      }
      throw Error(temp.name.toString() + " is not a function");
    }
    case "hash":
      return {
        record: evaluate(temp.object, stack, cache),
        key: evaluate(temp.key, stack, cache),
        [isRef]: true
      };
    case "get": {
      const value = evaluate(temp.value, stack, cache);
      return value ? value.record[value.key] : value;
    }
    case "flat": {
      const values = temp.values.flatMap((value) => typeof value === "string" ? [value] : flatwrap(evaluate(value, stack, cache))).filter((value) => value !== "").reduce((result, child) => {
        const len = result.length;
        if (len && typeof child === "string" && typeof result[len - 1] === "string") {
          result[len - 1] += child;
        } else {
          result.push(child);
        }
        return result;
      }, []);
      if (values.length === 1 && typeof values[0] === "string") {
        return values[0];
      } else {
        return values;
      }
    }
    case "draw": {
      const value = evaluate(temp.value, stack, cache);
      if (typeof value === "object") {
        if (instanceOfTemplate(value)) {
          if (value.type === "tree") {
            value.type = "group";
            const result = evaluate(value, stack, cache);
            value.type = "tree";
            return result;
          } else {
            return evaluate(value, stack, cache);
          }
        } else {
          return Object.getPrototypeOf(value) === Object.prototype ? JSON.stringify(value) : "";
        }
      } else {
        return value === null || value === void 0 ? "" : value + "";
      }
    }
    case "join":
      return temp.values.reduce((result, value, index) => {
        if (instanceOfTemplate(value)) {
          const text = evaluate(value, stack, cache);
          return result + (index ? temp.separator : "") + (typeof text === "object" ? "" : text);
        } else {
          return result + (index ? temp.separator : "") + value;
        }
      }, "");
    case "flags": {
      const value = evaluate(temp.value, stack, cache);
      if (typeof value === "string") {
        return value.split(/\s+/);
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          return value;
        } else if (value) {
          return Object.keys(value).filter((key) => value[key]);
        }
      }
      return [];
    }
    case "if":
      return evaluate(temp.condition, stack, cache) ? evaluate(temp.truthy, stack, cache) : temp.falsy ? evaluate(temp.falsy, stack, cache) : null;
    case "for": {
      const array = evaluate(temp.array, stack, cache);
      let entries;
      if (typeof array === "object" && array !== null) {
        if (Symbol.iterator in array) {
          if ("entries" in array) {
            entries = [...array.entries()];
          } else {
            let i = 0;
            entries = [];
            for (const value of array) {
              entries.push([i++, value]);
            }
          }
        } else {
          entries = Object.entries(array);
        }
      } else {
        entries = [[0, array]];
      }
      return entries.flatMap(([key, value], index) => {
        const loop = new Loop(key, value, index, entries, stack);
        const result = flatwrap(evaluate(temp.value, stack.concat([temp.each ? { [temp.each]: value, loop } : { loop }]), cache)).filter((child) => typeof child !== "number");
        if (typeof loop.value === "object") {
          result.filter((child) => typeof child === "object").forEach((child) => child.key = loop.value);
        }
        return result;
      });
    }
    case "tree": {
      const children = evaluateChildren(temp, stack, cache);
      return children.length ? { children } : {};
    }
    case "custom": {
      const el2 = plugins.find((plugin) => plugin.match(temp, stack, cache))?.exec(temp, stack, cache);
      if (el2) {
        return el2;
      }
    }
    case "element": {
      const children = evaluateChildren(temp, stack, cache);
      const tree = children.length ? { children } : {};
      const el2 = tree;
      el2.tag = temp.tag;
      if (temp.is) {
        el2.is = typeof temp.is === "string" ? temp.is : evaluate(temp.is, stack, cache);
      }
      evaluateProps(temp, stack, cache, el2);
      return el2;
    }
    case "group":
      return evaluateChildren(temp, stack, cache);
    case "handler": {
      if (!cache.handler) {
        cache.handler = /* @__PURE__ */ new WeakMap();
      }
      if (!cache.handler.has(temp)) {
        cache.handler.set(temp, []);
      }
      const thisHandlerCache = cache.handler.get(temp);
      for (const cache2 of thisHandlerCache) {
        if (compareCache(cache2[0], stack)) {
          return cache2[1];
        }
      }
      const handler = (event) => evaluate(temp.value, [...stack, { event }], cache);
      thisHandlerCache.push([stack, handler]);
      return handler;
    }
    case "evaluation":
      return evaluate(temp.template, temp.stack ? temp.stack.concat(stack) : stack, cache);
    default:
      return plugins.find((plugin) => plugin.match(template, stack, cache))?.exec(template, stack, cache);
  }
};
evaluate.plugin = function(plugin) {
  plugins.unshift(plugin);
};
var realElementPlugin = {
  match(template, stack, _cache) {
    if (template.type === "custom") {
      const temp = template;
      if (!isPrimitive(temp.tag)) {
        return temp.tag === "window" || pickup(stack, temp.tag)[0] instanceof EventTarget;
      }
    }
    return false;
  },
  exec(template, stack, cache) {
    const temp = template;
    if (template.tag === "window") {
      const re2 = {
        el: window,
        invalid: {
          props: true,
          children: true
        }
      };
      evaluateProps(temp, stack, cache, re2);
      return re2;
    }
    const el2 = pickup(stack, temp.tag)[0];
    const re = { el: el2 };
    evaluateProps(temp, stack, cache, re);
    if ((el2 instanceof Element || el2 instanceof DocumentFragment || el2 instanceof ShadowRoot) && temp.children && temp.children.length) {
      re.children = evaluateChildren(temp, stack, cache);
    } else {
      re.invalid = {
        children: true
      };
    }
    return re;
  }
};
evaluate.plugin(realElementPlugin);
function evaluateChildren(template, stack, cache) {
  const children = template.children || [];
  let i = 0;
  if (children.length) {
    if ((cache.groups ?? (cache.groups = [/* @__PURE__ */ new WeakMap(), 0]))[0].has(template)) {
      i = cache.groups[0].get(template);
    } else {
      i = cache.groups[1] = cache.groups[1] + children.length;
      cache.groups[0].set(template, i);
    }
  }
  const result = children.flatMap((child, index) => {
    if (instanceOfTemplate(child)) {
      const result2 = flatwrap(evaluate(child, stack, cache));
      switch (child.type) {
        case "if":
        case "for":
        case "group":
          result2.push(i - index);
      }
      return result2;
    } else {
      return [child];
    }
  });
  if (typeof result[result.length - 1] === "number") {
    result.pop();
  }
  return result;
}
function evaluateProps(template, stack, cache, ve) {
  if (template.style) {
    ve.style = typeof template.style === "string" ? template.style : evaluate(template.style, stack, cache);
  }
  if (template.bools) {
    for (const key in template.bools) {
      if (!key.startsWith("@")) {
        const value = template.bools[key];
        const result = typeof value === "string" ? value : evaluate(value, stack, cache);
        if (result) {
          (ve.props ?? (ve.props = {}))[key] = result;
        }
      }
    }
  }
  if (template.props) {
    if (!ve.props) {
      ve.props = {};
    }
    for (const key in template.props) {
      if (!key.startsWith("@")) {
        const value = template.props[key];
        ve.props[key] = typeof value === "string" ? value : evaluate(value, stack, cache);
      }
    }
  }
  if (template.class) {
    template.class.forEach((value) => ve.class = (ve.class || []).concat(Array.isArray(value) ? value : evaluate(value, stack, cache)));
  }
  if (template.part) {
    template.part.forEach((value) => ve.part = (ve.part || []).concat(Array.isArray(value) ? value : evaluate(value, stack, cache)));
  }
  if (template.on) {
    if (!ve.on) {
      ve.on = {};
    }
    for (const type in template.on) {
      ve.on[type] = template.on[type].map((listener) => evaluate(listener, stack, cache));
    }
  }
}
function compareCache(cache, stack, cacheIndex = cache.length - 1, stackIndex = stack.length - 1) {
  const [cacheLoop, newCacheIndex] = pickup(cache, "loop", cacheIndex);
  const [stackLoop, newStackIndex] = pickup(stack, "loop", stackIndex);
  if (!cacheLoop && !stackLoop)
    return true;
  if (!cacheLoop || !stackLoop)
    return false;
  return cacheLoop.index === stackLoop.index && cacheLoop.key === stackLoop.key && cacheLoop.value === stackLoop.value && compareCache(cache, stack, newCacheIndex - 1, newStackIndex - 1);
}
function flatwrap(value) {
  return value === null || value === void 0 ? [] : Array.isArray(value) ? value : [value];
}
function operateUnary(operator, operand) {
  switch (operator) {
    case "void":
      return void 0;
    case "typeof":
      return typeof operand;
    case "+":
      return +operand;
    case "-":
      return -operand;
    case "~":
      return ~operand;
    case "!":
      return !operand;
    default:
      throw Error(operator + " does not exist");
  }
}
function noCut(operator, left) {
  switch (operator) {
    case "&&":
      return !!left;
    case "||":
      return !left;
    case "??":
      return left === null || left === void 0;
    default:
      return true;
  }
}
function operateBinary(operator, left, right) {
  switch (operator) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "/":
      return left / right;
    case "*":
      return left * right;
    case "%":
      return left % right;
    case "**":
      return left ** right;
    case "in":
      return left in right;
    case "instanceof":
      return left instanceof right;
    case "<":
      return left < right;
    case ">":
      return left > right;
    case "<=":
      return left <= right;
    case ">=":
      return left >= right;
    case "==":
      return left == right;
    case "!=":
      return left != right;
    case "===":
      return left === right;
    case "!==":
      return left !== right;
    case "<<":
      return left << right;
    case ">>":
      return left >> right;
    case ">>>":
      return left >>> right;
    case "&":
      return left & right;
    case "|":
      return left | right;
    case "^":
      return left ^ right;
    case "&&":
      return left && right;
    case "||":
      return left || right;
    case "??":
      return left ?? right;
    default:
      throw Error(operator + " does not exist");
  }
}

// web_components/builtin.ts
var builtin = lock({
  alert,
  console,
  Object,
  Number,
  Math,
  Date,
  Array,
  JSON,
  String,
  isNaN,
  isFinite,
  location,
  history,
  navigator,
  setTimeout,
  setInterval
});

// web_components/types.ts
var special = Symbol("Beako-special");
function instanceOfComponent(object) {
  return typeof object === "object" && object !== null && "template" in object && "data" in object && "options" in object;
}

// web_components/entity.ts
var Entity = class {
  constructor(component, host, tree) {
    this._props = {};
    this._refs = {};
    const root = tree.el;
    this._component = component;
    this._host = host;
    this._tree = tree;
    this._patch = this._patch.bind(this);
    this._cache = { [special]: [host, root] };
    if (this._component.options.mode === "closed") {
      root.addEventListener(eventTypes.patch, (event) => event.stopPropagation());
    }
    const data = typeof this._component.data === "function" ? this._component.data(this) : this._component.data;
    this._constructor = (async () => {
      const result = await data;
      const stack = result ? Array.isArray(result) ? result : [result] : [];
      this._stack = [builtin, { host, root }, watch(this._props), ...stack];
      reach(this._stack, this._patch);
      this._patch();
      stack.forEach((data2) => {
        if (typeof data2 === "object" && data2 !== null) {
          for (const name in data2) {
            if (typeof data2[name] === "function" && isNaN(name) && !(name in this._host)) {
              const method = data2[name].bind(this);
              Object.defineProperty(this._host, name, {
                get() {
                  return method;
                }
              });
            }
          }
        }
      });
    })().then();
  }
  setProp(name, value) {
    switch (name) {
      case "is":
      case "class":
      case "part":
      case "style":
        return;
      default: {
        const old = this._props[name];
        if (old !== value) {
          if (name in this._refs) {
            const ref = this._refs[name][0];
            if (instanceOfRef(value) && value.record === ref.record) {
              return;
            } else {
              unwatch(this._props, name, this._refs[name][1]);
              unwatch(ref.record, ref.key, this._refs[name][2]);
              delete this._refs[name];
            }
          }
          unwatch(old, this._patch);
          if (instanceOfRef(value)) {
            const childCallback = (newValue) => {
              value.record[value.key] = newValue;
            };
            const parentCallback = (newValue) => {
              this._props[name] = newValue;
            };
            this._refs[name] = [value, childCallback, parentCallback];
            watch(this._props, name, childCallback);
            watch(value.record, value.key, parentCallback);
            this._props[name] = value.record[value.key];
          } else {
            this._props[name] = value;
          }
          if (old === void 0) {
            watch(this._props, name, this._patch);
          }
          reach(this._props, this._patch);
          this._patch();
        }
      }
    }
  }
  _unwatch() {
    for (const name in this._refs) {
      const ref = this._refs[name][0];
      unwatch(this._props, name, this._refs[name][1]);
      unwatch(ref.record, ref.key, this._refs[name][2]);
    }
    unwatch(this._stack, this._patch);
  }
  get component() {
    return this._component;
  }
  get host() {
    return this._host;
  }
  get root() {
    return this._tree.el;
  }
  get props() {
    return this._props;
  }
  get patch() {
    return this._patch;
  }
  get whenConstructed() {
    return () => this._constructor;
  }
  _patch() {
    if (this._stack && this._tree && this._component.template) {
      const tree = evaluate(this._component.template, this._stack, this._cache);
      patch2(this._tree, tree);
    }
  }
};

// web_components/plugins.ts
var componentPlugin = {
  match(template, stack, _cache) {
    if (template.type === "custom") {
      const temp = template;
      if (!isPrimitive(temp.tag)) {
        const element = pickup(stack, temp.tag)[0];
        if (instanceOfComponent(element)) {
          return true;
        } else {
          const El = customElements.get(temp.tag);
          return El !== void 0 && Object.prototype.isPrototypeOf.call(ComponentElement, El);
        }
      }
    }
    return false;
  },
  exec(template, stack, cache) {
    const temp = template;
    const el2 = { tag: template.tag };
    const element = pickup(stack, temp.tag)[0];
    if (element) {
      el2.tag = localComponentElementTag;
      el2.props = { component: element };
    }
    const values = [];
    const contents = [];
    const children = (temp.children || [])?.flatMap((child) => {
      if (!(typeof child === "string")) {
        const temp2 = child;
        if (temp2.props) {
          if (temp2.props["@as"]) {
            contents.push([temp2.props["@as"], temp2]);
            return [];
          } else if (temp2.props.slot) {
            return [evaluate(child, stack, cache)];
          }
        }
      }
      values.push(child);
      return [];
    });
    if (values.length) {
      contents.push(["content", { type: "group", children: values }]);
    }
    if (contents.length) {
      if (!el2.props) {
        el2.props = {};
      }
      contents.forEach(([name, template2]) => {
        el2.props[name] = { type: "evaluation", template: template2, stack };
      });
    }
    if (children.length) {
      el2.children = children;
    }
    evaluateProps(temp, stack, cache, el2);
    if (temp.cache && temp.cache !== el2.props?.component) {
      el2.new = true;
    }
    if (el2.props?.component) {
      temp.cache = el2.props.component;
    } else {
      delete temp.cache;
    }
    return el2;
  }
};
var specialTagPlugin = {
  match(template, stack, cache) {
    if (template.type === "custom") {
      if (special in cache && !isPrimitive(template.tag)) {
        const el2 = pickup(stack, template.tag)[0];
        return cache[special].some((tag) => tag === el2);
      }
    }
    return false;
  },
  exec(template, stack, cache) {
    const el2 = pickup(stack, template.tag)[0] || ShadowRoot;
    const re = {
      el: el2,
      invalid: {
        props: true,
        children: true
      }
    };
    evaluateProps(template, stack, cache, re);
    return re;
  }
};

// web_components/compact.ts
evaluate.plugin(componentPlugin);
evaluate.plugin(specialTagPlugin);
function compact(template, data = []) {
  return lock({
    template: typeof template === "string" ? parse(template) : template,
    data: typeof data === "function" || Array.isArray(data) ? data : [data],
    options: { mode: "open" }
  });
}

// web_components/element.ts
var localComponentElementTag = "beako-entity";
var ComponentElement = class extends HTMLElement {
  constructor() {
    super();
  }
  setProp(name, value) {
    this.entity?.setProp(name, value);
  }
  static getComponent() {
    return void 0;
  }
  loadProps() {
    if (this.hasAttributes()) {
      this.getAttributeNames().forEach((name) => {
        this.setProp(name, this.getAttribute(name));
      });
    }
  }
  whenConstructed() {
    return this.entity?.whenConstructed() || null;
  }
  get attributes() {
    return proxyNamedNodeMap(super.attributes, this.setProp);
  }
  setAttribute(name, value) {
    this.setProp(name, value);
    super.setAttribute(name, value);
  }
  getAttributeNode(name) {
    const attr2 = super.getAttributeNode(name);
    return attr2 ? proxyAttr(attr2, this.setProp) : attr2;
  }
  removeAttribute(name) {
    this.setProp(name, void 0);
    return super.removeAttribute(name);
  }
  removeAttributeNode(attr2) {
    this.setProp(attr2.name, void 0);
    return super.removeAttributeNode(attr2);
  }
};
var LocalComponentElement = class extends ComponentElement {
  constructor() {
    super();
  }
  setProp(name, value) {
    if (name === "component") {
      switch (typeof value) {
        case "string": {
          const def = customElements.get(value);
          if (def && ComponentElement.isPrototypeOf(def)) {
            const component = def.getComponent();
            if (component) {
              const tree = load(this.attachShadow(component.options));
              this.entity = new Entity(component, this, tree);
            }
          } else {
            throw Error(value + " is not a component.");
          }
          break;
        }
        case "object":
        case "undefined":
          if (instanceOfComponent(value)) {
            const tree = load(this.attachShadow(value.options));
            this.entity = new Entity(value, this, tree);
          } else if (value === null || value === void 0) {
            console.log("reset:", value);
            const component = compact("");
            const tree = load(this.attachShadow(component.options));
            this.entity = new Entity(component, this, tree);
          } else {
            throw Error("The object is not a component.");
          }
          break;
      }
    }
    console.log("setProp:", name, value);
    super.setProp(name, value);
  }
};
customElements.define(localComponentElementTag, LocalComponentElement);
function proxyAttr(attr2, setProp) {
  return new Proxy(attr2, {
    set(target, prop, value) {
      setProp(prop, value);
      if (prop === "value") {
        return target.value = value;
      }
    }
  });
}
function proxyNamedNodeMap(attrs, setProp) {
  return new Proxy(attrs, {
    get: function(target, prop) {
      if (prop === "length") {
        return target[prop];
      } else {
        return proxyAttr(target[prop], setProp);
      }
    }
  });
}

// web_components/define.ts
function define(name, template, data = []) {
  const component = instanceOfComponent(template) ? template : compact(template, data);
  if (component.options.localeOnly) {
    throw Error("This componet is local only.");
  }
  customElements.define(name, class extends ComponentElement {
    constructor() {
      super();
      const tree = load(this.attachShadow(component.options));
      this.entity = new Entity(component, this, tree);
      if (this.innerHTML) {
        this.entity.setProp("content", this.innerHTML);
        if (this.hasAttributes()) {
          this.getAttributeNames().forEach((name2) => {
            this.entity.setProp(name2, this.getAttribute(name2));
          });
        }
      } else {
        this.loadProps();
      }
    }
    static getComponent() {
      return component;
    }
  });
}

// web_components/mount.ts
function mount(target, template, data = []) {
  const host = typeof target === "string" ? document.querySelector(target) : target;
  const component = instanceOfComponent(template) ? template : compact(template, data);
  if (component.options.localeOnly) {
    throw Error("This componet is local only.");
  }
  const tree = load(host.attachShadow(component.options));
  const entity = new Entity(component, host, tree);
  if (host.innerHTML) {
    entity.setProp("content", host.innerHTML);
  }
  if (host.hasAttributes()) {
    host.getAttributeNames().forEach((name) => {
      entity.setProp(name, host.getAttribute(name));
    });
  }
}

// web_components/seal.ts
function seal(component, options = {}) {
  component.options = Object.freeze({ mode: "closed", ...options });
  return Object.freeze(component);
}
export {
  ComponentElement,
  Entity,
  Loop,
  builtin,
  compact,
  define,
  destroy2 as destroy,
  evaluate,
  eventTypes,
  expression,
  load,
  lock,
  mount,
  parse,
  patch2 as patch,
  pickup,
  reach,
  receive,
  seal,
  unlock,
  unwatch,
  watch
};
