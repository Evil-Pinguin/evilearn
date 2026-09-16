import { Flashcard } from '../types';

export const flashcardsData: Flashcard[] = [
  // ==========================================
  // 40 КОМАНД (BASH, LINUX, GIT, TOOLS)
  // ==========================================
  {
    id: 'cmd-1',
    category: 'bash',
    type: 'command',
    question: 'pwd',
    answer: 'Print Working Directory: показывает полный абсолютный путь к текущей папке.',
    codeExample: 'pwd\n# Вывод: /home/breashee/evilearn/src',
    difficulty: 'easy'
  },
  {
    id: 'cmd-2',
    category: 'bash',
    type: 'command',
    question: 'ls',
    answer: 'Список файлов и папок в текущей директории.',
    codeExample: 'ls\n# 1948.c  char_decode.c  quest3.c',
    difficulty: 'easy'
  },
  {
    id: 'cmd-3',
    category: 'bash',
    type: 'command',
    question: 'ls -l',
    answer: 'Подробный список файлов с правами доступа (rwx), владельцем, размером в байтах и датой.',
    codeExample: 'ls -l src/',
    difficulty: 'easy'
  },
  {
    id: 'cmd-4',
    category: 'bash',
    type: 'command',
    question: 'ls -la',
    answer: 'Подробный список ВСЕХ файлов, включая скрытые (начинающиеся с точки, например .clang-format, .git).',
    codeExample: 'ls -la',
    difficulty: 'easy'
  },
  {
    id: 'cmd-5',
    category: 'bash',
    type: 'command',
    question: 'cd папка',
    answer: 'Перейти внутрь указанной папки (Change Directory).',
    codeExample: 'cd src',
    difficulty: 'easy'
  },
  {
    id: 'cmd-6',
    category: 'bash',
    type: 'command',
    question: 'cd ..',
    answer: 'Подняться на один уровень выше к родительской директории.',
    codeExample: 'cd ..',
    difficulty: 'easy'
  },
  {
    id: 'cmd-7',
    category: 'bash',
    type: 'command',
    question: 'cd ~',
    answer: 'Мгновенно перейти в домашнюю директорию пользователя (~).',
    codeExample: 'cd ~',
    difficulty: 'easy'
  },
  {
    id: 'cmd-8',
    category: 'bash',
    type: 'command',
    question: 'mkdir имя',
    answer: 'Создать новую директорию (папку).',
    codeExample: 'mkdir training',
    difficulty: 'easy'
  },
  {
    id: 'cmd-9',
    category: 'bash',
    type: 'command',
    question: 'mkdir -p a/b/c',
    answer: 'Создать вложенное дерево папок с автоматическим созданием всех промежуточных уровней.',
    codeExample: 'mkdir -p build/debug/logs',
    difficulty: 'medium'
  },
  {
    id: 'cmd-10',
    category: 'bash',
    type: 'command',
    question: 'touch файл',
    answer: 'Создать пустой файл или обновить время модификации существующего.',
    codeExample: 'touch notes.txt',
    difficulty: 'easy'
  },
  {
    id: 'cmd-11',
    category: 'bash',
    type: 'command',
    question: 'rm файл',
    answer: 'Удалить файл (ВНИМАНИЕ: корзины в Linux нет, удаление навсегда!).',
    codeExample: 'rm old.c',
    difficulty: 'easy'
  },
  {
    id: 'cmd-12',
    category: 'bash',
    type: 'command',
    question: 'rm -r папка',
    answer: 'Рекурсивно удалить папку вместе со всем её содержимым.',
    codeExample: 'rm -r test_dir',
    difficulty: 'medium'
  },
  {
    id: 'cmd-13',
    category: 'bash',
    type: 'command',
    question: 'mv что куда',
    answer: 'Переместить файл или переименовать его.',
    codeExample: 'mv training/notes.txt training/diary.txt',
    difficulty: 'easy'
  },
  {
    id: 'cmd-14',
    category: 'bash',
    type: 'command',
    question: 'cp что куда',
    answer: 'Создать копию файла или папки (с флагом -r).',
    codeExample: 'cp diary.txt diary_backup.txt',
    difficulty: 'easy'
  },
  {
    id: 'cmd-15',
    category: 'bash',
    type: 'command',
    question: 'cat файл',
    answer: 'Вывести полное текстовое содержимое файла в консоль.',
    codeExample: 'cat src/1948.c',
    difficulty: 'easy'
  },
  {
    id: 'cmd-16',
    category: 'bash',
    type: 'command',
    question: 'head -n 10 файл',
    answer: 'Показать первые N строк файла (по умолчанию 10 строк).',
    codeExample: 'head -n 5 output.txt',
    difficulty: 'easy'
  },
  {
    id: 'cmd-17',
    category: 'bash',
    type: 'command',
    question: 'tail -n 10 файл',
    answer: 'Показать последние N строк файла.',
    codeExample: 'tail -n 5 output.txt',
    difficulty: 'easy'
  },
  {
    id: 'cmd-18',
    category: 'bash',
    type: 'command',
    question: 'wc -l файл',
    answer: 'Подсчитать количество строк в файле.',
    codeExample: 'wc -l src/data/door_data.txt\n# 42',
    difficulty: 'medium'
  },
  {
    id: 'cmd-19',
    category: 'bash',
    type: 'command',
    question: 'grep слово',
    answer: 'Поиск и фильтрация строк, содержащих указанный текст или шаблон.',
    codeExample: 'ps aux | grep sleep',
    difficulty: 'medium'
  },
  {
    id: 'cmd-20',
    category: 'bash',
    type: 'command',
    question: "sed -n '13p' файл",
    answer: 'Напечатать ровно 13-ю строку файла без открытия текстового редактора.',
    codeExample: "sed -n '13p' src/data/door_data.txt",
    difficulty: 'hard'
  },
  {
    id: 'cmd-21',
    category: 'bash',
    type: 'command',
    question: 'chmod +x скрипт',
    answer: 'Добавить право на запуск (execute) файлу скрипта или программы.',
    codeExample: 'chmod +x hello.sh\n./hello.sh',
    difficulty: 'easy'
  },
  {
    id: 'cmd-22',
    category: 'bash',
    type: 'command',
    question: 'ps aux',
    answer: 'Показать список всех запущенных процессов в системе со столбцами USER, PID, %CPU, %MEM.',
    codeExample: 'ps aux | grep a.out',
    difficulty: 'medium'
  },
  {
    id: 'cmd-23',
    category: 'bash',
    type: 'command',
    question: 'kill PID',
    answer: 'Послать процессу сигнал завершения SIGTERM (вежливая просьба закрыться).',
    codeExample: 'kill 12345',
    difficulty: 'easy'
  },
  {
    id: 'cmd-24',
    category: 'bash',
    type: 'command',
    question: 'kill -9 PID',
    answer: 'Принудительно и немедленно уничтожить процесс сигналом SIGKILL (нельзя проигнорировать).',
    codeExample: 'kill -9 12345',
    difficulty: 'medium'
  },
  {
    id: 'cmd-25',
    category: 'bash',
    type: 'command',
    question: 'sleep 300 &',
    answer: 'Запустить фоновый процесс сна на 300 секунд (символ & переводит в фон).',
    codeExample: 'sleep 300 &',
    difficulty: 'medium'
  },
  {
    id: 'cmd-26',
    category: 'bash',
    type: 'command',
    question: 'echo "строка" | ./program',
    answer: 'Передать текст со стандартного вывода echo на стандартный ввод stdin программы через пайп |.',
    codeExample: 'echo "8 2" | ./arithmetic',
    difficulty: 'easy'
  },
  {
    id: 'cmd-27',
    category: 'bash',
    type: 'command',
    question: '> vs >>',
    answer: '> открывает файл с очисткой и перезаписывает его; >> открывает в режиме добавления в конец.',
    codeExample: './prog > out.txt   # перезапись\n./prog >> log.txt  # добавление',
    difficulty: 'easy'
  },
  {
    id: 'cmd-28',
    category: 'tools',
    type: 'command',
    question: 'ssh-keygen -t ed25519',
    answer: 'Сгенерировать безопасную пару SSH-ключей (приватный id_ed25519 и публичный id_ed25519.pub).',
    codeExample: 'ssh-keygen -t ed25519',
    difficulty: 'medium'
  },
  {
    id: 'cmd-29',
    category: 'tools',
    type: 'command',
    question: 'cat ~/.ssh/id_ed25519.pub',
    answer: 'Вывести публичный SSH-ключ для копирования в настройки профиля GitLab / GitHub.',
    codeExample: 'cat ~/.ssh/id_ed25519.pub',
    difficulty: 'medium'
  },
  {
    id: 'cmd-30',
    category: 'tools',
    type: 'command',
    question: 'ssh -T -p 2222 git@git-ssh.21-school.ru',
    answer: 'Проверить работоспособность SSH-ключа на сервере Школы 21 ("Welcome, @username!").',
    codeExample: 'ssh -T -p 2222 git@git-ssh.21-school.ru',
    difficulty: 'medium'
  },
  {
    id: 'cmd-31',
    category: 'git',
    type: 'command',
    question: 'git clone <url>',
    answer: 'Скачать удаленный репозиторий проекта с сервера на рабочую станцию (выполняется 1 раз).',
    codeExample: 'git clone git@git-ssh.21-school.ru:v1/D03T03.git',
    difficulty: 'easy'
  },
  {
    id: 'cmd-32',
    category: 'git',
    type: 'command',
    question: 'git checkout -b develop',
    answer: 'Создать новую ветку develop и сразу переключиться на неё.',
    codeExample: 'git checkout -b develop',
    difficulty: 'easy'
  },
  {
    id: 'cmd-33',
    category: 'git',
    type: 'command',
    question: 'git status',
    answer: 'Показать текущее состояние репозитория: изменённые, добавленные в индекс и неотслеживаемые файлы.',
    codeExample: 'git status',
    difficulty: 'easy'
  },
  {
    id: 'cmd-34',
    category: 'git',
    type: 'command',
    question: 'git add <файл>',
    answer: 'Добавить файл в staging area (индекс) для включения в следующий коммит.',
    codeExample: 'git add src/1948.c',
    difficulty: 'easy'
  },
  {
    id: 'cmd-35',
    category: 'git',
    type: 'command',
    question: 'git commit -m "сообщение"',
    answer: 'Зафиксировать снимок изменений из индекса с поясняющим комментарием.',
    codeExample: 'git commit -m "quest 1: prime divisor"',
    difficulty: 'easy'
  },
  {
    id: 'cmd-36',
    category: 'git',
    type: 'command',
    question: 'git push origin develop',
    answer: 'Отправить локальные зафиксированные коммиты в ветку develop на удаленный сервер origin.',
    codeExample: 'git push origin develop',
    difficulty: 'easy'
  },
  {
    id: 'cmd-37',
    category: 'git',
    type: 'command',
    question: 'git diff',
    answer: 'Показать построчные изменения в файлах по сравнению с последним коммитом (+ добавлено, - удалено).',
    codeExample: 'git diff src/1948.c',
    difficulty: 'easy'
  },
  {
    id: 'cmd-38',
    category: 'git',
    type: 'command',
    question: 'git restore <файл>',
    answer: 'Отменить незафиксированные изменения в файле и вернуть его к состоянию последнего коммита.',
    codeExample: 'git restore src/char_decode.c',
    difficulty: 'easy'
  },
  {
    id: 'cmd-39',
    category: 'git',
    type: 'command',
    question: 'git log --oneline',
    answer: 'Показать компактную историю коммитов в одну строку на коммит.',
    codeExample: 'git log --oneline -n 5',
    difficulty: 'easy'
  },
  {
    id: 'cmd-40',
    category: 'tools',
    type: 'command',
    question: 'gcc -Wall -Werror -Wextra -std=c11 file.c -lm -o binary',
    answer: 'Каноническая команда сборки C11 по стандартам Школы 21 с превращением warning в ошибки и линковкой math.h в конце.',
    codeExample: 'gcc -Wall -Werror -Wextra -std=c11 door_functions.c -lm -o door_functions',
    difficulty: 'hard'
  },

  // ==========================================
  // 20 КОНЦЕПЦИЙ И ПРАВИЛ ШКОЛЫ 21
  // ==========================================
  {
    id: 'cpt-1',
    category: 'concepts',
    type: 'concept',
    question: '%c-детектор мусора в scanf',
    answer: 'Конструкция `if (scanf("%d %c", &a, &extra) != 1)` читает 2 аргумента, но ждёт ровно 1. Если после числа есть мусор (12.5 или 12x), extra ловит его, scanf возвращает 2, и программа печатает n/a.',
    codeExample: 'int a; char extra;\nif (scanf("%d %c", &a, &extra) != 1) {\n  printf("n/a"); return 0;\n}',
    difficulty: 'hard'
  },
  {
    id: 'cpt-2',
    category: 'concepts',
    type: 'concept',
    question: '%lf vs %f в C',
    answer: 'Переменная double в scanf ОБЯЗАТЕЛЬНО читается через `%lf` (long float), а в printf печатается через `%f` (или `%.2f`, `%.7f`).',
    codeExample: 'double r;\nscanf("%lf %c", &r, &extra);\nprintf("%.2f", r);',
    difficulty: 'medium'
  },
  {
    id: 'cpt-3',
    category: 'concepts',
    type: 'concept',
    question: 'Эпсилон-сравнение (fabs < 1e-6)',
    answer: 'Вещественные числа double хранятся с погрешностью IEEE 754 (0.1+0.2 != 0.3). Прямое сравнение `==` запрещено. Правильно: `fabs(a - b) < 1e-6`.',
    codeExample: 'const double kEps = 1e-6;\nif (fabs(a - b) < kEps) { /* равны */ }',
    difficulty: 'hard'
  },
  {
    id: 'cpt-4',
    category: 'concepts',
    type: 'concept',
    question: 'Базовый случай рекурсии',
    answer: 'Условие остановки рекурсии (например `if (n <= 1) return 1;`). Без базового случая функция вызывает себя бесконечно, стек вызовов переполняется, и программа падает с Segmentation Fault.',
    codeExample: 'int f(int n) {\n  if (n <= 1) return 1; // БАЗА\n  return n * f(n - 1);  // ШАГ\n}',
    difficulty: 'medium'
  },
  {
    id: 'cpt-5',
    category: 'concepts',
    type: 'concept',
    question: 'Переполнение int при Fibonacci',
    answer: '32-битный signed int вмещает числа до 2,147,483,647. Начиная с fib(47), происходит переполнение в отрицательные числа. Для больших значений обязательно использовать `long long` и `%lld`.',
    difficulty: 'medium'
  },
  {
    id: 'cpt-6',
    category: 'concepts',
    type: 'concept',
    question: 'Посимвольная сверка автотестов',
    answer: 'В большинстве базовых автотестов Школы 21 лишний пробел или лишний перенос строки `\\n` в конце вывода приводит к FAIL тестов платформы.',
    difficulty: 'easy'
  },
  {
    id: 'cpt-7',
    category: 'concepts',
    type: 'concept',
    question: 'Принцип Дейкстры: Single Exit Point',
    answer: 'Функция должна иметь ровно одну точку выхода (единственный return в самом конце). Запрещено разбрасывать return по разным веткам if/else.',
    codeExample: 'int res = 0;\nif (...) res = 1;\nreturn res; // единственная точка',
    difficulty: 'medium'
  },
  {
    id: 'cpt-8',
    category: 'concepts',
    type: 'concept',
    question: 'Запрет бинарников в Git',
    answer: 'Скомпилированные файлы (a.out, 1948, hi) запрещено коммитить в Git. В репозитории хранятся только исходники `.c`, `.h` и `.clang-format`.',
    difficulty: 'easy'
  },
  {
    id: 'cpt-9',
    category: 'concepts',
    type: 'concept',
    question: 'Символ как число ASCII',
    answer: 'Символ char — это число от 0 до 255. Перевод hex/цифры в число: `c - \'0\'` для \'0\'..\'9\' и `c - \'A\' + 10` для \'A\'..\'F\'.',
    codeExample: "int digit = '7' - '0'; // 7\nint hex = 'F' - 'A' + 10; // 15",
    difficulty: 'hard'
  },
  {
    id: 'cpt-10',
    category: 'concepts',
    type: 'concept',
    question: 'Аргументы argc и argv',
    answer: '`argc` — количество аргументов командной строки (включая имя программы). `argv` — массив строк параметров (`argv[1]` — первый переданный аргумент).',
    codeExample: 'int main(int argc, char *argv[]) {\n  if (argc == 2 && argv[1][0] == \'0\') ...\n}',
    difficulty: 'medium'
  },
  {
    id: 'cpt-11',
    category: 'concepts',
    type: 'concept',
    question: 'Целочисленное деление vs Остаток',
    answer: 'В C деление двух int `7 / 2` равно `3` (дробная часть отбрасывается). Остаток `7 % 2` равен `1`.',
    difficulty: 'easy'
  },
  {
    id: 'cpt-12',
    category: 'concepts',
    type: 'concept',
    question: 'Деление вычитанием (имитация / и %)',
    answer: 'Чтобы разделить a на b без операторов `/` и `%`, вычитаем b из a в цикле `while (rem >= b) { rem -= b; count++; }`. count — частное, rem — остаток.',
    codeExample: 'while (rem >= b) { rem -= b; count++; }',
    difficulty: 'hard'
  },
  {
    id: 'cpt-13',
    category: 'concepts',
    type: 'concept',
    question: 'Оптимизация простоты i * i <= n',
    answer: 'При проверке простоты числа n достаточно проверять делители i от 2 до корня числа (`i * i <= n`), так как любой составной делитель больше корня имеет парный меньше корня.',
    codeExample: 'for (int i = 2; i * i <= n; i++) {\n  if (n % i == 0) return 0;\n}',
    difficulty: 'medium'
  },
  {
    id: 'cpt-14',
    category: 'concepts',
    type: 'concept',
    question: 'Ловушка квадратов простых (9, 25, 49)',
    answer: 'Числа 9 (3·3), 25 (5·5), 49 (7·7) — СОСТАВНЫЕ числа! Они нечётные, но имеют по 3 делителя. Нельзя называть их простыми делителями.',
    difficulty: 'hard'
  },
  {
    id: 'cpt-15',
    category: 'concepts',
    type: 'concept',
    question: 'Стиль Google: Порядок #include',
    answer: 'Заголовочные файлы подключаются строго по алфавиту: `#include <math.h>` пишется ВЫШЕ `#include <stdio.h>` (m идёт раньше s).',
    difficulty: 'medium'
  },
  {
    id: 'cpt-16',
    category: 'concepts',
    type: 'concept',
    question: 'Пайп | как конвейер',
    answer: 'Символ `|` соединяет вывод stdout одной программы с вводом stdin другой. Пример: `echo "8 2" | ./arithmetic`.',
    difficulty: 'easy'
  },
  {
    id: 'cpt-17',
    category: 'concepts',
    type: 'concept',
    question: 'Горячие клавиши nano',
    answer: 'Ctrl+O Enter — сохранить файл; Ctrl+X — выйти; Ctrl+K — ВЫРЕЗАТЬ строку (осторожно со случайным удалением кода!).',
    difficulty: 'easy'
  },
  {
    id: 'cpt-18',
    category: 'concepts',
    type: 'concept',
    question: 'Константа M_PI и define PI',
    answer: 'В стандарте C11 M_PI доступен в math.h. В заданиях Школы 21 часто требуют задать `#define PI 3.14159265358979323846` в начале файла.',
    difficulty: 'easy'
  },
  {
    id: 'cpt-19',
    category: 'concepts',
    type: 'concept',
    question: 'Правило сетки (42 точки = 41 щель)',
    answer: 'Отрезок, разбитый на N точек включительно, имеет (N - 1) интервалов. Шаг сетки: `step = (end - start) / (N - 1)`. Для 42 точек: `2π / 41`.',
    difficulty: 'hard'
  },
  {
    id: 'cpt-20',
    category: 'concepts',
    type: 'concept',
    question: 'Плашка «Решаю сама 💪» для Дня 3',
    answer: 'Квесты дня 3 (1948.c, char_decode.c, quest3.c, door_functions.c) пишутся самостоятельно на основе пройденных уроков 7, 9, 10, 11, 12!',
    difficulty: 'easy'
  }
];
