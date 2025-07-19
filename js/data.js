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
  {
    id: 'driven-wild',
    title: 'Driven Wild',
    icon: 'https://placehold.co/150x150/ff0000/1a1a1a?text=Driven+Wild',
    description: `Welcome to Driven Wild! 🚗🌴

Retro arcade driving across 10 stages, can you make it to the garden?

Your best distance, fastest time, and ghost are saved.
Originally made to fit in a 13k zip for JS13K 2024!
More modes and other surprises are coming soon!

🎵 Featuring music from Newgrounds artists!

"VigiLatte" by VarxenCore9
"Urban City" by traftay
"Old Times (feat: Sychu)" by 8-BITek

I'd like to feature a rotating selection of music on the in game radio. Let me know if you made music that fits the vibe and want to be included!

Thank you for playing! I have recently made some major updates and am still in the process of making final tweaks. Please leave your feedback and I will continue improving it and adding new stuff.`,
    controls: [
        'Arrows or Mouse = Drive',
        'Spacebar = Brake',
        'Enter = Toggle Full Screen',
        'Escape = Exit to Title Screen',
        'P = Pause',
        'M = Mute',
        'R = Restart',
        'F = Free Ride Mode',
        'C = Clear Save Data',
        'Also supports Gamepad and Touch devices',
        'Touch center of screen to pause on mobile'
    ],
    tags: ['Driving', 'Racing'],
    genres: ['Driving', 'Racing'],
    platforms: ['PC Only', 'Keyboard Needed'],
    isTrending: true,
    isNew: true,
    isFavorited: false,
    launchType: 'modal',
    normalUrl: 'https://www.newgrounds.com/portal/view/972740',
    fullscreenUrl: 'https://uploads.ungrounded.net/alternate/6510000/6510853_alternate_303470_r35.zip/'
  },
];
