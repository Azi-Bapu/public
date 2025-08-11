# JavaScript & Browser Concepts — Deep Dive

This document offers an in-depth breakdown of critical JavaScript and browser runtime concepts, focused on **how they work**, **why they matter**, **where they’re used**, **pitfalls**, and **best practices**.

---

## 1. Task Queue / Microtask Queue

### 🔹 What It Is
JavaScript is single-threaded and runs code in a non-blocking, asynchronous manner using a concurrency model based on the **event loop** and **task queues**.

- **Macrotask Queue (Task Queue)** includes: `setTimeout`, `setInterval`, I/O, UI events, `setImmediate` (Node.js)
- **Microtask Queue** includes: `Promise.then`, `queueMicrotask`, `MutationObserver`

### 🔹 How It Works
When a task (e.g., a click or timeout) completes, the callback is added to the **macrotask queue**. However, **before the event loop picks the next macrotask**, it checks and executes all pending **microtasks**.

```js
console.log("start");
setTimeout(() => console.log("macro"), 0);
Promise.resolve().then(() => console.log("micro"));
console.log("end");
// Output: start → end → micro → macro
```

### 🔹 Use Cases
- Prioritizing logic after the current synchronous execution but before the next async cycle.
- Framework internals (React, Vue) rely heavily on microtasks for scheduling DOM updates.

### 🔹 Best Practices
- Avoid long microtask chains — can block rendering.
- Understand task timing to prevent UI glitches.

---

## 2. Event Loop

### 🔹 What It Is
The **event loop** is the orchestrator that pulls tasks from the queue and pushes them to the call stack.

### 🔹 How It Works
1. Executes the global code.
2. Picks tasks from the **task queue**.
3. After each task, clears **microtask queue**.
4. Triggers rendering when needed.

```text
Call Stack ↓
 └── Main Script → Microtasks → Render → Task Queue → Repeat
```

### 🔹 Why It Matters
- Prevents blocking UI.
- Enables async features (fetch, timers, etc).

### 🔹 Pitfalls
- Blocking JS (while loops, sync XHR) freeze the loop.

---

## 3. Memory Management

### 🔹 What It Is
Refers to how JS allocates memory when you create variables, objects, etc., and how it reclaims it.

### 🔹 Phases
1. **Allocation**: `let user = { name: "Emmanuel" }`
2. **Use**: Read/write operations.
3. **Release**: Unused objects are garbage collected.

### 🔹 Tools
- Chrome DevTools → Memory tab
- Snapshots, heap profiler

### 🔹 Practices
- Nullify large unused references.
- Avoid global variables.
- Minimize closure leaks.

---

## 4. Garbage Collection

### 🔹 What It Is
A built-in engine process that frees memory used by objects no longer in use.

### 🔹 Algorithms
- **Mark-and-sweep**: Root → reachable objects are marked. Unmarked are removed.
- **Reference Counting**: Removed if no references remain.

### 🔹 Pitfalls
- Cyclic references (rare issue in modern engines).
- Closures can trap memory.

```js
function create() {
  let large = new Array(1000000);
  return () => console.log(large.length);
}
```

---

## 5. Variable Masking

### 🔹 What It Is
Occurs when a variable in a closer scope has the same name as one in an outer scope, hiding the outer one.

```js
let a = "outer";
function test() {
  let a = "inner";
  console.log(a); // "inner"
}
```

### 🔹 Implication
Can cause confusion or bugs.

### 🔹 Practice
Avoid name conflicts; use descriptive naming.

---

## 6. Race Conditions

### 🔹 What It Is
Two or more operations attempt to modify or access shared data and the result depends on timing.

### 🔹 Example
```js
let user;
fetch("/api/user").then(res => user = res);
console.log(user); // undefined
```

### 🔹 Solution
Use async/await or proper chaining.

---

## 7. Event Bubbling & Capturing

### 🔹 What It Is
Phases of event propagation:
- **Capture phase**: Document → Target
- **Bubble phase**: Target → Document

### 🔹 Uses
- Use `.stopPropagation()` to block.
- Detect where in the phase you’re acting.

```js
el.addEventListener('click', handler, true); // capture
el.addEventListener('click', handler, false); // bubble
```

