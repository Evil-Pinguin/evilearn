import { Flashcard } from '../types';

export const flashcardsData: Flashcard[] = [
  // BASH & LINUX
  {
    id: 'fc-1',
    category: 'bash',
    question: 'Как создать вложенную структуру папок a/b/c одной командой?',
    answer: 'mkdir -p a/b/c',
    codeExample: 'mkdir -p src/data/logs',
    tip: 'Флаг -p (parents) создаёт все недостающие промежуточные папки без ошибки.',
    difficulty: 'easy'
  },
  {
    id: 'fc-2',
    category: 'bash',
    question: 'Как посмотреть все файлы, включая скрытые, с правами и размером?',
    answer: 'ls -la',
    codeExample: 'ls -la src/',
    tip: '-l — подробный список (long), -a — включая скрытые файлы с точкой (all).',
    difficulty: 'easy'
  },
  {
    id: 'fc-3',
    category: 'bash',
    question: 'Как вывести ровно 13-ю строку файла без открытия редактора?',
    answer: "sed -n '13p' filename",
    codeExample: "sed -n '13p' src/data/door_data.txt",
    tip: '-n подавляет автовывод всех строк, p печатает указанную.',
    difficulty: 'medium'
  },
  {
    id: 'fc-4',
    category: 'bash',
    question: 'Как передать строку на вход скомпилированной программе через пайп?',
    answer: 'echo "строка" | ./program',
    codeExample: 'echo "48 45 4C" | ./char_decode 0',
    tip: '| перенаправляет stdout левой команды в stdin правой команды.',
    difficulty: 'easy'
  },
  {
    id: 'fc-5',
    category: 'bash',
    question: 'В чем разница между > и >> при перенаправлении в файл?',
    answer: '> перезаписывает файл целиком, а >> дописывает данные в конец файла.',
    codeExample: './prog > out.txt   # перезапись\n./prog >> log.txt  # добавление',
    difficulty: 'easy'
  },

  // GIT
  {
    id: 'fc-6',
    category: 'git',
    question: 'Какая последовательность команд фиксирует и отправляет квест?',
    answer: 'git add <файл> → git commit -m "сообщение" → git push origin <ветка>',
    codeExample: 'git add src/1948.c\ngit commit -m "quest 1: prime divisor"\ngit push origin develop',
    tip: 'Аналогия «Коробка-Посылка»: add — положить, commit — запечатать, push — отправить.',
    difficulty: 'easy'
  },
  {
    id: 'fc-7',
    category: 'git',
    question: 'Как создать ветку develop и сразу перейти в неё?',
    answer: 'git checkout -b develop',
    codeExample: 'git checkout -b develop',
    tip: 'Флаг -b означает "создать новую ветку (branch) перед переключением".',
    difficulty: 'easy'
  },
  {
    id: 'fc-8',
    category: 'git',
    question: 'Как отменить случайные изменения в файле и вернуть состояние последнего коммита?',
    answer: 'git restore <путь_к_файлу>',
    codeExample: 'git restore src/char_decode.c',
    tip: 'Спасает, если случайно удалила строки в nano или испортила код.',
    difficulty: 'easy'
  },
  {
    id: 'fc-9',
    category: 'git',
    question: 'Как посмотреть построчно, что именно изменено в коде (+ и -)?',
    answer: 'git diff',
    codeExample: 'git diff src/1948.c',
    tip: 'Красные строки (-) удалены, зеленые (+) добавлены.',
    difficulty: 'easy'
  },
  {
    id: 'fc-10',
    category: 'git',
    question: 'Что делать, если случайно скомпилировала бинарник прямо в src/?',
    answer: 'Немедленно удалить бинарник (rm src/имя_бинарника) до добавления в git add!',
    codeExample: 'rm src/1948 src/char_decode',
    tip: 'Исполняемые файлы в репозиторий добавлять СТРОГО ЗАПРЕЩЕНО.',
    difficulty: 'medium'
  },

  // C BASICS
  {
    id: 'fc-11',
    category: 'c_basics',
    question: 'Какой спецификатор формата используется для 64-битного целого long long?',
    answer: '%lld',
    codeExample: 'long long big = 9223372036854775807LL;\nprintf("%lld\\n", big);',
    tip: 'Для обычного int — %d, для double — %lf, для char — %c.',
    difficulty: 'easy'
  },
  {
    id: 'fc-12',
    category: 'c_basics',
    question: 'Как напечатать вещественное число с ровно 7 знаками после запятой?',
    answer: '%.7lf',
    codeExample: 'double val = 3.14159265;\nprintf("%.7lf\\n", val);',
    tip: 'Точка и число после неё задают количество знаков после запятой.',
    difficulty: 'easy'
  },
  {
    id: 'fc-13',
    category: 'c_basics',
    question: 'Почему одной проверки scanf("%d", &x) == 1 недостаточно для надежной валидации?',
    answer: 'Потому что scanf прочитает число и остановится на первой букве. Ввод "12abc" вернет 1, пропустив "abc" в буфер.',
    codeExample: 'if (scanf("%d", &n) != 1 || !tail_is_clean()) {\n    printf("n/a\\n");\n}',
    tip: 'Всегда используй tail_is_clean() для проверки отсутствия мусора в конце строки!',
    difficulty: 'hard'
  },
  {
    id: 'fc-14',
    category: 'c_basics',
    question: 'В чем суть принципа Дейкстры «Одна точка выхода» (Single Exit)?',
    answer: 'Функция должна иметь единственный return в конце, без разбросанных return по телу функции.',
    codeExample: 'int error = 0;\nif (...) error = 1;\nif (error) printf("n/a\\n");\nelse printf("%d\\n", res);\nreturn 0;',
    difficulty: 'medium'
  },

  // C ADVANCED
  {
    id: 'fc-15',
    category: 'c_advanced',
    question: 'Как передать переменную в функцию, чтобы функция могла изменить её значение?',
    answer: 'Передать адрес переменной (&var), а в параметрах функции принять указатель (*ptr) и разыменовать его.',
    codeExample: 'void inc(int *x) { *x += 1; }\n// Вызов:\nint a = 5; inc(&a); // a станет 6',
    tip: 'Аналогия: ты даешь ключ (&a) от своего шкафа, и функция кладет вещь прямо внутрь (*x).',
    difficulty: 'medium'
  },
  {
    id: 'fc-16',
    category: 'c_advanced',
    question: 'Как перевести шестнадцатеричный символ hex в число без функций atoi/sscanf?',
    answer: "c - '0' (для цифр '0'-'9') и c - 'A' + 10 (для букв 'A'-'F')",
    codeExample: "int v = (c >= '0' && c <= '9') ? c - '0' : c - 'A' + 10;",
    tip: "В ASCII символы '0'-'9' и 'A'-'F' идут строго подряд по порядку.",
    difficulty: 'hard'
  },
  {
    id: 'fc-17',
    category: 'c_advanced',
    question: 'Что произойдет при отсутствии базового случая в рекурсии?',
    answer: 'Бесконечные вызовы функции приведут к переполнению стека (Stack Overflow) и падению с Segmentation fault.',
    codeExample: 'long long fib(int n) {\n    if (n < 3) return 1; // БАЗОВЫЙ СЛУЧАЙ ОБЯЗАТЕЛЕН\n    return fib(n-1) + fib(n-2);\n}',
    difficulty: 'medium'
  },
  {
    id: 'fc-18',
    category: 'c_advanced',
    question: 'Как объявить указатель на функцию, принимающую double и int*, и возвращающую double?',
    answer: 'double (*f)(double, int *)',
    codeExample: 'void plot(double (*f)(double, int *)) {\n    int def = 0;\n    double y = f(1.5, &def);\n}',
    tip: 'Круглые скобки вокруг (*f) обязательны, иначе f станет функцией, возвращающей указатель на double.',
    difficulty: 'hard'
  },

  // TOOLS & SCHOOL 21 RULES
  {
    id: 'fc-19',
    category: 'tools',
    question: 'Какие 4 обязательных флага GCC требуются во всех квестах Школы 21?',
    answer: '-Wall -Werror -Wextra -std=c11',
    codeExample: 'gcc -Wall -Werror -Wextra -std=c11 src/1948.c -o 1948',
    tip: '-Werror превращает все предупреждения в ошибки.',
    difficulty: 'easy'
  },
  {
    id: 'fc-20',
    category: 'tools',
    question: 'Где в команде GCC должен стоять флаг -lm для подключения math.h?',
    answer: 'В САМОМ КОНЦЕ команды (после исходных файлов)!',
    codeExample: 'gcc -Wall -Werror -Wextra -std=c11 door_functions.c -lm -o door_functions',
    tip: 'Линковщик GCC связывает библиотеки слева направо. Если поставить в начало, будет undefined reference.',
    difficulty: 'medium'
  },
  {
    id: 'fc-21',
    category: 'tools',
    question: 'Как проверить и как исправить кодстайл по .clang-format?',
    answer: 'clang-format -n <файл> (проверить) и clang-format -i <файл> (исправить).',
    codeExample: 'clang-format -n src/1948.c # отчет\nclang-format -i src/1948.c # автоисправление',
    difficulty: 'easy'
  },
  {
    id: 'fc-22',
    category: 'school21',
    question: 'Формула шага сетки: отрезок длины L разбит на N точек включительно. Какой шаг?',
    answer: 'step = L / (N - 1)',
    codeExample: 'double step = 2.0 * PI / 41.0; // Для 42 точек от -PI до +PI',
    tip: 'Аналогия: у забора из 42 досок ровно 41 щель (промежуток).',
    difficulty: 'medium'
  },
  {
    id: 'fc-23',
    category: 'school21',
    question: 'Являются ли числа 9, 25, 49 простыми числами?',
    answer: 'НЕТ! Это квадраты простых чисел (3·3, 5·5, 7·7), они имеют по 3 делителя и являются составными.',
    tip: 'Нечётное число НЕ ОБЯЗАТЕЛЬНО простое. Ответ делителя всегда сверяй по списку простых: 2, 3, 5, 7, 11, 13...',
    difficulty: 'hard'
  },
  {
    id: 'fc-24',
    category: 'school21',
    question: 'Какой ритуал нахождения наибольшего простого делителя числа?',
    answer: '1. Ломать на простые кирпичики до конца. 2. Выписать все множители в ряд. 3. Выбрать наибольший кирпичик.',
    codeExample: '91 = 7 × 13 → ответ: 13\n100 = 2 × 2 × 5 × 5 → ответ: 5\n32 = 2⁵ → ответ: 2',
    difficulty: 'medium'
  }
];
