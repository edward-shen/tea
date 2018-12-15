interface Base {
  id: number;
  abbrev: string;
  question: string;
  respCount: number;
}

interface Question extends Base {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
  mean: number;
  median: number;
  stdDev: number;
  respRate: number;
}

interface NAQuestion extends Question {
  '-1': number;
}

interface HoursQuestion extends Base {
  '17-20': number;
  '13-16': number;
  '9-12': number;
  '5-8': number;
  '1-4': number;
}

export { Question, NAQuestion, HoursQuestion };
