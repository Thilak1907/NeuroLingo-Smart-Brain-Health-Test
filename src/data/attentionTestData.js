export const stroopData = {
    en: {
        colors: [
            { word: 'RED', color: 'red' },
            { word: 'BLUE', color: 'blue' },
            { word: 'GREEN', color: 'green' },
            { word: 'YELLOW', color: 'yellow' },
            { word: 'BLACK', color: 'black' },
            { word: 'RED', color: 'blue' },
            { word: 'BLUE', color: 'green' },
            { word: 'GREEN', color: 'red' },
            { word: 'YELLOW', color: 'black' },
            { word: 'BLACK', color: 'yellow' }
        ],
        options: ['Red', 'Blue', 'Green', 'Yellow', 'Black']
    },
    ta: {
        colors: [
            { word: 'சிவப்பு', color: 'red' },
            { word: 'நீலம்', color: 'blue' },
            { word: 'பச்சை', color: 'green' },
            { word: 'மஞ்சள்', color: 'yellow' },
            { word: 'கருப்பு', color: 'black' },
            { word: 'சிவப்பு', color: 'blue' },
            { word: 'நீலம்', color: 'green' },
            { word: 'பச்சை', color: 'red' },
            { word: 'மஞ்சள்', color: 'black' },
            { word: 'கருப்பு', color: 'yellow' }
        ],
        options: ['சிவப்பு', 'நீலம்', 'பச்சை', 'மஞ்சள்', 'கருப்பு']
    },
    hi: {
        colors: [
            { word: 'लाल', color: 'red' },
            { word: 'नीला', color: 'blue' },
            { word: 'हरा', color: 'green' },
            { word: 'पीला', color: 'yellow' },
            { word: 'काला', color: 'black' },
            { word: 'लाल', color: 'blue' },
            { word: 'नीला', color: 'green' },
            { word: 'हरा', color: 'red' },
            { word: 'पीला', color: 'black' },
            { word: 'काला', color: 'yellow' }
        ],
        options: ['लाल', 'नीला', 'हरा', 'पीला', 'काला']
    },
    te: {
        colors: [
            { word: 'ఎరుపు', color: 'red' },
            { word: 'నీలం', color: 'blue' },
            { word: 'ఆకుపచ్చ', color: 'green' },
            { word: 'పసుపు', color: 'yellow' },
            { word: 'నలుపు', color: 'black' },
            { word: 'ఎరుపు', color: 'blue' },
            { word: 'నీలం', color: 'green' },
            { word: 'ఆకుపచ్చ', color: 'red' },
            { word: 'పసుపు', color: 'black' },
            { word: 'నలుపు', color: 'yellow' }
        ],
        options: ['ఎరుపు', 'నీలం', 'ఆకుపచ్చ', 'పసుపు', 'నలుపు']
    },
    bn: {
        colors: [
            { word: 'লাল', color: 'red' },
            { word: 'নীল', color: 'blue' },
            { word: 'সবুজ', color: 'green' },
            { word: 'হলুদ', color: 'yellow' },
            { word: 'কালো', color: 'black' },
            { word: 'লাল', color: 'blue' },
            { word: 'নীল', color: 'green' },
            { word: 'সবুজ', color: 'red' },
            { word: 'হলুদ', color: 'black' },
            { word: 'কালো', color: 'yellow' }
        ],
        options: ['লাল', 'নীল', 'সবুজ', 'হলুদ', 'কালো']
    }
};

export const oddOneOutData = [
    {
        id: 1,
        items: ['🍎', '🍌', '🚗', '🍇'],
        correctIndex: 2, // Car is the odd one out
        type: 'emoji'
    },
    {
        id: 2,
        items: ['🐶', '🐱', '🐰', '⚽'],
        correctIndex: 3, // Ball is the odd one out
        type: 'emoji'
    },
    {
        id: 3,
        items: ['A', 'B', 'C', '1'],
        correctIndex: 3, // 1 is the odd one out
        type: 'text'
    },
    {
        id: 4,
        items: ['🔺', '🟦', '🟢', '⭐'],
        correctIndex: 3, // Star is the odd one out (others are basic shapes) - debatable but simple for now
        type: 'emoji'
    },
    {
        id: 5,
        items: ['🚗', '🚌', '🚲', '✈️'],
        correctIndex: 3, // Plane (others are road vehicles)
        type: 'emoji'
    }
];
