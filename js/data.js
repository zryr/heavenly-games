const games = [
  {
    id: 'drive-mad',
    title: 'Drive Mad',
    icon: 'https://cpsgames.org//thumbs/drive-mad_2.webp', // Using link as requested for now
    iframeSrc: 'https://lolygames.github.io/drive-mad/',
    description: `Drive Mad is a fun car game where you drive on tracks with lots of obstacles. Try to get to the finish line without crashing! You need to be good at controlling your speed to do cool stunts and get past all the tricky parts.

Can you beat every level and show off your amazing driving skills?`,
    controls: [
      'Steer forward - W, D, X, Up arrow, Right arrow, Mouse click',
      'Steer backward - S, A, Z, Down arrow, Left arrow'
    ],
    tags: ['Car', 'Strategy'],
    genres: ['Driving', 'Skill', 'Simulation'], // Genres for sidebar filtering
    platforms: ['PC Only', 'Keyboard Needed', 'Mobile Supported'], // Pills
    isTrending: true,
    isNew: true, // Example of a new game
    isFavorited: false, // Default, will check localStorage
    launchType: 'iframe', // Standard iframe launch
    likes: 0,
    dislikes: 0
  },
];