---

## 8. Event Delegation

### 🔹 What It Is
Attach one listener to a parent element to handle events from children.

```js
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") console.log(e.target.textContent);
});
```

### 🔹 Benefit
- Fewer listeners.
- Dynamically handle added children.

---

## 9. MutationObserver

### 🔹 What It Is
API to watch changes to the DOM.

```js
const observer = new MutationObserver((mutations) => console.log(mutations));
observer.observe(document.body, { childList: true, subtree: true });
```

### 🔹 Use Cases
- Reactivity in frameworks.
- Accessibility, analytics tracking.

---

## 10. Reflow vs Repaint vs Compositing

### 🔹 Definitions
- **Reflow**: Geometry/layout change.
- **Repaint**: Visual styling (color, shadow).
- **Compositing**: GPU combines layers.

### 🔹 Cost
Reflow > Repaint > Composite

### 🔹 Optimize
Avoid frequent layout access after writes.

---

## 11. Layout Thrashing

### 🔹 What It Is
Repeated alternating reads/writes to layout triggers multiple reflows.

```js
// BAD
for (let el of items) {
  el.style.width = el.offsetWidth + "px";
}
```

### 🔹 Fix
Batch reads and writes separately.

---

## 12. Batching DOM Updates

### 🔹 What It Is
Minimize DOM access and group changes.

### 🔹 Example
```js
const fragment = document.createDocumentFragment();
for (...) {
  const node = document.createElement("li");
  fragment.appendChild(node);
}
ul.appendChild(fragment);
```

---

## 13. requestAnimationFrame()

### 🔹 What It Is
Schedules animation code right before the next repaint.

```js
function animate(time) {
  updateFrame(time);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 🔹 Use Case
Smooth animation synced to 60Hz refresh.

---

## 14. Tree Shaking

### 🔹 What It Is
Eliminates unused exports during bundling.

```js
// only "add" will be bundled
import { add } from "./math.js";
```

### 🔹 Tools
Webpack, Rollup, esbuild (with ESM).

---

## 15. Minification / Compression

- **Minification**: Removes whitespace, comments. → e.g., Terser.
- **Compression**: Reduces transfer size via algorithms (e.g., gzip, brotli).

```js
// Before
function sum(a, b) { return a + b; }
// After
function a(b,c){return b+c}
```

---

## 16. Efficient Looping Techniques

### 🔹 Recommended
- `for...of` over arrays
- `map`, `filter`, `reduce` for transformations

### 🔹 Avoid
- `for...in` on arrays (meant for objects)
- Repeated DOM access in loops

---

## 17. Avoiding Memory Leaks

### 🔹 Common Sources
- Unremoved listeners
- Detached DOM still referenced
- Closures retaining large objects

### 🔹 Prevent
- Use `WeakMap`, `WeakRef`
- Remove listeners on unmount
- Nullify objects

---

## 18. Modules (ESM / CommonJS)

### 🔹 ESM
```js
export function greet() {}
import { greet } from "./mod.js";
```

### 🔹 CommonJS (Node)
```js
module.exports = greet;
const greet = require("./mod");
```

---

## 19. Environment Variables

### 🔹 What It Is
Store secrets and config in `.env` files.

```
API_KEY=12345
NODE_ENV=production
```

- Load via `dotenv` (Node)
- Use `.env.example`
- Add `.env` to `.gitignore`

---

## 20. Immutability & Pure Functions

- **Immutability**: Avoid changing state.
- **Pure Function**: Same input → same output, no side effects.

```js
// Pure
const double = n => n * 2;
```

---

## 21. `this` Keyword

| Context        | `this` Refers To         |
|----------------|--------------------------|
| Method         | Object                    |
| Arrow Function | Lexical Parent           |
| Event Listener | DOM Element              |
| Global         | `window` / `global`      |
| Class          | Class Instance           |

---

## 22. Securing API Keys

### 🔹 Best Practices
- NEVER expose secret keys in frontend
- Use backend proxy or serverless functions
- Restrict via domains/IP/rate limits
- Rotate keys regularly

```js
// Serverless call
GET /api/weather → calls 3rd party API securely
```

---

# ✅ End of Document