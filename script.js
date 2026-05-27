const saveBtn = document.getElementById("saveBtn");
const noteInput = document.getElementById("noteInput");
const notesList = document.getElementById("notesList");

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

async function loadNotes() {
  try {
    const response = await fetch("http://127.0.0.1:5000/notes");

    if (!response.ok) {
      throw new Error("Failed to load notes");
    }

    const notes = await response.json();
    notesList.innerHTML = "";

    notes.forEach((item) => {
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("note");

      const noteText = document.createElement("p");
      noteText.innerText = item.note;

      const timeText = document.createElement("small");
      timeText.innerText = `Saved at: ${formatDateTime(item.created_at)}`;

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.innerText = "Edit";

      editBtn.addEventListener("click", async () => {
        const newNote = prompt("Edit your note:", item.note);

        if (newNote === null) return;

        const trimmedNote = newNote.trim();

        if (trimmedNote === "") {
          alert("Note cannot be empty");
          return;
        }

        try {
          const response = await fetch(`http://127.0.0.1:5000/notes/${item.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              note: trimmedNote
            })
          });

          if (!response.ok) {
            throw new Error("Edit failed");
          }

          loadNotes();
        } catch (error) {
          console.log("Edit error:", error);
          alert("Could not edit note");
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerText = "Delete";

      deleteBtn.addEventListener("click", async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/notes/${item.id}`, {
            method: "DELETE"
          });

          if (!response.ok) {
            throw new Error("Delete failed");
          }

          loadNotes();
        } catch (error) {
          console.log("Delete error:", error);
          alert("Could not delete note");
        }
      });

      noteDiv.appendChild(noteText);
      noteDiv.appendChild(timeText);
      noteDiv.appendChild(editBtn);
      noteDiv.appendChild(deleteBtn);

      notesList.appendChild(noteDiv);
    });
  } catch (error) {
    console.log("Load notes error:", error);
    alert("Could not load notes");
  }
}

saveBtn.addEventListener("click", async () => {
  const noteText = noteInput.value.trim();

  if (noteText === "") {
    alert("Please write a note");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note: noteText
      })
    });

    if (!response.ok) {
      throw new Error("Save failed");
    }

    noteInput.value = "";
    loadNotes();
  } catch (error) {
    console.log("Save error:", error);
    alert("Could not save note");
  }
});

loadNotes();