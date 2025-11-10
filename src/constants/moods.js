export const MOOD_OPTIONS = [
  {
    id: 'peaceful',
    label: 'Peaceful',
    emoji: '😌',
    swatch: '#78C0A8',
    accent: 'from-teal-200/70 to-teal-400/40',
    tags: ['calm', 'centered'],
  },
  {
    id: 'joyful',
    label: 'Joyful',
    emoji: '😊',
    swatch: '#F7A399',
    accent: 'from-peach-200/80 to-peach-400/40',
    tags: ['uplifted', 'grateful'],
  },
  {
    id: 'reflective',
    label: 'Reflective',
    emoji: '🤔',
    swatch: '#EAEAEA',
    accent: 'from-neutral-200/80 to-neutral-400/40',
    tags: ['thoughtful'],
  },
  {
    id: 'energized',
    label: 'Energized',
    emoji: '✨',
    swatch: '#C9A7EB',
    accent: 'from-purple-200/70 to-purple-400/40',
    tags: ['motivated'],
  },
  {
    id: 'tender',
    label: 'Tender',
    emoji: '🥲',
    swatch: '#B8C4FF',
    accent: 'from-sky-200/80 to-sky-400/40',
    tags: ['soft', 'sensitive'],
  },
];

export const getMoodById = (id) => MOOD_OPTIONS.find((mood) => mood.id === id) ?? null;

