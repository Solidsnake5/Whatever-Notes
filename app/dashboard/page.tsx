'use client';
import React, { useState, useRef, useEffect } from "react";
import {supabase} from '../../lib/supabaseClient'
import NextImage from "next/image";
// import { supabase } from '../lib/supabaseClient';

// Define Category type for strong typing
interface Category {
  name: string;
  color: string;
}

const categories: Category[] = [
  { name: "All", color: "#1CB5E0" }, // All is a virtual category
  { name: "Videos", color: "#8e44ad" },
  { name: "Wishlist", color: "#f39c12" },
  { name: "Assignment", color: "#2980b9" },
  { name: "Projects", color: "#16a085" },
  { name: "Work", color: "#e74c3c" },
  { name: "Study", color: "#27ae60" },
];

const formatDate = (dateObj: Date) => {
  // Format: 07 January 2021
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};
const formatTime = (dateObj: Date) => {
  // Format: 09:38PM
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, '0')}:${minutes}${ampm}`;
};

function NewNoteModal({
  open,
  onClose,
  onAddNote,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  onAddNote: (note: Note) => void;
  categories: Category[];
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[1]?.name || '');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setContent('');
      setCategory(categories[1]?.name || '');
      setError('');
    }
  }, [open, categories]);

  // Trap focus and close on ESC
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0" role="dialog" aria-modal="true" aria-labelledby="new-note-title">
      <div
        ref={modalRef}
        className="bg-[#181828] rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-4 animate-slide-in-left"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 id="new-note-title" className="text-xl font-bold text-white">Add New Note</h2>
          <button
            aria-label="Close modal"
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            if (!title.trim() || !content.trim()) {
              setError('Title and content are required, senpai!');
              return;
            }
            const catObj = categories.find((c: Category) => c.name === category);
            const now = new Date();
            onAddNote({
              title: title.trim(),
              content: content.trim(),
              category,
              categoryColor: catObj?.color || '#1CB5E0',
              time: formatTime(now),
              date: formatDate(now),
            });
            onClose();
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-200">Title</span>
            <input
              type="text"
              name="title"
              id="note-title"
              className="rounded-lg px-3 py-2 bg-[#22223a] border border-[#23233a] text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0]"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={60}
              aria-label="Note title"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-200">Content</span>
            <textarea
              name="content"
              id="note-content"
              className="rounded-lg px-3 py-2 bg-[#22223a] border border-[#23233a] text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] resize-none min-h-[80px]"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              maxLength={500}
              aria-label="Note content"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-200">Category</span>
            <select
              name="category"
              id="note-category"
              className="rounded-lg px-3 py-2 bg-[#22223a] border border-[#23233a] text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0]"
              value={category}
              onChange={e => setCategory(e.target.value)}
              aria-label="Note category"
            >
              {categories.filter((c: Category) => c.name !== 'All').map((cat: Category) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </label>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="rounded-lg px-6 py-2 text-base font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] bg-gradient-to-r from-[#1CB5E0] to-[#000851] transition-all hover:scale-105 mt-2"
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
}

function EditNoteModal({
  open,
  onClose,
  note,
  categories,
  onSave,
  onDelete,
}: {
  open: boolean;
  onClose: () => void;
  note: Note | null;
  categories: Category[];
  onSave: (updatedNote: Note) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(categories[1]?.name || '');
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setError('');
    } else if (open) {
      setTitle('');
      setContent('');
      setCategory(categories[1]?.name || '');
      setError('');
    }
  }, [open, note, categories]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-2 sm:px-0" role="dialog" aria-modal="true" aria-labelledby="edit-note-title">
      <div
        ref={modalRef}
        className="bg-[#181828] rounded-2xl shadow-2xl p-6 w-full max-w-md mx-auto flex flex-col gap-4 animate-slide-in-left"
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 id="edit-note-title" className="text-xl font-bold text-white">Edit Note</h2>
          <button
            aria-label="Close modal"
            className="text-gray-400 hover:text-white focus:outline-none"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          className="flex flex-col gap-4"
          onSubmit={e => {
            e.preventDefault();
            if (!title.trim() || !content.trim()) {
              setError('Title and content are required, senpai!');
              return;
            }
            const catObj = categories.find((c: Category) => c.name === category);
            onSave({
              ...note,
              title: title.trim(),
              content: content.trim(),
              category,
              categoryColor: catObj?.color || '#1CB5E0',
            });
            onClose();
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-200">Title</span>
            <input
              type="text"
              name="title"
              id="note-title"
              className="rounded-lg px-3 py-2 bg-[#22223a] border border-[#23233a] text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0]"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              maxLength={60}
              aria-label="Note title"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-200">Content</span>
            <textarea
              name="content"
              id="note-content"
              className="rounded-lg px-3 py-2 bg-[#22223a] border border-[#23233a] text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] resize-none min-h-[80px]"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              maxLength={500}
              aria-label="Note content"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-200">Category</span>
            <select
              name="category"
              id="note-category"
              className="rounded-lg px-3 py-2 bg-[#22223a] border border-[#23233a] text-white focus:outline-none focus:ring-2 focus:ring-[#1CB5E0]"
              value={category}
              onChange={e => setCategory(e.target.value)}
              aria-label="Note category"
            >
              {categories.filter((c: Category) => c.name !== 'All').map((cat: Category) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </label>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="rounded-lg px-6 py-2 text-base font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] bg-gradient-to-r from-[#1CB5E0] to-[#000851] transition-all hover:scale-105"
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-lg px-6 py-2 text-base font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-all"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this note, senpai?')) {
                  onDelete();
                  onClose();
                }
              }}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// SVG for settings icon
const SettingsIcon = ({ selected }: { selected?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke={selected ? "#1CB5E0" : "#888"}
    strokeWidth={2}
    aria-hidden="true"
    focusable="false"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7zm7.94-2.34a1 1 0 0 0 .26-1.09l-1-1.73a1 1 0 0 1 .21-1.23l.82-.82a1 1 0 0 0 0-1.41l-1.41-1.41a1 1 0 0 0-1.41 0l-.82.82a1 1 0 0 1-1.23.21l-1.73-1a1 1 0 0 0-1.09.26l-.58.58a1 1 0 0 1-1.42 0l-.58-.58a1 1 0 0 0-1.09-.26l-1.73 1a1 1 0 0 1-1.23-.21l-.82-.82a1 1 0 0 0-1.41 0L3.34 8.34a1 1 0 0 0 0 1.41l.82.82a1 1 0 0 1 .21 1.23l-1 1.73a1 1 0 0 0 .26 1.09l.58.58a1 1 0 0 1 0 1.42l-.58.58a1 1 0 0 0-.26 1.09l1 1.73a1 1 0 0 1-.21 1.23l-.82.82a1 1 0 0 0 0 1.41l1.41 1.41a1 1 0 0 0 1.41 0l.82-.82a1 1 0 0 1 1.23-.21l1.73 1a1 1 0 0 0 1.09-.26l.58-.58a1 1 0 0 1 1.42 0l.58.58a1 1 0 0 0 1.09.26l1.73-1a1 1 0 0 1 1.23.21l.82.82a1 1 0 0 0 1.41 0l1.41-1.41a1 1 0 0 0 0-1.41l-.82-.82a1 1 0 0 1-.21-1.23l1-1.73a1 1 0 0 0-.26-1.09l-.58-.58a1 1 0 0 1 0-1.42l.58-.58z"
    />
  </svg>
);

interface CategoryWithCount extends Category {
  count: number;
}

function SidebarNav({
  selectedCategory,
  setSelectedCategory,
  showSettings,
  setShowSettings,
  onNavItemClick,
  categoriesWithCounts,
}: {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onNavItemClick?: () => void;
  categoriesWithCounts: CategoryWithCount[];
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1CB5E0] bg-[#22223a]">
          {/* <Image src="/next.svg" alt="User avatar" width={64} height={64} /> */}
        </div>
        <span className="text-lg font-bold mt-2">Steve Dean</span>
      </div>
      <nav className="flex flex-col gap-2 mt-8" role="navigation" aria-label="Categories">
        {categoriesWithCounts.map((cat) => {
          const isSelected = selectedCategory === cat.name && !showSettings;
          return (
            <button
              key={cat.name}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] ${
                isSelected
                  ? "bg-[#23233a] shadow border-l-4 border-[#1CB5E0]"
                  : "hover:bg-[#23233a]/80 hover:shadow"
              }`}
              style={{ cursor: "pointer" }}
              aria-current={isSelected ? "page" : undefined}
              aria-label={cat.name}
              tabIndex={0}
              onClick={() => {
                setSelectedCategory(cat.name);
                setShowSettings(false);
                if (onNavItemClick) onNavItemClick();
              }}
            >
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
                aria-label={cat.name + " color"}
              ></span>
              <span className="flex-1 text-base text-left">{cat.name}</span>
              <span className="text-xs bg-[#22223a] rounded-full px-2 py-0.5 font-semibold">
                {cat.count.toString().padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </nav>
      {/* Settings Tab at Bottom */}
      <button
        className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors group focus:outline-none focus:ring-2 focus:ring-[#1CB5E0] mt-8 ${
          showSettings
            ? "bg-[#23233a] shadow border-l-4 border-[#1CB5E0]"
            : "hover:bg-[#23233a]/80 hover:shadow"
        }`}
        style={{ cursor: "pointer" }}
        aria-current={showSettings ? "page" : undefined}
        aria-label="Settings"
        tabIndex={0}
        onClick={() => {
          setShowSettings(true);
          if (onNavItemClick) onNavItemClick();
        }}
      >
        <SettingsIcon selected={showSettings} />
        <span className="flex-1 text-base text-left">Settings</span>
      </button>
    </>
  );
}

interface Note {
  id?: string;
  title: string;
  content: string;
  category: string;
  categoryColor: string;
  time: string;
  date: string;
}

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSettings, setShowSettings] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [notesState, setNotesState] = useState<Note[]>([]);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [selectedNoteIdx, setSelectedNoteIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes from Supabase
  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Failed to fetch notes, senpai!');
    } else {
      setNotesState(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add note
  const handleAddNote = async (note: Note) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('notes').insert([note]).select();
    if (error) {
      setError('Failed to add note, senpai!');
    } else if (data && data[0]) {
      setNotesState(prev => [data[0], ...prev]);
    }
    setLoading(false);
  };

  // Edit note
  const handleEditNote = async (updatedNote: Note) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('notes')
      .update({
        title: updatedNote.title,
        content: updatedNote.content,
        category: updatedNote.category,
        categoryColor: updatedNote.categoryColor,
      })
      .eq('id', updatedNote.id)
      .select();
    if (error) {
      setError('Failed to update note, senpai!');
    } else if (data && data[0]) {
      setNotesState(prev => prev.map(n => n.id === updatedNote.id ? data[0] : n));
    }
    setLoading(false);
  };

  // Delete note
  const handleDeleteNote = async (id: string) => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      setError('Failed to delete note, senpai!');
    } else {
      setNotesState(prev => prev.filter(n => n.id !== id));
    }
    setLoading(false);
  };

  // Close mobile nav on outside click
  useEffect(() => {
    if (!mobileNavOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(e.target as Node)
      ) {
        setMobileNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileNavOpen]);

  const filteredNotes =
    selectedCategory === "All"
      ? notesState
      : notesState.filter((note) => note.category === selectedCategory);

  // Handle profile photo upload
  function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  // Compute dynamic category counts
  const categoriesWithCounts: CategoryWithCount[] = categories.map((cat) => {
    if (cat.name === 'All') {
      return { ...cat, count: notesState.length };
    }
    return {
      ...cat,
      count: notesState.filter((note) => note.category === cat.name).length,
    };
  });

  return (
    <div className="min-h-screen flex bg-[#111118] text-white font-[family-name:var(--font-geist-sans)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-[#181828] border-r border-[#22223a] p-6 gap-8 min-h-screen justify-between">
        <SidebarNav
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          categoriesWithCounts={categoriesWithCounts}
        />
      </aside>
      {/* Mobile Nav Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-[#181828] border border-[#22223a] rounded-lg p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1CB5E0]"
        aria-label="Open navigation menu"
        onClick={() => setMobileNavOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Mobile Sidebar Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" aria-hidden="true"></div>
          {/* Drawer */}
          <div
            ref={mobileNavRef}
            className="relative w-64 max-w-full bg-[#181828] border-r border-[#22223a] p-6 flex flex-col gap-8 min-h-screen animate-slide-in-left shadow-2xl z-50"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Close navigation menu"
              onClick={() => setMobileNavOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarNav
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
              onNavItemClick={() => setMobileNavOpen(false)}
              categoriesWithCounts={categoriesWithCounts}
            />
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {showSettings
              ? "Settings"
              : selectedCategory === "All"
              ? "All Notes"
              : `${selectedCategory} Notes`}
          </h1>
          {!showSettings && (
            <button
              className="inline-block rounded-lg px-6 py-2 text-base font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1CB5E0] bg-gradient-to-r from-[#1CB5E0] to-[#000851] transition-all hover:scale-105"
              onClick={() => setShowNewNoteModal(true)}
            >
              Add New Note
            </button>
          )}
        </div>
        <NewNoteModal
          open={showNewNoteModal}
          onClose={() => setShowNewNoteModal(false)}
          onAddNote={handleAddNote}
          categories={categories}
        />
        <EditNoteModal
          open={selectedNoteIdx !== null && filteredNotes[selectedNoteIdx] !== undefined}
          onClose={() => setSelectedNoteIdx(null)}
          note={selectedNoteIdx !== null && filteredNotes[selectedNoteIdx] !== undefined ? filteredNotes[selectedNoteIdx] : null}
          categories={categories}
          onSave={handleEditNote}
          onDelete={() => {
            if (selectedNoteIdx !== null) {
              const note = filteredNotes[selectedNoteIdx];
              if (note && note.id) handleDeleteNote(note.id);
            }
          }}
        />
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-[#181828] px-6 py-4 rounded-xl shadow text-white text-lg font-bold animate-pulse">Loading, please wait senpai...</div>
          </div>
        )}
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-700 text-white px-4 py-2 rounded shadow-lg">
            {error}
            <button className="ml-4 text-white font-bold" onClick={() => setError(null)} aria-label="Dismiss error">✕</button>
          </div>
        )}
        {showSettings ? (
          <section className="flex flex-col items-center justify-center h-full text-gray-300">
            <div className="bg-[#181828] border border-[#22223a] rounded-2xl p-8 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Settings</h2>
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1CB5E0] bg-[#22223a]">
                  {profilePhoto ? (
                    <NextImage src={profilePhoto} alt="Profile preview" width={80} height={80} />
                  ) : (
                    <NextImage src="/next.svg" alt="Profile preview" width={80} height={80} />
                  )}
                </div>
                <label htmlFor="profile-photo-upload" className="block text-sm font-medium text-gray-200 cursor-pointer">
                  <span className="underline hover:text-[#1CB5E0]">Upload Profile Photo</span>
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </label>
              </div>
              <p className="text-gray-400 mb-2">This is a placeholder for your settings panel. Add your settings options here, senpai!</p>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNotes.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12 text-lg">No notes in this category yet.</div>
            ) : (
              filteredNotes.map((note, idx) => (
                <article
                  key={idx}
                  className="rounded-2xl p-6 shadow-lg border border-[#22223a] bg-[#181828] flex flex-col gap-3 min-h-[220px] relative transition-transform duration-150 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
                  style={{ borderTop: `4px solid ${note.categoryColor}` }}
                  tabIndex={0}
                  onClick={() => setSelectedNoteIdx(idx)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedNoteIdx(idx); }}
                  aria-label={`Edit note: ${note.title}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded bg-opacity-80"
                      style={{ backgroundColor: note.categoryColor }}
                    >
                      {note.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mb-1 line-clamp-1">{note.title}</h2>
                  <p className="text-gray-400 text-sm flex-1 line-clamp-3">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                    <span>{note.time}</span>
                    <span>{note.date}</span>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>
      <style jsx global>{`
        @keyframes slide-in-left {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
} 