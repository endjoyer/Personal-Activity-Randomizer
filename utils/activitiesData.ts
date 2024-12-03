export interface Activity {
  _id: string;
  name: string;
}

export interface Section {
  _id: string;
  name: string;
  activities: Activity[];
}

export const sections: Section[] = [
  {
    _id: 'movies',
    name: 'Movies',
    activities: [
      { _id: '1', name: 'Inception' },
      { _id: '2', name: 'The Matrix' },
      // Add more movies here
    ],
  },
  {
    _id: 'books',
    name: 'Books',
    activities: [
      { _id: '3', name: '1984' },
      { _id: '4', name: 'To Kill a Mockingbird' },
      // Add more books here
    ],
  },
  // Add more sections here
];
