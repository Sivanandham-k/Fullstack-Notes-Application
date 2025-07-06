package com.example.notes.controller;

import com.example.notes.model.Note;
import com.example.notes.repository.noteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/notes")
public class noteController {

    private final noteRepository noteRepo;

    public noteController(noteRepository noteRepo) {
        this.noteRepo = noteRepo;
    }

    @GetMapping
    public List<Note> getAllNotes() {
        return noteRepo.findAll();
    }

    @PostMapping
    public Note addNote(@RequestBody Note note) {
        return noteRepo.save(note);
    }

    @DeleteMapping("/{id}")
    public void deleteNote(@PathVariable Long id) {
        noteRepo.deleteById(id);
    }
}
