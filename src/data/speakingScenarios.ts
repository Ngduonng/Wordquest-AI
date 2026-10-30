import { SpeakingScenario } from '../types/index.ts';

export const SPEAKING_SCENARIOS: SpeakingScenario[] = [
  {
    id: 'spk_intro_5a4',
    title: 'Self-Introduction & Favourite Things (Unit 1)',
    titleVi: 'Giới thiệu bản thân & Điều yêu thích (Lớp 5A4)',
    emoji: '🐬',
    grade: 5,
    topic: 'unit1_all_about_me',
    level: 'basic',
    learningObjective: 'Học sinh tự tin giới thiệu tên, lớp 5A4, nơi ở (city/countryside) và con vật/môn thể thao yêu thích.',
    situationEn: 'You are introducing yourself to teacher and friends in English class 5A4 at Huu Nghi Primary School.',
    situationVi: 'Em đang tự giới thiệu bản thân trước thầy cô và các bạn mới tại lớp 5A4, Trường TH Hữu Nghị.',
    partnerName: 'Teacher Emily',
    turns: [
      {
        turnId: 't1',
        partnerPrompt: 'Hello! Can you tell me a little bit about yourself?',
        partnerPromptVi: 'Xin chào! Em có thể giới thiệu một chút về bản thân mình được không?',
        promptSpeaker: 'Teacher Emily',
        suggestedResponse: 'Hello! My name is Nam. I am in Class 5A4 at Huu Nghi Primary School.',
        responseVi: 'Xin chào cô! Tên em là Nam. Em học lớp 5A4 tại trường Tiểu học Hữu Nghị.',
        targetKeywords: ['name', 'class', '5a4', 'primary', 'school', 'huu nghi'],
        grammarFrame: 'Hello! My name is [Tên]. I am in Class 5A4.',
        hintsVi: ['Chào cô giáo (Hello / Hi)', 'Nói tên em: My name is...', 'Nói lớp: I am in Class 5A4 at Huu Nghi Primary School.'],
        options: [
          'Hello! My name is Nam. I am in Class 5A4 at Huu Nghi Primary School.',
          'Good morning! I like reading English stories.',
          'Hi! I live in the city with my parents.'
        ]
      },
      {
        turnId: 't2',
        partnerPrompt: 'Nice to meet you! Do you live in the city or the countryside?',
        partnerPromptVi: 'Rất vui được gặp em! Em sống ở thành phố hay ở vùng nông thôn?',
        promptSpeaker: 'Teacher Emily',
        suggestedResponse: 'I live in the countryside with my grandparents and family.',
        responseVi: 'Em sống ở vùng nông thôn cùng với ông bà và gia đình ạ.',
        targetKeywords: ['live', 'countryside', 'city'],
        grammarFrame: 'I live in the [countryside / city].',
        hintsVi: ['Dùng cấu trúc Unit 1: I live in the countryside / I live in the city.'],
        options: [
          'I live in the countryside with my grandparents.',
          'I live in a tall building in the city.',
          'I go to school by bicycle every morning.'
        ]
      },
      {
        turnId: 't3',
        partnerPrompt: 'What is your favourite animal and why do you like it?',
        partnerPromptVi: 'Con vật em yêu thích nhất là gì và vì sao em thích nó?',
        promptSpeaker: 'Teacher Emily',
        suggestedResponse: 'My favourite animal is a dolphin because it dances and jumps beautifully.',
        responseVi: 'Con vật em thích nhất là cá heo vì nó nhảy múa và lượn sóng rất đẹp.',
        targetKeywords: ['favourite', 'animal', 'dolphin', 'because', 'dances', 'beautifully'],
        grammarFrame: 'My favourite animal is [con vật] because it [lý do].',
        hintsVi: ['Theo Unit 1 SGK: My favourite animal is a dolphin because it dances beautifully.'],
        options: [
          'My favourite animal is a dolphin because it dances beautifully.',
          'I like cats and dogs because they are cute.',
          'My favourite sport is table tennis.'
        ]
      }
    ]
  },
  {
    id: 'spk_our_homes_5a4',
    title: 'Talking about Homes and Address (Unit 2)',
    titleVi: 'Hỏi đáp về nơi ở & Địa chỉ (Unit 2)',
    emoji: '🏡',
    grade: 5,
    topic: 'unit2_our_homes',
    level: 'practice',
    learningObjective: 'Học sinh thực hành hỏi đáp xem bạn sống ở tòa nhà/căn hộ nào và hỏi địa chỉ cụ thể.',
    situationEn: 'You are asking your classmate where they live and their address.',
    situationVi: 'Em đang hỏi bạn cùng lớp xem bạn sống ở đâu và địa chỉ nhà bạn.',
    partnerName: 'Mai (Classmate)',
    turns: [
      {
        turnId: 't1',
        partnerPrompt: 'Do you live in that tall building over there?',
        partnerPromptVi: 'Bạn có sống ở tòa nhà cao tầng đằng kia không?',
        promptSpeaker: 'Mai',
        suggestedResponse: 'Yes, I do. I live in a flat on the fifth floor of Sunset Building.',
        responseVi: 'Có, đúng rồi. Mình sống trong một căn hộ ở tầng năm tòa nhà Sunset Building.',
        targetKeywords: ['yes', 'live', 'flat', 'building'],
        grammarFrame: "Yes, I do. / No, I don't. I live in...",
        hintsVi: ['Trả lời: Yes, I do. / No, I don’t.', 'Nói nơi ở: I live in that flat / house.'],
        options: [
          'Yes, I do. I live in that flat on the fifth floor.',
          'No, I do not. I live in a house in the countryside.',
          'My house has a small green garden.'
        ]
      },
      {
        turnId: 't2',
        partnerPrompt: 'What is your address?',
        partnerPromptVi: 'Địa chỉ nhà bạn là gì?',
        promptSpeaker: 'Mai',
        suggestedResponse: 'It is 116 Hoa Binh Street.',
        responseVi: 'Địa chỉ nhà mình là số 116 đường Hòa Bình.',
        targetKeywords: ['address', 'street', '116', 'hoa binh'],
        grammarFrame: 'It is [Số nhà] [Tên đường] Street.',
        hintsVi: ['Dùng mẫu câu Unit 2: It is [Số nhà] [Tên đường] Street.'],
        options: [
          'It is 116 Hoa Binh Street.',
          'It is 45 Ba Trieu Street.',
          'I live near the sports centre.'
        ]
      },
      {
        turnId: 't3',
        partnerPrompt: 'Is your home far from our school?',
        partnerPromptVi: 'Nhà bạn có xa trường học của chúng mình không?',
        promptSpeaker: 'Mai',
        suggestedResponse: 'No, it is near here. It is about one kilometre from our school.',
        responseVi: 'Không, nhà mình ở gần đây thôi. Cách trường khoảng một ki-lô-mét.',
        targetKeywords: ['near', 'far', 'kilometre', 'school'],
        grammarFrame: 'It is about [Khoảng cách] kilometre(s) from here.',
        hintsVi: ['Nêu khoảng cách: It is about one kilometre from our school.'],
        options: [
          'No, it is near here. It is about one kilometre from our school.',
          'Yes, it is very far from here.',
          'I walk to school with my sister.'
        ]
      }
    ]
  },
  {
    id: 'spk_future_jobs',
    title: 'Talking about Future Jobs (Unit 5)',
    titleVi: 'Nghề nghiệp mơ ước trong tương lai (Unit 5)',
    emoji: '👩‍🚒',
    grade: 5,
    topic: 'unit5_future_jobs',
    level: 'practice',
    learningObjective: 'Học sinh bày tỏ ước mơ nghề nghiệp và nêu lý do bằng cấu trúc "I would like to be a... because..."',
    situationEn: 'At the school Job Fair, you are talking about your dream career with your friend.',
    situationVi: 'Tại Ngày hội việc làm của trường, em đang chia sẻ về nghề nghiệp ước mơ của mình với bạn.',
    partnerName: 'Minh',
    turns: [
      {
        turnId: 't1',
        partnerPrompt: 'What would you like to be in the future, Nam?',
        partnerPromptVi: 'Cậu muốn làm nghề gì trong tương lai thế Nam?',
        promptSpeaker: 'Minh',
        suggestedResponse: 'I would like to be a firefighter in the future.',
        responseVi: 'Mình muốn trở thành một người lính cứu hỏa trong tương lai.',
        targetKeywords: ['would like', 'firefighter', 'future', 'doctor', 'teacher'],
        grammarFrame: 'I would like to be a/an [Nghề nghiệp] in the future.',
        hintsVi: ['Dùng cấu trúc Unit 5: I would like to be a firefighter / reporter / writer / doctor.'],
        options: [
          'I would like to be a firefighter in the future.',
          'I would like to be a reporter because I like news.',
          'I want to be a teacher to teach children.'
        ]
      },
      {
        turnId: 't2',
        partnerPrompt: 'Why would you like to be a firefighter?',
        partnerPromptVi: 'Tại sao cậu lại muốn trở thành lính cứu hỏa?',
        promptSpeaker: 'Minh',
        suggestedResponse: 'Because I would like to put out fires and help people in danger.',
        responseVi: 'Bởi vì mình muốn dập tắt các đám cháy và cứu giúp những người gặp nạn.',
        targetKeywords: ['because', 'put out fires', 'help', 'people'],
        grammarFrame: 'Because I would like to [Lý do: help people / grow flowers / teach children].',
        hintsVi: ['Nêu lý do: Because I would like to put out fires and help people.'],
        options: [
          'Because I would like to put out fires and help people.',
          'Because I love planting flowers and trees.',
          'Because I want to report news on television.'
        ]
      },
      {
        turnId: 't3',
        partnerPrompt: 'That sounds so brave and meaningful! How about your sister?',
        partnerPromptVi: 'Thật dũng cảm và ý nghĩa! Còn chị gái của cậu thì sao?',
        promptSpeaker: 'Minh',
        suggestedResponse: 'My sister would like to be a writer because she loves writing stories for children.',
        responseVi: 'Chị mình muốn trở thành nhà văn vì chị thích viết truyện cho các em nhỏ.',
        targetKeywords: ['sister', 'writer', 'stories', 'children'],
        grammarFrame: 'She would like to be a [Nghề nghiệp] because she likes [Hành động].',
        hintsVi: ['Nói về người thân: She would like to be a writer because she likes writing stories.'],
        options: [
          'She would like to be a writer because she likes writing stories for children.',
          'She would like to be a doctor to take care of sick patients.',
          'She wants to be a gardener in a peaceful countryside.'
        ]
      }
    ]
  },
  {
    id: 'spk_tet_holiday',
    title: 'Plans for Our Tet Holiday (Unit 12)',
    titleVi: 'Kế hoạch ngày Tết cổ truyền (Unit 12)',
    emoji: '🌸',
    grade: 5,
    topic: 'unit12_tet_holiday',
    level: 'practice',
    learningObjective: 'Học sinh luyện hỏi đáp về các dự định đón Tết (Will you... for Tet? - Yes, I will. / No, I won\'t).',
    situationEn: 'You and your classmate are chatting about family preparations before Tet festival.',
    situationVi: 'Em và bạn cùng lớp đang trò chuyện về sự chuẩn bị đón Tết của gia đình.',
    partnerName: 'Linh',
    turns: [
      {
        turnId: 't1',
        partnerPrompt: 'Tet is coming soon! Will you buy a branch of peach blossoms for Tet?',
        partnerPromptVi: 'Tết sắp đến rồi! Nhà bạn có mua cành hoa đào đón Tết không?',
        promptSpeaker: 'Linh',
        suggestedResponse: 'Yes, I will. My father and I will buy a pretty branch of peach blossoms.',
        responseVi: 'Có chứ. Bố và mình sẽ cùng đi chọn mua một cành hoa đào thật đẹp.',
        targetKeywords: ['yes', 'will', 'peach blossoms', 'tet'],
        grammarFrame: 'Yes, I will. / No, I won\'t. I\'ll...',
        hintsVi: ['Mẫu câu Unit 12: Yes, I will. / No, I won’t.', 'Cành hoa đào: branch of peach blossoms.'],
        options: [
          'Yes, I will. We will buy a pretty branch of peach blossoms.',
          'No, I will not. We will buy fresh yellow roses.',
          'I love watching the colourful spring festival.'
        ]
      },
      {
        turnId: 't2',
        partnerPrompt: 'Will your family make banh chung together?',
        partnerPromptVi: 'Gia đình bạn có cùng nhau gói bánh chưng không?',
        promptSpeaker: 'Linh',
        suggestedResponse: 'Yes, we will. My mother and sister will make banh chung and spring rolls.',
        responseVi: 'Có chứ. Mẹ và chị gái mình sẽ cùng gói bánh chưng và làm nem rán.',
        targetKeywords: ['yes', 'make', 'banh chung', 'spring rolls'],
        grammarFrame: 'Yes, we will. We will make banh chung / spring rolls.',
        hintsVi: ['Gói bánh chưng: make banh chung', 'Làm nem rán: make spring rolls.'],
        options: [
          'Yes, we will. We will make banh chung and spring rolls together.',
          'No, we will do the shopping at the big supermarket.',
          'We will decorate our house with red lanterns.'
        ]
      },
      {
        turnId: 't3',
        partnerPrompt: 'Where will you go at Tet?',
        partnerPromptVi: 'Bạn sẽ đi đâu vào dịp Tết?',
        promptSpeaker: 'Linh',
        suggestedResponse: 'I will go to my grandparents’ house in the countryside and watch fireworks.',
        responseVi: 'Mình sẽ về thăm nhà ông bà ở quê và đi xem bắn pháo hoa.',
        targetKeywords: ['grandparents', 'house', 'countryside', 'fireworks', 'show'],
        grammarFrame: 'I\'ll go to [Địa điểm: my grandparents\' house / a fireworks show].',
        hintsVi: ['Dùng mẫu câu Unit 12: I will go to my grandparents’ house in the countryside.'],
        options: [
          'I will go to my grandparents’ house in the countryside and watch fireworks.',
          'I will visit a flower festival in Ha Noi.',
          'We will stay at home and have a warm family party.'
        ]
      }
    ]
  },
  {
    id: 'spk_our_health',
    title: 'Asking about Health & Giving Advice (Unit 15)',
    titleVi: 'Hỏi thăm sức khỏe & Đưa lời khuyên (Unit 15)',
    emoji: '🩺',
    grade: 5,
    topic: 'unit15_our_health',
    level: 'practice',
    learningObjective: 'Học sinh hỏi thăm khi bạn không khỏe và đưa ra lời khuyên y tế phù hợp (You should...).',
    situationEn: 'Your friend looks tired and unwell during break time at school.',
    situationVi: 'Bạn em trông mệt mỏi và không được khỏe trong giờ ra chơi ở trường.',
    partnerName: 'Peter',
    turns: [
      {
        turnId: 't1',
        partnerPrompt: 'Ouch! I don’t feel very well today.',
        partnerPromptVi: 'Ôi đau quá! Hôm nay mình cảm thấy không được khỏe.',
        promptSpeaker: 'Peter',
        suggestedResponse: 'What is the matter, Peter? Are you OK?',
        responseVi: 'Cậu bị làm sao thế Peter? Cậu có ổn không?',
        targetKeywords: ['matter', 'what', 'feel', 'well'],
        grammarFrame: 'What\'s the matter? / What is the matter?',
        hintsVi: ['Hỏi thăm bằng câu Unit 15 SGK: What’s the matter? (Cậu bị sao thế?)'],
        options: [
          'What is the matter, Peter? Are you OK?',
          'How is your headache today?',
          'Do you want to play badminton with me?'
        ]
      },
      {
        turnId: 't2',
        partnerPrompt: 'I have a terrible toothache. It hurts so much.',
        partnerPromptVi: 'Mình bị đau răng dữ dội. Răng mình đau nhức lắm.',
        promptSpeaker: 'Peter',
        suggestedResponse: 'You should go to the dentist as soon as possible and rinse your mouth with warm water.',
        responseVi: 'Cậu nên đi khám nha sĩ càng sớm càng tốt và súc miệng bằng nước ấm nhé.',
        targetKeywords: ['should', 'dentist', 'go', 'rinse', 'mouth'],
        grammarFrame: 'You should [go to the dentist / take some medicine / have a rest].',
        hintsVi: ['Đưa lời khuyên bằng You should: You should go to the dentist.'],
        options: [
          'You should go to the dentist as soon as possible.',
          'You should eat more ice cream and sweets.',
          'You shouldn\'t drink warm water.'
        ]
      },
      {
        turnId: 't3',
        partnerPrompt: 'Thank you for your kind advice. What else should I avoid doing?',
        partnerPromptVi: 'Cảm ơn lời khuyên tốt bụng của cậu. Mình nên tránh làm gì nữa nhỉ?',
        promptSpeaker: 'Peter',
        suggestedResponse: 'You should not eat too many sweets and you should brush your teeth twice a day.',
        responseVi: 'Cậu không nên ăn quá nhiều đồ ngọt và nhớ đánh răng hai lần mỗi ngày nhé.',
        targetKeywords: ['should not', 'eat', 'sweets', 'brush', 'teeth'],
        grammarFrame: 'You shouldn\'t [eat too many sweets / drink cold water].',
        hintsVi: ['Khuyên không nên: You should not eat too many sweets.'],
        options: [
          'You should not eat too many sweets and remember to brush your teeth.',
          'You should stay up late to watch television.',
          'You should not go to the school clinic.'
        ]
      }
    ]
  }
];
