import MoodEntryForm from '../../moods/components/MoodEntryForm.jsx'

export default function ComposerModal({ isOpen, onClose, editingEntry = null }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/40 px-4 py-10 backdrop-blur-sm dark:bg-black/55">
      <div className="w-full max-w-xl">
        <MoodEntryForm key={editingEntry?.id ?? 'new'} editingEntry={editingEntry} onClose={onClose} />
      </div>
    </div>
  )
}
