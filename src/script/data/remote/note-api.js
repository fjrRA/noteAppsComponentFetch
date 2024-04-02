const BASE_URL = "https://notes-api.dicoding.dev/v2/";

class NotesApi {
  static getAll() {
    return fetch(`${BASE_URL}/notes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseJson) => responseJson.data)
      .catch((error) => {
        console.error("Error fetching notes:", error);
        throw error;
      });
  }

  static getArchived() {
    return fetch(`${BASE_URL}/notes/archived`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseJson) =>
        responseJson.data.map((note) => ({ ...note, isArchived: true })),
      )
      .catch((error) => {
        console.error("Error fetching archived notes:", error);
        throw error;
      });
  }

  // Metode statis untuk membuat catatan baru
  static createNote(newNote) {
    return fetch(`${BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((responseJson) => responseJson.data); // Success!
        } else if (response.status === 400) {
          return response.json().then((errorJson) => {
            // Log detailed error message from the server
            console.error(
              "Error creating note (400 Bad Request):",
              errorJson.message,
            );
            throw new Error("Failed to create note (400 Bad Request)");
          });
        } else {
          // Handle other non-400 but potentially recoverable errors
          console.warn("Network response was not ok, retrying...");
          // return retryRequest(fetch, response.clone()); // Retry with Exponential Backoff
        }
      })
      .catch((error) => {
        console.error("Error creating note:", error);
        throw error;
      });
  }

  static deleteNote(noteId) {
    return fetch(`${BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete note");
        }
        return true; // Indicate successful deletion
      })
      .catch((error) => {
        console.error("Error deleting note:", error);
        throw error; // Re-throw the error for upstream handling
      });
  }
}

export default NotesApi;
