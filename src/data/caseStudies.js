// ─────────────────────────────────────────────────────────────
//  UX CASE STUDIES (separate from the build projects in projects.js)
//
//  Each case study follows the full UX process:
//  overview → research → define → ideate → architecture → wireframes →
//  usability testing → iterations → design system → mockups →
//  responsive design → prototype → results → reflection.
//
//  ⚠ Research numbers, quotes and test results below are written as a
//  realistic starting point. Replace them with YOUR real figures
//  (participants, success rates, times, SUS scores) before submitting.
//
//  Screens are drawn in code in src/screens/<app>.jsx. `screen` keys
//  below point to those components.
// ─────────────────────────────────────────────────────────────

export const caseStudies = [
  // ───────────────────────────── LAM ─────────────────────────────
  {
    slug: 'lam',
    index: '01',
    title: 'Lam',
    tagline: 'Thimphu city buses, finally predictable.',
    accent: '#5BC0FF',
    accent2: '#6D5BFF',
    platform: 'Android app + responsive web',
    role: 'Solo UX designer — research to prototype',
    team: 'Individual project · reviewed by 2 peers',
    duration: '6 weeks',
    tools: ['Figma', 'FigJam', 'Google Forms', 'Maze'],
    prototype: '', // ← paste your Figma prototype link
    cover: { phone: 'home', web: 'web' },
    summary: 'A bus companion for Thimphu: see when the next bus arrives, which stop to wait at, and pay without hunting for change.',
    tldr: {
      problem: 'Riders wait at stops without knowing if the bus already passed.',
      solution: 'A list-first home screen with live arrivals, landmark stop names and guest tickets.',
      outcome: 'Time to find the next bus fell from 41 s to 8 s in testing.',
    },
    overview: {
      problem: 'Thimphu’s city buses run on routes many riders learn only by word of mouth. People wait at stops without knowing if the bus has already passed, and paying in cash slows boarding.',
      goal: 'Help daily commuters know when their bus will arrive so they wait less and plan with confidence.',
      responsibilities: ['User interviews & survey', 'Competitive audit', 'Personas & journey map', 'Information architecture', 'Wireframes → hi-fi', 'Two rounds of usability testing'],
      constraints: ['Many riders use budget Android phones', 'Older riders need large text', 'Must work without creating an account'],
      success: ['Find the next arrival in under 10 seconds', 'Buy a ticket in under 1 minute', 'SUS score above 80'],
    },
    research: {
      questions: ['How do riders decide when to leave for the stop today?', 'What makes waiting stressful?', 'How do people describe where a stop is?'],
      methods: [
        { name: 'Online survey', n: '42 responses', detail: 'Google Forms shared in college and office groups.' },
        { name: 'Stop interviews', n: '8 riders', detail: '10-minute chats at Clock Tower and Changzamtog stops.' },
        { name: 'Competitive audit', n: '3 products', detail: 'Compared how each shows arrivals, stops and payment.' },
      ],
      competitors: [
        { name: 'Google Maps (transit)', good: 'Familiar, good walking directions', gap: 'In our audit it showed no live Thimphu bus positions' },
        { name: 'Moovit', good: 'Clear “arriving in X min” pattern', gap: 'Thimphu routes were not available' },
        { name: 'Printed timetable / Facebook posts', good: 'Trusted, local', gap: 'Static, hard to read, often outdated' },
      ],
      affinity: [
        { title: 'Uncertainty', notes: ['“Did I just miss it?”', 'Waits feel longer when unknown', 'Leave home too early “just in case”'] },
        { title: 'Finding stops', notes: ['Stops have no visible names', 'People say “near the clock tower”', 'New riders ask strangers'] },
        { title: 'Paying', notes: ['Exact change is hard', 'Queue at the door', 'Want to pay by mBoB'] },
        { title: 'Access', notes: ['Small fonts are hard for elders', 'Hate long sign-ups', 'Data is costly — keep it light'] },
      ],
      insights: [
        { text: 'Not knowing is worse than waiting — riders want a simple “arriving in X min”.', evidence: '31 of 42 survey responses' },
        { text: 'Stop names are informal; people navigate by landmarks.', evidence: '7 of 8 interviewees' },
        { text: 'Older riders need large text and no sign-up to start.', evidence: 'All 3 riders over 50' },
      ],
    },
    personas: [
      { name: 'Kinley, 19', tag: 'College student · rides daily', bio: 'Takes Route 3 from Babesa to college. Leaves 20 minutes early because she never knows where the bus is.', quote: '“Did I just miss it, or is it late?”', goals: ['Know the live arrival time', 'Save home and college stops', 'Pay with mBoB'], pains: ['Waiting in the rain', 'Carrying exact change'], tech: 'Android, heavy app user' },
      { name: 'Aum Dema, 58', tag: 'Retired · rides to the market', bio: 'Uses the bus twice a week. Her grandson set up her phone; she avoids apps that ask for accounts.', quote: '“Just show me big and simple.”', goals: ['Large, clear text', 'Stops named by landmarks'], pains: ['Small fonts', 'Apps that ask for an account first'], tech: 'Basic Android, uses WhatsApp' },
    ],
    journey: {
      persona: 'Kinley',
      stages: [
        { stage: 'Plan', doing: 'Guesses when to leave home', feel: 2, opp: 'Show live arrival before leaving' },
        { stage: 'Walk to stop', doing: 'Hurries in case the bus is early', feel: 2, opp: 'Nearest stop with walking time' },
        { stage: 'Wait', doing: 'Stares down the road, asks others', feel: 1, opp: '“Bus is 2 stops away” status' },
        { stage: 'Board & pay', doing: 'Searches bag for change', feel: 2, opp: 'QR ticket bought in advance' },
        { stage: 'Ride', doing: 'Watches for her stop', feel: 4, opp: 'Stop list with “your stop” marker' },
      ],
    },
    problemStatement: 'Kinley is a daily commuter who needs to know exactly when her bus will arrive because uncertainty makes her leave early and wait in the cold.',
    hmw: ['How might we answer “when is my bus?” in one glance?', 'How might we describe stops the way riders already talk about them?', 'How might we let first-time riders pay without an account?'],
    ideation: {
      method: 'Crazy 8s — eight ideas in eight minutes, then dot-voting with two classmates.',
      ideas: [
        { title: 'Map-first home', sketch: 'map', impact: 0.55, effort: 0.6 },
        { title: 'Nearest stops list', sketch: 'list', pick: true, impact: 0.9, effort: 0.3 },
        { title: 'Big countdown', sketch: 'big', pick: true, impact: 0.8, effort: 0.2 },
        { title: 'Stop timeline', sketch: 'timeline', pick: true, impact: 0.75, effort: 0.35 },
        { title: 'QR ticket', sketch: 'qr', impact: 0.7, effort: 0.55 },
        { title: 'SMS arrivals', sketch: 'chat', impact: 0.6, effort: 0.75 },
        { title: 'Route cards', sketch: 'cards', impact: 0.4, effort: 0.3 },
        { title: 'Map + sheet', sketch: 'sheet', impact: 0.5, effort: 0.65 },
      ],
      decision: 'I combined the three highest-voted ideas: a nearest-stops list with a big countdown, plus a stop timeline once you pick a bus. The map stays one tap away for people who want it.',
    },
    architecture: {
      sitemap: { root: 'Lam', children: [
        { name: 'Nearby', items: ['Stop details', 'Live bus'] },
        { name: 'Map', items: ['Stops', 'Buses'] },
        { name: 'Routes', items: ['Trip planner', 'All routes'] },
        { name: 'Tickets', items: ['Buy', 'My tickets'] },
        { name: 'Saved', items: ['Stops', 'Trips'] },
      ] },
      flow: ['Open app', 'See nearest stop', 'Check arrival', 'Buy ticket', 'Show QR to driver'],
      flowNote: 'The core flow takes 5 steps and no sign-up. Everything a rider needs at the stop is reachable from the first screen.',
    },
    wireframes: {
      intro: 'After paper sketches I built digital wireframes in Figma to test structure before colour. The first home screen was map-first — testing later changed that.',
      screens: [
        { screen: 'homeV1', title: 'Home v1 — map first', note: 'Assumption: riders think in maps. Times hidden behind a tap.' },
        { screen: 'live', title: 'Live bus', note: 'Big countdown + stop timeline so riders see progress.' },
        { screen: 'plan', title: 'Trip planner', note: 'Three options max, fastest highlighted, to avoid choice overload.' },
        { screen: 'payV1', title: 'Tickets v1 — sign in first', note: 'Followed a typical pattern: account before payment.' },
        { screen: 'ticket', title: 'Ticket', note: 'QR large enough to scan from a hand-held phone.' },
      ],
    },
    testing: {
      method: 'Moderated usability test of the mid-fi Figma prototype (Round 1), repeated with the revised hi-fi prototype (Round 2).',
      participants: '5 participants per round · ages 18–60 · 3 daily riders, 2 occasional',
      tasks: [
        { task: 'Find when the next bus arrives', r1: 60, r2: 100, t1: 41, t2: 8 },
        { task: 'Find the Clock Tower stop', r1: 40, r2: 100, t1: 37, t2: 11 },
        { task: 'Buy and show a ticket', r1: 60, r2: 100, t1: 95, t2: 42 },
      ],
      findings: [
        { sev: 'High', finding: 'Map was the home screen; riders hunted for times.', evidence: '3 of 5 tapped random pins first', fix: 'Home now lists nearest stops with arrival times; the map is one tap away.' },
        { sev: 'High', finding: 'Stops used official names only.', evidence: '“What is NL-14?” — P2', fix: 'Each stop shows a landmark line under its name.' },
        { sev: 'Medium', finding: 'Forced sign-up before buying a ticket.', evidence: '2 of 5 gave up at the CID field', fix: 'Guest checkout; the ticket is saved on the phone.' },
        { sev: 'Low', finding: 'Text too small for older riders.', evidence: 'P5 zoomed the screen twice', fix: 'Large-text option offered on the first screen.' },
      ],
    },
    iterations: [
      { before: 'homeV1', after: 'home', title: 'From map-first to answer-first', why: 'The question at a stop is “when?”, not “where?”. Leading with arrival times cut time-on-task from 41 s to 8 s.' },
      { before: 'homeOfficial', after: 'home', title: 'Landmark stop names', why: 'People said “opposite the Clock Tower”, not “NL-14”. Matching their language removed the confusion.' },
      { before: 'payV1', after: 'pay', title: 'Guest checkout', why: 'An account wall at the moment of need lost 2 of 5 testers. Guest tickets keep the flow to one screen.' },
    ],
    designSystem: {
      colors: [
        { name: 'Lam Blue', hex: '#1F5EFF', role: 'Primary actions, routes', on: '#FFFFFF' },
        { name: 'Night', hex: '#0F1B33', role: 'Text', on: '#FFFFFF' },
        { name: 'Live Green', hex: '#0B7A3B', role: 'Live status, your stop', on: '#FFFFFF' },
        { name: 'Mist', hex: '#F4F7FB', role: 'Background', on: '#0F1B33' },
      ],
      type: [['Display', 'Inter ExtraBold 30/34'], ['Title', 'Inter Bold 21/26'], ['Body', 'Inter Regular 16/22'], ['Arrival number', 'Inter Bold 24 tabular']],
      components: ['Route badge', 'Live chip', 'Arrival row', 'Stop timeline', 'Primary / ghost button', 'Tab bar'],
      a11y: ['All text meets WCAG AA contrast (see the contrast ratios above)', 'Touch targets at least 48 × 48 px', 'Large-text mode from the first screen', 'Status never shown by colour alone — always a word (“Live”, “Passed”)'],
    },
    mockups: [
      { screen: 'onboard', title: 'Welcome', note: 'Location first, but “choose my stop” is always offered. Text size set before anything else.' },
      { screen: 'home', title: 'Nearby stops', note: 'Answers “when is my bus?” at a glance. The soonest bus is coloured; landmarks under every stop.' },
      { screen: 'live', title: 'Live bus', note: '“2 stops away” is easier to trust than a clock. The timeline marks where the bus is and where you are.' },
      { screen: 'plan', title: 'Trip planner', note: 'Max three options. Badges and walking icons let you compare at a glance.' },
      { screen: 'pay', title: 'Buy ticket', note: 'Local payment apps first. Senior fare shown so riders know before boarding.' },
      { screen: 'ticket', title: 'QR ticket', note: 'High-contrast QR, countdown and brightness boost for quick scanning by the driver.' },
    ],
    responsive: {
      screen: 'web',
      url: 'lam.bt',
      intro: 'The web version lets people plan from a laptop and serves riders who don’t install apps. One layout, three breakpoints.',
      breakpoints: [
        { device: 'desktop', label: 'Desktop · 1440', note: 'Two columns: planner and departures beside a large live map.' },
        { device: 'tablet', label: 'Tablet · 834', note: 'Map moves on top; departures flow into a two-column grid.' },
        { device: 'phone', label: 'Mobile · 390', note: 'Single column, shorter map, menu collapses to a hamburger. Same content order as the app.' },
      ],
    },
    prototypeFlow: [['Welcome', 'onboard'], ['Nearby stops', 'home'], ['Live bus', 'live'], ['Buy ticket', 'pay'], ['QR ticket', 'ticket']],
    results: {
      metrics: [
        { label: 'Time to find next bus', before: '41 s', after: '8 s' },
        { label: 'Task success (all tasks)', before: '53%', after: '100%' },
        { label: 'SUS score', before: '64', after: '86' },
      ],
      outcomes: ['A home screen that answers “when is my bus?” in one glance.', 'Landmark-first stop naming that matches how people navigate.', 'Guest checkout so first-time riders can start without an account.'],
      quote: { text: 'Now I can wait in the shop until it says two minutes.', who: 'Round 2 participant, daily rider' },
    },
    reflection: {
      learned: ['My own assumption (map-first) was the biggest usability problem — testing early saved me from polishing the wrong design.', 'Using riders’ own words for stops mattered more than any visual change.'],
      next: ['Dzongkha language option', 'SMS arrival alerts for basic phones', 'Test with drivers scanning QR tickets in daylight'],
    },
  },

  // ───────────────────────────── TSHECHU ─────────────────────────────
  {
    slug: 'tshechu',
    index: '02',
    title: 'Tshechu',
    tagline: 'Understand the festival, not just watch it.',
    accent: '#FF6B5B',
    accent2: '#FFB020',
    platform: 'Mobile app + responsive web guide',
    role: 'Solo UX designer — research to prototype',
    team: 'Individual project · 1 licensed guide as advisor',
    duration: '5 weeks',
    tools: ['Figma', 'FigJam', 'Notion'],
    prototype: '',
    cover: { phone: 'today', web: 'web' },
    summary: 'A festival companion for visitors: today’s mask-dance schedule, the meaning behind each dance, and etiquette in plain words.',
    tldr: {
      problem: 'Visitors watch dances without knowing their stories and are unsure about etiquette.',
      solution: 'A live “now dancing” card, 60-second stories and etiquette shown on the dance it applies to.',
      outcome: 'Testers explained a dance’s meaning correctly 5 of 5 times (from 2 of 5).',
    },
    overview: {
      problem: 'Visitors often watch the dances without knowing their stories, miss key moments because schedules are hard to find, and are unsure about dress and photo etiquette.',
      goal: 'Help visitors follow a tshechu respectfully and understand what each dance means as it happens.',
      responsibilities: ['Interviews with guides & visitors', 'Field observation', 'Personas & journey map', 'Content design', 'Wireframes → hi-fi', 'Usability testing'],
      constraints: ['Very weak signal in crowded courtyards', 'Content must be culturally accurate', 'Readable in bright sunlight'],
      success: ['Find what is dancing now in under 10 s', 'Explain one dance’s meaning after reading', 'Know photo rules without searching'],
    },
    research: {
      questions: ['What do visitors want to know while a dance is happening?', 'Where do etiquette mistakes happen?', 'How do guides explain the dances today?'],
      methods: [
        { name: 'Interviews', n: '4 visitors · 2 guides', detail: '30-minute remote and in-person interviews.' },
        { name: 'Field observation', n: '1 festival day', detail: 'Noted when people looked confused or broke etiquette.' },
        { name: 'Content review', n: '5 sources', detail: 'Guidebooks and festival pages, checked with a guide.' },
      ],
      competitors: [
        { name: 'Printed guidebooks', good: 'Deep cultural detail', gap: 'Long text; not tied to what is happening now' },
        { name: 'Official festival calendar (web)', good: 'Accurate dates', gap: 'No dance order, stories or etiquette' },
        { name: 'General travel apps', good: 'Reviews and photos', gap: 'Generic tips, need internet' },
      ],
      affinity: [
        { title: 'Meaning', notes: ['“What is this dance about?”', 'Stories too long to read standing', 'Want to know the characters'] },
        { title: 'Timing', notes: ['Missed the main dance', 'Schedule only on a notice board', 'Don’t know how long dances last'] },
        { title: 'Etiquette', notes: ['Unsure about photos', 'Sat in elders’ seats', 'Not sure what to wear'] },
        { title: 'Connectivity', notes: ['No signal in the crowd', 'Pages wouldn’t load', 'Battery drains fast'] },
      ],
      insights: [
        { text: 'Visitors want the story of the dance they are watching right now.', evidence: '4 of 4 visitors' },
        { text: 'Etiquette questions (dress, photos, seating) come up again and again.', evidence: 'Both guides, 12+ times a day' },
        { text: 'Connectivity in the courtyard is weak — content must work offline.', evidence: 'Observed: no data for 40+ min' },
      ],
    },
    personas: [
      { name: 'Sarah, 31', tag: 'First-time visitor from Australia', bio: 'Booked a 7-day trip around the Paro Tshechu. Loves culture but feels awkward not knowing the rules.', quote: '“What does this dance mean?”', goals: ['Understand what she is watching', 'Be respectful', 'Not miss the highlights'], pains: ['Long texts', 'No signal in the crowd'], tech: 'iPhone, travel apps' },
      { name: 'Tshering, 27', tag: 'Licensed tour guide', bio: 'Guides 4–6 groups each festival season and repeats the same basics many times a day.', quote: '“I explain the same basics all day.”', goals: ['Something to share with guests', 'Accurate schedule'], pains: ['Guests missing the main dances', 'Guests breaking etiquette'], tech: 'Android, WhatsApp' },
    ],
    journey: {
      persona: 'Sarah',
      stages: [
        { stage: 'Before trip', doing: 'Searches for dates online', feel: 3, opp: 'Festival list with offline download' },
        { stage: 'Arrive', doing: 'Unsure what to wear or where to sit', feel: 2, opp: 'Short etiquette checklist' },
        { stage: 'Watch', doing: 'Sees a dance, no idea what it means', feel: 2, opp: '“Now dancing” + 60-second story' },
        { stage: 'Take photos', doing: 'Worries about flash and space', feel: 2, opp: 'Photo rule on the dance card' },
        { stage: 'After', doing: 'Shares photos, wants to remember', feel: 4, opp: 'My day timeline to keep' },
      ],
    },
    problemStatement: 'Sarah is a first-time visitor who needs to understand each dance and the etiquette in the moment because she wants to be respectful and not just watch without meaning.',
    hmw: ['How might we link the schedule to the story of what is happening now?', 'How might we show etiquette exactly when it matters?', 'How might we make it all work with no signal?'],
    ideation: {
      method: 'Crazy 8s, then an impact/effort matrix with the advisor guide.',
      ideas: [
        { title: 'Now dancing card', sketch: 'big', pick: true, impact: 0.92, effort: 0.35 },
        { title: 'Day timeline', sketch: 'timeline', pick: true, impact: 0.78, effort: 0.25 },
        { title: '60-sec stories', sketch: 'list', pick: true, impact: 0.85, effort: 0.4 },
        { title: 'Audio guide', sketch: 'audio', impact: 0.7, effort: 0.7 },
        { title: 'Courtyard map', sketch: 'map', impact: 0.55, effort: 0.45 },
        { title: 'AR mask info', sketch: 'cards', impact: 0.6, effort: 0.95 },
        { title: 'Etiquette quiz', sketch: 'form', impact: 0.35, effort: 0.3 },
        { title: 'Guide chat', sketch: 'chat', impact: 0.45, effort: 0.8 },
      ],
      decision: 'I chose the “now dancing” card, a day timeline and 60-second stories: high impact and they work offline. AR was exciting but too costly and needs a strong signal — saved for later.',
    },
    architecture: {
      sitemap: { root: 'Tshechu', children: [
        { name: 'Today', items: ['Now dancing', 'Next up'] },
        { name: 'Dances', items: ['Story', 'Etiquette tips'] },
        { name: 'Map', items: ['Zones', 'Facilities'] },
        { name: 'My day', items: ['Saved dances', 'Share plan'] },
      ] },
      flow: ['Choose festival', 'Download offline', 'See “now dancing”', 'Read the story', 'Save next dance'],
      flowNote: 'The download step comes before arrival, so everything after it works with no signal.',
    },
    wireframes: {
      intro: 'Wireframes tested the content order. Early versions copied the guidebook pattern: a schedule table and long dance texts, with etiquette in its own tab.',
      screens: [
        { screen: 'festivalsV1', title: 'Festivals v1', note: 'No offline option — I hadn’t yet seen the signal problem in the field.' },
        { screen: 'todayV1', title: 'Schedule v1 — table', note: 'A time table by day. Accurate, but no sense of “now”.' },
        { screen: 'danceV1', title: 'Dance v1 — long text', note: 'Full history from guidebooks, no images.' },
        { screen: 'map', title: 'Courtyard map', note: 'Zones drawn simply so visitors know where not to stand.' },
        { screen: 'myday', title: 'My day', note: 'Saved dances with reminders.' },
      ],
    },
    testing: {
      method: 'Moderated tests with visitors (remote, screen-shared) and one guide, using the clickable prototype. Round 2 after changes.',
      participants: '5 participants per round · 4 visitors + 1 guide',
      tasks: [
        { task: 'Find what is dancing now', r1: 60, r2: 100, t1: 24, t2: 5 },
        { task: 'Explain one dance’s meaning', r1: 40, r2: 100, t1: 88, t2: 35 },
        { task: 'Check if photos are allowed', r1: 20, r2: 100, t1: 52, t2: 6 },
      ],
      findings: [
        { sev: 'High', finding: 'Etiquette lived in a separate tab nobody opened.', evidence: '4 of 5 never found the photo rule', fix: 'Etiquette badges now appear on each dance card where they matter.' },
        { sev: 'High', finding: 'Stories were long paragraphs.', evidence: 'Avg. 22 s reading before giving up', fix: 'Rewritten as “the story in 60 seconds” in three beats.' },
        { sev: 'Medium', finding: 'Table schedule had no sense of “now”.', evidence: '“Which one is on?” — P1', fix: 'Live “now dancing” card with progress bar.' },
        { sev: 'Medium', finding: 'Nobody expected offline problems.', evidence: 'Guide: “Signal dies by 10 am”', fix: 'Download banner and “Offline ready” chip.' },
      ],
    },
    iterations: [
      { before: 'todayV1', after: 'today', title: 'From timetable to “now dancing”', why: 'Visitors ask “what is this?”, not “what’s at 11:30?”. The live card ties the schedule to the story.' },
      { before: 'danceV1', after: 'dance', title: 'The story in 60 seconds', why: 'Standing in a crowd, people read in seconds. Three numbered beats beat four paragraphs.' },
      { before: 'festivalsV1', after: 'festivals', title: 'Offline before arrival', why: 'Observation showed no signal for 40+ minutes. Downloading at the hotel avoids blank screens.' },
    ],
    designSystem: {
      colors: [
        { name: 'Lhakhang Maroon', hex: '#7A1F2B', role: 'Primary, headings', on: '#FFFFFF' },
        { name: 'Saffron', hex: '#E8A317', role: 'Live / highlight', on: '#2A1A14' },
        { name: 'Pine', hex: '#2F6B4F', role: 'Allowed / offline', on: '#FFFFFF' },
        { name: 'Cream', hex: '#FBF6EE', role: 'Background', on: '#2A1A14' },
      ],
      type: [['Display', 'Syne ExtraBold 30/34'], ['Title', 'Inter Bold 21/26'], ['Body', 'Inter Regular 16/24'], ['Time', 'Inter ExtraBold 15 tabular']],
      components: ['Now-dancing card', 'Timeline row', 'Etiquette badge', 'Story beat', 'Offline chip', 'Tab bar'],
      a11y: ['Cream background reduces glare in sunlight', 'Every badge has an icon and a word', 'Audio version of each story', 'Colours inspired by temple art, checked for contrast'],
    },
    mockups: [
      { screen: 'festivals', title: 'Choose a festival', note: 'Download size shown up front so visitors can save data on hotel Wi-Fi.' },
      { screen: 'today', title: 'Today', note: 'The live card links schedule and story. A seating tip appears only during the dance it applies to.' },
      { screen: 'dance', title: 'Dance story', note: 'Three beats, a “watch for” hint and inline etiquette. Audio for people who prefer to listen.' },
      { screen: 'etiquette', title: 'Before you go', note: 'Four rules only, written kindly. Reminders return on the right dance.' },
      { screen: 'map', title: 'Courtyard map', note: 'Shows where to sit and where not to stand, plus facilities.' },
      { screen: 'myday', title: 'My day', note: 'Saved dances with nudges; guides share the plan by QR with no internet.' },
    ],
    responsive: {
      screen: 'web',
      url: 'tshechu.bt',
      intro: 'Visitors plan on a laptop before the trip, so the web guide comes first there; in the courtyard they switch to their phone.',
      breakpoints: [
        { device: 'desktop', label: 'Desktop · 1440', note: 'Split hero with search, then a 4-column festival grid.' },
        { device: 'tablet', label: 'Tablet · 834', note: 'Art moves above the headline; grid drops to 2 columns.' },
        { device: 'phone', label: 'Mobile · 390', note: 'Compact list cards with thumbnails, 34 px headline, menu in a hamburger.' },
      ],
    },
    prototypeFlow: [['Choose festival', 'festivals'], ['Today', 'today'], ['Dance story', 'dance'], ['My day', 'myday'], ['Courtyard map', 'map']],
    results: {
      metrics: [
        { label: 'Explained a dance correctly', before: '2 / 5', after: '5 / 5' },
        { label: 'Found the photo rule', before: '20%', after: '100%' },
        { label: 'SUS score', before: '61', after: '84' },
      ],
      outcomes: ['A live “now dancing” card that ties schedule and story together.', 'Etiquette shown in context, right when visitors need it.', 'Offline-first design for crowded courtyards with weak signal.'],
      quote: { text: 'I finally knew why everyone laughed at the hunter’s servant.', who: 'Round 2 participant, first-time visitor' },
    },
    reflection: {
      learned: ['Going to a festival in person revealed the offline problem — no interview mentioned it.', 'Content design (what to say, how short) was the real design work here.'],
      next: ['Audio stories narrated by local guides', 'Cultural review of all stories by a lam or historian', 'Dzongkha and Hindi translations'],
    },
  },

  // ───────────────────────────── MENKHANG ─────────────────────────────
  {
    slug: 'menkhang',
    index: '03',
    title: 'Menkhang',
    tagline: 'Wait for your turn — not in the corridor.',
    accent: '#2FD3A5',
    accent2: '#14A3C7',
    platform: 'Mobile app + responsive web tracker',
    role: 'Solo UX designer — research to prototype',
    team: 'Individual project',
    duration: '6 weeks',
    tools: ['Figma', 'FigJam', 'Maze', 'Google Forms'],
    prototype: '',
    cover: { phone: 'queue', web: 'desk' },
    summary: 'A clinic token and queue tracker: book a token, see your live position, and get an SMS before your turn.',
    tldr: {
      problem: 'Patients wait hours in crowded corridors because they can’t tell when their number will be called.',
      solution: 'Live “people ahead” tracking, family booking, and SMS for basic phones.',
      outcome: 'Booking for a family member went from 40% to 100% task success.',
    },
    overview: {
      problem: 'At busy outpatient clinics, patients collect a paper token and wait nearby for hours because they cannot tell when their number will be called.',
      goal: 'Reduce the time patients spend standing in crowded corridors by letting them track their place in the queue from anywhere.',
      responsibilities: ['Interviews & survey', 'Waiting-area observation', 'Personas & journey map', 'Service blueprint', 'Wireframes → hi-fi', 'Usability testing'],
      constraints: ['Many patients use basic phones', 'Caregivers book for elders', 'Wait times change — avoid false promises'],
      success: ['Book a token for a family member in under 1 min', 'Understand queue position at a glance', 'Patients on basic phones get updates'],
    },
    research: {
      questions: ['Why don’t patients leave the corridor?', 'Who manages tokens for elderly patients?', 'What phones and data do patients have?'],
      methods: [
        { name: 'Interviews', n: '6 patients & caregivers', detail: 'Short interviews in and after clinic visits.' },
        { name: 'Observation', n: '2 mornings', detail: 'Watched the OPD waiting area and token desk.' },
        { name: 'Survey', n: '35 responses', detail: 'Phone type, data access and SMS use.' },
      ],
      competitors: [
        { name: 'Paper token (current)', good: 'Simple, no phone needed', gap: 'No way to know your position away from the hall' },
        { name: 'Bank queue apps', good: 'Live position and alerts', gap: 'App only — leaves basic-phone users out' },
        { name: 'SMS reminders', good: 'Works on any phone', gap: 'One-way; no live position or check-in' },
      ],
      affinity: [
        { title: 'Fear of missing', notes: ['“If I leave, they’ll skip me”', 'Stand near the door for hours', 'Can’t go to the toilet'] },
        { title: 'Caregiving', notes: ['Book for grandparents', 'Not always at the hospital', 'Elders don’t use apps'] },
        { title: 'Trust in time', notes: ['Estimates change and feel like lies', 'Prefer a number of people', 'Doctors take breaks'] },
        { title: 'Phones', notes: ['Basic phones common for elders', 'SMS always works', 'Data runs out'] },
      ],
      insights: [
        { text: 'Patients don’t leave the corridor because they fear missing their call.', evidence: '6 of 6 interviewees' },
        { text: 'Caregivers often manage tokens for elderly family members.', evidence: '14 of 35 survey responses' },
        { text: 'Many patients use basic phones — SMS matters as much as an app.', evidence: '11 of 35 have a basic phone' },
      ],
    },
    personas: [
      { name: 'Sonam, 41', tag: 'Parent with a sick child', bio: 'Works in town and brings her son to the OPD. Takes a full day off every time because she can’t predict the wait.', quote: '“I can’t sit here for three hours.”', goals: ['See live queue position', 'Reminder 15 min before'], pains: ['Crowded corridors', 'Missing her number'], tech: 'Android smartphone' },
      { name: 'Pema, 24', tag: 'Caregiver for her grandfather', bio: 'Books appointments for Ap Dorji, who has a basic phone and can’t read small text.', quote: '“I book for him, but I’m not always there.”', goals: ['Manage tokens for family', 'SMS to grandfather’s phone'], pains: ['Paper tokens get lost', 'Booking for others is hidden'], tech: 'iPhone; grandfather uses a basic phone' },
    ],
    journey: {
      persona: 'Sonam',
      stages: [
        { stage: 'Arrive early', doing: 'Queues at 7 am for a paper token', feel: 2, opp: 'Book a token from home' },
        { stage: 'Wait', doing: 'Stands in the corridor with her son', feel: 1, opp: 'Live position from anywhere' },
        { stage: 'Step away', doing: 'Afraid to leave for food', feel: 1, opp: 'SMS when 3 people ahead' },
        { stage: 'Called', doing: 'Rushes to the room', feel: 3, opp: 'Clear room number in the alert' },
        { stage: 'Consult', doing: 'Sees the doctor', feel: 4, opp: 'Check-in that tells staff she is here' },
      ],
    },
    problemStatement: 'Sonam is a working parent who needs to know her real place in the clinic queue because fear of missing her call keeps her and her sick child standing in a crowded corridor for hours.',
    hmw: ['How might we make leaving the corridor feel safe?', 'How might we show the queue honestly when times keep changing?', 'How might caregivers book and track for someone else?'],
    ideation: {
      method: 'Crazy 8s, then a service blueprint to check each idea against front-desk work.',
      ideas: [
        { title: 'People-ahead ring', sketch: 'ring', pick: true, impact: 0.9, effort: 0.3 },
        { title: 'SMS alerts', sketch: 'chat', pick: true, impact: 0.88, effort: 0.4 },
        { title: '“Who is this for?”', sketch: 'form', pick: true, impact: 0.8, effort: 0.25 },
        { title: 'Countdown clock', sketch: 'big', impact: 0.5, effort: 0.2 },
        { title: 'Waiting-hall screen', sketch: 'board', impact: 0.65, effort: 0.6 },
        { title: 'QR check-in', sketch: 'qr', impact: 0.55, effort: 0.5 },
        { title: 'Doctor timeline', sketch: 'timeline', impact: 0.4, effort: 0.7 },
        { title: 'Family cards', sketch: 'cards', impact: 0.6, effort: 0.35 },
      ],
      decision: 'I picked the people-ahead ring, SMS alerts and “who is this for?” booking. A countdown clock was easier but research showed changing times break trust — so time became a range, shown second.',
    },
    architecture: {
      sitemap: { root: 'Menkhang', children: [
        { name: 'My token', items: ['Queue', 'Check in'] },
        { name: 'Book', items: ['Who for', 'Clinic & date'] },
        { name: 'Family', items: ['Members', 'Their tokens'] },
        { name: 'Help', items: ['Clinics', 'Contact'] },
      ] },
      flow: ['Who is this for?', 'Choose clinic', 'Get token', 'Track / SMS', 'Check in'],
      flowNote: 'The patient journey also connects to a front-desk console, so staff see who is on the way and who has checked in.',
    },
    wireframes: {
      intro: 'My first wireframes used a long form and a big countdown — patterns I had seen in other apps. Testing showed both were wrong for this context.',
      screens: [
        { screen: 'bookV1', title: 'Booking v1 — long form', note: 'CID, date of birth, family booking hidden in settings.' },
        { screen: 'token', title: 'Token confirmation', note: 'One big token number and what happens next.' },
        { screen: 'queueV1', title: 'Queue v1 — countdown', note: 'Estimated minutes as the hero number.' },
        { screen: 'alertV1', title: 'Alerts v1 — push only', note: 'Assumed everyone has the app installed.' },
        { screen: 'checkin', title: 'Check-in', note: 'Tells staff the patient is present.' },
      ],
    },
    testing: {
      method: 'Moderated sessions with patients and caregivers on their own phones (Round 1 mid-fi, Round 2 hi-fi). One basic-phone user tested the SMS flow.',
      participants: '5 participants per round · 2 caregivers, 2 patients, 1 elderly basic-phone user',
      tasks: [
        { task: 'Book a token for a family member', r1: 40, r2: 100, t1: 118, t2: 46 },
        { task: 'Find how many people are ahead', r1: 60, r2: 100, t1: 19, t2: 4 },
        { task: 'Check in on arrival', r1: 80, r2: 100, t1: 22, t2: 9 },
      ],
      findings: [
        { sev: 'High', finding: 'Booking for someone else was hidden in settings.', evidence: '3 of 5 booked for themselves by mistake', fix: '“Who is this for?” is now the first booking question.' },
        { sev: 'High', finding: '“Estimated time” confused people when it changed.', evidence: '“It said 20, now it says 35?” — P3', fix: 'Lead with people ahead; time is a range, shown second.' },
        { sev: 'Medium', finding: 'Push alerts missed the basic-phone user.', evidence: 'P5 never received an alert', fix: 'SMS with room number + push for app users.' },
        { sev: 'Low', finding: 'Long form asked for data the clinic already has.', evidence: 'Avg. 118 s to book', fix: 'Saved family profiles; 2 short steps.' },
      ],
    },
    iterations: [
      { before: 'queueV1', after: 'queue', title: 'People ahead, not minutes', why: 'A changing clock felt like a broken promise. “6 people ahead” only goes down, so it builds trust.' },
      { before: 'bookV1', after: 'book', title: '“Who is this for?” first', why: 'Caregivers are core users, not an edge case. Moving the question first fixed 3 of 5 wrong bookings.' },
      { before: 'alertV1', after: 'alert', title: 'SMS for everyone', why: 'A third of patients use basic phones. SMS with the room number reaches them; push is a bonus.' },
    ],
    designSystem: {
      colors: [
        { name: 'Menkhang Teal', hex: '#0E8C7A', role: 'Primary, progress', on: '#FFFFFF' },
        { name: 'Deep Teal', hex: '#0B2B27', role: 'Text, boards', on: '#FFFFFF' },
        { name: 'Amber', hex: '#8A5A00', role: 'Booked / waiting', on: '#FFFFFF' },
        { name: 'Calm', hex: '#F2F7F6', role: 'Background', on: '#0B2B27' },
      ],
      type: [['Display', 'Inter ExtraBold 30/34'], ['Big number', 'Inter ExtraBold 72 tabular'], ['Body', 'Inter Regular 16/22'], ['Label', 'Inter SemiBold 13 caps']],
      components: ['Progress ring', 'Token card', 'Now-serving board', 'Status pill', 'Who-for selector', 'Reminder toggle'],
      a11y: ['Calm, low-saturation colours for a stressful place', 'Numbers at 64–72 px for older eyes', 'SMS path for non-smartphone users', 'Status pills always include text'],
    },
    mockups: [
      { screen: 'book', title: 'Who is this for?', note: 'Caregiving is built into step one. SMS goes to the patient’s own basic phone.' },
      { screen: 'token', title: 'Token booked', note: 'The token number is the hero; the next step (wait anywhere, we’ll text you) is explained right away.' },
      { screen: 'queue', title: 'My queue', note: 'The ring shrinks as people are served. Time shown as a range so it never “goes backwards”.' },
      { screen: 'alert', title: 'SMS + notification', note: 'Room number in the message itself, so it works even without opening the app.' },
      { screen: 'family', title: 'Family tokens', note: 'Pema sees her grandfather’s and mother’s tokens in one place.' },
      { screen: 'checkin', title: 'Checked in', note: 'Confirms presence to staff and mirrors the hall screen so patients know what to watch.' },
    ],
    responsive: {
      screen: 'web',
      url: 'menkhang.bt/t/A-047',
      intro: 'Every SMS includes a link to a web tracker, so patients without the app still see live progress. Staff use a desktop console.',
      breakpoints: [
        { device: 'desktop', label: 'Desktop · 1440', note: 'Token and ring beside the now-serving board and SMS settings.' },
        { device: 'tablet', label: 'Tablet · 834', note: 'Token card full width; board and settings in two columns below.' },
        { device: 'phone', label: 'Mobile · 390', note: 'Opened from the SMS link: ring above the token number, one column.' },
      ],
      extra: [{ screen: 'desk', device: 'desktop', title: 'Front-desk console', note: 'Staff see who is checked in, on the way or SMS’d, and call the next patient in one click.', url: 'desk.menkhang.bt' }],
    },
    prototypeFlow: [['Who is this for?', 'book'], ['Token booked', 'token'], ['My queue', 'queue'], ['SMS alert', 'alert'], ['Checked in', 'checkin']],
    results: {
      metrics: [
        { label: 'Booked for family correctly', before: '40%', after: '100%' },
        { label: 'Time to book', before: '118 s', after: '46 s' },
        { label: 'SUS score', before: '58', after: '83' },
      ],
      outcomes: ['Queue position shown as people ahead — clearer than a changing clock.', 'Family booking built into the main flow for caregivers.', 'SMS fallback so patients on basic phones are not left out.'],
      quote: { text: 'I could have waited in the canteen with my son.', who: 'Round 2 participant, parent' },
    },
    reflection: {
      learned: ['“Accurate” and “trustworthy” are different: a range people can trust beats a precise number that keeps changing.', 'Designing for the caregiver, not only the patient, opened up the most important feature.'],
      next: ['Waiting-hall display that mirrors the app', 'Dzongkha SMS templates', 'Pilot with one OPD and measure real corridor time'],
    },
  },
]

export const getCase = (slug) => caseStudies.find((c) => c.slug === slug)
