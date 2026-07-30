import type { CaseData } from '../types';

export const midnightMurder: CaseData = {
  id: 'midnight-murder',
  title: 'The Midnight Murder',
  description:
    'A wealthy art collector is found dead in his locked library. Five guests were in the mansion. One of them is lying.',
  difficulty: 3,
  estimatedMinutes: 15,
  setting: 'A gothic mansion on a rainy English moor, 1952.',
  openingScene:
    `Rain hammers the windows of Ashworth Manor.\n\nYou have been called in as an independent investigator — no badge, just a sharp mind.\n\nLord Edmund Ashworth, 67, art collector and antiquarian, was found dead in his locked library at midnight. A glass of brandy sits beside him. Five guests remain in the house. Nobody has left.\n\nThe local constable is useless. You have until dawn.\n\nYou can explore rooms, inspect objects, and interrogate suspects. When you are ready, make your accusation.\n\nWhere would you like to begin?`,
  victim: {
    name: 'Lord Edmund Ashworth',
    age: 67,
    occupation: 'Art collector and antiquarian',
    causeOfDeath: 'Cyanide poisoning via a glass of brandy',
  },
  murdererIndex: 2,
  suspects: [
    {
      id: 0,
      name: 'Dr. Victor Crane',
      role: 'Family physician',
      keywords: ['crane', 'doctor', 'dr crane', 'dr. crane', 'physician', 'victor'],
      defaultResponse:
        `Dr. Crane adjusts his glasses for the third time in as many minutes.\n\n"I was in the billiard room until after midnight. Reading. Alone."\n\nHis voice is steady. His hands are not.\n\n"I heard nothing unusual until I heard someone shouting that Lord Ashworth was dead."\n\nHe glances at the library door.\n\nYou can ask him about: the body, the door, or his alibi.`,
      topics: [
        {
          keywords: ['body', 'victim', 'found', 'dead', 'discover'],
          response:
            `"I forced the library door at around quarter past midnight. The body was cold — or cold enough. He had been sitting in his chair. The brandy glass was still in his hand."\n\nHe pauses.\n\n"I am a physician. I know what cyanide looks like. I said nothing because I did not want to cause panic before the constable arrived."`,
          revealsClueId: 1,
        },
        {
          keywords: ['door', 'locked', 'library', 'midnight', 'forced'],
          response:
            `"The door was locked from the inside. There is no other exit. I cannot explain it."\n\nHe avoids your eyes.\n\n"I have been asking myself the same question all night."`,
        },
        {
          keywords: ['alibi', 'billiard', 'billiards', 'where', 'night'],
          response:
            `"Billiard room. East corridor, ground floor. I was alone — I cannot prove it. I heard the piano around eleven fifteen. I assumed it was the Reverend."\n\nHe finally meets your gaze.\n\n"I did not kill him."`,
        },
      ],
    },
    {
      id: 1,
      name: 'James Ashworth',
      role: "Lord Ashworth's estranged son",
      keywords: ['james', 'ashworth', 'son', 'james ashworth', 'heir'],
      defaultResponse:
        `James Ashworth leans against the wall with studied casualness.\n\n"I was in the garden. Smoking. The rain started around eleven and I came inside."\n\nHe does not look like a man in mourning.\n\n"Before you ask — yes, we had our differences. He was going to change the will. Again."\n\nHe says it like it means nothing.\n\nYou can ask him about: the will, the garden, or his father.`,
      topics: [
        {
          keywords: ['will', 'money', 'inheritance', 'change', 'estate'],
          response:
            `"He threatened to cut me out every few years. It was a game to him."\n\nHis jaw tightens.\n\n"This time he meant it. He found out about my debts. That's all I'm saying without a solicitor present."`,
        },
        {
          keywords: ['garden', 'outside', 'cigarette', 'rain', 'smoking'],
          response:
            `"I was near the east wall. There's a stone bench — you can still see the cigarette stubs if the rain hasn't washed them away."\n\nHe pulls out a cigarette box. Same brand.\n\n"I came inside when the rain got heavy. Quarter to midnight, maybe."`,
          revealsClueId: 4,
        },
        {
          keywords: ['father', 'lord', 'relationship', 'angry', 'fight'],
          response:
            `"We argued after dinner. He said I'd never amount to anything. Standard repertoire."\n\nA pause.\n\n"I did not poison him. If I'd wanted him dead I'd have been a lot more patient about it."`,
        },
      ],
    },
    {
      id: 2,
      name: 'Margaret Hale',
      role: "Lord Ashworth's personal secretary",
      keywords: ['margaret', 'hale', 'secretary', 'margaret hale'],
      defaultResponse:
        `Margaret Hale sits perfectly straight. Her hands are folded. Nothing about her is accidental.\n\n"I served Lord Ashworth his brandy at eleven o'clock, as I do every evening. I then retired to my room."\n\nShe speaks as if reading from a prepared statement.\n\n"I heard nothing after that."\n\nYou can ask her about: the brandy, her room, or Vienna.`,
      topics: [
        {
          keywords: ['brandy', 'served', 'drink', 'decanter', 'glass'],
          response:
            `"I poured one glass. Lord Ashworth preferred his brandy alone, without company. I set it on the sideboard, as always."\n\nNot a flicker.\n\n"I did not touch the decanter after that."`,
        },
        {
          keywords: ['room', 'retired', 'midnight', 'eleven', 'alibi', 'where'],
          response:
            `"I was in my room from eleven o'clock. I read until half past, then I slept."\n\nShe holds your gaze without blinking.\n\nThe cook saw her in the kitchen at quarter to midnight, asking about brandy. She does not mention this.`,
        },
        {
          keywords: ['vienna', 'past', 'history', 'note', 'letter'],
          response:
            `For a fraction of a second — barely a heartbeat — something moves behind her eyes.\n\n"I have no idea what you are referring to."\n\nShe smooths an invisible wrinkle from her skirt.\n\n"Lord Ashworth and I had a professional relationship. Nothing more."`,
        },
        {
          keywords: ['kitchen', 'cook', 'midnight', 'quarter'],
          response:
            `A pause, just slightly too long.\n\n"I may have gone downstairs for water. I don't recall precisely."\n\nShe does not change her expression.\n\n"Is that significant?"`,
        },
      ],
    },
    {
      id: 3,
      name: 'Reverend Thomas Doyle',
      role: 'Old friend and priest',
      keywords: ['reverend', 'doyle', 'thomas', 'priest', 'reverend doyle', 'thomas doyle'],
      defaultResponse:
        `Reverend Doyle sits with his hands clasped on his knees. He looks like a man who has been carrying something heavy for a long time.\n\n"Edmund and I were friends for forty years. I cannot believe—"\n\nHe stops. Swallows.\n\n"I was in the sitting room all evening. I heard the piano playing around eleven fifteen."\n\nYou can ask him about: the piano, the library, or what he is hiding.`,
      topics: [
        {
          keywords: ['piano', 'music', 'playing', 'heard', 'eleven'],
          response:
            `"Yes, someone was playing. A Chopin nocturne — quite beautifully."\n\nA long pause.\n\n"I do not play piano myself. I assumed it was one of the others."\n\nHe does not say who. He is covering for someone, and he knows that you know it.`,
          revealsClueId: 8,
        },
        {
          keywords: ['library', 'door', 'body', 'ashworth'],
          response:
            `"I did not go near the library after dinner. Edmund had asked not to be disturbed."\n\nHis voice drops.\n\n"He sent me a note earlier in the week. He said he had uncovered something troubling. I should have taken it more seriously."`,
        },
        {
          keywords: ['hiding', 'secret', 'trouble', 'know', 'confession'],
          response:
            `He looks at you for a long moment.\n\n"There are things said in confidence that I cannot repeat. Even now."\n\nHis hands tighten on his knees.\n\n"What I can tell you is that Edmund was frightened. He had been frightened for some weeks."`,
        },
      ],
    },
    {
      id: 4,
      name: 'Clara Webb',
      role: 'Visiting art appraiser',
      keywords: ['clara', 'webb', 'appraiser', 'clara webb', 'art appraiser'],
      defaultResponse:
        `Clara Webb is the only person in the house who seems genuinely surprised by the murder.\n\n"I was in the east wing all evening. Lord Ashworth commissioned me to catalogue the collection — there are over sixty pieces."\n\nShe hesitates.\n\n"I noticed something odd about one of the paintings. I was going to mention it to him in the morning."\n\nYou can ask her about: the paintings, the east wing, or Margaret.`,
      topics: [
        {
          keywords: ['painting', 'paintings', 'odd', 'collection', 'art', 'catalogue'],
          response:
            `"One of the landscapes in the east corridor had been rehung recently. I could tell by the dust marks on the wall."\n\nShe frowns.\n\n"It was slightly crooked, which Lord Ashworth would never have permitted. Something had been moved behind it."\n\nShe did not look behind it. She wishes she had.`,
          revealsClueId: 5,
        },
        {
          keywords: ['east wing', 'corridor', 'evening', 'night'],
          response:
            `"I was there until nearly midnight. The light is better in that corridor than in the gallery — tall windows on the north side."\n\nShe pauses.\n\n"I saw Margaret walking past around quarter to midnight. She was heading toward the kitchen stairs. She didn't see me."`,
        },
        {
          keywords: ['margaret', 'secretary', 'hale'],
          response:
            `"She always made me uneasy, if I'm honest. Too composed. I've met a few people like that — usually they're either very good at their job or very good at hiding something."\n\nShe looks toward the east wing.\n\n"Or both."`,
        },
      ],
    },
  ],
  rooms: [
    {
      id: 1,
      name: 'Library',
      keywords: ['library', 'study', 'crime scene', 'book room', 'where the body', 'body'],
      arrivalText:
        `You stand in the library.\n\nRain beats against the tall windows. Lord Ashworth lies slumped in his armchair, exactly where he was found. The local constable has been considerate enough to touch everything.\n\nA brandy decanter gleams on the sideboard. The cold fireplace still holds its ash. The desk is buried under papers and correspondence.\n\nYou can inspect: the body, the brandy decanter, the desk, the fireplace, or the bookshelf.`,
      searchText:
        `You search the library methodically.\n\nThe room has been locked from the inside — the constable confirmed this. There is no hidden exit you can find. Whatever happened here, the killer found another way.\n\nThe brandy decanter on the sideboard draws your eye. The body. The desk. The fireplace. Each one has something to say.`,
      inspectables: [
        {
          keywords: ['body', 'victim', 'lord', 'ashworth', 'corpse', 'man', 'dead'],
          response:
            `You crouch beside Lord Ashworth.\n\nHis expression is not peaceful. His lips are slightly blue. A faint smell of almonds — barely detectable, but there.\n\nFine white ash dusts his left sleeve. Not fireplace ash. It is too fine, too uniform. Someone burned something nearby, and recently.\n\nHis right index finger has an ink stain. He was writing before he died.`,
          revealsClueId: 2,
        },
        {
          keywords: ['brandy', 'decanter', 'glass', 'drink', 'alcohol', 'sideboard'],
          response:
            `You hold the decanter to the light.\n\nThere is a residue on the inner rim — a faint discolouration that does not belong. You recognise it. Potassium cyanide, or something very like it.\n\nOne glass was poured. The glass beside the body. Nobody else drank from this decanter tonight.`,
          revealsClueId: 1,
        },
        {
          keywords: ['desk', 'paper', 'papers', 'correspondence', 'letter', 'note', 'writing'],
          response:
            `The desk is a chaos of letters and ledger books — but Lord Ashworth was a meticulous man. This chaos was created after his death.\n\nSomeone went through his papers.\n\nWedged under the leg of the inkstand, you find something that was missed: a crumpled note, written in Lord Ashworth's hand.\n\n"I know what you did in Vienna. Meet me in the library at midnight. — E.A."`,
          revealsClueId: 3,
        },
        {
          keywords: ['fireplace', 'hearth', 'ash', 'fire', 'soot', 'chimney'],
          response:
            `The fireplace is cold — it was never lit tonight.\n\nBut there is ash in the grate. Fine, white, papery ash. Recent. Someone burned documents here, and recently enough that the ash has not fully settled.\n\nWhoever did this was in a hurry.`,
        },
        {
          keywords: ['bookshelf', 'books', 'shelf', 'shelves'],
          response:
            `Floor to ceiling. Leather-bound, alphabetised, each spine in perfect order.\n\nExcept one shelf, third from the top, where three books are slightly out of alignment — as if someone pulled them aside quickly and did not bother to straighten them.\n\nBehind them: nothing. Whatever was there is gone.`,
        },
        {
          keywords: ['vial', 'poison', 'cyanide', 'bottle', 'hidden'],
          response:
            `Behind the decanter, tucked into the corner of the sideboard shelf, you find it.\n\nA tiny glass vial, no longer than your thumb. Empty, but not clean. Cyanide traces coat the inside.\n\nSomeone put it here in a hurry. Or did not expect anyone to look this carefully.`,
          revealsClueId: 9,
        },
      ],
    },
    {
      id: 2,
      name: 'Kitchen',
      keywords: ['kitchen', 'cook', 'cellar', 'downstairs', 'below'],
      arrivalText:
        `The kitchen is stone-floored and cold.\n\nThe cook — a stout woman named Mrs. Briggs — is sitting at the large table with a cup of tea, looking shaken. The hearth is warm. A small door in the corner leads to the cellar.\n\nYou can inspect: the cook, the cellar door, or the hearth.`,
      searchText:
        `The kitchen smells of roast and old wood.\n\nMrs. Briggs watches you suspiciously. The cellar door is slightly ajar — the lock looks recently damaged. The hearth fire is lower than it should be for this hour.`,
      inspectables: [
        {
          keywords: ['cook', 'mrs briggs', 'briggs', 'woman', 'staff', 'housekeeper'],
          response:
            `Mrs. Briggs sets down her tea.\n\n"I was here all evening. I don't go upstairs after dinner — not my place."\n\nShe pauses, then decides to tell you.\n\n"Miss Hale came down at quarter to midnight. Asked which brandy Lord Ashworth preferred — the Armagnac or the old cognac. I told her the cognac. He always had the cognac."\n\nShe folds her hands.\n\n"She already knew that. She's been here three years."`,
          revealsClueId: 11,
        },
        {
          keywords: ['cellar', 'door', 'lock', 'broken', 'stairs', 'below'],
          response:
            `The cellar door has a bolt lock. The bolt has been forced — from the inside out.\n\nSomeone locked themselves in the cellar and broke the lock to get out. Or hid something down there and didn't want to leave evidence of having used the key.\n\nThe cellar smells faintly of chemical — sharp and medicinal.`,
          revealsClueId: 10,
        },
        {
          keywords: ['hearth', 'fire', 'kitchen fire'],
          response:
            `The fire is lower than it should be. Someone used the kitchen hearth earlier tonight — there are fresh ash remnants that are not from cooking.\n\nA scrap of paper, unburned at the edge, reads: "...provenance certified, Paris 19..." The rest is ash.`,
        },
      ],
    },
    {
      id: 3,
      name: 'Garden',
      keywords: ['garden', 'outside', 'yard', 'lawn', 'outdoors', 'rain', 'outside'],
      arrivalText:
        `Rain hammers the garden.\n\nYou pull your coat tighter. A stone bench sits near the rose bushes along the east wall. The lawn is soft and sodden.\n\nYou can inspect: the stone bench, the cigarette stubs, or the east wall.`,
      searchText:
        `The garden is dark and rain-soaked. The ground near the east wall is churned — someone stood here for some time.\n\nThree cigarette stubs lie near the bench, already softening in the rain.`,
      inspectables: [
        {
          keywords: ['cigarette', 'stub', 'stubs', 'butt', 'butts', 'tobacco', 'smoking'],
          response:
            `Three cigarette stubs, same brand. The tobacco is still relatively fresh — smoked within the last two or three hours.\n\nYou pick one up and look at the brand: Craven A. You have seen that box before.\n\nIn James Ashworth's coat pocket when he was gesturing at you.`,
          revealsClueId: 4,
        },
        {
          keywords: ['bench', 'stone bench', 'seat', 'sitting'],
          response:
            `The stone bench is wet. A faint impression in the soil nearby suggests someone stood here — pacing, perhaps — for some time.\n\nThe position gives a partial view of the east wing windows and the library window.\n\nSomeone could have watched from here. But in this rain, could they have been sure of what they were seeing?`,
        },
        {
          keywords: ['wall', 'east wall', 'rose', 'roses', 'bush'],
          response:
            `The east wall is ivy-covered stone. Near the base, a section of ivy has been disturbed — pulled aside recently. Behind it: a small recess in the stone. Empty now.\n\nWhatever was hidden there is gone.`,
        },
      ],
    },
    {
      id: 4,
      name: 'East Wing',
      keywords: ['east wing', 'east', 'corridor', 'gallery', 'paintings', 'east corridor'],
      arrivalText:
        `The east wing corridor stretches before you, lined with paintings on both sides.\n\nDust on most surfaces. Clara Webb's cataloguing materials — notebooks, a magnifying glass, a portable light — are set up near the far end.\n\nOne painting, a landscape near the middle of the corridor, hangs slightly crooked.\n\nYou can inspect: the crooked painting, Clara's materials, or the north windows.`,
      searchText:
        `You work your way down the corridor methodically.\n\nMost paintings are exactly as they should be — dust lines intact, hanging level. Except the landscape near the middle. Its dust lines are wrong. It was recently moved.`,
      inspectables: [
        {
          keywords: ['painting', 'landscape', 'crooked', 'moved', 'picture', 'frame'],
          response:
            `You lift the landscape from its hook.\n\nBehind it: a wall safe, recessed into the plaster. The combination dial has been wiped clean of fingerprints.\n\nThe safe is open.\n\nIt is empty. Whatever Lord Ashworth kept here is gone.`,
          revealsClueId: 5,
        },
        {
          keywords: ['safe', 'empty', 'combination', 'vault'],
          response:
            `The safe is a Chubb & Sons model, circa 1930s. Quality workmanship — not easy to crack without the combination.\n\nThe inside dimensions suggest it held documents, not valuables. Papers, perhaps. Or photographs.\n\nWhoever emptied it knew the combination.`,
        },
        {
          keywords: ['clara', 'materials', 'notebook', 'catalogue', 'notes'],
          response:
            `Clara's notebook lists sixty-one paintings. Against three of them she has written "provenance unclear" and circled the entry in red.\n\nAll three are attributed to the same Parisian dealer. The same dealer appears in some of the burned correspondence downstairs.\n\nSomething is wrong with these paintings' histories.`,
        },
      ],
    },
    {
      id: 5,
      name: 'Sitting Room',
      keywords: ['sitting room', 'sitting', 'lounge', 'piano room', 'piano', 'parlour'],
      arrivalText:
        `The sitting room is warm and comfortable — or it was, before tonight.\n\nA grand piano stands against the far wall, lid open. Sheet music is open on the stand. A half-finished cup of tea sits on the side table beside the armchair nearest the fire.\n\nYou can inspect: the piano, the sheet music, or the tea.`,
      searchText:
        `A quiet room. The kind of room where people talk after dinner.\n\nThe piano has been played recently — the keys show finger marks in the fine dust that coats this wing. The armchair by the fire is indented, recently occupied. A cold cup of tea.`,
      inspectables: [
        {
          keywords: ['piano', 'keys', 'instrument', 'played'],
          response:
            `The piano is a Bösendorfer — an expensive instrument, kept in tune. The keys show fresh finger marks in the light dust.\n\nSomeone played it tonight. Someone with considerable skill.\n\nReverend Doyle said he heard the piano and assumed it was someone else. He cannot play himself.\n\nNone of the remaining suspects admit to playing.`,
        },
        {
          keywords: ['sheet music', 'music', 'chopin', 'nocturne', 'score'],
          response:
            `A Chopin nocturne, Op. 9 No. 2.\n\nThe pages are dog-eared with use — this is not a piece someone sight-read. The pianist knew this music well.\n\nIn the margin, in pencil, a handwritten note: "For E. — Vienna, 1938."\n\nThe handwriting is precise and controlled. You have seen it before, in the chemistry textbook upstairs.`,
          revealsClueId: 8,
        },
        {
          keywords: ['tea', 'cup', 'cold', 'teacup'],
          response:
            `The tea is stone cold. Made hours ago.\n\nTwo biscuits remain on the saucer, untouched.\n\nWhoever sat here was too agitated to eat.`,
        },
      ],
    },
    {
      id: 6,
      name: "Margaret's Room",
      keywords: ["margaret's room", "margaret room", "secretary's room", "hale's room", "her room", 'upstairs', 'bedroom'],
      arrivalText:
        `Margaret Hale's room is almost aggressively neat.\n\nThe bed is made with military precision. A leather briefcase sits under the bed — visible, but only just. A single book lies on the nightstand.\n\nYou can inspect: the briefcase, the book, or the wardrobe.`,
      searchText:
        `The room resists you. Everything is in its place.\n\nBut neatness can be its own form of concealment. The briefcase under the bed. The book on the nightstand. The wardrobe, slightly ajar.`,
      inspectables: [
        {
          keywords: ['briefcase', 'case', 'bag', 'leather'],
          response:
            `The briefcase is unlocked.\n\nInside: folders of documents. Provenance certificates for three paintings — the same three Clara Webb flagged in her catalogue as having unclear histories.\n\nThe certificates are convincing forgeries. The signature of a Paris dealer who died in 1941.\n\nMargaret Hale's fingerprints are on every page.`,
          revealsClueId: 7,
        },
        {
          keywords: ['book', 'textbook', 'chemistry', 'reading', 'nightstand'],
          response:
            `A chemistry textbook. Graduate level. The spine reads: "Toxicology and Forensic Chemistry, 3rd Ed."\n\nChapter 11: Cyanide Compounds and Their Detection.\n\nThe margins are dense with annotations in a precise, controlled hand. Underlined passages. Question marks. A note that reads: "undetectable at this concentration if body found within 2hrs?"`,
          revealsClueId: 6,
        },
        {
          keywords: ['wardrobe', 'clothes', 'cupboard', 'closet'],
          response:
            `Clothes, hung by colour and type. Practical, expensive, nothing excessive.\n\nAt the back of the wardrobe, tucked into the inside pocket of a winter coat: a train ticket.\n\nDeparture: London Victoria. Date: tomorrow morning. First class.`,
        },
      ],
    },
  ],
  clues: [
    { id: 1, name: 'Cyanide in decanter', description: 'Potassium cyanide residue found on the inner rim of the brandy decanter. Only one glass was poured.', roomId: 1 },
    { id: 2, name: 'Ash on victim\'s sleeve', description: 'Fine white ash on Lord Ashworth\'s left sleeve — consistent with burned paper, not fireplace ash.', roomId: 1 },
    { id: 3, name: 'The midnight note', description: '"I know what you did in Vienna. Meet me in the library at midnight. — E.A." Found crumpled under the inkstand.', roomId: 1 },
    { id: 4, name: 'Cigarette stubs', description: 'Three Craven A cigarette stubs near the garden bench. Same brand as James Ashworth\'s.', roomId: 3 },
    { id: 5, name: 'Emptied wall safe', description: 'A wall safe hidden behind a recently moved painting in the east wing. Open. Empty. Combination-wiped clean.', roomId: 4 },
    { id: 6, name: 'Chemistry textbook', description: "Margaret Hale's toxicology textbook, with annotations about undetectable cyanide concentrations.", roomId: 6 },
    { id: 7, name: 'Forged provenance documents', description: "Forged certificates for three paintings in Margaret Hale's briefcase. Her fingerprints are on them.", roomId: 6 },
    { id: 8, name: 'Sheet music inscription', description: 'Piano sheet music annotated "For E. — Vienna, 1938." The handwriting matches Margaret Hale\'s.', roomId: 5 },
    { id: 9, name: 'Empty cyanide vial', description: 'A tiny glass vial hidden behind the brandy decanter. Cyanide traces inside.', roomId: 1 },
    { id: 10, name: 'Broken cellar lock', description: 'The cellar door bolt was forced from the inside. The cellar smells of chemicals.', roomId: 2 },
    { id: 11, name: "Cook's testimony", description: 'Mrs. Briggs saw Margaret Hale in the kitchen at 11:45pm — asking which brandy Lord Ashworth preferred, despite knowing the answer.', roomId: 2 },
  ],
  timeline: [
    { time: '10:00pm', event: 'Dinner ends. Lord Ashworth retires to the library.' },
    { time: '11:00pm', event: 'Margaret Hale serves brandy to Lord Ashworth in the library.' },
    { time: '11:15pm', event: 'Piano heard playing in the sitting room.' },
    { time: '11:45pm', event: 'Margaret Hale seen in kitchen by the cook.' },
    { time: '12:00am', event: 'Lord Ashworth found dead. Library locked from inside.' },
    { time: '12:05am', event: 'Dr. Crane forces the door open.' },
  ],
};
