const frag = document.createDocumentFragment();
const div = document.createElement("div");
for (let i = 0; i < 5; i++) {
  div.textContent = "Hello World "
  frag.appendChild(div);
}
container.appendChild(frag);