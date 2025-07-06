document.addEventListener("DOMContentLoaded", () => {
    const notesContainer = document.getElementById("notesContainer");
    const addNoteBtn = document.getElementById("addNoteBtn");
    const addNoteModal = document.getElementById("addNoteModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const noteForm = document.getElementById("noteForm");
    const searchInput = document.getElementById("searchInput");
    const filterSelect = document.getElementById("filterSelect");
    const emptyState = document.getElementById("emptyState");
    const confirmModal = document.getElementById("confirmModal");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    let notes = [];


    async function fetchNotes() {
        const res = await fetch("http://localhost:8080/api/notes");
        notes = await res.json();
        showNotes();
    }
    let noteToDeleteId = null;


    async function deleteNote(id) {
        const res = await fetch(`http://localhost:8080/api/notes/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchNotes();
        } else {
            console.error('Failed to delete note');
        }
    }

    function showNotes(list = notes) {
        notesContainer.innerHTML = "";

        console.log(list);


        const reverse = [...list].reverse(); //Reverse the notes array and store the reverse variable to display the data in LIFO method 

        console.log(reverse);


        if (reverse.length === 0) {
            emptyState.style.display = "block";
            return;
        } else {
            emptyState.style.display = "none";
        }

        reverse.forEach((note) => {
            const noteCard = document.createElement("div");
            noteCard.className = "note-card";
            noteCard.innerHTML = `
            <div class="note-content">
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="note-actions">
                        <button class="delete-btn" data-id="${note.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="note-text">${note.content}</p>
                <div class="note">
                    <span class="note-tag ">  ${getTagIcon(note.tag)} ${note.tag}</span>
                    <span class="note-date">${new Date(note.date).toLocaleString()}</span>
                </div>
            </div>`;
            notesContainer.appendChild(noteCard);
        });

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.onclick = () => {
                const noteId = btn.getAttribute("data-id");
                confirmModal.classList.add("active");
                document.body.style.overflow = "hidden";

                confirmDeleteBtn.onclick = () => {
                    deleteNote(noteId);
                    confirmModal.classList.remove("active");
                    document.body.style.overflow = "auto";
                };
            };
        });
    }

    function getTagIcon(tag) {
        const icons = {
            work: '<i class="fas fa-briefcase"></i>',
            personal: '<i class="fas fa-user"></i>',
            ideas: '<i class="fas fa-lightbulb"></i>',
            reminders: '<i class="fas fa-bell"></i>',
        };
        return icons[tag] || "";
    }

    addNoteBtn.onclick = () => {
        addNoteModal.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    closeModalBtn.onclick = () => {
        addNoteModal.classList.remove("active");
        document.body.style.overflow = "auto";
        noteForm.reset();
    };

    cancelDeleteBtn.onclick = () => {
        confirmModal.classList.remove("active");
        document.body.style.overflow = "auto";
        noteToDeleteId = null;
    };

    confirmDeleteBtn.onclick = () => {
        if (noteToDeleteId !== null) {
            notes.splice(noteToDeleteId, 1);
            showNotes();
            confirmModal.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    };

    noteForm.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById("noteTitle").value;
        const content = document.getElementById("noteContent").value;
        const tag = document.querySelector('input[name="noteTag"]:checked').value;

        const newNote = {
            title,
            content,
            tag,
            date: new Date().toISOString()
        };

        await fetch("http://localhost:8080/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNote)
        });

        fetchNotes();
        noteForm.reset();
        addNoteModal.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    searchInput.oninput = filterNotes;
    filterSelect.onchange = filterNotes;

    function filterNotes() {
        const search = searchInput.value.toLowerCase();
        const tag = filterSelect.value;
        let filtered = notes.filter(note =>
            note.title.toLowerCase().includes(search) ||
            note.content.toLowerCase().includes(search)
        );
        if (tag !== "all") {
            filtered = filtered.filter(note => note.tag === tag);
        }
        showNotes(filtered);
    }

    fetchNotes();
});


