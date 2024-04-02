import NotesApi from "../data/remote/note-api.js";

class NoteArchive extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createAt: null,
    isArchieved: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(value) {
    this._note = value;

    // Render ulang
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
      :host {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
        overflow: hidden;
      }

      .note-info {
        padding: 16px 24px;
      }

      .note-info__title h2 {
        font-weight: lighter;
      }

      .note-info__description p {
        display: -webkit-box;
        margin-top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5; /* number of lines to show */
      }

      .delete-button {
        background-color: #E72929;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 0 4px 0 4px;
        cursor: pointer;
        margin-top: 10px;
      }

      .archive-button {
        background-color:#e77229;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 0 4px 0 4px;
        cursor: pointer;
        margin-top: 10px;
        outline: 0;
      }
    `;
  }

  async _updateArchiveStatus(noteId, isArchived) {
    const BASE_URL = "https://notes-api.dicoding.dev/v2/";
    const url = `${BASE_URL}/notes/${noteId}/${isArchived ? "archive" : "unarchive"}`;
    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${isArchived ? "archive" : "unarchive"} note`,
        );
      }

      console.log(
        `Note ${isArchived ? "archived" : "unarchived"} successfully!`,
      );
    } catch (error) {
      console.error(
        `Error ${isArchived ? "archiving" : "unarchiving"} note:`,
        error,
      );
      alert(
        `Gagal ${isArchived ? "mengarsipkan" : "membatalkan arsip"} catatan.`,
      );
    }
    const archiveButton = this._shadowRoot.querySelector(".archive-button");
    archiveButton.textContent = isArchived
      ? "Keluarkan Arsip"
      : "Masukkan Arsip";
    this._shadowRoot
      .querySelector(".card")
      .classList.toggle("archived", isArchived); // Toggle class

    // **Dispatch custom event for parent to handle list updates**
    this.dispatchEvent(
      new CustomEvent("note-archived", {
        detail: { noteId, isArchived },
      }),
    );
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="note-info">
          <div class="note-info__title">
            <h2>${this._note.title}</h2>
          </div>
          <div class="note-info__description">
            <p>${this._note.body}</p>
          </div>
        </div>
        <button class="delete-button" type="submit">Hapus Catatan</button>
        <button class="archive-button" type="button">Batalkan Arsip</button>
      </div>
    `;

    const deleteButton = this._shadowRoot.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm("Hapus Catatan Ini?");
      if (confirmDelete) {
        try {
          await NotesApi.deleteNote(this._note.id);
          // Visually remove the note from the DOM
          this.remove();
        } catch (error) {
          console.error("Error deleting note:", error);
          alert("Gagal menghapus catatan.");
        }
      }
    });

    const archiveButton = this._shadowRoot.querySelector(".archive-button");
    archiveButton.addEventListener("click", async () => {
      const newIsArchived = !this._note.isArchived;
      await this._updateArchiveStatus(this._note.id, newIsArchived);
      this._note.isArchived = newIsArchived; // Update local state
      this.render(); // Re-render with updated archive status
    });
  }
}

customElements.define("note-archive", NoteArchive);
