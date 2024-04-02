import Utils from "../utils.js";
import NotesApi from "../data/remote/note-api.js";

const home = () => {
  // List variables
  const searchFormElement = document.querySelector("#searchForm");
  const addNoteFormElement = document.querySelector("#addNoteForm");
  const noteListContainerElement = document.querySelector("#noteListContainer");
  const noteLoadingElement =
    noteListContainerElement.querySelector(".search-loading");
  const noteSearchErrorElement =
    noteListContainerElement.querySelector("note-search-error");
  const noteListElement = noteListContainerElement.querySelector("note-list");
  const noteListArchiveElement =
    noteListContainerElement.querySelector("note-list-archive");

  let notesData = [];

  // Add note
  addNoteFormElement.addEventListener("submit", (event) => {
    event.preventDefault();

    const newNoteName = document.querySelector("#newNoteName").value.trim();
    const newNoteDescription = document
      .querySelector("#newNoteDescription")
      .value.trim();

    const noteValidation = document.getElementById("noteNameValidation");

    if (newNoteName === "") {
      noteValidation.textContent = "Judul harus diisi ya.";
      noteValidation.style.color = "white";
      return;
    } else if (newNoteName.length < 3) {
      noteValidation.textContent = "Judul minimal tiga karakter.";
      noteValidation.style.color = "#E72929";
      noteValidation.style.fontWeight = "700";
      return;
    } else {
      noteValidation.textContent = "";
    }

    const newNote = {
      title: newNoteName,
      body: newNoteDescription,
    };

    // Send POST request to create a new note
    NotesApi.createNote(newNote)
      .then(() => {
        showNote();
        addNoteFormElement.reset();
      })
      .catch((error) => {
        console.error("Error adding note:", error);
      });
  });

  // Searching
  const search = () => {
    const searchTerm = document.querySelector("#name").value.toLowerCase();
    showLoading();

    // Separate filtering for regular notes and archived notes
    const filteredRegularNotes = notesData
      .filter((note) => !note.isArchived) // Exclude archived notes
      .filter((note) => note.title.toLowerCase().includes(searchTerm));

    const filteredArchivedNotes = notesData
      .filter((note) => note.isArchived) // Include only archived notes
      .filter((note) => note.title.toLowerCase().includes(searchTerm));

    const allFilteredNotes = filteredRegularNotes.concat(filteredArchivedNotes);
    displayResult(allFilteredNotes);

    showNoteList();
  };

  const showNote = () => {
    showLoading();

    Promise.all([NotesApi.getAll(), NotesApi.getArchived()])
      .then(([allNotes, archivedNotes]) => {
        // Update notesData based on search term (if any)
        const searchTerm = document.querySelector("#name").value.toLowerCase();
        notesData = searchTerm ? [] : allNotes.concat(archivedNotes); // Combine only if no search term

        displayResult(notesData);
      })
      .catch((error) => {
        // console.error(error);
        noteSearchErrorElement.textContent = error.message;
        showSearchError();
      })
      .finally(() => {
        showNoteList();
      });
  };

  const displayResult = (notesData) => {
    const existingNoteElements = {}; // Track existing notes in the DOM

    // Clear existing notes from the DOM
    [noteListElement, noteListArchiveElement].forEach((element) => {
      element.innerHTML = ""; // Clear all child elements
    });

    const noteElements = notesData.map((note) => {
      const existingElement = existingNoteElements[note.id];
      if (existingElement) {
        // Note already exists, reuse the element
        return existingElement;
      }

      const newElement = note.isArchived
        ? document.createElement("note-archive")
        : document.createElement("note-item");
      newElement.note = note;
      existingNoteElements[note.id] = newElement; // Track the new element
      return newElement;
    });

    // Now, safely append the note elements to the DOM
    noteElements.forEach((element) => {
      const parentElement = element.note.isArchived
        ? noteListArchiveElement
        : noteListElement;
      parentElement.appendChild(element);
    });
  };

  const showLoading = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteLoadingElement);
  };

  const showNoteList = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteListElement); // Original line
    Utils.showElement(noteListArchiveElement); // Add this line
  };

  const showSearchError = () => {
    Array.from(noteListContainerElement.children).forEach((element) => {
      Utils.hideElement(element);
    });
    Utils.showElement(noteSearchErrorElement);
  };

  searchFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    search();
  });

  // Show notes on page load
  showNote();
};

export default home;
