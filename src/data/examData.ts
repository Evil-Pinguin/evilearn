import { ExamQuestion } from '../types';

export const examQuestionsData: ExamQuestion[] = [
  {
    id: 1,
    requiredParts: [
      { label: 'int main', anyOf: ['main'] },
      { label: '#include <stdio.h>', anyOf: ['#include <stdio.h>', '#include<stdio.h>'] },
      { label: 'printf / puts', anyOf: ['printf', 'puts'] },
      { label: 'строка "I am ready!"', anyOf: ['i am ready!'] },
      { label: 'return 0;', anyOf: ['return'] }
    ],
    forbiddenParts: [{ label: 'перевод строки \\n в конце вывода (автотест сверяет посимвольно)', anyOf: ['\\n'] }],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    printf("I am ready!");\n    return 0;\n}',
    title: 'Задача 1: Печать строки готовности',
    category: 'Основы C',
    type: 'code',
    points: 10,
    description: 'Напиши полную программу на C (с include <stdio.h> и main), которая печатает "I am ready!" (строго без \\n в конце).',
    hint: 'Используй #include <stdio.h>, внутри main напиши printf("I am ready!"); и верни return 0;. Не ставь \\n.',
    starterCode: `#include <stdio.h>

int main(void) {
    // Напиши код здесь
    
    return 0;
}`,
    expectedOutputSample: 'I am ready!',
    testCases: [
      { input: '', expected: 'I am ready!', description: 'Печать без \\n' }
    ],
    explanation: 'Правильное решение: printf("I am ready!"); и return 0;.'
  },
  {
    id: 2,
    requiredParts: [
      { label: 'int main', anyOf: ['main'] },
      { label: 'scanf для чтения числа', anyOf: ['scanf'] },
      { label: 'ловушка extra / n/a', anyOf: ['extra', 'tail_is_clean', 'n/a'] },
      { label: 'умножение n * n', anyOf: ['n * n', '* n', 'pow'] },
      { label: 'печать через printf', anyOf: ['printf'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    char extra;\n\n    if (scanf("%d %c", &n, &extra) != 1) {\n        printf("n/a");\n        return 0;\n    }\n    printf("%d", n * n);\n    return 0;\n}',
    title: 'Задача 2: Квадрат числа с валидацией',
    category: 'Валидация ввода',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает целое число, печатает его квадрат. Если во вводе мусор (например "abc", "12.5" или "5x") — печатает "n/a".',
    hint: 'Объяви int n; char extra; и проверь if (scanf("%d %c", &n, &extra) != 1) { printf("n/a"); return 0; } затем напечатай n * n.',
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    char extra;

    // Ввод с валидацией и печать квадрата
    
    return 0;
}`,
    sampleInput: '5 -> 25 | abc -> n/a',
    testCases: [
      { input: '5', expected: '25', description: '5 -> 25' },
      { input: '-4', expected: '16', description: '-4 -> 16' },
      { input: 'abc', expected: 'n/a', description: 'abc -> n/a' },
      { input: '12.5', expected: 'n/a', description: '12.5 -> n/a' }
    ],
    explanation: 'Используется %c-ловушка: if (scanf("%d %c", &n, &extra) != 1) printf("n/a"); else printf("%d", n * n);'
  },
  {
    id: 3,
    requiredParts: [
      { label: 'своя функция min', anyOf: ['min_of_two', 'int min', 'min('] },
      { label: 'вызов функции из main', anyOf: ['min'] },
      { label: 'сравнение чисел', anyOf: ['<', '>', '?'] },
      { label: 'scanf с ловушкой', anyOf: ['scanf'] },
      { label: 'printf результата', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint min_of_two(int a, int b) {\n    return (a < b) ? a : b;\n}\n\nint main(void) {\n    int a, b;\n    char extra;\n\n    if (scanf("%d %d %c", &a, &b, &extra) != 2) {\n        printf("n/a");\n        return 0;\n    }\n    printf("%d", min_of_two(a, b));\n    return 0;\n}',
    title: 'Задача 3: Меньшее из двух (функция обязательна)',
    category: 'Функции',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает два целых числа, печатает меньшее. Вычисление меньшего числа ОБЯЗАНО быть вынесено в отдельную функцию (например min_of_two). Мусор -> n/a.',
    hint: 'Создай выше main функцию: int min_of_two(int a, int b) { return (a < b) ? a : b; }. В main прочитай два числа: scanf("%d %d %c", &a, &b, &extra) != 2.',
    starterCode: `#include <stdio.h>

int min_of_two(int a, int b) {
    // Твоя функция
}

int main(void) {
    // Ввод и вызов
    return 0;
}`,
    sampleInput: '3 9 -> 3 | 10 2 -> 2',
    testCases: [
      { input: '3 9', expected: '3', description: '3 9 -> 3' },
      { input: '10 2', expected: '2', description: '10 2 -> 2' },
      { input: '5 5', expected: '5', description: '5 5 -> 5' },
      { input: '12x 5', expected: 'n/a', description: '12x 5 -> n/a' }
    ],
    explanation: 'Функция min_of_two(a, b) возвращает (a < b) ? a : b; main читает два числа с %c ловушкой: scanf("%d %d %c", &a, &b, &extra) != 2.'
  },
  {
    id: 4,
    requiredParts: [
      { label: 'цикл (for или while)', anyOf: ['for', 'while'] },
      { label: 'накопление суммы', anyOf: ['+=', 'sum =', 'sum +='] },
      { label: 'шаг 2 или проверка чётности', anyOf: ['+= 2', '% 2', '%2'] },
      { label: 'scanf с ловушкой', anyOf: ['scanf'] },
      { label: 'printf результата', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    char extra;\n\n    if (scanf("%d %c", &n, &extra) != 1) {\n        printf("n/a");\n        return 0;\n    }\n    int sum = 0;\n    for (int i = 2; i <= n; i += 2) {\n        sum += i;\n    }\n    printf("%d", sum);\n    return 0;\n}',
    title: 'Задача 4: Сумма чётных чисел от 1 до N',
    category: 'Циклы',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает целое N, печатает сумму всех чётных чисел от 1 до N. Пример: при N=10 -> 30 (2+4+6+8+10). Мусор -> n/a.',
    hint: 'Запусти цикл: int sum = 0; for (int i = 2; i <= n; i += 2) { sum += i; }. Не забудь валидацию ввода с extra.',
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    char extra;

    // Цикл подсчета четных чисел
    
    return 0;
}`,
    sampleInput: '10 -> 30 (2+4+6+8+10)',
    testCases: [
      { input: '10', expected: '30', description: '10 -> 30' },
      { input: '5', expected: '6', description: '5 -> 6 (2+4)' },
      { input: '1', expected: '0', description: '1 -> 0' },
      { input: '12.5', expected: 'n/a', description: '12.5 -> n/a' }
    ],
    explanation: 'Накопление в цикле: int sum = 0; for (int i = 2; i <= n; i += 2) sum += i; printf("%d", sum);'
  },
  {
    id: 5,
    requiredParts: [
      { label: 'double + %lf в scanf', anyOf: ['%lf'] },
      { label: 'тип double', anyOf: ['double'] },
      { label: 'формула площади (r * r)', anyOf: ['r * r', 'r*r', 'pow(r'] },
      { label: 'число пи', anyOf: ['3.14159265358979', '3.14159', 'm_pi', 'acos(-1)'] },
      { label: 'печать с 3 знаками %.3f', anyOf: ['%.3f'] },
      { label: 'printf результата', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    double r;\n    char extra;\n\n    if (scanf("%lf %c", &r, &extra) != 1 || r < 0) {\n        printf("n/a");\n        return 0;\n    }\n    printf("%.3f", 3.14159265358979 * r * r);\n    return 0;\n}',
    title: 'Задача 5: Площадь круга с 3 знаками',
    category: 'math.h & double',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает дробное число (радиус r), печатает площадь круга πr² с ровно тремя знаками после точки (%.3f). π = 3.14159265358979. Мусор или r < 0 -> n/a.',
    hint: 'double r; char extra; Чтение: scanf("%lf %c", &r, &extra). Формула: 3.14159265358979 * r * r. Печать: printf("%.3f", area);',
    starterCode: `#include <stdio.h>

int main(void) {
    double r;
    char extra;

    // Ввод %lf и вывод %.3f
    
    return 0;
}`,
    sampleInput: '2 -> 12.566',
    testCases: [
      { input: '2', expected: '12.566', description: 'r=2 -> 12.566' },
      { input: '1', expected: '3.142', description: 'r=1 -> 3.142' },
      { input: 'abc', expected: 'n/a', description: 'abc -> n/a' }
    ],
    explanation: 'Чтение через %lf, валидация if (r < 0) printf("n/a"); печать через printf("%.3f", 3.14159265358979 * r * r);'
  },
  {
    id: 6,
    requiredParts: [
      { label: 'ветка LETTER', anyOf: ['letter', 'isalpha'] },
      { label: 'ветка DIGIT', anyOf: ['digit', 'isdigit'] },
      { label: 'ветка OTHER', anyOf: ['other', 'else'] },
      { label: 'чтение символа', anyOf: ['scanf', 'getchar'] },
      { label: 'printf', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: "#include <stdio.h>\n\nint main(void) {\n    int c = getchar();\n\n    if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')) {\n        printf(\"LETTER\");\n    } else if (c >= '0' && c <= '9') {\n        printf(\"DIGIT\");\n    } else {\n        printf(\"OTHER\");\n    }\n    return 0;\n}",
    title: 'Задача 6: Классификатор символов',
    category: 'char & ASCII',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает один символ. Если это латинская буква (\'A\'..\'Z\', \'a\'..\'z\') -> печатает LETTER, если цифра (\'0\'..\'9\') -> DIGIT, иначе -> OTHER. При ошибке ввода -> n/a.',
    hint: 'Проверяй диапазоны символов: (c >= \'A\' && c <= \'Z\') || (c >= \'a\' && c <= \'z\') для букв, и (c >= \'0\' && c <= \'9\') для цифр.',
    starterCode: `#include <stdio.h>

int main(void) {
    char c;
    if (scanf("%c", &c) != 1) {
        printf("n/a");
        return 0;
    }
    // Классификация символа
    
    return 0;
}`,
    sampleInput: 'k -> LETTER | 7 -> DIGIT | ! -> OTHER',
    testCases: [
      { input: 'k', expected: 'LETTER', description: 'k -> LETTER' },
      { input: '7', expected: 'DIGIT', description: '7 -> DIGIT' },
      { input: '!', expected: 'OTHER', description: '! -> OTHER' }
    ],
    explanation: 'Сравнение диапазонов ASCII: if ((c>=\'A\' && c<=\'Z\') || (c>=\'a\' && c<=\'z\')) printf("LETTER"); else if (c>=\'0\' && c<=\'9\') printf("DIGIT"); else printf("OTHER");'
  },
  {
    id: 7,
    requiredParts: [
      { label: 'цикл while', anyOf: ['while', 'for'] },
      { label: 'уменьшение вычитанием или %', anyOf: ['-=', '%'] },
      { label: 'условие a != b', anyOf: ['!=', '<'] },
      { label: 'scanf двух чисел', anyOf: ['scanf'] },
      { label: 'printf результата', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    char extra;\n\n    if (scanf("%d %d %c", &a, &b, &extra) != 2 || a <= 0 || b <= 0) {\n        printf("n/a");\n        return 0;\n    }\n    while (a != b) {\n        if (a > b) {\n            a -= b;\n        } else {\n            b -= a;\n        }\n    }\n    printf("%d", a);\n    return 0;\n}',
    title: 'Задача 7: НОД двух чисел (Алгоритм Евклида)',
    category: 'Алгоритмы',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает два целых положительных числа, печатает их наибольший общий делитель (НОД) по алгоритму Евклида вычитанием (заменяй большее число на разность большего и меньшего, пока они не станут равны). Мусор или числа <= 0 -> n/a.',
    hint: 'Пока a != b, делай: if (a > b) a -= b; else b -= a;. В конце напечатай a.',
    starterCode: `#include <stdio.h>

int main(void) {
    int a, b;
    char extra;

    if (scanf("%d %d %c", &a, &b, &extra) != 2 || a <= 0 || b <= 0) {
        printf("n/a");
        return 0;
    }
    // Алгоритм Евклида вычитанием
    
    return 0;
}`,
    sampleInput: '12 18 -> 6',
    testCases: [
      { input: '12 18', expected: '6', description: '12 18 -> 6' },
      { input: '100 25', expected: '25', description: '100 25 -> 25' },
      { input: '17 19', expected: '1', description: '17 19 -> 1' }
    ],
    explanation: 'while (a != b) { if (a > b) a -= b; else b -= a; } printf("%d", a);'
  },
  {
    id: 8,
    requiredParts: [
      { label: 'цикл for', anyOf: ['for'] },
      { label: 'граница 10', anyOf: ['10'] },
      { label: 'разделитель " | "', anyOf: ['|'] },
      { label: 'печать %d', anyOf: ['%d'] },
      { label: 'printf', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    for (int i = 1; i <= 10; i++) {\n        printf("%d | %d | %d\\n", i, i * i, i * i * i);\n    }\n    return 0;\n}',
    title: 'Задача 8: Таблица квадратов и кубов',
    category: 'Форматный вывод',
    type: 'code',
    points: 10,
    description: 'Напиши программу: НИЧЕГО не читает. Печатает таблицу для x от 1 до 10, в каждой строке: x, x² и x³, разделенные " | ". Формат строки: "x | x^2 | x^3\\n". Пример 7-й строки: "7 | 49 | 343\\n".',
    hint: 'В цикле for (int i = 1; i <= 10; i++) печатай printf("%d | %d | %d\\n", i, i * i, i * i * i);',
    starterCode: `#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        // Печатай строку
    }
    return 0;
}`,
    sampleInput: 'строки вида "7 | 49 | 343"',
    testCases: [
      { input: '', expected: '1 | 1 | 1\n2 | 4 | 8\n3 | 9 | 27\n4 | 16 | 64\n5 | 25 | 125\n6 | 36 | 216\n7 | 49 | 343\n8 | 64 | 512\n9 | 81 | 729\n10 | 100 | 1000\n', description: 'Таблица 1..10' }
    ],
    explanation: 'printf("%d | %d | %d\\n", i, i * i, i * i * i);'
  },
  {
    id: 9,
    requiredParts: [
      { label: 'функция factorial()', anyOf: ['factorial'] },
      { label: 'базовый случай (return 1)', anyOf: ['if', 'n <= 1', 'n < 2', '?'] },
      { label: 'рекурсивный вызов с n - 1', anyOf: ['n - 1', 'n-1'] },
      { label: 'умножение', anyOf: ['*'] },
      { label: 'scanf с ловушкой', anyOf: ['scanf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) {\n        return 1;\n    }\n    return n * factorial(n - 1);\n}\n\nint main(void) {\n    int n;\n    char extra;\n\n    if (scanf("%d %c", &n, &extra) != 1 || n < 0 || n > 12) {\n        printf("n/a");\n        return 0;\n    }\n    printf("%d", factorial(n));\n    return 0;\n}',
    title: 'Задача 9: Рекурсивный факториал',
    category: 'Рекурсия',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает целое число N (от 0 до 12), вычисляет N! СТРОГО РЕКУРСИВНОЙ ФУНКЦИЕЙ factorial(). Пример: 5 -> 120. Мусор или N < 0 -> n/a.',
    hint: 'int factorial(int n) { if (n <= 1) return 1; return n * factorial(n - 1); }',
    starterCode: `#include <stdio.h>

int factorial(int n) {
    // Рекурсивный расчет
}

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1 || n < 0 || n > 12) {
        printf("n/a");
        return 0;
    }
    printf("%d", factorial(n));
    return 0;
}`,
    sampleInput: '5 -> 120 | 0 -> 1',
    testCases: [
      { input: '5', expected: '120', description: '5! = 120' },
      { input: '0', expected: '1', description: '0! = 1' },
      { input: '3', expected: '6', description: '3! = 6' }
    ],
    explanation: 'int factorial(int n) { if (n <= 1) return 1; return n * factorial(n - 1); }'
  },
  {
    id: 10,
    requiredParts: [
      { label: 'цикл перебора делителей', anyOf: ['for', 'while'] },
      { label: 'остаток от деления n % d', anyOf: ['%'] },
      { label: 'сравнение с нулём', anyOf: ['== 0', '!= 0'] },
      { label: 'выход из цикла', anyOf: ['break', 'return', 'else'] },
      { label: 'scanf с ловушкой', anyOf: ['scanf'] },
      { label: 'printf результата', anyOf: ['printf'] },
      { label: 'int main', anyOf: ['main'] }
    ],
    referenceSolution: '#include <stdio.h>\n\nint main(void) {\n    int n;\n    char extra;\n\n    if (scanf("%d %c", &n, &extra) != 1 || n <= 1) {\n        printf("n/a");\n        return 0;\n    }\n    for (int d = n / 2; d >= 1; d--) {\n        if (n % d == 0) {\n            printf("%d", d);\n            break;\n        }\n    }\n    return 0;\n}',
    title: 'Задача 10: Наибольший собственный делитель числа',
    category: 'Алгоритмы делимости',
    type: 'code',
    points: 10,
    description: 'Напиши программу: читает целое N > 1, печатает его НАИБОЛЬШИЙ делитель, кроме самого числа N (собственный делитель). Пример: 100 -> 50, 17 -> 1. Мусор или N <= 1 -> n/a.',
    hint: 'Начни проверку с d = n / 2 вниз до 1: for (int d = n / 2; d >= 1; d--) if (n % d == 0) { printf("%d", d); break; }',
    starterCode: `#include <stdio.h>

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1 || n <= 1) {
        printf("n/a");
        return 0;
    }
    // Поиск наибольшего делителя d < n
    
    return 0;
}`,
    sampleInput: '100 -> 50 | 17 -> 1',
    testCases: [
      { input: '100', expected: '50', description: '100 -> 50' },
      { input: '17', expected: '1', description: '17 -> 1' },
      { input: '12', expected: '6', description: '12 -> 6' }
    ],
    explanation: 'Ищем сверху вниз: for (int d = n / 2; d >= 1; d--) { if (n % d == 0) { printf("%d", d); break; } }'
  }
];
