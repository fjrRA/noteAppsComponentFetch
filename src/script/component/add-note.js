class AddNote extends HTMLElement {
  constructor() {
    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
  }
}

customElements.define("add-note", AddNote);
