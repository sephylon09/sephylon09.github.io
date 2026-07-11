/* apps-data.js — single source of truth for Mini Forge Dev app metadata.
   Add a new app here, then add its policy panel to privacy-policy.html and
   its FAQ panel to support.html (see README “Adding a new app”). */
window.MFD_APPS = [
  {
    id: "anime-pulse",
    name: "Anime Pulse",
    category: "Anime Schedule & Discovery",
    kind: "app",
    description: "Track airing anime, browse seasonal shows, and keep a weekly schedule with optional episode reminders.",
    logo: "assets/animepulse_logo.png",
    optimizedLogo: "assets/app-icons/animepulse.webp",
    status: "published",
    playUrl: "https://play.google.com/store/apps/details?id=com.sephylon.animepulse",
    privacyHash: "anime-pulse",
    supportHash: "anime-pulse",
    packageId: "com.sephylon.animepulse"
  },
  {
    id: "letter-rise",
    name: "Letter Rise",
    category: "Word Puzzle Game",
    kind: "game",
    description: "Swipe connected letters to build words and keep the rising board down. Unlock themes and chase your high score.",
    logo: "assets/letterrise_logo.jpeg",
    optimizedLogo: "assets/app-icons/letterrise.webp",
    status: "published",
    playUrl: "https://play.google.com/store/apps/details?id=com.sephylon.letterrise",
    privacyHash: "letter-rise",
    supportHash: "letter-rise",
    packageId: "com.sephylon.letterrise"
  },
  {
    id: "letterforge",
    name: "LetterForge",
    category: "Word Puzzle Game",
    kind: "game",
    description: "Forge words through daily challenges and endless puzzles, with hints, achievements, and offline progress.",
    logo: "assets/letterforge_logo.png",
    optimizedLogo: "assets/app-icons/letterforge.webp",
    status: "published",
    playUrl: "https://play.google.com/store/apps/details?id=com.sephylon.letterforge",
    privacyHash: "letterforge",
    supportHash: "letterforge",
    packageId: "com.sephylon.letterforge"
  },
  {
    id: "emoji-guess",
    name: "Emoji Guess",
    category: "Emoji Puzzle Game",
    kind: "game",
    description: "Guess words, movies, food, countries, and animals from emoji clues. Earn coins, use hints, and play offline.",
    logo: "assets/emoji_guess_logo.png",
    optimizedLogo: "assets/app-icons/emojiguess.webp",
    status: "coming-soon",
    playUrl: null,
    privacyHash: "emoji-guess",
    supportHash: "emoji-guess",
    packageId: null
  },
  {
    id: "guess-the-time",
    name: "Guess The Time",
    category: "Multiplayer Guessing Game",
    kind: "game",
    description: "Create a room, invite friends, and guess the hidden time across rounds to see who lands closest.",
    logo: "assets/guessthetime_logo.png",
    optimizedLogo: "assets/app-icons/guessthetime.webp",
    status: "coming-soon",
    playUrl: null,
    privacyHash: "guess-the-time",
    supportHash: "guess-the-time",
    packageId: null
  },
  {
    id: "foodfit-scan",
    name: "FoodFit Scan",
    category: "Food Barcode & Nutrition Scanner",
    kind: "app",
    description: "Scan or search packaged food to check nutrition, allergens, additives, and how well products fit your goals.",
    logo: "assets/foodfit_logo.png",
    optimizedLogo: "assets/app-icons/foodfit.webp",
    status: "coming-soon",
    playUrl: null,
    privacyHash: "foodfit-scan",
    supportHash: "foodfit-scan",
    packageId: null
  }
];
