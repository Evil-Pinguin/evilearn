export interface MathDrillItem {
  number: number;
  factors: number[];
  largestPrime: number;
  isTrap: boolean;
  trapType?: 'square_of_prime' | 'first_extracted_confusion' | 'incomplete_factorization';
  hint: string;
  explanation: string;
}

export const mathDrillNumbers: MathDrillItem[] = [
  {
    number: 91,
    factors: [7, 13],
    largestPrime: 13,
    isTrap: false,
    hint: 'Попробуй разделить на 7: 91 / 7 = ? Проверь полученные множители.',
    explanation: '91 = 7 × 13. Оба числа 7 и 13 — простые. Наибольший простой делитель: 13.'
  },
  {
    number: 100,
    factors: [2, 2, 5, 5],
    largestPrime: 5,
    isTrap: true,
    trapType: 'square_of_prime',
    hint: 'Разложи 100 на 2·50 → 2·2·25 → 2·2·5·5. Не называй 25 или 50 (они составные)!',
    explanation: '100 = 2 × 2 × 5 × 5. Простые кирпичики: {2, 5}. Наибольший простой делитель: 5. (25 и 50 — составные ловушки!)'
  },
  {
    number: 32,
    factors: [2, 2, 2, 2, 2],
    largestPrime: 2,
    isTrap: false,
    hint: '32 — это степень двойки (2^5). Какие простые множители входят в 32?',
    explanation: '32 = 2 × 2 × 2 × 2 × 2. Единственный простой множитель — 2. Значит, наибольший простой делитель: 2.'
  },
  {
    number: 49,
    factors: [7, 7],
    largestPrime: 7,
    isTrap: true,
    trapType: 'square_of_prime',
    hint: '49 — это не простое число! Вспомни таблицу умножения: 7 × 7 = ?',
    explanation: '49 = 7 × 7. Число 49 составное (квадрат простого числа 7). Наибольший простой делитель: 7.'
  },
  {
    number: 25,
    factors: [5, 5],
    largestPrime: 5,
    isTrap: true,
    trapType: 'square_of_prime',
    hint: '25 оканчивается на 5, значит делится на 5.',
    explanation: '25 = 5 × 5. Это квадрат простого числа 5. Наибольший простой делитель: 5.'
  },
  {
    number: 9,
    factors: [3, 3],
    largestPrime: 3,
    isTrap: true,
    trapType: 'square_of_prime',
    hint: '9 — нечётное, но составное: 3 × 3 = 9.',
    explanation: '9 = 3 × 3. Наибольший простой делитель: 3.'
  },
  {
    number: 98,
    factors: [2, 7, 7],
    largestPrime: 7,
    isTrap: true,
    trapType: 'first_extracted_confusion',
    hint: 'Сначала вынимаем 2: 98 = 2 × 49. Теперь разложи 49 до конца!',
    explanation: '98 = 2 × 7 × 7. Первый вынутый множитель — 2 (наименьший), а ответ — 7 (наибольший).'
  },
  {
    number: 75,
    factors: [3, 5, 5],
    largestPrime: 5,
    isTrap: true,
    trapType: 'incomplete_factorization',
    hint: '75 = 3 × 25. Не останавливайся на 25! Разложи 25 = 5 × 5.',
    explanation: '75 = 3 × 5 × 5. Простые множители: 3 и 5. Наибольший простой делитель: 5.'
  },
  {
    number: 55,
    factors: [5, 11],
    largestPrime: 11,
    isTrap: true,
    trapType: 'first_extracted_confusion',
    hint: '55 = 5 × 11. Первым вынимается 5, но какое число больше — 5 или 11?',
    explanation: '55 = 5 × 11. Множитель 5 — наименьший, а наибольший простой делитель — 11.'
  },
  {
    number: 45,
    factors: [3, 3, 5],
    largestPrime: 5,
    isTrap: true,
    trapType: 'square_of_prime',
    hint: '45 = 9 × 5. Но 9 — составное (3 × 3)! Разложи полностью.',
    explanation: '45 = 3 × 3 × 5. Наибольший простой делитель: 5 (не 9!).'
  },
  {
    number: 51,
    factors: [3, 17],
    largestPrime: 17,
    isTrap: true,
    trapType: 'incomplete_factorization',
    hint: 'Проверь сумму цифр: 5 + 1 = 6 (делится на 3). 51 / 3 = ?',
    explanation: '51 = 3 × 17. 17 — простое число. Наибольший простой делитель: 17.'
  },
  {
    number: 57,
    factors: [3, 19],
    largestPrime: 19,
    isTrap: true,
    trapType: 'incomplete_factorization',
    hint: 'Сумма цифр 5 + 7 = 12 (делится на 3). 57 / 3 = ?',
    explanation: '57 = 3 × 19. 19 — простое число. Наибольший простой делитель: 19.'
  },
  {
    number: 77,
    factors: [7, 11],
    largestPrime: 11,
    isTrap: false,
    hint: '77 = 7 × 11. Оба множителя простые.',
    explanation: '77 = 7 × 11. Наибольший простой делитель: 11.'
  },
  {
    number: 97,
    factors: [97],
    largestPrime: 97,
    isTrap: false,
    hint: 'Проверь делители до корня (2, 3, 5, 7). Делится ли 97 на что-то?',
    explanation: '97 не делится на 2, 3, 5, 7. 97 — само по себе простое число! Наибольший простой делитель: 97.'
  }
];
