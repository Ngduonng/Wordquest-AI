import { VocabularyWord, TopicId, GradeLevel } from '../types/index.ts';
import CURRICULUM from './curriculum.json';

export interface TopicMeta {
  id: TopicId;
  book: 1 | 2;
  unitNumber: number;
  nameEn: string;
  nameVi: string;
  emoji: string;
  imageUrl?: string;
  descriptionVi: string;
  gradient: string;
  badgeBg: string;
}

export const TOPICS: TopicMeta[] = [
  // ---------------- TẬP 1 (UNITS 1 - 10) ----------------
  {
    id: 'unit1_all_about_me',
    book: 1,
    unitNumber: 1,
    nameEn: 'Unit 1: All about me!',
    nameVi: 'Bản thân em & Sở thích',
    emoji: '🐬',
    imageUrl: '/assets/images/vocabulary-lion.svg',
    descriptionVi: 'Giới thiệu bản thân, nơi ở, môn thể thao và đồ vật yêu thích (Tập 1 - Unit 1).',
    gradient: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'unit2_our_homes',
    book: 1,
    unitNumber: 2,
    nameEn: 'Unit 2: Our homes',
    nameVi: 'Ngôi nhà & Địa chỉ',
    emoji: '🏡',
    imageUrl: '/assets/images/vocabulary-family.svg',
    descriptionVi: 'Hỏi đáp về nơi ở (house, flat, tower) và địa chỉ đường phố (Tập 1 - Unit 2).',
    gradient: 'from-sky-400 to-blue-600',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'unit3_my_foreign_friends',
    book: 1,
    unitNumber: 3,
    nameEn: 'Unit 3: My foreign friends',
    nameVi: 'Bạn bè quốc tế & Tính cách',
    emoji: '🌏',
    imageUrl: '/assets/images/mascot.svg',
    descriptionVi: 'Quốc tịch các nước và mô tả tính cách bạn bè (friendly, clever, helpful) (Tập 1 - Unit 3).',
    gradient: 'from-emerald-400 to-teal-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'unit4_free_time',
    book: 1,
    unitNumber: 4,
    nameEn: 'Unit 4: Our free-time activities',
    nameVi: 'Hoạt động thời gian rảnh',
    emoji: '🎻',
    imageUrl: '/assets/images/activity-quiz.svg',
    descriptionVi: 'Sở thích rảnh rỗi và tần suất hoạt động (always, often, sometimes) (Tập 1 - Unit 4).',
    gradient: 'from-purple-400 to-fuchsia-600',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'unit5_future_jobs',
    book: 1,
    unitNumber: 5,
    nameEn: 'Unit 5: My future job',
    nameVi: 'Nghề nghiệp tương lai',
    emoji: '👩‍🚒',
    imageUrl: '/assets/images/award-trophy.svg',
    descriptionVi: 'Nghề nghiệp mơ ước và lý do muốn làm công việc đó (Tập 1 - Unit 5).',
    gradient: 'from-rose-400 to-red-600',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'unit6_school_rooms',
    book: 1,
    unitNumber: 6,
    nameEn: 'Unit 6: Our school rooms',
    nameVi: 'Phòng học & Chỉ đường trong trường',
    emoji: '🏫',
    imageUrl: '/assets/images/vocabulary-backpack.svg',
    descriptionVi: 'Các phòng chức năng (computer room, library) và cách chỉ đường lên tầng (Tập 1 - Unit 6).',
    gradient: 'from-blue-400 to-indigo-600',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'unit7_school_activities',
    book: 1,
    unitNumber: 7,
    nameEn: 'Unit 7: Our favourite school activities',
    nameVi: 'Hoạt động yêu thích ở trường',
    emoji: '📚',
    imageUrl: '/assets/images/activity-listening.svg',
    descriptionVi: 'Làm dự án, đọc sách, giải toán và lý do thích hoạt động (Tập 1 - Unit 7).',
    gradient: 'from-cyan-400 to-teal-600',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  {
    id: 'unit8_in_classroom',
    book: 1,
    unitNumber: 8,
    nameEn: 'Unit 8: In our classroom',
    nameVi: 'Đồ dùng trong lớp & Vị trí',
    emoji: '📐',
    imageUrl: '/assets/images/activity-matching.svg',
    descriptionVi: 'Đồ dùng học tập (crayon, set square, glue stick) và vị trí (above, beside, under) (Tập 1 - Unit 8).',
    gradient: 'from-amber-400 to-yellow-600',
    badgeBg: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    id: 'unit9_outdoor_activities',
    book: 1,
    unitNumber: 9,
    nameEn: 'Unit 9: Our outdoor activities',
    nameVi: 'Hoạt động dã ngoại ngoài trời',
    emoji: '⛺',
    imageUrl: '/assets/images/activity-speaking.svg',
    descriptionVi: 'Cắm trại, đi rạp hát, thủy cung và hoạt động đã làm hôm qua (Tập 1 - Unit 9).',
    gradient: 'from-emerald-500 to-green-700',
    badgeBg: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'unit10_school_trip',
    book: 1,
    unitNumber: 10,
    nameEn: 'Unit 10: Our school trip',
    nameVi: 'Chuyến tham quan của trường',
    emoji: '🚌',
    imageUrl: '/assets/images/award-star-badge.svg',
    descriptionVi: 'Kể về chuyến đi thăm Bà Nà Hills, Hồ Gươm, Suối Tiên, Bái Đính (Tập 1 - Unit 10).',
    gradient: 'from-indigo-400 to-purple-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },

  // ---------------- TẬP 2 (UNITS 11 - 20) ----------------
  {
    id: 'unit11_family_time',
    book: 2,
    unitNumber: 11,
    nameEn: 'Unit 11: Family time',
    nameVi: 'Kỳ nghỉ cùng gia đình',
    emoji: '🏖️',
    imageUrl: '/assets/images/vocabulary-family.svg',
    descriptionVi: 'Tắm biển, đi thuyền ngắm vịnh Hạ Long, mua quà lưu niệm cùng gia đình (Tập 2 - Unit 11).',
    gradient: 'from-cyan-400 to-blue-600',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  {
    id: 'unit12_tet_holiday',
    book: 2,
    unitNumber: 12,
    nameEn: 'Unit 12: Our Tet holiday',
    nameVi: 'Tết cổ truyền của chúng em',
    emoji: '🌸',
    imageUrl: '/assets/images/award-star-badge.svg',
    descriptionVi: 'Gói bánh chưng, trang trí nhà cửa, hoa đào và chúc Tết ông bà (Tập 2 - Unit 12).',
    gradient: 'from-rose-400 to-red-500',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'unit13_special_days',
    book: 2,
    unitNumber: 13,
    nameEn: 'Unit 13: Our special days',
    nameVi: 'Ngày lễ hội & Đồ ăn bữa tiệc',
    emoji: '🍕',
    imageUrl: '/assets/images/vocabulary-apple.svg',
    descriptionVi: 'Tết Thiếu nhi, Ngày Nhà giáo, Trung thu và các món ăn trong bữa tiệc (Tập 2 - Unit 13).',
    gradient: 'from-orange-400 to-amber-500',
    badgeBg: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'unit14_staying_healthy',
    book: 2,
    unitNumber: 14,
    nameEn: 'Unit 14: Staying healthy',
    nameVi: 'Rèn luyện & Giữ gìn sức khỏe',
    emoji: '🥗',
    imageUrl: '/assets/images/activity-speaking.svg',
    descriptionVi: 'Tập thể dục, ăn rau củ, uống nước ép và tần suất rèn luyện sức khỏe (Tập 2 - Unit 14).',
    gradient: 'from-emerald-400 to-teal-500',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'unit15_our_health',
    book: 2,
    unitNumber: 15,
    nameEn: 'Unit 15: Our health',
    nameVi: 'Chăm sóc sức khỏe & Lời khuyên',
    emoji: '🩺',
    imageUrl: '/assets/images/activity-matching.svg',
    descriptionVi: 'Các vấn đề sức khỏe (headache, toothache) và lời khuyên y tế cần thiết (Tập 2 - Unit 15).',
    gradient: 'from-teal-400 to-sky-600',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  {
    id: 'unit16_seasons_weather',
    book: 2,
    unitNumber: 16,
    nameEn: 'Unit 16: Seasons and the weather',
    nameVi: 'Bốn mùa, Thời tiết & Trang phục',
    emoji: '⛅',
    imageUrl: '/assets/images/activity-quiz.svg',
    descriptionVi: 'Thời tiết bốn mùa tại Hà Nội, Sydney và trang phục phù hợp mỗi mùa (Tập 2 - Unit 16).',
    gradient: 'from-sky-400 to-indigo-500',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'unit17_stories',
    book: 2,
    unitNumber: 17,
    nameEn: 'Unit 17: Stories for children',
    nameVi: 'Truyện cổ tích & Nhân vật',
    emoji: '🦊',
    imageUrl: '/assets/images/vocabulary-lion.svg',
    descriptionVi: 'Nàng Bạch Tuyết, Rùa và Thỏ, Kiến và Châu Chấu, Cáo và Quạ (Tập 2 - Unit 17).',
    gradient: 'from-violet-400 to-purple-600',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-200'
  },
  {
    id: 'unit18_transport',
    book: 2,
    unitNumber: 18,
    nameEn: 'Unit 18: Means of transport',
    nameVi: 'Phương tiện giao thông & Đi lại',
    emoji: '🚲',
    imageUrl: '/assets/images/activity-listening.svg',
    descriptionVi: 'Cách đi đến Cầu Rồng, Nhà hát lớn bằng xe buýt, taxi, xe đạp, đi bộ (Tập 2 - Unit 18).',
    gradient: 'from-amber-400 to-orange-500',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'unit19_places_interest',
    book: 2,
    unitNumber: 19,
    nameEn: 'Unit 19: Places of interest',
    nameVi: 'Danh lam thắng cảnh & Khoảng cách',
    emoji: '🏞️',
    imageUrl: '/assets/images/award-trophy.svg',
    descriptionVi: 'Cảm nghĩ về Thác Bản Giốc, Phố cổ Hội An và khoảng cách km (Tập 2 - Unit 19).',
    gradient: 'from-emerald-400 to-cyan-600',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'unit20_summer_holidays',
    book: 2,
    unitNumber: 20,
    nameEn: 'Unit 20: Our summer holidays',
    nameVi: 'Kỳ nghỉ hè tuyệt vời',
    emoji: '🏝️',
    imageUrl: '/assets/images/mascot.svg',
    descriptionVi: 'Dự định kỳ nghỉ hè sắp tới: Sông Hương, Động Phong Nha, Đảo Phú Quốc (Tập 2 - Unit 20).',
    gradient: 'from-rose-400 to-pink-500',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200'
  }
];

const CURATED_VOCABULARY: VocabularyWord[] = [
  // ==================== TẬP 1: UNIT 1 - ALL ABOUT ME! ====================
  {
    id: 'u1_dolphin',
    word: 'dolphin',
    vietnamese: 'cá heo',
    phonetic: '/ˈdɒlfɪn/',
    topic: 'unit1_all_about_me',
    grade: 5,
    exampleEn: 'My favourite animal is a dolphin because it dances beautifully.',
    exampleVi: 'Con vật em yêu thích nhất là cá heo vì nó nhảy múa rất đẹp.',
    hint: 'A clever and friendly sea animal that loves jumping.',
    categoryNameVi: 'Unit 1 · All about me!',
    emoji: '🐬',
    imageUrl: '/assets/images/vocabulary-lion.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' }
  },
  {
    id: 'u1_countryside',
    word: 'countryside',
    vietnamese: 'nông thôn, vùng quê',
    phonetic: '/ˈkʌntrisaɪd/',
    topic: 'unit1_all_about_me',
    grade: 5,
    exampleEn: 'I live in the countryside with my grandparents.',
    exampleVi: 'Em sống ở vùng nông thôn cùng với ông bà của em.',
    hint: 'A peaceful area outside cities and towns with green fields.',
    categoryNameVi: 'Unit 1 · All about me!',
    emoji: '🌾',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u1_table_tennis',
    word: 'table tennis',
    vietnamese: 'bóng bàn',
    phonetic: '/ˈteɪbl tenɪs/',
    topic: 'unit1_all_about_me',
    grade: 5,
    exampleEn: 'What is your favourite sport? - It is table tennis.',
    exampleVi: 'Môn thể thao yêu thích của bạn là gì? - Đó là môn bóng bàn.',
    hint: 'A game played on a table with small paddles and a light ball.',
    categoryNameVi: 'Unit 1 · All about me!',
    emoji: '🏓',
    level: 'practice',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u1_sandwich',
    word: 'sandwich',
    vietnamese: 'bánh mì kẹp',
    phonetic: '/ˈsænwɪtʃ/',
    topic: 'unit1_all_about_me',
    grade: 5,
    exampleEn: 'My favourite food is a sandwich with cheese and tomatoes.',
    exampleVi: 'Món ăn yêu thích của em là bánh mì kẹp phô mai và cà chua.',
    hint: 'Two slices of bread with meat, vegetables or cheese inside.',
    categoryNameVi: 'Unit 1 · All about me!',
    emoji: '🥪',
    imageUrl: '/assets/images/vocabulary-apple.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800' }
  },

  // ==================== TẬP 1: UNIT 2 - OUR HOMES ====================
  {
    id: 'u2_flat',
    word: 'flat',
    vietnamese: 'căn hộ',
    phonetic: '/flæt/',
    topic: 'unit2_our_homes',
    grade: 5,
    exampleEn: 'I live in that flat on the fifth floor.',
    exampleVi: 'Mình sống trong căn hộ đó ở tầng năm.',
    hint: 'A set of rooms for living in, usually on one floor of a large building.',
    categoryNameVi: 'Unit 2 · Our homes',
    emoji: '🏢',
    imageUrl: '/assets/images/vocabulary-family.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },
  {
    id: 'u2_tower',
    word: 'tower',
    vietnamese: 'tòa tháp, tòa cao ốc',
    phonetic: '/ˈtaʊə(r)/',
    topic: 'unit2_our_homes',
    grade: 5,
    exampleEn: 'Do you live in Green Tower? - Yes, I do.',
    exampleVi: 'Bạn có sống ở tòa tháp Green Tower không? - Có, mình sống ở đó.',
    hint: 'A very tall, narrow building with many floors.',
    categoryNameVi: 'Unit 2 · Our homes',
    emoji: '🏙️',
    level: 'practice',
    colorScheme: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800' }
  },
  {
    id: 'u2_building',
    word: 'building',
    vietnamese: 'tòa nhà',
    phonetic: '/ˈbɪldɪŋ/',
    topic: 'unit2_our_homes',
    grade: 5,
    exampleEn: 'My aunt lives in Sunset Building near our school.',
    exampleVi: 'Dì của em sống ở tòa nhà Sunset Building gần trường em.',
    hint: 'A structure with walls and a roof, such as a house or school.',
    categoryNameVi: 'Unit 2 · Our homes',
    emoji: '🏬',
    level: 'basic',
    colorScheme: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-800' }
  },
  {
    id: 'u2_address',
    word: 'address',
    vietnamese: 'địa chỉ',
    phonetic: '/əˈdres/',
    topic: 'unit2_our_homes',
    grade: 5,
    exampleEn: 'What is your address? - It is 116 Hoa Binh Street.',
    exampleVi: 'Địa chỉ của bạn là gì? - Là số 116 đường Hòa Bình.',
    hint: 'The number of a house and the name of the street where someone lives.',
    categoryNameVi: 'Unit 2 · Our homes',
    emoji: '📍',
    level: 'practice',
    colorScheme: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' }
  },

  // ==================== TẬP 1: UNIT 3 - MY FOREIGN FRIENDS ====================
  {
    id: 'u3_friendly',
    word: 'friendly',
    vietnamese: 'thân thiện, cởi mở',
    phonetic: '/ˈfrendli/',
    topic: 'unit3_my_foreign_friends',
    grade: 5,
    exampleEn: 'My classmates in 5B4 are very friendly and kind.',
    exampleVi: 'Các bạn cùng lớp 5B4 của em rất thân thiện và tốt bụng.',
    hint: 'Behaving in a kind and pleasant way toward others.',
    categoryNameVi: 'Unit 3 · My foreign friends',
    emoji: '🤝',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u3_clever',
    word: 'clever',
    vietnamese: 'thông minh, nhanh dạ',
    phonetic: '/ˈklevə(r)/',
    topic: 'unit3_my_foreign_friends',
    grade: 5,
    exampleEn: 'Minh is a clever boy who solves maths puzzles quickly.',
    exampleVi: 'Minh là một bạn trai thông minh, giải toán đố rất nhanh.',
    hint: 'Quick at learning and understanding things.',
    categoryNameVi: 'Unit 3 · My foreign friends',
    emoji: '💡',
    level: 'practice',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u3_helpful',
    word: 'helpful',
    vietnamese: 'hay giúp đỡ, tốt bụng',
    phonetic: '/ˈhelpfl/',
    topic: 'unit3_my_foreign_friends',
    grade: 5,
    exampleEn: 'What is she like? - She is helpful and always assists her teacher.',
    exampleVi: 'Bạn ấy là người thế nào? - Bạn ấy rất hay giúp đỡ và luôn phụ giúp cô giáo.',
    hint: 'Willing to give help and be useful to friends.',
    categoryNameVi: 'Unit 3 · My foreign friends',
    emoji: '💖',
    level: 'basic',
    colorScheme: { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-800' }
  },
  {
    id: 'u3_australian',
    word: 'Australian',
    vietnamese: 'người Úc, thuộc nước Úc',
    phonetic: '/ɒˈstreɪliən/',
    topic: 'unit3_my_foreign_friends',
    grade: 5,
    exampleEn: 'What nationality is he? - He is Australian.',
    exampleVi: 'Cậu ấy mang quốc tịch nào? - Cậu ấy là người Úc.',
    hint: 'Belonging to Australia, home to kangaroos and koalas.',
    categoryNameVi: 'Unit 3 · My foreign friends',
    emoji: '🦘',
    level: 'practice',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },

  // ==================== TẬP 1: UNIT 4 - OUR FREE-TIME ACTIVITIES ====================
  {
    id: 'u4_surf_internet',
    word: 'surf the Internet',
    vietnamese: 'lướt mạng In-tơ-nét',
    phonetic: '/sɜːf ði ˈɪntənet/',
    topic: 'unit4_free_time',
    grade: 5,
    exampleEn: 'I sometimes surf the Internet to learn English songs.',
    exampleVi: 'Em thỉnh thoảng lướt mạng để học các bài hát tiếng Anh.',
    hint: 'Looking for interesting information or games online.',
    categoryNameVi: 'Unit 4 · Free-time activities',
    emoji: '💻',
    level: 'practice',
    colorScheme: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' }
  },
  {
    id: 'u4_play_violin',
    word: 'play the violin',
    vietnamese: 'chơi đàn vi-ô-lông',
    phonetic: '/pleɪ ðə ˌvaɪəˈlɪn/',
    topic: 'unit4_free_time',
    grade: 5,
    exampleEn: 'Mary likes playing the violin in her free time.',
    exampleVi: 'Mary thích chơi đàn vi-ô-lông vào thời gian rảnh rỗi.',
    hint: 'Playing music with a bow on a wooden string instrument.',
    categoryNameVi: 'Unit 4 · Free-time activities',
    emoji: '🎻',
    level: 'practice',
    colorScheme: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800' }
  },
  {
    id: 'u4_water_flowers',
    word: 'water the flowers',
    vietnamese: 'tưới hoa',
    phonetic: '/ˈwɔːtə ðə ˈflaʊəz/',
    topic: 'unit4_free_time',
    grade: 5,
    exampleEn: 'I usually water the flowers in our school garden on Saturdays.',
    exampleVi: 'Em thường tưới hoa trong vườn trường vào các ngày thứ Bảy.',
    hint: 'Giving water to plants so they stay fresh and grow.',
    categoryNameVi: 'Unit 4 · Free-time activities',
    emoji: '🌸',
    level: 'basic',
    colorScheme: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' }
  },
  {
    id: 'u4_go_for_walk',
    word: 'go for a walk',
    vietnamese: 'đi dạo bộ',
    phonetic: '/ɡəʊ fər ə wɔːk/',
    topic: 'unit4_free_time',
    grade: 5,
    exampleEn: 'What do you do at the weekend? - I often go for a walk around the lake.',
    exampleVi: 'Bạn làm gì vào cuối tuần? - Mình thường đi dạo quanh hồ.',
    hint: 'Walking outdoors for fresh air and gentle exercise.',
    categoryNameVi: 'Unit 4 · Free-time activities',
    emoji: '🚶',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },

  // ==================== TẬP 1: UNIT 5 - MY FUTURE JOB ====================
  {
    id: 'u5_firefighter',
    word: 'firefighter',
    vietnamese: 'lính cứu hỏa',
    phonetic: '/ˈfaɪəfaɪtə(r)/',
    topic: 'unit5_future_jobs',
    grade: 5,
    exampleEn: 'I would like to be a firefighter because I want to put out fires and save people.',
    exampleVi: 'Em muốn trở thành lính cứu hỏa vì em muốn dập tắt các đám cháy và cứu người.',
    hint: 'A brave person whose job is to put out dangerous fires.',
    categoryNameVi: 'Unit 5 · My future job',
    emoji: '👨‍🚒',
    imageUrl: '/assets/images/award-trophy.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' }
  },
  {
    id: 'u5_reporter',
    word: 'reporter',
    vietnamese: 'phóng viên',
    phonetic: '/rɪˈpɔːtə(r)/',
    topic: 'unit5_future_jobs',
    grade: 5,
    exampleEn: 'She would like to be a reporter because she likes reporting the news.',
    exampleVi: 'Bạn ấy muốn trở thành phóng viên vì bạn ấy thích đưa tin tức.',
    hint: 'A person who collects and reports news on television or in newspapers.',
    categoryNameVi: 'Unit 5 · My future job',
    emoji: '🎤',
    level: 'practice',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },
  {
    id: 'u5_gardener',
    word: 'gardener',
    vietnamese: 'người làm vườn',
    phonetic: '/ˈɡɑːdnə(r)/',
    topic: 'unit5_future_jobs',
    grade: 5,
    exampleEn: 'My grandfather is a gardener. He grows beautiful red roses.',
    exampleVi: 'Ông của em là một người làm vườn. Ông trồng những bông hồng đỏ rất đẹp.',
    hint: 'A person who takes care of plants, trees and flowers in a garden.',
    categoryNameVi: 'Unit 5 · My future job',
    emoji: '🌱',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u5_writer',
    word: 'writer',
    vietnamese: 'nhà văn',
    phonetic: '/ˈraɪtə(r)/',
    topic: 'unit5_future_jobs',
    grade: 5,
    exampleEn: 'I would like to be a writer to write interesting stories for children.',
    exampleVi: 'Em muốn trở thành nhà văn để viết những câu chuyện thú vị cho thiếu nhi.',
    hint: 'A person who creates stories, poems, or books.',
    categoryNameVi: 'Unit 5 · My future job',
    emoji: '✍️',
    level: 'practice',
    colorScheme: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800' }
  },

  // ==================== TẬP 1: UNIT 6 - OUR SCHOOL ROOMS ====================
  {
    id: 'u6_ground_floor',
    word: 'ground floor',
    vietnamese: 'tầng trệt, tầng một',
    phonetic: '/ˌɡraʊnd ˈflɔː(r)/',
    topic: 'unit6_school_rooms',
    grade: 5,
    exampleEn: 'Where is the art room? - It is on the ground floor.',
    exampleVi: 'Phòng mĩ thuật ở đâu? - Ở tầng trệt của trường.',
    hint: 'The floor of a building that is level with the ground.',
    categoryNameVi: 'Unit 6 · Our school rooms',
    emoji: '🚪',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u6_go_upstairs',
    word: 'go upstairs',
    vietnamese: 'đi lên gác, lên lầu',
    phonetic: '/ɡəʊ ˌʌpˈsteəz/',
    topic: 'unit6_school_rooms',
    grade: 5,
    exampleEn: 'Could you tell me the way to the computer room? - Go upstairs. It is on the second floor.',
    exampleVi: 'Thầy có thể chỉ đường tới phòng tin học giúp em được không? - Hãy đi lên lầu, phòng ở tầng hai.',
    hint: 'Moving to an upper floor using the stairs.',
    categoryNameVi: 'Unit 6 · Our school rooms',
    emoji: '🪜',
    imageUrl: '/assets/images/activity-listening.svg',
    level: 'practice',
    colorScheme: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' }
  },
  {
    id: 'u6_computer_room',
    word: 'computer room',
    vietnamese: 'phòng tin học, phòng máy tính',
    phonetic: '/kəmˈpjuːtə ruːm/',
    topic: 'unit6_school_rooms',
    grade: 5,
    exampleEn: 'We have computer lessons in the computer room on Tuesday.',
    exampleVi: 'Chúng em có tiết tin học tại phòng máy tính vào thứ Ba.',
    hint: 'A school room equipped with computers for pupils to learn.',
    categoryNameVi: 'Unit 6 · Our school rooms',
    emoji: '🖥️',
    level: 'basic',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },
  {
    id: 'u6_corridor',
    word: 'corridor',
    vietnamese: 'hành lang',
    phonetic: '/ˈkɒrɪdɔː(r)/',
    topic: 'unit6_school_rooms',
    grade: 5,
    exampleEn: 'Go along the corridor and turn left to find the library.',
    exampleVi: 'Đi dọc theo hành lang và rẽ trái để tới thư viện.',
    hint: 'A long passage in a building from which doors lead into rooms.',
    categoryNameVi: 'Unit 6 · Our school rooms',
    emoji: '🏛️',
    level: 'challenge',
    colorScheme: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800' }
  },

  // ==================== TẬP 1: UNIT 7 - OUR FAVOURITE SCHOOL ACTIVITIES ====================
  {
    id: 'u7_solve_maths',
    word: 'solve maths problems',
    vietnamese: 'giải các bài toán',
    phonetic: '/sɒlv mæθs ˈprɒbləmz/',
    topic: 'unit7_school_activities',
    grade: 5,
    exampleEn: 'Minh likes solving maths problems because he thinks it is useful.',
    exampleVi: 'Minh thích giải toán vì bạn ấy nghĩ môn toán rất hữu ích.',
    hint: 'Finding answers to numbers and mathematics questions.',
    categoryNameVi: 'Unit 7 · School activities',
    emoji: '🔢',
    level: 'practice',
    colorScheme: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-800' }
  },
  {
    id: 'u7_do_projects',
    word: 'do projects',
    vietnamese: 'làm các bài tập dự án',
    phonetic: '/duː ˈprɒdʒekts/',
    topic: 'unit7_school_activities',
    grade: 5,
    exampleEn: 'We like doing projects because it is good for group work.',
    exampleVi: 'Chúng em thích làm dự án vì hoạt động này rất tốt cho làm việc nhóm.',
    hint: 'Working together in a team to research, draw and present a topic.',
    categoryNameVi: 'Unit 7 · School activities',
    emoji: '📋',
    imageUrl: '/assets/images/activity-speaking.svg',
    level: 'practice',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u7_useful',
    word: 'useful',
    vietnamese: 'có ích, hữu ích',
    phonetic: '/ˈjuːsfl/',
    topic: 'unit7_school_activities',
    grade: 5,
    exampleEn: 'Reading English books is very useful for our communication.',
    exampleVi: 'Đọc sách tiếng Anh rất hữu ích cho khả năng giao tiếp của chúng em.',
    hint: 'Helping you to do or achieve something good.',
    categoryNameVi: 'Unit 7 · School activities',
    emoji: '⭐',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },

  // ==================== TẬP 1: UNIT 8 - IN OUR CLASSROOM ====================
  {
    id: 'u8_set_square',
    word: 'set square',
    vietnamese: 'thước kẻ hình ê-ke tam giác',
    phonetic: '/ˈset skweə(r)/',
    topic: 'unit8_in_classroom',
    grade: 5,
    exampleEn: 'Whose set square is this? - It is Nam’s set square.',
    exampleVi: 'Cái thước ê-ke này của ai? - Đó là thước ê-ke của Nam.',
    hint: 'A flat triangular tool used in drawing and maths geometry.',
    categoryNameVi: 'Unit 8 · In our classroom',
    emoji: '📐',
    imageUrl: '/assets/images/vocabulary-backpack.svg',
    level: 'practice',
    colorScheme: { bg: 'bg-cyan-50', border: 'border-cyan-300', text: 'text-cyan-800' }
  },
  {
    id: 'u8_glue_stick',
    word: 'glue stick',
    vietnamese: 'thỏi keo dán',
    phonetic: '/ˈɡluː stɪk/',
    topic: 'unit8_in_classroom',
    grade: 5,
    exampleEn: 'Where is the glue stick? - It is beside the pencil case.',
    exampleVi: 'Thỏi keo dán ở đâu? - Nó ở bên cạnh hộp bút.',
    hint: 'A solid stick of glue used to stick paper together.',
    categoryNameVi: 'Unit 8 · In our classroom',
    emoji: '🧴',
    level: 'basic',
    colorScheme: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800' }
  },
  {
    id: 'u8_above',
    word: 'above',
    vietnamese: 'ở phía trên',
    phonetic: '/əˈbʌv/',
    topic: 'unit8_in_classroom',
    grade: 5,
    exampleEn: 'The picture is above the window in classroom 5B4.',
    exampleVi: 'Bức tranh được treo ở phía trên cửa sổ lớp 5B4.',
    hint: 'At a higher place or position than something else.',
    categoryNameVi: 'Unit 8 · In our classroom',
    emoji: '⬆️',
    level: 'basic',
    colorScheme: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800' }
  },
  {
    id: 'u8_crayon',
    word: 'crayon',
    vietnamese: 'bút sáp màu',
    phonetic: '/ˈkreɪən/',
    topic: 'unit8_in_classroom',
    grade: 5,
    exampleEn: 'Whose crayon is this? - It is Linh’s crayon.',
    exampleVi: 'Cái bút sáp màu này của ai? - Đó là bút sáp của Linh.',
    hint: 'A coloured stick of wax used for drawing pictures.',
    categoryNameVi: 'Unit 8 · In our classroom',
    emoji: '🖍️',
    level: 'basic',
    colorScheme: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' }
  },

  // ==================== TẬP 1: UNIT 9 - OUR OUTDOOR ACTIVITIES ====================
  {
    id: 'u9_campsite',
    word: 'campsite',
    vietnamese: 'địa điểm cắm trại',
    phonetic: '/ˈkæmpsaɪt/',
    topic: 'unit9_outdoor_activities',
    grade: 5,
    exampleEn: 'Were you at the campsite yesterday? - Yes, we were.',
    exampleVi: 'Hôm qua các bạn có ở khu cắm trại không? - Có, chúng mình ở đó.',
    hint: 'An outdoor place where people set up tents for camping.',
    categoryNameVi: 'Unit 9 · Outdoor activities',
    emoji: '⛺',
    imageUrl: '/assets/images/activity-matching.svg',
    level: 'practice',
    colorScheme: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' }
  },
  {
    id: 'u9_aquarium',
    word: 'aquarium',
    vietnamese: 'thủy cung, bể nuôi cá',
    phonetic: '/əˈkweəriəm/',
    topic: 'unit9_outdoor_activities',
    grade: 5,
    exampleEn: 'We visited the aquarium and watched colorful fish.',
    exampleVi: 'Chúng em đã đến thăm thủy cung và ngắm những đàn cá rực rỡ.',
    hint: 'A big building with glass tanks displaying living water creatures.',
    categoryNameVi: 'Unit 9 · Outdoor activities',
    emoji: '🐠',
    level: 'practice',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },
  {
    id: 'u9_dance_campfire',
    word: 'dance around the campfire',
    vietnamese: 'nhảy múa quanh lửa trại',
    phonetic: '/dɑːns əˈraʊnd ðə ˈkæmpfaɪə/',
    topic: 'unit9_outdoor_activities',
    grade: 5,
    exampleEn: 'In the evening, all the students danced around the campfire.',
    exampleVi: 'Vào buổi tối, tất cả học sinh cùng nhảy múa quanh đống lửa trại.',
    hint: 'Moving happily to music around a bright outdoor fire.',
    categoryNameVi: 'Unit 9 · Outdoor activities',
    emoji: '🔥',
    level: 'challenge',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800' }
  },

  // ==================== TẬP 1: UNIT 10 - OUR SCHOOL TRIP ====================
  {
    id: 'u10_bana_hills',
    word: 'Ba Na Hills',
    vietnamese: 'Bà Nà Hills (Đà Nẵng)',
    phonetic: '/bɑː nɑː hɪlz/',
    topic: 'unit10_school_trip',
    grade: 5,
    exampleEn: 'Did they go to Ba Na Hills last weekend? - Yes, they did.',
    exampleVi: 'Cuối tuần trước các bạn ấy có đi Bà Nà Hills không? - Có, các bạn ấy có đi.',
    hint: 'A famous mountain resort and tourist destination in Da Nang.',
    categoryNameVi: 'Unit 10 · Our school trip',
    emoji: '⛰️',
    imageUrl: '/assets/images/award-star-badge.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u10_plant_trees',
    word: 'plant trees',
    vietnamese: 'trồng cây xanh',
    phonetic: '/plɑːnt triːz/',
    topic: 'unit10_school_trip',
    grade: 5,
    exampleEn: 'What did they do on the school trip? - They planted trees and vegetables.',
    exampleVi: 'Các bạn ấy đã làm gì trong chuyến tham quan? - Các bạn ấy đã trồng cây xanh và rau.',
    hint: 'Putting young plants into the ground so they will grow.',
    categoryNameVi: 'Unit 10 · Our school trip',
    emoji: '🌳',
    level: 'basic',
    colorScheme: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-800' }
  },

  // ==================== TẬP 2: UNIT 11 - FAMILY TIME ====================
  {
    id: 'u11_boat_trip',
    word: 'take a boat trip',
    vietnamese: 'đi du thuyền, đi thuyền tham quan',
    phonetic: '/teɪk ə bəʊt trɪp/',
    topic: 'unit11_family_time',
    grade: 5,
    exampleEn: 'We took a boat trip around Ha Long Bay last summer.',
    exampleVi: 'Gia đình em đã đi thuyền tham quan quanh Vịnh Hạ Long mùa hè năm ngoái.',
    hint: 'Travelling on water in a boat for pleasure and sightseeing.',
    categoryNameVi: 'Unit 11 · Family time',
    emoji: '⛵',
    imageUrl: '/assets/images/vocabulary-family.svg',
    level: 'practice',
    colorScheme: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' }
  },
  {
    id: 'u11_eat_seafood',
    word: 'eat seafood',
    vietnamese: 'ăn hải sản tươi ngon',
    phonetic: '/iːt ˈsiːfuːd/',
    topic: 'unit11_family_time',
    grade: 5,
    exampleEn: 'What did your family do in Nha Trang? - We ate delicious seafood.',
    exampleVi: 'Gia đình bạn đã làm gì ở Nha Trang? - Chúng mình đã thưởng thức hải sản rất ngon.',
    hint: 'Eating fresh fish, crab and shrimp from the sea.',
    categoryNameVi: 'Unit 11 · Family time',
    emoji: '🦞',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u11_buy_souvenirs',
    word: 'buy souvenirs',
    vietnamese: 'mua đồ lưu niệm',
    phonetic: '/baɪ ˌsuːvəˈnɪəz/',
    topic: 'unit11_family_time',
    grade: 5,
    exampleEn: 'My sister bought some souvenirs for her friends at school.',
    exampleVi: 'Chị em đã mua một số món đồ lưu niệm tặng các bạn ở trường.',
    hint: 'Buying special gifts to remember a place you visited.',
    categoryNameVi: 'Unit 11 · Family time',
    emoji: '🎁',
    level: 'practice',
    colorScheme: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' }
  },
  {
    id: 'u11_collect_seashells',
    word: 'collect seashells',
    vietnamese: 'thu lượm, nhặt vỏ sò',
    phonetic: '/kəˈlekt ˈsiːʃelz/',
    topic: 'unit11_family_time',
    grade: 5,
    exampleEn: 'Did you walk on the beach? - Yes, I collected beautiful seashells.',
    exampleVi: 'Em có đi dạo trên bãi biển không? - Có, em đã nhặt những chiếc vỏ sò xinh xắn.',
    hint: 'Finding and picking up pretty shells on the seashore.',
    categoryNameVi: 'Unit 11 · Family time',
    emoji: '🐚',
    level: 'practice',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },

  // ==================== TẬP 2: UNIT 12 - OUR TET HOLIDAY ====================
  {
    id: 'u12_peach_blossom',
    word: 'peach blossoms',
    vietnamese: 'hoa đào ngày Tết',
    phonetic: '/ˈpiːtʃ ˈblɒsəmz/',
    topic: 'unit12_tet_holiday',
    grade: 5,
    exampleEn: 'Will you buy a branch of peach blossoms for Tet? - Yes, I will.',
    exampleVi: 'Nhà bạn có mua một cành hoa đào đón Tết không? - Có, nhà mình có mua.',
    hint: 'Pink flowers that bloom in northern Vietnam during Spring and Tet.',
    categoryNameVi: 'Unit 12 · Our Tet holiday',
    emoji: '🌸',
    imageUrl: '/assets/images/award-star-badge.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-pink-50', border: 'border-pink-300', text: 'text-pink-800' }
  },
  {
    id: 'u12_banh_chung',
    word: 'make banh chung',
    vietnamese: 'gói bánh chưng',
    phonetic: '/meɪk ˌbæŋ ˈtʃʊŋ/',
    topic: 'unit12_tet_holiday',
    grade: 5,
    exampleEn: 'My family will make banh chung together before New Year Eve.',
    exampleVi: 'Gia đình em sẽ cùng nhau gói bánh chưng trước đêm Giao thừa.',
    hint: 'Making traditional square sticky rice cakes for Vietnamese Tet.',
    categoryNameVi: 'Unit 12 · Our Tet holiday',
    emoji: '🟢',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u12_decorate_house',
    word: 'decorate the house',
    vietnamese: 'trang trí nhà cửa',
    phonetic: '/ˈdekəreɪt ðə haʊs/',
    topic: 'unit12_tet_holiday',
    grade: 5,
    exampleEn: 'We will decorate the house with red lanterns and fresh flowers.',
    exampleVi: 'Chúng em sẽ trang trí nhà cửa bằng lồng đèn đỏ và hoa tươi.',
    hint: 'Making the house look beautiful and festive for celebrations.',
    categoryNameVi: 'Unit 12 · Our Tet holiday',
    emoji: '🏮',
    level: 'practice',
    colorScheme: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' }
  },
  {
    id: 'u12_fireworks_show',
    word: 'fireworks show',
    vietnamese: 'màn trình diễn pháo hoa',
    phonetic: '/ˈfaɪəwɜːks ʃəʊ/',
    topic: 'unit12_tet_holiday',
    grade: 5,
    exampleEn: 'Where will you go at Tet? - We will watch a fireworks show at midnight.',
    exampleVi: 'Bạn sẽ đi đâu vào dịp Tết? - Chúng mình sẽ đi xem pháo hoa vào lúc nửa đêm.',
    hint: 'Bright, colorful lights exploding in the night sky.',
    categoryNameVi: 'Unit 12 · Our Tet holiday',
    emoji: '🎆',
    level: 'practice',
    colorScheme: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800' }
  },

  // ==================== TẬP 2: UNIT 13 - OUR SPECIAL DAYS ====================
  {
    id: 'u13_childrens_day',
    word: "Children's Day",
    vietnamese: 'ngày Quốc tế Thiếu nhi',
    phonetic: '/ˈtʃɪldrənz deɪ/',
    topic: 'unit13_special_days',
    grade: 5,
    exampleEn: 'What will you do on Children’s Day? - We will sing, dance and have a party.',
    exampleVi: 'Các bạn sẽ làm gì vào ngày Quốc tế Thiếu nhi? - Chúng mình sẽ hát, múa và liên hoan.',
    hint: 'A joyful holiday celebrating boys and girls on the first of June.',
    categoryNameVi: 'Unit 13 · Our special days',
    emoji: '🎈',
    imageUrl: '/assets/images/activity-speaking.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u13_milk_tea',
    word: 'milk tea',
    vietnamese: 'trà sữa',
    phonetic: '/mɪlk tiː/',
    topic: 'unit13_special_days',
    grade: 5,
    exampleEn: 'What drinks will you have at the party? - We will have milk tea and apple juice.',
    exampleVi: 'Các bạn sẽ uống gì trong bữa tiệc? - Chúng mình sẽ uống trà sữa và nước ép táo.',
    hint: 'A sweet drink made by mixing black tea and fresh milk.',
    categoryNameVi: 'Unit 13 · Our special days',
    emoji: '🧋',
    level: 'basic',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800' }
  },
  {
    id: 'u13_pizza',
    word: 'pizza',
    vietnamese: 'bánh pi-da (pizza)',
    phonetic: '/ˈpiːtsə/',
    topic: 'unit13_special_days',
    grade: 5,
    exampleEn: 'We will have hot pizza with cheese and sausages.',
    exampleVi: 'Chúng mình sẽ có món bánh pizza nóng hổi với phô mai và xúc xích.',
    hint: 'A flat round baked bread topped with cheese and tomato sauce.',
    categoryNameVi: 'Unit 13 · Our special days',
    emoji: '🍕',
    imageUrl: '/assets/images/vocabulary-apple.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' }
  },

  // ==================== TẬP 2: UNIT 14 - STAYING HEALTHY ====================
  {
    id: 'u14_morning_exercise',
    word: 'do morning exercise',
    vietnamese: 'tập thể dục buổi sáng',
    phonetic: '/duː ˈmɔːnɪŋ ˈeksəsaɪz/',
    topic: 'unit14_staying_healthy',
    grade: 5,
    exampleEn: 'How does he stay healthy? - He does morning exercise every day.',
    exampleVi: 'Cậu ấy giữ gìn sức khỏe thế nào? - Cậu ấy tập thể dục buổi sáng mỗi ngày.',
    hint: 'Exercising in the early morning to stay fit and active.',
    categoryNameVi: 'Unit 14 · Staying healthy',
    emoji: '🤸',
    level: 'basic',
    colorScheme: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' }
  },
  {
    id: 'u14_fresh_juice',
    word: 'drink fresh juice',
    vietnamese: 'uống nước ép trái cây tươi',
    phonetic: '/drɪŋk freʃ dʒuːs/',
    topic: 'unit14_staying_healthy',
    grade: 5,
    exampleEn: 'I drink fresh orange juice three times a week.',
    exampleVi: 'Em uống nước cam ép tươi ba lần một tuần.',
    hint: 'Drinking natural vitamin juice made from fresh fruits.',
    categoryNameVi: 'Unit 14 · Staying healthy',
    emoji: '🧃',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u14_eat_vegetables',
    word: 'eat vegetables',
    vietnamese: 'ăn rau củ',
    phonetic: '/iːt ˈvedʒtəblz/',
    topic: 'unit14_staying_healthy',
    grade: 5,
    exampleEn: 'Children should eat green vegetables and fresh fruits to stay strong.',
    exampleVi: 'Trẻ em nên ăn nhiều rau xanh và trái cây tươi để luôn khỏe mạnh.',
    hint: 'Eating plants like carrots, beans, and salad for good health.',
    categoryNameVi: 'Unit 14 · Staying healthy',
    emoji: '🥦',
    level: 'basic',
    colorScheme: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-800' }
  },

  // ==================== TẬP 2: UNIT 15 - OUR HEALTH ====================
  {
    id: 'u15_toothache',
    word: 'toothache',
    vietnamese: 'bệnh đau răng',
    phonetic: '/ˈtuːθeɪk/',
    topic: 'unit15_our_health',
    grade: 5,
    exampleEn: 'What is the matter? - I have a toothache. - You should go to the dentist.',
    exampleVi: 'Em bị làm sao thế? - Em bị đau răng ạ. - Em nên đi khám nha sĩ ngay nhé.',
    hint: 'Pain in or around a tooth when it is hurt or decayed.',
    categoryNameVi: 'Unit 15 · Our health',
    emoji: '🦷',
    level: 'basic',
    colorScheme: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800' }
  },
  {
    id: 'u15_headache',
    word: 'headache',
    vietnamese: 'bệnh đau đầu',
    phonetic: '/ˈhedeɪk/',
    topic: 'unit15_our_health',
    grade: 5,
    exampleEn: 'I have a headache. You should have a rest and drink warm water.',
    exampleVi: 'Mình bị đau đầu. Bạn nên nghỉ ngơi và uống nước ấm nhé.',
    hint: 'A continuous pain in your head.',
    categoryNameVi: 'Unit 15 · Our health',
    emoji: '🤕',
    level: 'basic',
    colorScheme: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800' }
  },
  {
    id: 'u15_go_dentist',
    word: 'go to the dentist',
    vietnamese: 'đi khám nha sĩ (bác sĩ răng hàm mặt)',
    phonetic: '/ɡəʊ tə ðə ˈdentɪst/',
    topic: 'unit15_our_health',
    grade: 5,
    exampleEn: 'You have a toothache? You should go to the dentist as soon as possible.',
    exampleVi: 'Bạn bị đau răng à? Bạn nên đi khám nha sĩ càng sớm càng tốt nhé.',
    hint: 'Visiting a tooth doctor to examine and cure teeth.',
    categoryNameVi: 'Unit 15 · Our health',
    emoji: '👨‍⚕️',
    level: 'practice',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },

  // ==================== TẬP 2: UNIT 16 - SEASONS AND THE WEATHER ====================
  {
    id: 'u16_autumn',
    word: 'autumn',
    vietnamese: 'mùa thu',
    phonetic: '/ˈɔːtəm/',
    topic: 'unit16_seasons_weather',
    grade: 5,
    exampleEn: 'How is the weather in autumn in Ha Noi? - It is cool and cloudy.',
    exampleVi: 'Thời tiết mùa thu ở Hà Nội như thế nào? - Trời mát mẻ và nhiều mây.',
    hint: 'The season between summer and winter when leaves turn golden.',
    categoryNameVi: 'Unit 16 · Seasons and weather',
    emoji: '🍂',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u16_jumper',
    word: 'jumper',
    vietnamese: 'áo len dài tay',
    phonetic: '/ˈdʒʌmpə(r)/',
    topic: 'unit16_seasons_weather',
    grade: 5,
    exampleEn: 'What do you usually wear in winter? - I wear a warm jumper and trousers.',
    exampleVi: 'Bạn thường mặc gì vào mùa đông? - Mình mặc áo len ấm và quần dài.',
    hint: 'A knitted wool sweater with long sleeves worn for warmth.',
    categoryNameVi: 'Unit 16 · Seasons and weather',
    emoji: '🧶',
    level: 'practice',
    colorScheme: { bg: 'bg-indigo-50', border: 'border-indigo-300', text: 'text-indigo-800' }
  },

  // ==================== TẬP 2: UNIT 17 - STORIES FOR CHILDREN ====================
  {
    id: 'u17_tortoise',
    word: 'tortoise',
    vietnamese: 'con rùa',
    phonetic: '/ˈtɔːtəs/',
    topic: 'unit17_stories',
    grade: 5,
    exampleEn: 'Who won the race? - The slow but steady tortoise won the race.',
    exampleVi: 'Ai đã thắng cuộc đua? - Chú rùa tuy chậm mà kiên trì đã chiến thắng.',
    hint: 'A slow-moving reptile with a hard round shell on its back.',
    categoryNameVi: 'Unit 17 · Stories for children',
    emoji: '🐢',
    imageUrl: '/assets/images/vocabulary-lion.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u17_snow_white',
    word: 'Snow White',
    vietnamese: 'Nàng Bạch Tuyết',
    phonetic: '/ˌsnəʊ ˈwaɪt/',
    topic: 'unit17_stories',
    grade: 5,
    exampleEn: 'Who are the main characters? - They are Snow White and the seven dwarfs.',
    exampleVi: 'Các nhân vật chính là ai? - Đó là nàng Bạch Tuyết và bảy chú lùn.',
    hint: 'A beloved fairy tale princess with skin as white as snow.',
    categoryNameVi: 'Unit 17 · Stories for children',
    emoji: '👸',
    level: 'basic',
    colorScheme: { bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800' }
  },
  {
    id: 'u17_work_hard',
    word: 'work hard',
    vietnamese: 'làm việc chăm chỉ, siêng năng',
    phonetic: '/wɜːk hɑːd/',
    topic: 'unit17_stories',
    grade: 5,
    exampleEn: 'How did the ant work? - He worked hard to gather food for winter.',
    exampleVi: 'Chú kiến đã làm việc thế nào? - Chú đã làm việc rất chăm chỉ để tích trữ đồ ăn cho mùa đông.',
    hint: 'Putting a lot of effort and energy into doing a job well.',
    categoryNameVi: 'Unit 17 · Stories for children',
    emoji: '🐜',
    level: 'practice',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },

  // ==================== TẬP 2: UNIT 18 - MEANS OF TRANSPORT ====================
  {
    id: 'u18_dragon_bridge',
    word: 'Dragon Bridge',
    vietnamese: 'Cầu Rồng (Đà Nẵng)',
    phonetic: '/ˈdræɡən brɪdʒ/',
    topic: 'unit18_transport',
    grade: 5,
    exampleEn: 'Where do you want to visit? - I want to visit Dragon Bridge in Da Nang.',
    exampleVi: 'Bạn muốn đi tham quan ở đâu? - Mình muốn đến thăm Cầu Rồng ở Đà Nẵng.',
    hint: 'A famous bridge shaped like a golden dragon that breathes fire and water.',
    categoryNameVi: 'Unit 18 · Means of transport',
    emoji: '🐉',
    imageUrl: '/assets/images/activity-listening.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' }
  },
  {
    id: 'u18_by_bus',
    word: 'by bus',
    vietnamese: 'bằng xe buýt',
    phonetic: '/baɪ bʌs/',
    topic: 'unit18_transport',
    grade: 5,
    exampleEn: 'How can I get to Hoan Kiem Lake? - You can get there by bus.',
    exampleVi: 'Làm thế nào để em đến được Hồ Gươm? - Em có thể đến đó bằng xe buýt.',
    hint: 'Travelling on a large public vehicle on the road.',
    categoryNameVi: 'Unit 18 · Means of transport',
    emoji: '🚌',
    level: 'basic',
    colorScheme: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-800' }
  },

  // ==================== TẬP 2: UNIT 19 - PLACES OF INTEREST ====================
  {
    id: 'u19_peaceful',
    word: 'peaceful',
    vietnamese: 'yên bình, thanh bình',
    phonetic: '/ˈpiːsfl/',
    topic: 'unit19_places_interest',
    grade: 5,
    exampleEn: 'What do you think of Ban Gioc Waterfall? - I think it is peaceful and beautiful.',
    exampleVi: 'Bạn nghĩ gì về Thác Bản Giốc? - Mình thấy nơi đó thật yên bình và tuyệt đẹp.',
    hint: 'Quiet and calm; free from disturbance or noisy traffic.',
    categoryNameVi: 'Unit 19 · Places of interest',
    emoji: '🕊️',
    level: 'practice',
    colorScheme: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'text-teal-800' }
  },
  {
    id: 'u19_kilometres',
    word: 'kilometres',
    vietnamese: 'ki-lô-mét (km)',
    phonetic: '/kɪˈlɒmɪtəz/',
    topic: 'unit19_places_interest',
    grade: 5,
    exampleEn: 'How far is it from our school to the park? - It is about two kilometres.',
    exampleVi: 'Từ trường mình đến công viên bao xa? - Khoảng hai ki-lô-mét.',
    hint: 'A metric unit of length equal to 1,000 metres.',
    categoryNameVi: 'Unit 19 · Places of interest',
    emoji: '📏',
    level: 'basic',
    colorScheme: { bg: 'bg-sky-50', border: 'border-sky-300', text: 'text-sky-800' }
  },

  // ==================== TẬP 2: UNIT 20 - OUR SUMMER HOLIDAYS ====================
  {
    id: 'u20_phu_quoc',
    word: 'Phu Quoc Island',
    vietnamese: 'Đảo Phú Quốc',
    phonetic: '/fʊ kkwɒk ˈaɪlənd/',
    topic: 'unit20_summer_holidays',
    grade: 5,
    exampleEn: 'Where are you going to visit this summer? - I am going to visit Phu Quoc Island.',
    exampleVi: 'Hè này bạn dự định đi tham quan ở đâu? - Mình sẽ đi đảo Phú Quốc.',
    hint: 'A beautiful tropical island in Vietnam with sandy beaches and safari.',
    categoryNameVi: 'Unit 20 · Summer holidays',
    emoji: '🏝️',
    imageUrl: '/assets/images/mascot.svg',
    level: 'basic',
    colorScheme: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800' }
  },
  {
    id: 'u20_eco_farm',
    word: 'visit an eco-farm',
    vietnamese: 'thăm trang trại sinh thái',
    phonetic: '/ˈvɪzɪt ən ˈiːkəʊ fɑːm/',
    topic: 'unit20_summer_holidays',
    grade: 5,
    exampleEn: 'What are you going to do this summer? - We are going to visit an eco-farm and grow vegetables.',
    exampleVi: 'Hè này các bạn định làm gì? - Chúng mình định đi thăm trang trại sinh thái và trồng rau.',
    hint: 'Visiting a green farm that uses natural methods to grow plants and feed animals.',
    categoryNameVi: 'Unit 20 · Summer holidays',
    emoji: '🚜',
    level: 'challenge',
    colorScheme: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-800' }
  }
];

