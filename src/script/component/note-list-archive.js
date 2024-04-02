import Utils from "../utils.js";
import NotesApi from "../data/remote/note-api.js";

class NoteListArchive extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _gutter = 16;

  static get observedAttributes() {
    return ["column", "gutter"];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");

    this.fetchArchivedNotes(); // New line
    this.render();
  }

  async fetchArchivedNotes() {
    try {
      const archivedNotes = await NotesApi.getArchived();
      this.notes = archivedNotes;
      this.render(); // Render after data is available
    } catch (error) {
      // Handle errors
    }
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
      }
  
      .list-archive {
        display: block;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: ${this.gutter}px;
      }
    `;
  }

  set column(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;

    this._column = value;
  }

  get column() {
    return this._column;
  }

  set gutter(value) {
    const newValue = Number(value);
    if (!Utils.isValidInteger(newValue)) return;

    this._gutter = value;
  }

  get gutter() {
    return this._gutter;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);

    console.log("Archived notes:", this.notes?.length);

    if (this.notes && this.notes.length > 0) {
      this._shadowRoot.innerHTML += `
        <h2>Note Arsip</h2>
        <div class="list-archive">
          <slot></slot>
        </div>
        <br>
      `;
    } else {
      // Optional: Display a message if there are no archived notes
      this._shadowRoot.innerHTML += `
        <h2>Tidak ada catatan yang diarsipkan.</h2>
      `;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "column":
        this.column = newValue;
        break;
      case "gutter":
        this.gutter = newValue;
        break;
    }

    this.render();
  }
}

customElements.define("note-list-archive", NoteListArchive);
