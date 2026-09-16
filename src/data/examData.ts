import { ExamQuestion } from '../types';

export const examQuestionsData: ExamQuestion[] = [
  {
    id: 1,
    title: 'Задача 1: Валидация ввода (double_it)',
    category: 'C Basics',
    type: 'code',
    points: 10,
    description: 'Напиши полную программу на C (с include <stdio.h> и main), которая читает одно целое число и печатает его удвоенное значение. Если на входе мусор или дробное число (например "12abc" или "4.5") — программа обязана напечатать "n/a\\n". Соблюдай единую точку выхода!',
    starterCode: `#include <stdio.h>

static int tail_is_clean(void) {
    int c;
    while ((c = getchar()) != '\\n' && c != EOF) {
        if (c != ' ' && c != '\\t' && c != '\\r') return 0;
    }
    return 1;
}

int main(void) {
    // Напиши код здесь
    
    return 0;
}`,
    testCases: [
      { input: '21', expected: '42', description: 'Число 21 -> 42' },
      { input: '-5', expected: '-10', description: 'Отрицательное число -5 -> -10' },
      { input: '12abc', expected: 'n/a', description: 'Мусор в хвосте 12abc -> n/a' },
      { input: 'hello', expected: 'n/a', description: 'Текст hello -> n/a' }
    ],
    explanation: 'Каноническое решение использует scanf("%d", &num) != 1 || !tail_is_clean(), флаг ошибки int error = 0, и ветвление с одной точкой выхода return 0 в конце main.'
  },
  {
    id: 2,
    title: 'Задача 2: Наибольший простой делитель числа 91',
    category: 'Math Drill',
    type: 'number',
    points: 10,
    description: 'Найди НАИБОЛЬШИЙ простой делитель для числа 91. Введи только одно целое число в поле ответа. (Внимание: помни про кирпичики и проверку по списку простых!).',
    correctAnswer: 13,
    explanation: '91 не делится на 2, 3, 5. Проверяем 7: 91 / 7 = 13. Числа 7 и 13 оба простые. Наибольший простой множитель — 13.'
  },
  {
    id: 3,
    title: 'Задача 3: Наибольший простой делитель числа 100',
    category: 'Math Drill',
    type: 'number',
    points: 10,
    description: 'Найди НАИБОЛЬШИЙ простой делитель для числа 100. Введи только число. (Осторожно: 25 и 50 — составные числа, не попадись в ловушку!).',
    correctAnswer: 5,
    explanation: 'Разложение числа 100 на простые множители: 100 = 2 × 2 × 5 × 5. Простые делители числа 100 — это только 2 и 5. Наибольший из них — 5.'
  },
  {
    id: 4,
    title: 'Задача 4: Спасение кода в Git (Откат файла)',
    category: 'Git',
    type: 'command',
    points: 10,
    description: 'Во время редактирования ты случайно удалила кусок кода в файле "src/quest3.c" и хочешь вернуть его к состоянию последнего коммита. Напиши точную команду Git.',
    correctAnswer: 'git restore src/quest3.c',
    explanation: 'Команда "git restore src/quest3.c" восстанавливает файл в рабочей директории до состояния HEAD/индекса.'
  },
  {
    id: 5,
    title: 'Задача 5: Полная команда компиляции со всеми флагами',
    category: 'Tools / GCC',
    type: 'command',
    points: 10,
    description: 'Напиши полную команду сборки файла "door_functions.c" в исполняемый файл "door_functions" со всеми обязательными флагами Школы 21 (-Wall, -Werror, -Wextra, -std=c11) и математической библиотекой libm.',
    correctAnswer: 'gcc -Wall -Werror -Wextra -std=c11 door_functions.c -lm -o door_functions',
    explanation: 'Обязательные флаги: -Wall -Werror -Wextra -std=c11. Флаг -lm должен находиться строго после имени компилируемого файла, а -o задает выходной файл.'
  },
  {
    id: 6,
    title: 'Задача 6: Деление вычитанием через указатель',
    category: 'C Advanced',
    type: 'code',
    points: 10,
    description: 'Напиши функцию "long long divide_by_sub(long long val, long long div, long long *q)", которая без использования операторов "/" и "%" вычисляет частное и остаток. Частное должно быть записано по указателю *q, а остаток возвращен через return.',
    starterCode: `long long divide_by_sub(long long val, long long div, long long *q) {
    long long count = 0;
    // Твой цикл вычитания здесь
    
    *q = count;
    return val;
}`,
    explanation: 'Используется цикл while (val >= div) { val -= div; count++; } затем *q = count; return val;'
  },
  {
    id: 7,
    title: 'Задача 7: Hex-декодирование в ASCII',
    category: 'C Advanced',
    type: 'choice',
    points: 10,
    description: 'Какое слово получится при декодировании hex-последовательности байтов "46 49 42 4F 4E 41 43 43 49 32 31"?\n(Подсказка: 46 = \'F\', 49 = \'I\', 42 = \'B\', 32 = \'2\', 31 = \'1\')',
    options: [
      'HELLOWORLD',
      'FIBONACCI21',
      'PEERREVIEW',
      'DOORFUNCTION'
    ],
    correctAnswer: 'FIBONACCI21',
    explanation: '46=\'F\', 49=\'I\', 42=\'B\', 4F=\'O\', 4E=\'N\', 41=\'A\', 43=\'C\', 43=\'C\', 49=\'I\', 32=\'2\', 31=\'1\' образует слово FIBONACCI21 (пасхалка сюжета Квеста 2).'
  },
  {
    id: 8,
    title: 'Задача 8: Последствия отсутствия базового случая в рекурсии',
    category: 'C Advanced',
    type: 'choice',
    points: 10,
    description: 'Что произойдет во время работы программы при рекурсивном вызове функции, если в ней забыли написать условие выхода (базовый случай)?',
    options: [
      'Программа завершится с кодом 0',
      'Произойдет бесконечное выделение стековых фреймов, стек переполнится, и ОС завершит процесс ошибкой Segmentation Fault (Stack Overflow)',
      'Компилятор gcc выдаст ошибку во время сборки с флагом -Wall',
      'Программа автоматически переключится на итеративный цикл'
    ],
    correctAnswer: 'Произойдет бесконечное выделение стековых фреймов, стек переполнится, и ОС завершит процесс ошибкой Segmentation Fault (Stack Overflow)',
    explanation: 'Каждый рекурсивный вызов аллоцирует фрейм в стеке (адрес возврата, локальные переменные). Без базового случая стек неминуемо переполняется (Stack Overflow).'
  },
  {
    id: 9,
    title: 'Задача 9: Расчет шага дискретизации сетки',
    category: 'School 21 Logic',
    type: 'choice',
    points: 10,
    description: 'Отрезок длиной L разбивается на N точек (включая обе границы). По какой формуле вычисляется шаг сетки step?',
    options: [
      'step = L / N',
      'step = L / (N - 1)',
      'step = (L - 1) / N',
      'step = L * (N - 1)'
    ],
    correctAnswer: 'step = L / (N - 1)',
    explanation: 'По правилу «забора с досками»: N точек образуют (N - 1) интервалов. Поэтому шаг равен общей длине, деленной на (N - 1). Для 42 точек шаг = 2*PI / 41.'
  },
  {
    id: 10,
    title: 'Задача 10: Принцип одной точки выхода Дейкстры',
    category: 'Code Style & Standards',
    type: 'choice',
    points: 10,
    description: 'Какой из следующих фрагментов кода функции строго соответствует стандартам структурного программирования Школы 21?',
    options: [
      'int check(int x) {\n  if (x < 0) return -1;\n  if (x == 0) return 0;\n  return 1;\n}',
      'int check(int x) {\n  int res = 0;\n  if (x < 0) res = -1;\n  else if (x > 0) res = 1;\n  return res;\n}',
      'int check(int x) {\n  if (x < 0) goto err;\n  return 1;\nerr: return -1;\n}',
      'int res;\nvoid check(int x) {\n  res = x;\n}'
    ],
    correctAnswer: 'int check(int x) {\n  int res = 0;\n  if (x < 0) res = -1;\n  else if (x > 0) res = 1;\n  return res;\n}',
    explanation: 'Второй вариант имеет ровно одну точку выхода (единственный return в конце), использует локальную переменную для сохранения результата и не использует запрещенные операторы goto или глобальные переменные.'
  }
];