const curriculumVocabulary: VocabularyWord[] = CURRICULUM.flatMap((lesson) => {
  const topic = TOPICS.find((item) => item.id === lesson.topic);
  const existingWords = new Set(
    CURATED_VOCABULARY
      .filter((item) => item.topic === lesson.topic)
      .map((item) => item.word.trim().toLocaleLowerCase())
  );

  return lesson.vocabulary.flatMap((entry) => {
    const separator = entry.indexOf(' — ');
    if (separator < 0) return [];

    const word = entry.slice(0, separator).trim();
    const vietnamese = entry.slice(separator + 3).trim();
    if (!word || !vietnamese || existingWords.has(word.toLocaleLowerCase())) return [];

    const slug = word
      .toLocaleLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
    const example = lesson.patterns.find((pattern) =>
      pattern.example.toLocaleLowerCase().includes(word.toLocaleLowerCase())
    );

    return [{
      id: `u${lesson.unit}_sgk_${slug}`,
      word,
      vietnamese,
      phonetic: '',
      topic: lesson.topic,
      grade: 5 as const,
      exampleEn: example?.example ?? '',
      exampleVi: example?.translation ?? '',
      hint: `Từ hoặc cụm từ trọng tâm trong Unit ${lesson.unit}.`,
      categoryNameVi: `Unit ${lesson.unit} · ${lesson.title}`,
      emoji: topic?.emoji ?? '📘',
      level: 'basic' as const,
      colorScheme: {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-800'
      }
    }];
  });
});

export const INITIAL_VOCABULARY: VocabularyWord[] = [
  ...CURATED_VOCABULARY,
  ...curriculumVocabulary
];
