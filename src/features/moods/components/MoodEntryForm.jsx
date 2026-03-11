import { useMemo, useState } from 'react';
import { MOOD_OPTIONS, getMoodById } from '../../../constants/moods.js';
import { useMoods } from '../../../context/MoodContext.jsx';

const tagsFromInput = (value) =>
  value
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, ''))
    .filter(Boolean);

export default function MoodEntryForm({ onClose }) {
  const { addEntry } = useMoods();
  const [form, setForm] = useState({
    moodId: '',
    notes: '',
    color: '#78C0A8',
    tagDraft: '',
    spotifyLink: '',
    imageData: null,
    visibility: 'private',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSpotifyInput, setShowSpotifyInput] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const selectedMood = useMemo(() => getMoodById(form.moodId), [form.moodId]);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  // Users surface moods first; once the user has picked a mood, it hide the palette away again
  const handleMoodSelect = (moodId) => {
    const mood = getMoodById(moodId);
    updateForm({
      moodId,
      color: mood?.swatch ?? '#78C0A8',
    });
    setShowMoodPicker(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateForm({ imageData: reader.result });
    };
    reader.readAsDataURL(file);
  };

  // Fail fast when the mood or notes are missing so the CTA stays disabled
  const validate = () => {
    const nextErrors = {};
    if (!form.moodId) nextErrors.moodId = 'Choose the mood that captures today.';
    if (!form.notes.trim()) nextErrors.notes = 'Add a short reflection to anchor the entry.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitError('');
    setIsSubmitting(true);

    const mood = getMoodById(form.moodId);
    // To store the timestamp inside the saved record so we can sort later
    const now = new Date().toISOString();

    try {
      await addEntry({
        dateTime: now,
        note: form.notes.trim(),
        moodId: form.moodId,
        moodLabel: mood?.label ?? 'Mood',
        emoji: mood?.emoji ?? '🙂',
        color: form.color,
        tags: tagsFromInput(form.tagDraft),
        spotifyLink: form.spotifyLink.trim(),
        imageData: form.imageData,
        visibility: form.visibility,
      });

      // To reset state and hide optional sections for the next entry
      updateForm({
        moodId: '',
        notes: '',
        color: '#78C0A8',
        tagDraft: '',
        spotifyLink: '',
        imageData: null,
        visibility: 'private',
      });
      setShowSpotifyInput(false);
      setShowImagePicker(false);
      setShowMoodPicker(false);
      setShowSuccess(true);
      const successTimeout = setTimeout(() => setShowSuccess(false), 1200);
      if (typeof onClose === 'function') {
        setTimeout(() => {
          onClose();
          clearTimeout(successTimeout);
        }, 400);
      }
    } catch (error) {
      setSubmitError(error?.message || 'We could not save your entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative">
      <form
        onSubmit={handleSubmit}
        className="card relative max-h-[90vh] w-full overflow-hidden border border-white/70 bg-white/95 shadow-soft"
        aria-label="Mood entry form"
      >
        <div className="bg-gradient-to-b from-white to-slate-50/60 px-6 pt-6 sm:px-8 sm:pt-7">
          <div className="flex items-start justify-between gap-4 border-b border-white/80 pb-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Share an update</p>
              <h2 className="text-2xl font-semibold text-midnight">How are you feeling right now?</h2>
              <p className="mt-1 text-sm text-slate-500">
                Capture this moment with mood, notes, tags, and optional media.
              </p>
            </div>
            {typeof onClose === 'function' && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-2xl text-slate-400 transition hover:border-neutral/50 hover:text-midnight"
                aria-label="Close composer"
              >
                ×
              </button>
            )}
          </div>
          {submitError && (
            <div className="mt-4 rounded-xl border border-peach/40 bg-peach/10 px-4 py-3 text-sm text-slate-700">
              {submitError}
            </div>
          )}

          <div className="mt-6 grid max-h-[58vh] gap-7 overflow-y-auto pr-1">
            <div className="space-y-3 rounded-2xl border border-white/80 bg-white/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-midnight">Mood *</p>
                <button
                  type="button"
                  onClick={() => setShowMoodPicker((prev) => !prev)}
                  className="rounded-full border border-neutral/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-teal hover:text-midnight"
                >
                  {showMoodPicker ? 'Hide moods' : form.moodId ? 'Change mood' : 'Select mood'}
                </button>
              </div>

              {selectedMood ? (
                <div className="flex items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-2xl shadow-inner">
                    {selectedMood.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-midnight">{selectedMood.label}</p>
                    <p className="text-xs text-slate-500">Tap “Change mood” if this doesn’t feel right.</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No mood selected yet? tap “Select mood” to pick one.</p>
              )}

              {showMoodPicker && (
                <div className="flex flex-wrap gap-3 rounded-2xl bg-slate-50/80 p-3">
                  {MOOD_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleMoodSelect(option.id)}
                      className={`group relative flex w-20 flex-col items-center gap-2 rounded-2xl border border-transparent px-4 py-3 transition ${
                        option.id === form.moodId
                          ? 'bg-white shadow-soft ring-2 ring-teal/40'
                          : 'bg-white/60 hover:bg-white'
                      }`}
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {option.emoji}
                      </span>
                      <span className="text-xs font-medium text-slate-600">{option.label}</span>
                      <span
                        className="absolute inset-x-6 bottom-2 h-1 rounded-full bg-gradient-to-r"
                        style={{ backgroundColor: option.swatch }}
                      />
                    </button>
                  ))}
                </div>
              )}
              {errors.moodId && <p className="text-sm text-peach">{errors.moodId}</p>}
            </div>

            <div className="grid gap-3 rounded-2xl border border-white/80 bg-white/80 p-4">
              <label htmlFor="note" className="text-sm font-semibold text-midnight">
                Notes *
              </label>
              <textarea
                id="note"
                value={form.notes}
                onChange={(event) => updateForm({ notes: event.target.value })}
                rows={5}
                className={`min-h-[140px] w-full resize-none rounded-2xl border px-4 py-4 text-base text-midnight placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 ${
                  errors.notes ? 'border-peach/60' : 'border-neutral'
                }`}
                placeholder="What colored your mood today?"
              />
              {errors.notes && <p className="text-sm text-peach">{errors.notes}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/80 bg-white/80 px-4 py-4">
              <label className="flex items-center gap-3 text-sm font-medium text-midnight">
                <span className="text-xl" aria-hidden="true">
                  🎨
                </span>
                Mood color
                <input
                  type="color"
                  className="h-10 w-10 cursor-pointer rounded-xl border border-neutral/60 bg-white shadow-inner"
                  value={form.color}
                  onChange={(event) => updateForm({ color: event.target.value })}
                />
              </label>

              <button
                type="button"
                onClick={() => setShowImagePicker((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-midnight transition hover:border-neutral/50 hover:bg-white"
              >
                <span className="text-xl" aria-hidden="true">
                  📷
                </span>
                {showImagePicker ? 'Hide photo' : 'Add photo'}
              </button>

              <button
                type="button"
                onClick={() => setShowSpotifyInput((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-midnight transition hover:border-neutral/50 hover:bg-white"
              >
                <span className="text-xl" aria-hidden="true">
                  🎵
                </span>
                {showSpotifyInput ? 'Hide Spotify' : 'Add Spotify track'}
              </button>
            </div>

            <label className="flex flex-col gap-2 rounded-2xl border border-white/80 bg-white/80 p-4 text-sm font-semibold text-midnight">
              Tags
              <input
                type="text"
                value={form.tagDraft}
                onChange={(event) => updateForm({ tagDraft: event.target.value })}
                className="rounded-xl border border-neutral bg-white/70 px-4 py-3 text-sm text-midnight placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                placeholder="e.g. #gratitude, #family"
              />
              <span className="text-xs font-normal text-slate-500">
                Separate with commas 
              </span>
            </label>

            {showSpotifyInput && (
              <label className="flex flex-col gap-2 rounded-2xl border border-white/80 bg-white/80 p-4 text-sm font-semibold text-midnight">
                Spotify link
                <input
                  type="url"
                  value={form.spotifyLink}
                  onChange={(event) => updateForm({ spotifyLink: event.target.value })}
                  className="rounded-xl border border-neutral bg-white/70 px-4 py-3 text-sm text-midnight placeholder:text-slate-400 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
                  placeholder="Paste a track that matches your mood"
                />
              </label>
            )}

            {showImagePicker && (
              <label className="flex flex-col gap-3 rounded-2xl border border-dashed border-neutral/80 bg-white/75 px-5 py-5 text-sm font-semibold text-midnight">
                Upload photo
                <span className="text-sm font-normal text-slate-500">
                  Add one image to bring your day to life.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}

            {form.imageData && (
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={form.imageData}
                  alt="Mood attachment"
                  className="h-56 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => updateForm({ imageData: null })}
                  className="absolute right-4 top-4 rounded-full bg-midnight/70 px-3 py-1 text-sm text-white shadow-lg transition hover:bg-midnight/80"
                >
                  Remove photo
                </button>
              </div>
            )}

            <div className="flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-4 text-sm text-slate-600">
              <div className="flex flex-col">
                <span className="font-semibold text-midnight">Privacy</span>
                <span>Entries stay private unless you explicitly share them.</span>
              </div>
              <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-wide text-white">
                Private
              </span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-midnight/95 px-6 py-4 sm:px-8">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              if (typeof onClose === 'function') onClose();
              updateForm({
                moodId: '',
                notes: '',
                color: '#78C0A8',
                tagDraft: '',
                spotifyLink: '',
                imageData: null,
                visibility: 'private',
              });
              setErrors({});
              setShowSpotifyInput(false);
              setShowImagePicker(false);
              setShowMoodPicker(false);
            }}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !form.moodId || !form.notes.trim()}
            className="btn btn-primary flex w-full items-center justify-center gap-2 bg-white/10 text-base font-semibold tracking-wide text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/50"
          >
            {isSubmitting ? 'Posting...' : selectedMood ? `${selectedMood.emoji} Post` : 'Post'}
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="pointer-events-none absolute inset-x-0 -bottom-8 flex justify-center">
          <div className="rounded-full bg-midnight/90 px-5 py-2 text-sm text-white shadow-lg">
            Entry saved — beautiful work.
          </div>
        </div>
      )}
    </section>
  );
}
