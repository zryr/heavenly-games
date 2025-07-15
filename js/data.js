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
    launchType: 'iframe' // Standard iframe launch
  },
  // Add a new game object that uses the modal launch type
   {
    id: 'axiom', // Unique ID
    title: 'Axiom', // Example Title
    icon: 'https://via.placeholder.com/150/00ffff/1a1a1a?text=Axiom', // Example Icon
    description: 'This game uses a special way to open with proxies.', // Description (optional for modal type)
    controls: ['Depends on launch method'], // Controls (optional for modal type)
    tags: ['Special', 'Proxy'], // Tags (optional for modal type)
    genres: ['Arcade', 'Shooting'], // Assign to a genre
    platforms: ['Needs Options'], // Example pill
    isTrending: true, // Can be trending/new/favorited
    isNew: true,
    isFavorited: false,
    launchType: 'modal', // <-- **This indicates the modal launch**
    normalUrl: 'https://www.newgrounds.com/portal/view/972740', // URL for normal mode
    fullscreenUrl: 'https://uploads.ungrounded.net/alternate/6510000/6510853_alternate_303470_r35.zip/' // URL for fullscreen mode (Note: .zip might not work directly in iframe, this is just the provided URL)
  },
   {
    id: 'example-game-3',
    title: 'Cool Strategy Game',
    icon: 'https://via.placeholder.com/150/ff00ff/1a1a1a?text=Game+Icon+3', // Placeholder icon
    iframeSrc: 'https://example.com/games/strategy/', // Replace with actual game URL
    description: 'Plan your moves to win!',
    controls: ['Mouse Click'],
    tags: ['Strategy', 'Puzzle'],
    genres: ['Strategy', 'Puzzle'],
    platforms: ['PC Only', 'Mouse Needed'],
    isTrending: true,
    isNew: false,
    isFavorited: false,
    launchType: 'iframe' // Standard iframe launch
  },
];
