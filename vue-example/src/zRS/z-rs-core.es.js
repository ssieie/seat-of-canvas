var Ce = Object.defineProperty;
var Ye = (n, t, e) => t in n ? Ce(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var p = (n, t, e) => Ye(n, typeof t != "symbol" ? t + "" : t, e);
class Xe {
  constructor() {
    p(this, "behaviorTasks");
    this.behaviorTasks = /* @__PURE__ */ new Map();
  }
  get getBehaviorTasksSize() {
    return this.behaviorTasks.size;
  }
  addBehavior(t, e, s, i, o) {
    this.behaviorTasks.set(t, {
      event: e,
      call: s,
      interval: i,
      lastExecuteTime: o ? performance.now() - i : performance.now()
    });
  }
  delBehavior(t) {
    return this.behaviorTasks.delete(t);
  }
  delBehaviorAll() {
    this.behaviorTasks.clear();
  }
  behaviorProcess(t) {
    this.behaviorTasks.forEach((e, s) => {
      let i = t - e.lastExecuteTime;
      if (i > e.interval) {
        e.lastExecuteTime = t - i % e.interval;
        const o = e.event();
        e.call && e.call(o);
      }
    });
  }
}
const et = new Xe();
function Ut(n, t, e = 0, s = n.length - 1, i = Ae) {
  for (; s > e; ) {
    if (s - e > 600) {
      const u = s - e + 1, c = t - e + 1, l = Math.log(u), h = 0.5 * Math.exp(2 * l / 3), f = 0.5 * Math.sqrt(l * h * (u - h) / u) * (c - u / 2 < 0 ? -1 : 1), g = Math.max(e, Math.floor(t - c * h / u + f)), S = Math.min(s, Math.floor(t + (u - c) * h / u + f));
      Ut(n, t, g, S, i);
    }
    const o = n[t];
    let r = e, a = s;
    for (W(n, e, t), i(n[s], o) > 0 && W(n, e, s); r < a; ) {
      for (W(n, r, a), r++, a--; i(n[r], o) < 0; ) r++;
      for (; i(n[a], o) > 0; ) a--;
    }
    i(n[e], o) === 0 ? W(n, e, a) : (a++, W(n, a, s)), a <= t && (e = a + 1), t <= a && (s = a - 1);
  }
}
function W(n, t, e) {
  const s = n[t];
  n[t] = n[e], n[e] = s;
}
function Ae(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
class Wt {
  constructor(t = 9) {
    this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(t) {
    let e = this.data;
    const s = [];
    if (!at(t, e)) return s;
    const i = this.toBBox, o = [];
    for (; e; ) {
      for (let r = 0; r < e.children.length; r++) {
        const a = e.children[r], u = e.leaf ? i(a) : a;
        at(t, u) && (e.leaf ? s.push(a) : mt(t, u) ? this._all(a, s) : o.push(a));
      }
      e = o.pop();
    }
    return s;
  }
  collides(t) {
    let e = this.data;
    if (!at(t, e)) return !1;
    const s = [];
    for (; e; ) {
      for (let i = 0; i < e.children.length; i++) {
        const o = e.children[i], r = e.leaf ? this.toBBox(o) : o;
        if (at(t, r)) {
          if (e.leaf || mt(t, r)) return !0;
          s.push(o);
        }
      }
      e = s.pop();
    }
    return !1;
  }
  load(t) {
    if (!(t && t.length)) return this;
    if (t.length < this._minEntries) {
      for (let s = 0; s < t.length; s++)
        this.insert(t[s]);
      return this;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (!this.data.children.length)
      this.data = e;
    else if (this.data.height === e.height)
      this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const s = this.data;
        this.data = e, e = s;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(t) {
    return t && this._insert(t, this.data.height - 1), this;
  }
  clear() {
    return this.data = L([]), this;
  }
  remove(t, e) {
    if (!t) return this;
    let s = this.data;
    const i = this.toBBox(t), o = [], r = [];
    let a, u, c;
    for (; s || o.length; ) {
      if (s || (s = o.pop(), u = o[o.length - 1], a = r.pop(), c = !0), s.leaf) {
        const l = Ie(t, s.children, e);
        if (l !== -1)
          return s.children.splice(l, 1), o.push(s), this._condense(o), this;
      }
      !c && !s.leaf && mt(s, i) ? (o.push(s), r.push(a), a = 0, u = s, s = s.children[0]) : u ? (a++, s = u.children[a], c = !1) : s = null;
    }
    return this;
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(t) {
    return this.data = t, this;
  }
  _all(t, e) {
    const s = [];
    for (; t; )
      t.leaf ? e.push(...t.children) : s.push(...t.children), t = s.pop();
    return e;
  }
  _build(t, e, s, i) {
    const o = s - e + 1;
    let r = this._maxEntries, a;
    if (o <= r)
      return a = L(t.slice(e, s + 1)), Z(a, this.toBBox), a;
    i || (i = Math.ceil(Math.log(o) / Math.log(r)), r = Math.ceil(o / Math.pow(r, i - 1))), a = L([]), a.leaf = !1, a.height = i;
    const u = Math.ceil(o / r), c = u * Math.ceil(Math.sqrt(r));
    At(t, e, s, c, this.compareMinX);
    for (let l = e; l <= s; l += c) {
      const h = Math.min(l + c - 1, s);
      At(t, l, h, u, this.compareMinY);
      for (let f = l; f <= h; f += u) {
        const g = Math.min(f + u - 1, h);
        a.children.push(this._build(t, f, g, i - 1));
      }
    }
    return Z(a, this.toBBox), a;
  }
  _chooseSubtree(t, e, s, i) {
    for (; i.push(e), !(e.leaf || i.length - 1 === s); ) {
      let o = 1 / 0, r = 1 / 0, a;
      for (let u = 0; u < e.children.length; u++) {
        const c = e.children[u], l = dt(c), h = Te(t, c) - l;
        h < r ? (r = h, o = l < o ? l : o, a = c) : h === r && l < o && (o = l, a = c);
      }
      e = a || e.children[0];
    }
    return e;
  }
  _insert(t, e, s) {
    const i = s ? t : this.toBBox(t), o = [], r = this._chooseSubtree(i, this.data, e, o);
    for (r.children.push(t), J(r, i); e >= 0 && o[e].children.length > this._maxEntries; )
      this._split(o, e), e--;
    this._adjustParentBBoxes(i, o, e);
  }
  // split overflowed node into two
  _split(t, e) {
    const s = t[e], i = s.children.length, o = this._minEntries;
    this._chooseSplitAxis(s, o, i);
    const r = this._chooseSplitIndex(s, o, i), a = L(s.children.splice(r, s.children.length - r));
    a.height = s.height, a.leaf = s.leaf, Z(s, this.toBBox), Z(a, this.toBBox), e ? t[e - 1].children.push(a) : this._splitRoot(s, a);
  }
  _splitRoot(t, e) {
    this.data = L([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, Z(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, s) {
    let i, o = 1 / 0, r = 1 / 0;
    for (let a = e; a <= s - e; a++) {
      const u = q(t, 0, a, this.toBBox), c = q(t, a, s, this.toBBox), l = ke(u, c), h = dt(u) + dt(c);
      l < o ? (o = l, i = a, r = h < r ? h : r) : l === o && h < r && (r = h, i = a);
    }
    return i || s - e;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(t, e, s) {
    const i = t.leaf ? this.compareMinX : Be, o = t.leaf ? this.compareMinY : _e, r = this._allDistMargin(t, e, s, i), a = this._allDistMargin(t, e, s, o);
    r < a && t.children.sort(i);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(t, e, s, i) {
    t.children.sort(i);
    const o = this.toBBox, r = q(t, 0, e, o), a = q(t, s - e, s, o);
    let u = rt(r) + rt(a);
    for (let c = e; c < s - e; c++) {
      const l = t.children[c];
      J(r, t.leaf ? o(l) : l), u += rt(r);
    }
    for (let c = s - e - 1; c >= e; c--) {
      const l = t.children[c];
      J(a, t.leaf ? o(l) : l), u += rt(a);
    }
    return u;
  }
  _adjustParentBBoxes(t, e, s) {
    for (let i = s; i >= 0; i--)
      J(e[i], t);
  }
  _condense(t) {
    for (let e = t.length - 1, s; e >= 0; e--)
      t[e].children.length === 0 ? e > 0 ? (s = t[e - 1].children, s.splice(s.indexOf(t[e]), 1)) : this.clear() : Z(t[e], this.toBBox);
  }
}
function Ie(n, t, e) {
  if (!e) return t.indexOf(n);
  for (let s = 0; s < t.length; s++)
    if (e(n, t[s])) return s;
  return -1;
}
function Z(n, t) {
  q(n, 0, n.children.length, t, n);
}
function q(n, t, e, s, i) {
  i || (i = L(null)), i.minX = 1 / 0, i.minY = 1 / 0, i.maxX = -1 / 0, i.maxY = -1 / 0;
  for (let o = t; o < e; o++) {
    const r = n.children[o];
    J(i, n.leaf ? s(r) : r);
  }
  return i;
}
function J(n, t) {
  return n.minX = Math.min(n.minX, t.minX), n.minY = Math.min(n.minY, t.minY), n.maxX = Math.max(n.maxX, t.maxX), n.maxY = Math.max(n.maxY, t.maxY), n;
}
function Be(n, t) {
  return n.minX - t.minX;
}
function _e(n, t) {
  return n.minY - t.minY;
}
function dt(n) {
  return (n.maxX - n.minX) * (n.maxY - n.minY);
}
function rt(n) {
  return n.maxX - n.minX + (n.maxY - n.minY);
}
function Te(n, t) {
  return (Math.max(t.maxX, n.maxX) - Math.min(t.minX, n.minX)) * (Math.max(t.maxY, n.maxY) - Math.min(t.minY, n.minY));
}
function ke(n, t) {
  const e = Math.max(n.minX, t.minX), s = Math.max(n.minY, t.minY), i = Math.min(n.maxX, t.maxX), o = Math.min(n.maxY, t.maxY);
  return Math.max(0, i - e) * Math.max(0, o - s);
}
function mt(n, t) {
  return n.minX <= t.minX && n.minY <= t.minY && t.maxX <= n.maxX && t.maxY <= n.maxY;
}
function at(n, t) {
  return t.minX <= n.maxX && t.minY <= n.maxY && t.maxX >= n.minX && t.maxY >= n.minY;
}
function L(n) {
  return {
    children: n,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function At(n, t, e, s, i) {
  const o = [t, e];
  for (; o.length; ) {
    if (e = o.pop(), t = o.pop(), e - t <= s) continue;
    const r = t + Math.ceil((e - t) / s / 2) * s;
    Ut(n, r, t, e, i), o.push(t, r, r, e);
  }
}
const lt = ["rectangle", "circle", "strip"];
function It() {
  return {
    highlightElements: !0,
    currentDragEl: null,
    cvs: null,
    containerTransformState: {
      lastX: 0,
      lastY: 0,
      offsetX: 0,
      offsetY: 0,
      scale: 1
    },
    graphicMatrix: {
      groups: {
        rectangle: {},
        circle: {},
        strip: {}
      },
      elements: {},
      groupElements: {}
    },
    groupTree: new Wt()
  };
}
function ot(n) {
  const t = n.getGraphicGroups(lt), e = new Wt();
  for (const s of t.values())
    e.insert({
      ...s,
      minX: s.x,
      minY: s.y,
      maxX: s.x + s.w,
      maxY: s.y + s.h
    });
  n.updateState("groupTree", e);
}
const B = class B {
  constructor() {
    p(this, "state");
    p(this, "listeners", {});
    this.state = It();
  }
  static getInstance() {
    return B.instance || (B.instance = new B()), B.instance;
  }
  getState(...t) {
    if (t.length === 0)
      return { ...this.state };
    if (t.length === 1)
      return this.state[t[0]];
    const e = {};
    return t.forEach((s) => {
      e[s] = this.state[s];
    }), e;
  }
  updateState(t, e) {
    const s = this.state[t];
    this.state[t] = e, t === "graphicMatrix" && ot(B.getInstance()), this.notify(t, e, s);
  }
  // 订阅特定字段
  subscribe(t, e, s = !1) {
    this.listeners[t] || (this.listeners[t] = /* @__PURE__ */ new Set()), this.listeners[t].add(e), s && e(this.state[t], this.state[t]);
  }
  // 取消订阅
  unsubscribe(t, e) {
    var s;
    (s = this.listeners[t]) == null || s.delete(e);
  }
  // 取消订阅
  unsubscribeAll() {
    Object.keys(this.listeners).forEach((t) => {
      this.listeners[t].clear();
    }), this.listeners = {};
  }
  // 通知监听器
  notify(t, e, s) {
    var i;
    (i = this.listeners[t]) == null || i.forEach((o) => {
      o(e, s);
    });
  }
  // 获取画布上已有的全部组
  getGraphicGroups(t) {
    const e = /* @__PURE__ */ new Map(), s = Array.from(new Set(t));
    for (const i of s)
      for (const [o, r] of Object.entries(this.state.graphicMatrix.groups[i]))
        e.set(o, r);
    return e;
  }
  // 获取画布上已有的全部组 arr
  getGraphicGroupsArr() {
    const t = [];
    for (const e of lt)
      for (const [s, i] of Object.entries(this.state.graphicMatrix.groups[e]))
        t.push(i);
    return t;
  }
  // 获取指定组
  getGraphicGroupsById(t) {
    if (!t) return null;
    for (const e of lt)
      for (const [s, i] of Object.entries(this.state.graphicMatrix.groups[e]))
        if (t === s)
          return i;
    return null;
  }
  // 获取指定组下的元素
  getGraphicGroupElementsById(t) {
    return this.state.graphicMatrix.groupElements[t].map((s) => this.state.graphicMatrix.elements[s]);
  }
  // 获取指定元素
  getGraphicGroupElementById(t) {
    const e = this.state.graphicMatrix.elements[t];
    return e || null;
  }
  reset() {
    this.state = It();
  }
  destroy() {
  }
};
p(B, "instance");
let b = B;
const qt = b.getInstance(), Jt = () => qt.getState("cvs");
function Y() {
  return qt.getState("containerTransformState");
}
function _(n, t) {
  const { scale: e, offsetX: s, offsetY: i } = Y();
  return [
    n * e + s,
    t * e + i
  ];
}
const ze = (n, t) => {
  const { scale: e, offsetX: s, offsetY: i } = Y();
  return [
    (n - s) / e,
    (t - i) / e
  ];
};
function E(n) {
  return n * Y().scale;
}
function Re(n, t, e) {
  const { scale: s, offsetX: i, offsetY: o } = Y(), r = Math.min(Math.max(s, 0.75), 3), u = 30 * r, c = r > 1 ? r : 1, l = i % u, h = o % u;
  n.fillStyle = "#dfdfe1";
  for (let f = l; f < t; f += u)
    for (let g = h; g < e; g += u)
      n.fillRect(f - c, g - c, c * 2, c * 2);
}
function Oe(n) {
  et.delBehavior(n);
}
function De() {
  et.delBehaviorAll();
}
class Pe {
  constructor(t, e) {
    p(this, "cvs");
    p(this, "$");
    p(this, "fps");
    p(this, "fpsInterval");
    p(this, "lastRenderTime");
    p(this, "frame");
    if (!e.cvs || !e.pen)
      throw new Error("Canvaser context is incomplete.");
    this.cvs = e.cvs, this.$ = e.pen, this.fps = t, this.fpsInterval = 1e3 / this.fps, this.lastRenderTime = performance.now();
  }
  run(t) {
    this.frame = window.requestAnimationFrame(this.run.bind(this, t));
    let e = performance.now(), s = e - this.lastRenderTime;
    s > this.fpsInterval && (this.lastRenderTime = e - s % this.fpsInterval, this.clearScreen(), this.renderGrid(), this.renderInstances(t)), this.processBehavior(e);
  }
  clear() {
    this.frame && window.cancelAnimationFrame(this.frame), De();
  }
  clearScreen() {
    this.$.clearRect(0, 0, this.cvs.width, this.cvs.height);
  }
  renderGrid() {
    Re(this.$, this.cvs.width, this.cvs.height);
  }
  renderInstances(t) {
    var e, s;
    for (const i in t)
      (s = (e = t[i]) == null ? void 0 : e.draw) == null || s.call(e);
  }
  processBehavior(t) {
    et.getBehaviorTasksSize && et.behaviorProcess(t);
  }
}
class Ze {
  constructor() {
    p(this, "events", {});
  }
  subscribe(t, e) {
    return this.events[t] || (this.events[t] = []), this.events[t].push(e), () => this.unsubscribe(t, e);
  }
  publish(t, ...e) {
    var s;
    (s = this.events[t]) == null || s.forEach((i) => i(...e));
  }
  unsubscribe(t, e) {
    const s = this.events[t];
    s && (this.events[t] = s.filter((i) => i !== e));
  }
  once(t, e) {
    const s = (...i) => {
      e(...i), this.unsubscribe(t, s);
    };
    this.subscribe(t, s);
  }
  clear(t) {
    this.events[t] && (this.events[t] = []);
  }
  clearAll() {
    this.events = {};
  }
}
const x = new Ze(), Le = b.getInstance(), gt = (n, t, e) => n + (t - n) * e;
function ct(n, t = 300) {
  const e = performance.now(), { scale: s, offsetX: i, offsetY: o } = Y(), r = {
    offsetX: i,
    offsetY: o,
    scale: s
  };
  et.addBehavior(
    "resetTransform",
    () => {
      const u = performance.now() - e, c = Math.min(1, u / t), l = c * (2 - c);
      return x.publish("calculateProportion"), c >= 1 && Oe("resetTransform"), {
        offsetX: gt(r.offsetX, n.offsetX, l),
        offsetY: gt(r.offsetY, n.offsetY, l),
        scale: gt(r.scale, n.scale, l),
        lastX: 0,
        lastY: 0
      };
    },
    (a) => {
      Le.updateState("containerTransformState", a);
    },
    1e3 / 60,
    // 每秒 60 次
    !0
  );
}
function Fe(n, t, e) {
  let s, i, o, r = 0;
  e || (e = {});
  let a = function() {
    r = e.leading === !1 ? 0 : (/* @__PURE__ */ new Date()).getTime(), s = null, n.apply(i, o), s || (i = o = null);
  }, u = function() {
    let c = (/* @__PURE__ */ new Date()).getTime();
    !r && e.leading === !1 && (r = c);
    let l = t - (c - r);
    i = this, o = arguments, l <= 0 || l > t ? (s && (clearTimeout(s), s = null), r = c, n.apply(i, o), s || (i = o = null)) : !s && e.trailing !== !1 && (s = setTimeout(a, l));
  };
  return u.cancel = function() {
    clearTimeout(s), r = 0, s = null;
  }, u;
}
function U() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (n) => {
    const t = Math.random() * 16 | 0;
    return (n === "x" ? t : t & 3 | 8).toString(16);
  });
}
function j(n, t = /* @__PURE__ */ new WeakMap()) {
  if (n === null || typeof n != "object")
    return n;
  if (t.has(n))
    return t.get(n);
  const e = Array.isArray(n) ? [] : {};
  t.set(n, e);
  for (const s in n)
    Object.prototype.hasOwnProperty.call(n, s) && (e[s] = j(n[s], t));
  return e;
}
function Bt(n, t, e) {
  return n.map((s) => s === t ? e : s);
}
function He(n, t) {
  const e = {
    id: n.id,
    group_by: n.group_by,
    index: n.index,
    x: n.x,
    y: n.y,
    isDragging: n.isDragging,
    dX: n.dX,
    dY: n.dY,
    width: n.width,
    height: n.height,
    pos: n.pos ? [...n.pos] : void 0,
    strip: n.strip ? { ...n.strip } : void 0,
    text: n.text,
    baseFontSize: n.baseFontSize,
    nameFontSize: n.nameFontSize,
    status: n.status
  };
  _t(n, t), _t(t, e);
}
function _t(n, t) {
  n.group_by = t.group_by, n.index = t.index, n.x = t.x, n.y = t.y, n.isDragging = t.isDragging, n.dX = t.dX, n.dY = t.dY, n.width = t.width, n.height = t.height, n.pos = t.pos ? [...t.pos] : void 0, n.strip = t.strip ? { ...t.strip } : void 0;
}
const $e = "rgb(255, 255, 255)", m = 50, M = 50, Ne = 30, d = 10, nt = d * 3, y = d * 1.5, yt = "#f6f6f6", St = "#E3D2C3", Gt = "#2DAA9E", vt = "rgb(0,0,0)", Ue = "#074799", We = "rgb(0,0,0)", Tt = "rgb(0,0,0)", Vt = "rgb(255,255,255)", qe = "占座", z = b.getInstance();
function jt(n, t) {
  const e = t * m + (t - 1) * d + nt, s = n * M + (n - 1) * d + Ne + d * 2;
  return [e, s];
}
function Kt(n, t, e) {
  let s = 0;
  if (e && e.fullRow !== 0) {
    const { logicalColCount: o, fullRow: r } = e, a = o * m + (o - 1) * d, u = r * m + (r - 1) * d;
    s = (a - u) / 2 + n * m + n * d + y;
  } else
    s = n * m + d * n + y;
  const i = t * M + d * t + y;
  return {
    gX: s,
    gY: i
  };
}
function Je(n, t, e, s) {
  const i = {};
  let o = 1;
  for (let r = 0; r < t; r++)
    for (let a = 0; a < e; a++) {
      const u = `${n}-${r}-${a}`, { gX: c, gY: l } = Kt(a, r);
      i[u] = {
        id: u,
        group_by: n,
        index: o,
        x: c,
        y: l,
        isDragging: !1,
        dX: 0,
        dY: 0,
        width: m,
        height: M,
        pos: [r, a],
        text: Math.random().toString(36).substr(2, 2),
        status: "idle",
        baseFontSize: 13,
        nameFontSize: 10
      }, o++;
    }
  return i;
}
function Qt(n, t, e = !0) {
  n.fillStyle = yt;
  const [s, i] = _(t.x, t.y), o = E(t.w), r = E(t.h);
  n.fillRect(s, i, o, r), n.lineWidth = E(1), n.strokeStyle = St, t.hover && (n.strokeStyle = Gt), n.strokeRect(s, i, o, r), Ve(n, t, s, i, o, r, e);
}
function Ve(n, t, e, s, i, o, r = !0) {
  $(n, vt, "center", "alphabetic", t.baseFontSize), n.fillText(`区域名称：${t.group_name}`, e + i / 2, s + o - (r ? E(d) : d));
}
function te(n, t) {
  return {
    x: n.x + t.x,
    y: n.y + t.y
  };
}
function ee(n, t, e) {
  if (!t.isDragging) {
    const s = te(e, t), [i, o] = _(s.x, s.y), r = E(t.width), a = E(t.height);
    Yt(n, t, i, o, r, a);
  }
}
function je(n, t, e, s) {
  const i = z.getGraphicGroupElementById(t.id);
  if (!i) return;
  const o = z.getState("graphicMatrix"), r = z.getGraphicGroupElementsById(n.group_id);
  for (const c of r)
    if (c.pos[0] === i.pos[0])
      switch (e) {
        case "before":
          c.pos[1] >= i.pos[1] && (c.pos[1] = c.pos[1] + s);
          break;
        case "after":
          c.pos[1] > i.pos[1] && (c.pos[1] = c.pos[1] + s);
          break;
      }
  const a = [], u = {};
  for (let c = 1; c <= s; c++) {
    const l = U();
    let h = [0, 0];
    switch (e) {
      case "before":
        h = [i.pos[0], i.pos[1] - c];
        break;
      case "after":
        h = [i.pos[0], i.pos[1] + c];
        break;
    }
    a.push(Xt(l, n, 0, 0, 0, h, `测试${c}`));
  }
  o.elements = {
    ...o.elements,
    ...a.reduce((c, l) => (c[l.id] = l, c), u)
  }, o.groupElements[n.group_id] = [...o.groupElements[n.group_id], ...a.map((c) => c.id)], ne(n.group_id);
}
function Ke(n) {
  const t = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
  for (const s of n) {
    const [i, o] = s.pos;
    t.add(i), e.add(o);
  }
  return {
    logicalRowCount: t.size,
    logicalColCount: e.size,
    matrixRowCount: Math.max(...t) + 1,
    matrixColCount: Math.max(...e) + 1
  };
}
function Qe(n) {
  const t = /* @__PURE__ */ new Set();
  for (const o of n)
    t.add(o.pos[0]);
  const e = [...t].sort((o, r) => o - r), s = /* @__PURE__ */ new Map();
  e.forEach((o, r) => {
    s.set(o, r);
  });
  const i = /* @__PURE__ */ new Map();
  for (const o of n) {
    const [r] = o.pos, a = s.get(r);
    i.has(a) || i.set(a, []), i.get(a).push(o);
  }
  for (const [o, r] of i.entries())
    r.sort((a, u) => a.pos[1] - u.pos[1]), r.forEach((a, u) => {
      a.pos = [o, u];
    });
}
function tn(n) {
  const t = /* @__PURE__ */ new Map();
  for (const s of n) {
    const [i, o] = s.pos;
    t.has(i) || t.set(i, []), t.get(i).push(o);
  }
  const e = /* @__PURE__ */ new Map();
  for (const [s, i] of t.entries()) {
    const o = i.sort((a, u) => a - u), r = /* @__PURE__ */ new Map();
    o.forEach((a, u) => r.set(a, u)), e.set(s, r);
  }
  return e;
}
function en(n, t, e) {
  const s = /* @__PURE__ */ new Set();
  for (const i of n) {
    const [o, r] = i.pos;
    o === t && s.add(r);
  }
  return s.size === e ? 0 : s.size;
}
function ne(n) {
  const t = z.getGraphicGroupsById(n);
  if (!t) return;
  const e = z.getGraphicGroupElementsById(n), s = e.length;
  Qe(e);
  const i = /* @__PURE__ */ new Map(), o = [];
  for (const f of e)
    o.push({ pos: f.pos }), i.set(f.pos.toString(), f.id);
  console.log(e);
  const { logicalRowCount: r, logicalColCount: a } = Ke(o);
  console.log(r, a);
  const [u, c] = jt(r, a);
  t.w = u, t.h = c, t.size = s;
  const l = tn(o);
  let h = 1;
  for (let f = 0; f < r; f++) {
    const g = en(o, f, a);
    for (let S = 0; S < a; S++)
      if (i.has(`${f},${S}`)) {
        const T = z.getGraphicGroupElementById(i.get(`${f},${S}`));
        if (T) {
          const w = l.get(f).get(S), { gX: ft, gY: pt } = Kt(w, f, { logicalColCount: a, fullRow: g });
          T.x = ft, T.y = pt, T.index = h, T.pos = [f, S];
        }
        h++;
      }
  }
  ot(z);
}
const K = b.getInstance(), nn = m + d * 2, kt = 40;
function se(n) {
  const t = m + d, e = Math.max(n * t / (2 * Math.PI), 50), s = (e + nn) * 2;
  return {
    radius: e,
    w: s,
    h: s
  };
}
function ie(n, t) {
  const e = 2 * Math.PI * t / n.size - Math.PI / 2, s = (n.radius + kt) * Math.cos(e) - m / 2, i = (n.radius + kt) * Math.sin(e) - M / 2;
  return [s, i];
}
function sn(n) {
  const t = {};
  for (let e = 0; e < n.size; e++) {
    const [s, i] = ie(n, e), o = `${n.group_id}-${e}`;
    t[o] = Xt(o, n, e + 1, s, i);
  }
  return t;
}
function on(n, t, e, s) {
  const i = K.getState("graphicMatrix"), r = K.getGraphicGroupElementsById(n.group_id).sort((l, h) => l.index - h.index).map((l) => l.id), a = [];
  for (let l = 0; l < s; l++) {
    const h = U();
    a.push(Xt(h, n, 0, 0, 0, void 0, `测试${l}`));
  }
  const u = r.indexOf(t.id);
  r.splice(e === "before" ? u : u + 1, 0, ...a.map((l) => l.id));
  const c = {};
  i.elements = {
    ...i.elements,
    ...a.reduce((l, h) => (l[h.id] = h, l), c)
  }, i.groupElements[n.group_id] = r, oe(n.group_id);
}
function oe(n) {
  const t = K.getGraphicGroupsById(n);
  if (!t) return;
  const e = K.getGraphicGroupElementsById(n), s = e.length, { radius: i, w: o, h: r } = se(s);
  t.w = o, t.h = r, t.radius = i, t.size = s;
  for (let a = 0; a < t.size; a++) {
    const [u, c] = ie(t, a);
    e[a].x = u, e[a].y = c, e[a].index = a + 1;
  }
  ot(K);
}
function re(n, t) {
  n.fillStyle = yt;
  const [e, s] = _(t.x, t.y), i = E(t.w), o = E(t.h), r = E(t.radius), a = {
    x: e + i / 2,
    y: s + o / 2
  };
  n.fillRect(e, s, i, o), n.strokeStyle = St, n.beginPath(), n.arc(a.x, a.y, r, 0, 2 * Math.PI), n.stroke(), n.fillStyle = Vt, n.fill(), t.hover && (n.strokeStyle = Gt), n.strokeRect(e, s, i, o), rn(n, t, a);
}
function rn(n, t, e) {
  $(n, vt, "center", "middle", t.baseFontSize), n.fillText(`${t.group_name}`, e.x, e.y);
}
function ae(n, t) {
  return {
    x: n.x + t.x + n.w / 2,
    y: n.y + t.y + n.h / 2
  };
}
function ce(n, t, e) {
  if (!t.isDragging) {
    const s = E(t.width), i = E(t.height), o = ae(e, t), [r, a] = _(o.x, o.y);
    Yt(n, t, r, a, s, i);
  }
}
const H = b.getInstance();
function le(n, t) {
  const e = t + 2, s = n + 2, i = s * m + (s - 1) * d + nt, o = e * M + (e - 1) * d + nt;
  return [i, o];
}
function V(n, t, e, s, i, o, r, a) {
  return {
    id: n,
    group_by: t,
    index: e,
    x: s,
    y: i,
    isDragging: !1,
    dX: 0,
    dY: 0,
    width: m,
    height: M,
    strip: {
      pos: o,
      idx: r
    },
    text: a || Math.random().toString(36).substr(2, 2),
    status: "idle",
    baseFontSize: 13,
    nameFontSize: 10
  };
}
function an(n, t, e) {
  const s = {};
  let i = 1;
  const o = y;
  for (let c = 0; c < t; c++) {
    const l = `${n}-top-${c}`, h = m + d + c * m + d * c + y, f = o;
    s[l] = V(l, n, i, h, f, "top", c), i++;
  }
  const r = s[`${n}-top-${t - 1}`].x + m + d;
  for (let c = 0; c < e; c++) {
    const l = `${n}-right-${c}`, h = r, f = M + d + c * M + d * c + y;
    s[l] = V(l, n, i, h, f, "right", c), i++;
  }
  const a = s[`${n}-right-${e - 1}`].y + m + d;
  for (let c = t; c > 0; c--) {
    const l = `${n}-bottom-${c}`, h = c * m + d * c + y, f = a;
    s[l] = V(l, n, i, h, f, "bottom", c), i++;
  }
  const u = y;
  for (let c = e; c > 0; c--) {
    const l = `${n}-left-${c}`, h = u, f = c * M + d * c + y;
    s[l] = V(l, n, i, h, f, "left", c), i++;
  }
  return s;
}
function ue(n, t, e = !0) {
  n.fillStyle = yt;
  const [s, i] = _(t.x, t.y), o = E(t.w), r = E(t.h);
  n.fillRect(s, i, o, r), n.strokeStyle = St, cn(n, s, i, o, r, e), t.hover && (n.strokeStyle = Gt), n.strokeRect(s, i, o, r), ln(n, t, s, i, o, r);
}
function cn(n, t, e, s, i, o = !0) {
  const r = o ? E(m + nt) : m + nt, a = {
    x: t + r,
    y: e + r,
    w: s - r * 2,
    h: i - r * 2
  };
  n.beginPath(), n.strokeRect(a.x, a.y, a.w, a.h), n.fillStyle = Vt, n.fillRect(a.x, a.y, a.w, a.h);
}
function ln(n, t, e, s, i, o) {
  $(n, vt, "center", "middle", t.baseFontSize), n.fillText(`${t.group_name}`, e + i / 2, s + o / 2);
}
function he(n, t) {
  return {
    x: n.x + t.x,
    y: n.y + t.y
  };
}
function fe(n, t, e) {
  if (!t.isDragging) {
    const s = he(e, t), [i, o] = _(s.x, s.y), r = E(t.width), a = E(t.height);
    Yt(n, t, i, o, r, a);
  }
}
function un(n) {
  const t = {
    top: [],
    right: [],
    bottom: [],
    left: []
  };
  for (const e of n)
    t[e.strip.pos].push(e);
  for (const e of Object.keys(t)) {
    const s = t[e];
    s.sort((i, o) => i.strip.idx - o.strip.idx), s.forEach((i, o) => {
      i.strip.idx = o;
    });
  }
}
function hn(n, t, e, s) {
  const i = H.getGraphicGroupElementById(t.id);
  if (!i) return;
  const o = i.strip.idx, r = H.getState("graphicMatrix"), a = H.getGraphicGroupElementsById(n.group_id);
  for (const l of a)
    if (l.strip.pos === i.strip.pos)
      switch (e) {
        // 0，1，2
        // 0，3，4
        case "before":
          l.strip.idx >= o && (l.strip.idx = l.strip.idx + s);
          break;
        case "after":
          l.strip.idx > o && (l.strip.idx = l.strip.idx + s);
          break;
      }
  const u = [], c = {};
  for (let l = 1; l <= s; l++) {
    const h = U();
    let f = 0, g = i.strip.pos;
    switch (e) {
      case "before":
        f = i.strip.idx - l;
        break;
      case "after":
        f = i.strip.idx + l;
        break;
    }
    u.push(V(h, n.group_id, 0, 0, 0, g, f, `测试${l}`));
  }
  r.elements = {
    ...r.elements,
    ...u.reduce((l, h) => (l[h.id] = h, l), c)
  }, r.groupElements[n.group_id] = [...r.groupElements[n.group_id], ...u.map((l) => l.id)], pe(n.group_id);
}
function pe(n) {
  const t = H.getGraphicGroupsById(n);
  if (!t) return;
  const e = H.getGraphicGroupElementsById(n), s = e.length, i = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
  un(e);
  for (const l of e)
    switch (l.strip.pos) {
      case "top":
        i.top++;
        break;
      case "right":
        i.right++;
        break;
      case "bottom":
        i.bottom++;
        break;
      case "left":
        i.left++;
        break;
    }
  const o = Math.max(i.top, i.bottom, 1), r = Math.max(i.left, i.right, 1), [a, u] = le(o, r);
  t.w = a, t.h = u, t.size = s;
  let c = 1;
  for (const l of e.filter((h) => h.strip.pos === "top").sort((h, f) => h.strip.idx - f.strip.idx)) {
    const f = (o - i.top) * ((m + d) / 2) + m + d + l.strip.idx * m + d * l.strip.idx + y, g = y;
    l.x = f, l.y = g, l.index = c, c++;
  }
  for (const l of e.filter((h) => h.strip.pos === "right").sort((h, f) => h.strip.idx - f.strip.idx)) {
    const h = r - i.right, g = m + d + o * m + d * o + y, S = h * ((M + d) / 2) + M + d + l.strip.idx * M + d * l.strip.idx + y;
    l.x = g, l.y = S, l.index = c, c++;
  }
  for (const l of e.filter((h) => h.strip.pos === "bottom").sort((h, f) => h.strip.idx - f.strip.idx)) {
    const h = M + d + r * M + d * r + y, g = (o - i.bottom) * ((m + d) / 2) + m + d + l.strip.idx * m + d * l.strip.idx + y, S = h;
    l.x = g, l.y = S, l.index = c, c++;
  }
  for (const l of e.filter((h) => h.strip.pos === "left").sort((h, f) => h.strip.idx - f.strip.idx)) {
    const h = r - i.left, f = y, g = h * ((M + d) / 2) + M + d + l.strip.idx * M + d * l.strip.idx + y;
    l.x = f, l.y = g, l.index = c, c++;
  }
  ot(H);
}
const N = b.getInstance(), fn = (n) => {
  if (N.getState("highlightElements")) {
    const t = R(n);
    t && pn(t);
  }
};
let zt = /* @__PURE__ */ new Set();
function de(n) {
  for (const t of zt)
    if (!n.has(t)) {
      const e = N.getGraphicGroupsById(t);
      e && (e.hover = !1, e.z_index = 0);
    }
  for (const t of n.values()) {
    const e = N.getGraphicGroupsById(t);
    e && (e.hover = !0, e.z_index = 1);
  }
  zt = n;
}
function pn({ mx: n, my: t }) {
  const i = N.getState("groupTree").search({
    minX: n,
    minY: t,
    maxX: n,
    maxY: t
  }).sort((r, a) => a.z_index - r.z_index).map((r) => r.group_id), o = /* @__PURE__ */ new Set([i[0]]);
  de(o);
}
const dn = Fe(fn, 150), me = (n) => {
  const t = R(n);
  if (t) {
    const s = N.getState("groupTree").search({
      minX: t.mx,
      minY: t.my,
      maxX: t.mx,
      maxY: t.my
    });
    return s.length === 0 ? null : s.reduce((o, r) => r.z_index > o.z_index ? r : o, s[0]);
  }
  return null;
}, ge = (n, t) => {
  const e = R(n);
  if (e) {
    const { mx: s, my: i } = e, o = N.getGraphicGroupElementsById(t.group_id);
    for (const r of o) {
      const { width: a, height: u } = r;
      let c = 0, l = 0;
      switch (t.type) {
        case "rectangle":
          ({ x: c, y: l } = te(t, r));
          break;
        case "circle":
          ({ x: c, y: l } = ae(t, r));
          break;
        case "strip":
          ({ x: c, y: l } = he(t, r));
          break;
      }
      if (s >= c && s <= c + a && i >= l && i <= l + u)
        return r;
    }
  }
  return null;
};
function mn(n = "") {
  return n.split("/").pop();
}
const Rt = (n) => {
  const t = [];
  for (const e of n)
    t.push(
      new Promise((s, i) => {
        const o = new Image();
        o.src = e, o.onload = function() {
          createImageBitmap(o).then((r) => {
            s({
              name: mn(e),
              uri: o,
              width: o.width,
              height: o.height,
              bitmap: r
            });
          }).catch(i);
        }, o.onerror = function() {
          i(new Error(`load img error: ${e}`));
        };
      })
    );
  return Promise.all(t);
}, gn = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAYFBMVEUAAACMxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf+Mxf9itJhsAAAAH3RSTlMAliLdaXiHWuv7u9LIMhbvsqaR9d69cGJPTCkeDGZBhT6b/AAAAPxJREFUWMPt01lOxDAQhOEaExKbOM4y+wJ9/1sSYIRGwmHEuFu81H+A76Gkws/cbmx7+UN9O+4c7neI8lDxcAc+b+Xhtmf8UuelIN9hMddLUf3y4lEKi1iokeIa5GvL6RbZkiiUkOuoQb8ZTT3XkP4f+lKNL3MNag26xvFDG6sLkK5HecZKg16hup4nYRIbWiZsrOgNghUdIFa0kCZNmjRp0qRJkyZNmjRp0qRJkyZNeoFOTqGUpXXK0P5JKf9NBzEqwItRHlGMipjEqAkno7HDCdib2GGPOfdaf6ZjflmVw206NHJ5DblHrkGDHpCrW5fL6w55eyjcxA+38juKQFJKYbX+lQAAAABJRU5ErkJggg==", xn = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAAAXVBMVEUAAACZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmIF5V4AAAAHnRSTlMALdIiM92pvPp3WuyQiDwnzvFMaQhhQxzHsm8UnIbSJbCXAAABTUlEQVRYw+3Zy26DMBCF4cHYxI0dbG4J5HLe/zGb0gYhNW5aBtTN/FtL32LkWQ19Lz8XqsIfqlRxzul1dY9F9fUL+LQDoHx31CH/ZUEfO68A7E4/ydoB10ALClfAaUqWO5iSFlYaVOmJ9zAnWtxFoadEe9iMGAWLfeIpwhOrA2LidwAZj86A5wOtUREzh2Ni1IpLK+yF/h+6bYrdmFqDVp9W0bTjek6x6bl1IY/Kv435NeiH5eDJoJl2iU9P+9zBkEW5Ba1hCci2oDNAaKGFFlpooYUWWmihhRZaaKGFFlpooYVO0tYws0maX4Ju8xVqZ7SFpg3SsImjBLsjHEWcaYMaRPKI7fpyG+EpWJjiq8AVw0MysHess3hUculyomxH9/LmdvhoHXqkbk1O89ahE7exmkvXcPSsAbHWrOqI4SmtK7CrdGI5BwdWbpjL7/6mZ3qtwG0OAAAAAElFTkSuQmCC", F = class F {
  static async load() {
    const [t] = await Rt([gn]);
    F.onSeat = t;
    const [e] = await Rt([xn]);
    F.unSeat = e;
  }
};
p(F, "onSeat"), p(F, "unSeat");
let st = F;
const P = b.getInstance(), Ot = 10;
function En(n) {
  return P.getGraphicGroups(lt);
}
function $(n, t, e, s = "alphabetic", i = 13) {
  n.font = `${E(i)}px Arial`, n.fillStyle = t, n.textAlign = e, n.textBaseline = s;
}
function bn(n, t) {
  const { x: e, y: s, w: i, h: o } = n;
  for (const r of t.values())
    if (!(e + i <= r.x || e >= r.x + r.w || s + o <= r.y || s >= r.y + r.h))
      return !0;
  return !1;
}
function Ct(n, t) {
  const { scale: e, offsetX: s, offsetY: i } = Y(), o = Jt().width / e, r = En(), a = -s / e, u = -i / e;
  let c = a + o - n;
  const l = 10;
  a > c && (c = n);
  for (let h = u; ; h += l)
    for (let f = a; f < c; f += l) {
      if (bn({ x: f, y: h, w: n, h: t }, r)) {
        f += n;
        continue;
      }
      return [f + Ot, h + Ot];
    }
}
let C = null, Q = null;
function xe(n) {
  Q = n, C = n.getBoundingClientRect();
}
function bt(n) {
  if (C) {
    const t = n.clientX, e = n.clientY;
    return t - 8 >= C.left && t + 8 <= C.right && e - 8 >= C.top && e + 8 <= C.bottom;
  }
  return !1;
}
const R = (n) => {
  const { offsetX: t, offsetY: e, scale: s } = Y();
  if (C && Q) {
    const i = (n.clientX - C.left) * (Q.width / C.width), o = (n.clientY - C.top) * (Q.height / C.height), r = (i - t) / s, a = (o - e) / s;
    return { mx: r, my: a };
  }
  return null;
};
function Mn(n, t) {
  const e = me(n);
  if (e) {
    const s = ge(n, e);
    if (s) {
      if (s.id === t.id) return;
      const i = P.getState("graphicMatrix"), o = t.group_by, r = s.group_by;
      He(t, s), o !== r && (i.groupElements[o] = Bt(i.groupElements[o], t.id, s.id), i.groupElements[r] = Bt(i.groupElements[r], s.id, t.id));
    }
  }
}
function wn(n, t, e, s, i) {
  const o = P.getState("currentDragEl");
  if (o) {
    const r = _(o.dX, o.dY);
    r[0] + s / 2 >= t && r[0] + s / 2 <= t + s && r[1] + i / 2 >= e && r[1] + i / 2 <= e + i && (n.strokeStyle = Ue, n.strokeRect(t, e, s, i));
  }
}
function Ee(n) {
  switch (n) {
    case "idle":
      return st.unSeat.bitmap;
    default:
      return st.onSeat.bitmap;
  }
}
function yn(n) {
  const t = P.getState("currentDragEl");
  if (t) {
    const e = Ee(t.status), [s, i] = _(t.dX, t.dY);
    n.drawImage(e, s, i, E(t.width), E(t.height)), be(n, t, s, i);
  }
}
function Yt(n, t, e, s, i, o) {
  const r = Ee(t.status);
  n.drawImage(r, e, s, i, o), wn(n, e, s, i, o), be(n, t, e, s);
}
function be(n, t, e, s) {
  const i = e + E(t.width / 2);
  $(n, We, "center", "alphabetic", t.baseFontSize), n.fillText(String(t.index), i, s + E(t.width * 0.3)), t.status === "occupy" ? ($(n, Tt, "center", "middle", t.nameFontSize), n.fillText(qe, i, s + E(t.height / 2 + 2))) : t.text && ($(n, Tt, "center", "middle", t.nameFontSize), n.fillText(t.text, i, s + E(t.height / 2 + 2)));
}
function Xt(n, t, e, s, i, o, r) {
  return {
    id: n,
    group_by: t.group_id,
    index: e,
    x: s,
    y: i,
    isDragging: !1,
    dX: 0,
    dY: 0,
    width: m,
    height: M,
    pos: o,
    text: r || Math.random().toString(36).substr(2, 2),
    status: "idle",
    baseFontSize: 13,
    nameFontSize: 10
  };
}
function Sn(n, t) {
  const e = P.getState("graphicMatrix");
  switch (Reflect.deleteProperty(e.elements, t.id), e.groupElements[n.group_id] = e.groupElements[n.group_id].filter((s) => s !== t.id), n.type) {
    case "circle":
      oe(n.group_id);
      break;
    case "rectangle":
      ne(n.group_id);
      break;
    case "strip":
      pe(n.group_id);
      break;
  }
}
function Gn() {
  P.subscribe("cvs", xe);
}
function vn() {
  P.unsubscribe("cvs", xe), Q = null, C = null;
}
const I = b.getInstance(), ht = 3, D = 0.2, tt = 1;
function xt() {
  let n = Y().scale;
  if (n <= D) return 1;
  if (n >= tt)
    return n = Math.min(n, ht), Math.round(n / tt * 100);
  const t = (n - D) / (tt - D) * 99 + 1;
  return Math.round(t);
}
function Cn(n) {
  if (n <= 1)
    return D;
  if (n >= 100) {
    const e = n / 100 * tt;
    return Math.min(e, ht);
  }
  return (n - 1) / 99 * (tt - D) + D;
}
function Yn(n) {
  let { offsetX: t, offsetY: e, scale: s } = Y();
  const i = 1.09, o = s, r = n.offsetX, a = n.offsetY;
  if (n.deltaY < 0) {
    if (s > ht) return;
    s *= i;
  } else {
    if (s < D) return;
    s /= i;
  }
  const u = s / o;
  I.updateState("containerTransformState", {
    ...I.getState("containerTransformState"),
    scale: s,
    offsetX: r - (r - t) * u,
    offsetY: a - (a - e) * u
  });
}
class Xn {
  constructor(t, e, s) {
    p(this, "canvas", null);
    p(this, "ctx", null);
    p(this, "dragging", !1);
    p(this, "transformState");
    p(this, "onTransformStateChangeHandler");
    this.canvas = s.cvs, this.ctx = s.pen, this.resize(t, e), this.transformState = I.getState("containerTransformState"), this.onTransformStateChangeHandler = this.onTransformStateChange.bind(this), I.subscribe("containerTransformState", this.onTransformStateChangeHandler), this.addEvents();
  }
  onTransformStateChange(t) {
    this.transformState = t;
  }
  resize(t, e) {
    !this.canvas || !this.ctx || (console.log("Size Change", t, e), this.canvas.width = t, this.canvas.height = e, I.updateState("cvs", this.canvas));
  }
  addEvents() {
    this.canvas && (x.subscribe("mousedown", (t) => {
      t.button === 1 && this.resetTransform();
    }), x.subscribe("mousedown_dnh", (t) => {
      t.button === 0 && (this.dragging = !0, I.updateState("containerTransformState", {
        ...this.transformState,
        lastX: t.clientX,
        lastY: t.clientY
      }));
    }), x.subscribe("mousemove", (t) => {
      if (!this.dragging) return;
      if (!bt(t)) {
        this.dragging = !1;
        return;
      }
      const e = t.clientX - this.transformState.lastX, s = t.clientY - this.transformState.lastY;
      let i = this.transformState.offsetX + e, o = this.transformState.offsetY + s;
      I.updateState("containerTransformState", {
        ...this.transformState,
        lastX: t.clientX,
        lastY: t.clientY,
        offsetX: i,
        offsetY: o
      });
    }), x.subscribe("mouseup", () => {
      this.dragging = !1;
    }), x.subscribe("wheel", (t) => {
      t.preventDefault(), Yn(t);
    }));
  }
  resetTransform() {
    ct({ scale: 1, offsetX: 0, offsetY: 0 });
  }
  clear() {
    I.unsubscribe("containerTransformState", this.onTransformStateChangeHandler);
  }
}
const v = class v {
  constructor() {
    p(this, "menuElement", null);
    p(this, "handleDocumentClick");
    p(this, "currentContextMenuGroup", null);
    p(this, "currentContextMenuElement", null);
    p(this, "instances", null);
    p(this, "contextMenuItems", null);
    this.handleDocumentClick = this.hide.bind(this);
  }
  static getInstance() {
    return v.instance || (v.instance = new v()), v.instance;
  }
  init(t) {
    this.menuElement || (this.instances = t, this.menuElement = this.createMenuElement(), document.body.appendChild(this.menuElement), this.bindGlobalEvents());
  }
  createMenuElement() {
    const t = document.createElement("ul");
    return t.className = "z-custom-context-menu", t;
  }
  populateMenuItems(t, e) {
    const s = e || this.menuElement;
    s && (s.innerHTML = "", t.forEach((i) => {
      const o = document.createElement("li");
      o.style.position = "relative";
      const r = document.createElement("span");
      switch (r.textContent = i.label || "", o.appendChild(r), i.type) {
        case "default":
          o.className = "z-custom-context-menu-item";
          const a = (u) => {
            i.onClick && i.onClick();
          };
          o.addEventListener("click", a, { once: !0 });
          break;
        case "divider":
          o.className = "z-custom-context-menu-item-divider";
          break;
      }
      if (i.children && i.children.length > 0) {
        o.classList.add("z-custom-context-sub-menu");
        const a = document.createElement("span");
        a.className = "z-custom-context-sub-menu-arrow", o.appendChild(a);
        const u = document.createElement("ul");
        u.className = "z-custom-context-submenu", Object.assign(u.style, {
          top: "0",
          left: "100%"
        }), this.populateMenuItems(i.children, u), o.appendChild(u);
      }
      s.appendChild(o);
    }));
  }
  show(t, e, s, i, o) {
    var r;
    !this.menuElement || !this.contextMenuItems || (this.currentContextMenuGroup = i, this.currentContextMenuElement = o, this.populateMenuItems(((r = this.contextMenuItems) == null ? void 0 : r[s]) || []), this.menuElement && (this.menuElement.style.left = `${t}px`, this.menuElement.style.top = `${e}px`, setTimeout(() => {
      this.menuElement.classList.add("show");
    }, this.menuElement.classList.contains("show") ? 150 : 0), this.hide(null)));
  }
  hide(t) {
    var s, i;
    const e = t == null ? void 0 : t.target;
    e instanceof HTMLElement && (e.classList.contains("z-custom-context-sub-menu") || (s = e.parentElement) != null && s.classList.contains("z-custom-context-sub-menu")) || (i = this.menuElement) == null || i.classList.remove("show");
  }
  generateContextMenuItem(t) {
    const e = (s, i = 1) => t.contextMenuOperateFunc.increaseElement.call(this.instances.Graphic, v.instance.currentContextMenuGroup, v.instance.currentContextMenuElement, s, i);
    this.contextMenuItems = {
      group: [
        {
          label: "区域编辑",
          type: "default",
          onClick: () => {
          }
        },
        {
          label: "导出图片",
          type: "default",
          onClick: () => t.contextMenuOperateFunc.exportToPng.call(this.instances.Graphic, v.instance.currentContextMenuGroup)
        },
        { type: "divider" },
        {
          label: "删除区域",
          type: "default",
          onClick: () => t.contextMenuOperateFunc.delGroup.call(this.instances.Graphic, v.instance.currentContextMenuGroup)
        }
      ],
      element: [
        { label: "编辑人员", type: "default", onClick: () => console.log("编辑人员") },
        {
          label: "占位",
          type: "default",
          onClick: () => t.contextMenuOperateFunc.setElementStatus.call(this.instances.Graphic, v.instance.currentContextMenuElement, "occupy")
        },
        { label: "删除人员", type: "default", onClick: () => console.log("删除人员") },
        {
          label: "向前插入",
          type: "default",
          children: [
            {
              label: "插入一个",
              type: "default",
              onClick: () => e("before", 1)
            },
            {
              label: "任意数量",
              type: "default",
              onClick: () => e("before", 2)
            }
          ]
        },
        {
          label: "向后插入",
          type: "default",
          children: [
            {
              label: "插入一个",
              type: "default",
              onClick: () => e("after", 1)
            },
            {
              label: "任意数量",
              type: "default",
              onClick: () => e("after", 2)
            }
          ]
        },
        { type: "divider" },
        {
          label: "删除座位",
          type: "default",
          onClick: () => t.contextMenuOperateFunc.decreaseElement.call(this.instances.Graphic, v.instance.currentContextMenuGroup, v.instance.currentContextMenuElement)
        }
      ]
    };
  }
  bindGlobalEvents() {
    document.addEventListener("click", this.handleDocumentClick);
  }
  destroy() {
    this.menuElement && (this.menuElement.remove(), this.menuElement = null), this.contextMenuItems = null, document.removeEventListener("click", this.handleDocumentClick);
  }
};
p(v, "instance");
let ut = v;
const Dt = ut.getInstance();
function An(n, t, e) {
  if (n.button === 2) {
    if (e) {
      Dt.show(n.clientX, n.clientY, "element", t, e);
      return;
    }
    t && Dt.show(n.clientX, n.clientY, "group", t, e);
  }
}
const Me = (n) => {
  const t = me(n);
  let e = null;
  t ? (e = ge(n, t), e ? x.publish("mousedown_element", n, e, t) : x.publish("mousedown_group", n, t.group_id)) : x.publish("mousedown_dnh", n), An(n, t, e), x.publish("mousedown", n);
}, we = (n) => {
  dn(n), x.publish("mousemove", n);
}, ye = (n) => {
  x.publish("mouseup", n);
}, Se = (n) => {
  x.publish("wheel", n), x.publish("calculateProportion");
};
function In(n) {
  n.addEventListener("mousedown", Me), n.addEventListener("mousemove", we), n.addEventListener("mouseup", ye), n.addEventListener("wheel", Se, { passive: !1 });
}
function Bn(n) {
  n.removeEventListener("mousedown", Me), n.removeEventListener("mousemove", we), n.removeEventListener("mouseup", ye), n.removeEventListener("wheel", Se), x.clearAll();
}
const Pt = b.getInstance(), Zt = "rectangle";
class _n {
  constructor() {
    p(this, "graphicData");
    this.graphicData = Pt.getState("graphicMatrix");
  }
  addMatrixGraphic(t, e, s, i = []) {
    const o = this.graphicData, r = U(), a = Je(r, e, s), [u, c] = jt(e, s), [l, h] = Ct(u, c), f = {
      group_id: r,
      group_name: t,
      z_index: 0,
      x: l,
      y: h,
      w: u,
      h: c,
      hover: !1,
      size: e * s,
      type: Zt,
      baseFontSize: 13
    };
    o.groups[Zt][r] = f, o.elements = {
      ...o.elements,
      ...a
    }, o.groupElements[r] = Object.keys(a), Pt.updateState("graphicMatrix", o);
  }
  clear() {
  }
}
const Et = b.getInstance();
function Tn(n) {
  let t = 1 / 0, e = 1 / 0, s = -1 / 0, i = -1 / 0;
  for (const a of n) {
    let u = a.x, c = a.y, l = a.w, h = a.h;
    t = Math.min(t, u), e = Math.min(e, c), s = Math.max(s, u + l), i = Math.max(i, c + h);
  }
  const o = s - t, r = i - e;
  return {
    minX: t,
    minY: e,
    maxX: s,
    maxY: i,
    width: o,
    height: r,
    offsetX: -t,
    offsetY: -e
  };
}
function Ge(n = "graphic-export", t) {
  let e = [];
  if (t) {
    const f = j(Et.getGraphicGroupsById(t));
    f && (e = [f]);
  } else
    e = j(Et.getGraphicGroupsArr());
  const { width: s, height: i, offsetX: o, offsetY: r } = Tn(e), a = document.createElement("canvas");
  a.width = s + 12, a.height = i + 12;
  const u = a.getContext("2d");
  if (!u) return;
  u.fillStyle = "#fff", u.fillRect(0, 0, a.width, a.height), u.save(), u.translate(o, r);
  const c = Y().scale;
  for (const f of e.sort((g, S) => g.z_index - S.z_index)) {
    const [g, S] = ze(f.x, f.y);
    switch (f.x = g + 6, f.y = S + 6, f.w = f.w / c, f.h = f.h / c, f.baseFontSize = f.baseFontSize / c, f.type) {
      case "rectangle":
        Qt(u, f, !1);
        break;
      case "circle":
        f.radius = f.radius / c, re(u, f);
        break;
      case "strip":
        ue(u, f, !1);
        break;
    }
    const T = j(Et.getGraphicGroupElementsById(f.group_id));
    for (const w of T) {
      const ft = w.x / c, pt = w.y / c;
      switch (w.x = ft, w.y = pt, w.baseFontSize = w.baseFontSize / c, w.nameFontSize = w.nameFontSize / c, w.width = w.width / c, w.height = w.height / c, f.type) {
        case "rectangle":
          ee(u, w, f);
          break;
        case "circle":
          ce(u, w, f);
          break;
        case "strip":
          fe(u, w, f);
          break;
      }
    }
  }
  u.restore();
  const l = a.toDataURL("image/png"), h = document.createElement("a");
  h.href = l, h.download = `${n}.png`, h.click();
}
const X = b.getInstance();
class kn {
  constructor(t) {
    p(this, "canvas", null);
    p(this, "ctx", null);
    p(this, "lastMousePos", null);
    p(this, "currentGroup", null);
    p(this, "dragging", !1);
    p(this, "currentElement", null);
    p(this, "elDragging", !1);
    this.canvas = t.cvs, this.ctx = t.pen, this.addGroupEvents(), this.addElementEvents();
  }
  addGroupEvents() {
    this.canvas && (x.subscribe("mousedown_group", (t, e) => {
      if (t.button === 0) {
        const s = X.getGraphicGroupsById(e);
        if (s) {
          X.updateState("highlightElements", !1), de(/* @__PURE__ */ new Set([s.group_id]));
          const i = R(t);
          i && (this.lastMousePos = { x: i.mx, y: i.my }, this.currentGroup = s, this.currentGroup.z_index = this.currentGroup.z_index + 1, this.currentGroup.hover = !0, this.dragging = !0);
        }
      }
    }), x.subscribe("mousemove", (t) => {
      if (!this.dragging || !this.currentGroup) return;
      if (!bt(t)) {
        this.currentGroup.hover = !1, this.stopDraggingHandler(t, !0);
        return;
      }
      const e = R(t), s = this.lastMousePos;
      if (s && e) {
        const i = e.mx - s.x, o = e.my - s.y;
        this.currentGroup.x += i, this.currentGroup.y += o, this.lastMousePos = { x: e.mx, y: e.my };
      }
    }), x.subscribe("mouseup", this.stopDraggingHandler.bind(this)));
  }
  addElementEvents() {
    this.canvas && (x.subscribe("mousedown_element", (t, e) => {
      if (t.button === 0) {
        const s = R(t);
        s && (this.lastMousePos = { x: s.mx, y: s.my }, this.currentElement = e, e.dX = s.mx - e.width / 2, e.dY = s.my - e.height / 2, e.isDragging = !0, this.elDragging = !0, X.updateState("currentDragEl", e));
      }
    }), x.subscribe("mousemove", (t) => {
      if (!this.elDragging || !this.currentElement) return;
      if (!bt(t)) {
        this.elementStopDragging(t);
        return;
      }
      const e = R(t), s = this.lastMousePos;
      if (s && e) {
        const i = e.mx - s.x, o = e.my - s.y;
        this.currentElement.dX += i, this.currentElement.dY += o, this.lastMousePos = { x: e.mx, y: e.my };
      }
    }), x.subscribe("mouseup", this.elementStopDragging.bind(this)));
  }
  elementStopDragging(t) {
    this.elDragging && this.currentElement && (this.currentElement.isDragging = !1, Mn(t, this.currentElement), this.elDragging = !1, this.currentElement = null, X.updateState("currentDragEl", null));
  }
  stopDraggingHandler(t, e = !1) {
    this.lastMousePos = null, this.dragging && (e ? setTimeout(() => {
      X.updateState("highlightElements", !0);
    }, 500) : X.updateState("highlightElements", !0), this.dragging = !1, this.currentGroup = null, ot(X));
  }
  // contextMenu
  delGroup(t) {
    let e = !0;
    const s = X.getState("graphicMatrix");
    if (e = Reflect.deleteProperty(s.groups[t.type], t.group_id), !e || (e = Reflect.deleteProperty(s.groupElements, t.group_id), !e)) return e;
    for (const [i, o] of Object.entries(s.elements))
      if (o.group_by === t.group_id && (e = Reflect.deleteProperty(s.elements, i), !e))
        return e;
    return X.updateState("graphicMatrix", s), e;
  }
  exportToPng(t) {
    Ge(t.group_name, t.group_id);
  }
  increaseElement(t, e, s, i) {
    switch (t.type) {
      case "circle":
        on(t, e, s, i);
        break;
      case "strip":
        hn(t, e, s, i);
        break;
      case "rectangle":
        je(t, e, s, i);
        break;
    }
  }
  decreaseElement(t, e) {
    Sn(t, e), t.size === 1 && this.delGroup(t);
  }
  setElementStatus(t, e) {
    const s = X.getGraphicGroupElementById(t.id);
    s && (s.status = e);
  }
  clear() {
  }
}
const Lt = b.getInstance(), Ft = "circle";
class zn {
  constructor() {
    p(this, "graphicData");
    this.graphicData = Lt.getState("graphicMatrix");
  }
  async addCircleGraphic(t, e) {
    const s = this.graphicData, i = U(), { radius: o, w: r, h: a } = se(e), [u, c] = Ct(r, a), l = {
      group_id: i,
      group_name: t,
      z_index: 0,
      x: u,
      y: c,
      w: r,
      h: a,
      hover: !1,
      size: e,
      type: Ft,
      radius: o,
      baseFontSize: 13
    }, h = sn(l);
    s.groups[Ft][i] = l, s.elements = {
      ...s.elements,
      ...h
    }, s.groupElements[i] = Object.keys(h), Lt.updateState("graphicMatrix", s);
  }
  clear() {
  }
}
const Ht = b.getInstance(), $t = "strip";
class Rn {
  constructor() {
    p(this, "graphicData");
    this.graphicData = Ht.getState("graphicMatrix");
  }
  async addStripGraphic(t, e, s) {
    const i = this.graphicData, o = U(), [r, a] = le(e, s), [u, c] = Ct(r, a), l = {
      group_id: o,
      group_name: t,
      z_index: 0,
      x: u,
      y: c,
      w: r,
      h: a,
      hover: !1,
      size: e * 2 + s * 2,
      type: $t,
      baseFontSize: 13
    }, h = an(o, e, s);
    i.groups[$t][o] = l, i.elements = {
      ...i.elements,
      ...h
    }, i.groupElements[o] = Object.keys(h), Ht.updateState("graphicMatrix", i);
  }
  clear() {
  }
}
const Nt = b.getInstance();
class On extends kn {
  constructor(e) {
    super(e);
    p(this, "canvas", null);
    p(this, "ctx", null);
    p(this, "matrix");
    p(this, "circle");
    p(this, "strip");
    this.canvas = e.cvs, this.ctx = e.pen, this.matrix = new _n(), this.circle = new zn(), this.strip = new Rn();
  }
  draw() {
    if (!this.ctx) return;
    const e = this.ctx, s = Nt.getGraphicGroupsArr();
    for (const i of s.sort((o, r) => o.z_index - r.z_index)) {
      switch (i.type) {
        case "rectangle":
          Qt(e, i);
          break;
        case "circle":
          re(e, i);
          break;
        case "strip":
          ue(e, i);
          break;
      }
      const o = Nt.getGraphicGroupElementsById(i.group_id);
      for (const r of o)
        switch (i.type) {
          case "rectangle":
            ee(e, r, i);
            break;
          case "circle":
            ce(e, r, i);
            break;
          case "strip":
            fe(e, r, i);
            break;
        }
    }
    yn(this.ctx);
  }
  clear() {
    super.clear(), this.matrix.clear(), this.circle.clear(), this.strip.clear();
  }
  operate() {
    return {
      addMatrixGraphic: this.matrix.addMatrixGraphic.bind(this.matrix),
      addCircleGraphic: this.circle.addCircleGraphic.bind(this.circle),
      addStripGraphic: this.strip.addStripGraphic.bind(this.circle)
    };
  }
  contextMenuOperate() {
    return {
      delGroup: super.delGroup,
      exportToPng: super.exportToPng,
      increaseElement: super.increaseElement,
      decreaseElement: super.decreaseElement,
      setElementStatus: super.setElementStatus
    };
  }
}
function Dn(n, t) {
  const { graphicOperateFunc: e, contextMenuOperateFunc: s } = Pn(n, t);
  return {
    graphicOperateFunc: e,
    contextMenuOperateFunc: s,
    getData: () => j(b.getInstance().getState("graphicMatrix")),
    saveToImages: Ge
  };
}
function Pn(n, t) {
  return t.Graphic = new On(n), {
    graphicOperateFunc: t.Graphic.operate.call(t.Graphic),
    contextMenuOperateFunc: t.Graphic.contextMenuOperate.call(t.Graphic)
  };
}
const k = class k {
  constructor() {
    p(this, "toolElement", null);
    p(this, "handleToolClickBind");
    p(this, "onTransformStateChangeHandlerBind");
    this.handleToolClickBind = this.handleToolClick.bind(this), this.onTransformStateChangeHandlerBind = this.onTransformStateChangeHandler.bind(this);
  }
  static getInstance() {
    return k.instance || (k.instance = new k()), k.instance;
  }
  onTransformStateChangeHandler() {
    const t = document.querySelector(".zx-zoom-scale-proportion");
    t && (t.textContent = xt() + "%");
  }
  scaleHandler(t) {
    if (t === "situ") {
      ct({ scale: 1, offsetX: 0, offsetY: 0 });
      return;
    }
    const e = Jt();
    if (!e) return;
    let { offsetX: s, offsetY: i, scale: o } = Y();
    const r = e.width / 2, a = e.height / 2;
    if (t === "reset") {
      const u = 1 / o, c = r - (r - s) * u, l = a - (a - i) * u;
      ct({ offsetX: c, offsetY: l, scale: 1 });
    } else {
      const u = xt(), c = t === "up" ? u + 50 : u - 50;
      if (c > ht * 100 || c < 0) return;
      const l = Cn(c), h = l / o, f = r - (r - s) * h, g = a - (a - i) * h;
      ct({ offsetX: f, offsetY: g, scale: l });
    }
  }
  handleToolClick(t) {
    const e = t.target;
    if (e)
      switch (e.className) {
        case "zx-zoom-in-situ":
          this.scaleHandler("situ");
          break;
        case "zx-zoom-scale-up":
          this.scaleHandler("up");
          break;
        case "zx-zoom-scale-proportion":
          this.scaleHandler("reset");
          break;
        case "zx-zoom-scale-down":
          this.scaleHandler("down");
          break;
      }
  }
  createToolElement() {
    const t = document.createElement("div"), e = document.createElement("div");
    e.className = "zx-zoom-in-situ";
    const s = document.createElement("div");
    s.className = "zx-zoom-scale-up";
    const i = document.createElement("div");
    i.className = "zx-zoom-scale-proportion", i.textContent = xt() + "%";
    const o = document.createElement("div");
    return o.className = "zx-zoom-scale-down", t.appendChild(e), t.appendChild(s), t.appendChild(i), t.appendChild(o), t.className = "z-canvas-tool-zoom", t;
  }
  init() {
    var e;
    if (this.toolElement) return;
    this.toolElement = this.createToolElement();
    const t = (e = document.querySelector("#zx-drag-canvas")) == null ? void 0 : e.parentElement;
    t && (t.style.position = "relative", t.appendChild(this.toolElement)), this.bindGlobalEvents(), x.subscribe("calculateProportion", this.onTransformStateChangeHandlerBind);
  }
  bindGlobalEvents() {
    this.toolElement && this.toolElement.addEventListener("click", this.handleToolClickBind);
  }
  destroy() {
    this.toolElement && (this.toolElement.removeEventListener("click", this.handleToolClickBind), this.toolElement.remove(), this.toolElement = null), x.unsubscribe("calculateProportion", this.onTransformStateChangeHandlerBind);
  }
};
p(k, "instance");
let Mt = k;
const Zn = b.getInstance(), wt = ut.getInstance(), ve = Mt.getInstance(), G = {
  cvs: null,
  pen: null
};
let O = null, A = null;
const it = {
  Test: null,
  Graphic: null
};
function Ln(n) {
  O || (O = new Pe(n, G), O.run(it));
}
function Hn(n, t) {
  var e;
  (e = A == null ? void 0 : A.resize) == null || e.call(A, n, t);
}
async function $n(n, t = 30) {
  G.cvs = document.createElement("canvas"), G.cvs.setAttribute("id", "zx-drag-canvas"), G.cvs.style.display = "block", G.cvs.style.backgroundColor = $e, G.pen = G.cvs.getContext("2d"), Gn(), A = new Xn(n.clientWidth, n.clientHeight, G), n.appendChild(G.cvs), await st.load().catch(console.error);
  const e = Dn(G, it);
  return Ln(t), In(G.cvs), wt.init(it), wt.generateContextMenuItem(e), ve.init(), e;
}
function Nn() {
  var n;
  A == null || A.clear(), A = null, vn(), O == null || O.clear(), O = null;
  for (const t in it)
    (n = it[t]) == null || n.clear();
  b.getInstance().destroy(), b.getInstance().reset(), Zn.unsubscribeAll(), Bn(G.cvs), wt.destroy(), ve.destroy(), G.cvs.remove(), G.cvs = null, G.pen = null;
}
export {
  Nn as exit,
  $n as init,
  Hn as resize,
  Fe as throttle
};
