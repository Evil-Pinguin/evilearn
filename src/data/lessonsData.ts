import { Lesson, Module } from '../types';

export const modulesData: Module[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Модуль 1. Терминал Linux',
    description: 'Навигация по путям, манипуляция файлами, права доступа rwx, процессы, PID и пайпы.',
    icon: 'Terminal',
    color: 'from-emerald-500 to-teal-700',
    badge: 'Модуль 1',
    lessons: ['lesson-1', 'lesson-2']
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Модуль 2. Git и Версионирование',
    description: 'SSH-ключи, ветка develop, цикл add-commit-push, правила Школы 21 и чистота репозитория.',
    icon: 'GitBranch',
    color: 'from-cyan-500 to-blue-700',
    badge: 'Модуль 2',
    lessons: ['lesson-3']
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Модуль 3. Основы C',
    description: 'Компиляция со строгими флагами, %c-ловушка валидации, условия, циклы и функции.',
    icon: 'Code',
    color: 'from-violet-500 to-indigo-700',
    badge: 'Модуль 3',
    lessons: ['lesson-4', 'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8']
  },
  {
    id: 'module-4',
    number: 4,
    title: 'Модуль 4. Продвинутый C (Подготовка к Дню 3!)',
    description: 'Дробные числа, math.h, эпсилон, рекурсия, char и ASCII hex, сборка квеста 1948.c.',
    icon: 'Cpu',
    color: 'from-amber-500 to-rose-700',
    badge: 'Модуль 4',
    lessons: ['lesson-9', 'lesson-10', 'lesson-11', 'lesson-12']
  }
];

export const lessonsData: Lesson[] = [
  // ==========================================
  // МОДУЛЬ 1. ТЕРМИНАЛ
  // ==========================================
  {
    id: 'lesson-1',
    slug: 'terminal-basics',
    number: 1,
    moduleId: 'module-1',
    moduleNumber: 1,
    title: 'Урок 1. Основы терминала',
    subtitle: 'Текстовое управление компьютером, пути и базовые команды',
    icon: 'FolderTree',
    durationMinutes: 15,
    theoryContent: [
      {
        title: 'Что такое терминал и ключевая идея — путь (path)',
        paragraphs: [
          'Терминал — текстовый способ управления компьютером. Ты печатаешь команды — он выполняет. Всё программирование в Школе 21 происходит здесь.',
          'Ключевая идея — путь (path). Ты всегда "находишься" в какой-то папке. Команды действуют на то, что вокруг тебя.'
        ],
        tables: [
          {
            headers: ['Команда', 'Что делает', 'Пример'],
            rows: [
              ['pwd', 'показать, где я', 'pwd -> /home/user'],
              ['ls', 'список файлов', 'ls'],
              ['ls -l', 'список + права + размеры', 'ls -l src/'],
              ['cd папка', 'войти в папку', 'cd src'],
              ['cd ..', 'на уровень выше', 'cd ..'],
              ['cd ~', 'в домашнюю папку', 'cd ~'],
              ['mkdir имя', 'создать папку', 'mkdir test'],
              ['touch файл', 'создать пустой файл', 'touch a.txt'],
              ['rm файл', 'удалить файл', 'rm a.txt'],
              ['rm -r папка', 'удалить папку с содержимым', 'rm -r test'],
              ['mv что куда', 'переместить/переименовать', 'mv a.txt b.txt'],
              ['cp что куда', 'скопировать', 'cp a.txt b.txt'],
              ['cat файл', 'показать содержимое', 'cat a.txt'],
              ['head файл', 'первые 10 строк файла', 'head big.log']
            ]
          }
        ],
        callouts: [
          {
            type: 'warning',
            title: '⚠️ Частые ловушки путей',
            content: '• `ls /src` — слэш в начале = от корня ВСЕЙ системы. Такого нет!\n• `ls src` — без слэша = папка src рядом со мной. Вот это то, что нужно.\n• `rm` не спрашивает подтверждение и не отправляет в корзину. Удалил = удалил.'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-1-1',
        title: 'Упражнение 1.1: Навигация и создание файлов',
        taskType: 'bash_command',
        condition: 'Создай папку training, зайди в неё, создай файл notes.txt, проверь что он есть, выйди из папки обратно (напиши команды последовательно).',
        placeholder: 'mkdir training && cd training && touch notes.txt && ls && cd ..',
        hint: 'Тебе понадобятся команды: mkdir, cd, touch, ls, cd ..',
        solution: 'mkdir training\ncd training\ntouch notes.txt\nls\ncd ..',
        solutionExplanation: [
          'mkdir training — создаёт новую папку training.',
          'cd training — переходит внутрь созданной папки.',
          'touch notes.txt — создаёт пустой текстовый файл notes.txt.',
          'ls — выводит список файлов, чтобы убедиться, что notes.txt создан.',
          'cd .. — возвращается на один уровень вверх к родительскому каталогу.'
        ]
      },
      {
        id: 'ex-1-2',
        title: 'Упражнение 1.2: Переименование, копия и удаление',
        taskType: 'bash_command',
        condition: 'Переименуй training/notes.txt в diary.txt, создай копию diary_backup.txt, потом удали оригинал diary.txt. Проверь результат.',
        placeholder: 'mv training/notes.txt training/diary.txt && cp ...',
        hint: 'Используй mv для переименования, cp для создания копии, rm для удаления оригинала и ls для проверки.',
        solution: 'mv training/notes.txt training/diary.txt\ncp training/diary.txt training/diary_backup.txt\nrm training/diary.txt\nls training/',
        solutionExplanation: [
          'mv training/notes.txt training/diary.txt — переименовывает notes.txt в diary.txt.',
          'cp training/diary.txt training/diary_backup.txt — создаёт резервную копию diary_backup.txt.',
          'rm training/diary.txt — удаляет исходный файл diary.txt.',
          'ls training/ — проверяет, что в папке остался только diary_backup.txt.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-1-1',
        question: 'Какая команда используется для просмотра содержимого файла в терминале?',
        options: [
          { id: 'a', text: 'cat', isCorrect: true },
          { id: 'b', text: 'pwd', isCorrect: false },
          { id: 'c', text: 'touch', isCorrect: false },
          { id: 'd', text: 'cd', isCorrect: false }
        ],
        explanation: 'Команда cat (concatenate) выводит весь текст файла на экран в терминале.'
      },
      {
        id: 'q-1-2',
        question: 'Как подняться на одну папку выше в иерархии каталогов?',
        options: [
          { id: 'a', text: 'cd /', isCorrect: false },
          { id: 'b', text: 'cd ..', isCorrect: true },
          { id: 'c', text: 'cd ~', isCorrect: false },
          { id: 'd', text: 'up', isCorrect: false }
        ],
        explanation: 'Две точки (..) обозначают родительский каталог. Команда cd .. поднимает на один уровень вверх.'
      },
      {
        id: 'q-1-3',
        question: 'Чем `ls src` отличается от `ls /src`?',
        options: [
          { id: 'a', text: 'Разницы нет, это одна и та же команда', isCorrect: false },
          { id: 'b', text: 'ls src ищет папку src рядом с текущим местоположением, а ls /src — от абсолютного корня всей системы', isCorrect: true },
          { id: 'c', text: 'ls /src открывает файл в редакторе nano', isCorrect: false },
          { id: 'd', text: 'ls src выводит только скрытые файлы', isCorrect: false }
        ],
        explanation: 'Слэш в начале (/src) указывает абсолютный путь от корня Linux-системы. Путь без слэша (src) — относительный путь в текущей директории.'
      },
      {
        id: 'q-1-4',
        question: 'Какая команда покажет список файлов вместе с правами доступа и размерами?',
        options: [
          { id: 'a', text: 'ls', isCorrect: false },
          { id: 'b', text: 'ls -l', isCorrect: true },
          { id: 'c', text: 'pwd', isCorrect: false },
          { id: 'd', text: 'cat', isCorrect: false }
        ],
        explanation: 'Флаг -l (long format) включает отображение прав доступа (rwx), владельца, группы, размера и даты.'
      }
    ]
  },

  {
    id: 'lesson-2',
    slug: 'file-permissions-processes',
    number: 2,
    moduleId: 'module-1',
    moduleNumber: 1,
    title: 'Урок 2. Права файлов и процессы',
    subtitle: 'Права rwx, запуск скриптов ./, PID, kill и пайп | как воронка',
    icon: 'Terminal',
    durationMinutes: 20,
    theoryContent: [
      {
        title: 'Права доступа к файлам в Linux',
        paragraphs: [
          'В Linux у каждого файла 3 тройки прав: владелец / группа / остальные. В каждой тройке:',
          '• r — read, читать',
          '• w — write, писать',
          '• x — execute, запускать (для скриптов и программ)',
          'Пример: `-rwxrw----` = владелец может всё, группа может читать и писать, остальные — ничего.',
          'Меняем права: `chmod +x файл` — добавить право запуска. Запуск скрипта: `./script.sh` (точка-слэш = "из текущей папки").'
        ],
        callouts: [
          {
            type: 'analogy',
            title: 'Пайп | — труба и воронка данных',
            content: 'Пайп `|` — труба: вывод одной команды передаётся на вход другой. `ps aux` печатает сотни строк → `|` отправляет их в `grep имя` → grep оставляет только строки с нужным словом. Воронка!'
          }
        ]
      },
      {
        title: 'Управление процессами и PID',
        paragraphs: [
          'Каждая запущенная программа в системе — это процесс со своим уникальным номером PID (Process ID).'
        ],
        codeSnippets: [
          {
            title: 'Команды поиска и остановки процессов',
            language: 'bash',
            code: `ps aux | grep имя    # найти процесс по имени
kill PID             # вежливо попросить процесс завершиться
kill -9 PID          # принудительно убить процесс`
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-2-1',
        title: 'Упражнение 2.1: Создание исполняемого скрипта',
        taskType: 'bash_command',
        condition: 'Создай скрипт hello.sh с содержимым echo "I am alive", выдай ему права на выполнение через chmod, и запусти его.',
        placeholder: 'echo \'echo "I am alive"\' > hello.sh && chmod +x hello.sh && ./hello.sh',
        hint: 'Создай файл через echo или nano, добавь право x командой chmod +x hello.sh и запусти ./hello.sh',
        solution: 'nano hello.sh\n# внутри: echo "I am alive", сохранить Ctrl+O Enter, выйти Ctrl+X\nchmod +x hello.sh\n./hello.sh',
        solutionExplanation: [
          'nano hello.sh — открывает редактор для записи echo "I am alive".',
          'chmod +x hello.sh — добавляет флаг execute (x), позволяющий запускать файл.',
          './hello.sh — запускает скрипт из текущей директории.'
        ]
      },
      {
        id: 'ex-2-2',
        title: 'Упражнение 2.2: Фоновый процесс и kill',
        taskType: 'bash_command',
        condition: 'Запусти команду sleep 300 & в фоне, найди её PID через ps aux | grep sleep, заверши процесс и убедись, что он остановлен.',
        placeholder: 'sleep 300 & && ps aux | grep sleep && kill ...',
        hint: 'Символ & запускает команду в фоне. Вторая колонка в выводе ps aux — это PID. Заверши его: kill PID.',
        solution: 'sleep 300 &\nps aux | grep sleep    # вторая колонка = PID, запомни число\nkill 12345             # твой PID\nps aux | grep sleep    # строки нет',
        solutionExplanation: [
          'sleep 300 & — отправляет процесс сна на 5 минут в фоновый режим.',
          'ps aux | grep sleep — фильтрует список процессов и показывает PID во второй колонке.',
          'kill <PID> — посылает сигнал завершения процессу.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-2-1',
        question: 'Что означает символ `x` в строке прав доступа файла `-rwxr-xr-x`?',
        options: [
          { id: 'a', text: 'Право на удаление файла', isCorrect: false },
          { id: 'b', text: 'Право на выполнение (execute) программы или скрипта', isCorrect: true },
          { id: 'c', text: 'Файл зашифрован', isCorrect: false },
          { id: 'd', text: 'Файл только для чтения', isCorrect: false }
        ],
        explanation: 'Символ x (execute) даёт право запускать файл как исполняемую программу или скрипт.'
      },
      {
        id: 'q-2-2',
        question: 'Где в выводе команды `ps aux | grep имя` находится PID процесса?',
        options: [
          { id: 'a', text: 'В первой колонке (имя пользователя)', isCorrect: false },
          { id: 'b', text: 'Во второй колонке (числовой идентификатор процесса)', isCorrect: true },
          { id: 'c', text: 'В самом конце строки', isCorrect: false },
          { id: 'd', text: 'В названии терминала', isCorrect: false }
        ],
        explanation: 'Вторая колонка таблицы ps aux содержит Process ID (PID) — уникальный номер запущенного процесса.'
      },
      {
        id: 'q-2-3',
        question: 'В чем разница между командами `kill PID` и `kill -9 PID`?',
        options: [
          { id: 'a', text: 'Разницы нет', isCorrect: false },
          { id: 'b', text: 'kill посылает сигнал SIGTERM (вежливая просьба завершиться), а -9 посылает SIGKILL (принудительное немедленное убийство процесса ядром)', isCorrect: true },
          { id: 'c', text: 'kill -9 перезапускает процесс 9 раз', isCorrect: false },
          { id: 'd', text: 'kill удаляет файл с диска', isCorrect: false }
        ],
        explanation: 'Сигнал SIGKILL (-9) не может быть проигнорирован или перехвачен процессом — операционная система принудительно выгружает его из памяти.'
      },
      {
        id: 'q-2-4',
        question: 'Что делает оператор пайпа `|` в командной строке Linux?',
        options: [
          { id: 'a', text: 'Передаёт стандартный вывод (stdout) левой команды на стандартный ввод (stdin) правой команды', isCorrect: true },
          { id: 'b', text: 'Логическое ИЛИ для двух команд', isCorrect: false },
          { id: 'c', text: 'Сохраняет вывод в файл', isCorrect: false },
          { id: 'd', text: 'Перезагружает компьютер', isCorrect: false }
        ],
        explanation: 'Пайп `|` создаёт конвейер (воронку), направляя поток данных от первой утилиты ко второй.'
      }
    ]
  },

  // ==========================================
  // МОДУЛЬ 2. GIT
  // ==========================================
  {
    id: 'lesson-3',
    slug: 'git-cycle',
    number: 3,
    moduleId: 'module-2',
    moduleNumber: 2,
    title: 'Урок 3. Git-цикл и правила Школы 21',
    subtitle: 'SSH-ключи, ветка develop, цикл add-commit-push, запрет бинарников',
    icon: 'GitPullRequest',
    durationMinutes: 25,
    theoryContent: [
      {
        title: 'Git и SSH-ключи в Школе 21',
        paragraphs: [
          'Git — система контроля версий: сохраняет историю изменений кода и синхронизирует с сервером (GitLab).',
          'SSH-ключ — твой пропуск. Пара: приватный ключ (у тебя в `~/.ssh/`, никому!) + публичный (в GitLab).'
        ],
        codeSnippets: [
          {
            title: 'Генерация и проверка SSH-ключа',
            language: 'bash',
            code: `ssh-keygen -t ed25519          # создать ключ (Enter на все вопросы)
cat ~/.ssh/id_ed25519.pub      # показать публичный ключ -> скопировать в GitLab
ssh -T -p 2222 git@git-ssh.21-school.ru   # проверка связи: "Welcome, @breashee!"`
          }
        ]
      },
      {
        title: 'Цикл работы (запомнить как молитву!)',
        paragraphs: [
          '1. `git clone адрес` — ОДИН раз скачать репозиторий.',
          '2. `git checkout -b develop` — ОДИН раз создать ветку разработки.',
          'Дальше по кругу после каждого изменения:',
          '• `git status` — что изменилось?',
          '• `git add файл` — положить в staging (корзину коммита)',
          '• `git commit -m "описание"` — зафиксировать с сообщением',
          '• `git push origin develop` — отправить на сервер'
        ],
        callouts: [
          {
            type: 'danger',
            title: 'Железные правила Школы 21',
            content: '1. Пушим ТОЛЬКО исходники (`.c`, `.h`), НИКОГДА бинарники!\n2. Коммит после каждого квеста, с осмысленным сообщением.\n3. Вся работа ТОЛЬКО в ветке develop.'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-3-1',
        title: 'Упражнение 3.1: Симуляция Git-цикла локально',
        taskType: 'git_command',
        condition: 'Создай папку git_training, инициализируй репозиторий (git init), создай ветку develop, создай файл answer.txt с текстом "42", закоммить его с сообщением "Add answer file", проверь лог.',
        placeholder: 'mkdir git_training && cd git_training && git init && git checkout -b develop ...',
        hint: 'Последовательность: mkdir + cd, git init, git checkout -b develop, echo "42" > answer.txt, git add answer.txt, git commit -m "Add answer file", git log --oneline',
        solution: 'mkdir git_training && cd git_training\ngit init\ngit checkout -b develop\necho "42" > answer.txt\ngit status\ngit add answer.txt\ngit commit -m "Add answer file"\ngit log --oneline',
        solutionExplanation: [
          'git init — превращает папку в локальный Git-репозиторий.',
          'git checkout -b develop — создаёт ветку develop и переключается на неё.',
          'git add answer.txt — добавляет файл в индекс (staging area).',
          'git commit -m "Add answer file" — сохраняет изменения в истории коммитов.',
          'git log --oneline — показывает краткую историю коммитов в одну строку.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-3-1',
        question: 'Каков правильный порядок команд при сохранении и отправке изменений?',
        options: [
          { id: 'a', text: 'git commit -> git add -> git push', isCorrect: false },
          { id: 'b', text: 'git add -> git commit -> git push', isCorrect: true },
          { id: 'c', text: 'git push -> git commit -> git add', isCorrect: false },
          { id: 'd', text: 'git init -> git push -> git add', isCorrect: false }
        ],
        explanation: 'Сначала мы кладём файлы в индекс (add), затем запечатываем коммит (commit), и только потом отправляем на сервер (push).'
      },
      {
        id: 'q-3-2',
        question: 'Какая команда одновременно создаёт новую ветку и переключается на неё?',
        options: [
          { id: 'a', text: 'git branch имя', isCorrect: false },
          { id: 'b', text: 'git checkout -b имя', isCorrect: true },
          { id: 'c', text: 'git switch -d имя', isCorrect: false },
          { id: 'd', text: 'git new branch имя', isCorrect: false }
        ],
        explanation: 'Флаг -b в git checkout указывает Git создать новую ветку перед переключением на неё.'
      },
      {
        id: 'q-3-3',
        question: 'Какие файлы СТРОГО ЗАПРЕЩЕНО пушить в репозиторий Школы 21?',
        options: [
          { id: 'a', text: 'Файлы исходного кода .c', isCorrect: false },
          { id: 'b', text: 'Скомпилированные бинарные/исполняемые файлы (a.out, 1948, hi)', isCorrect: true },
          { id: 'c', text: 'Заголовочные файлы .h', isCorrect: false },
          { id: 'd', text: 'Файл конфигурации .clang-format', isCorrect: false }
        ],
        explanation: 'Бинарники загрязняют репозиторий и создаются компилятором на проверяющей машине. Их добавление приводит к моментальному отказу на проверке.'
      },
      {
        id: 'q-3-4',
        question: 'Зачем в Школе 21 разработка ведётся строго в ветке develop?',
        options: [
          { id: 'a', text: 'Чтобы изолировать незавершенную разработку от стабильной ветки master/main', isCorrect: true },
          { id: 'b', text: 'Потому что в master запрещено писать код на языке C', isCorrect: false },
          { id: 'c', text: 'Ветка develop компилирует код быстрее', isCorrect: false },
          { id: 'd', text: 'Это требование операционной системы Linux', isCorrect: false }
        ],
        explanation: 'Ветка master хранит чистый релиз, а вся промежуточная работа над квестами ведётся в ветке develop.'
      }
    ]
  },

  // ==========================================
  // МОДУЛЬ 3. ОСНОВЫ C
  // ==========================================
  {
    id: 'lesson-4',
    slug: 'first-program-compilation',
    number: 4,
    moduleId: 'module-3',
    moduleNumber: 3,
    title: 'Урок 4. Первая программа и компиляция',
    subtitle: 'gcc -Wall -Werror -Wextra -std=c11, точка входа main, правила автотестов',
    icon: 'FileCode',
    durationMinutes: 20,
    theoryContent: [
      {
        title: 'C — компилируемый язык',
        paragraphs: [
          'Текст (исходник `.c`) → компилятор gcc → бинарник (программа).',
          'Компиляция программы со строгими стандартами:'
        ],
        codeSnippets: [
          {
            title: 'Компиляция и запуск',
            language: 'bash',
            code: `gcc -Wall -Werror -Wextra -std=c11 src/hello.c -o hello
./hello`
          }
        ],
        tables: [
          {
            headers: ['Флаг', 'Значение'],
            rows: [
              ['-Wall -Wextra', 'показывать предупреждения о подозрительном коде'],
              ['-Werror', 'предупреждения = ошибки (не исправишь — не соберётся)'],
              ['-std=c11', 'стандарт C11'],
              ['-o имя', 'как назвать результирующий бинарник'],
              ['-lm', 'подключить math.h (pow, fabs) — писать В САМЫЙ КОНЕЦ']
            ]
          }
        ]
      },
      {
        title: 'Анатомия программы на C и правила автотестов',
        paragraphs: [
          '1. Вывод БЕЗ `\\n` в конце (в большинстве базовых квестов сверка посимвольная!).',
          '2. Мусор во вводе → печатаем `n/a`.',
          '3. В редакторе: nano — Ctrl+O, Enter (сохранить), Ctrl+X (выйти).',
          '4. Тест через пайп: `echo "8 2" | ./program`'
        ],
        codeSnippets: [
          {
            title: 'Минимальная программа на C',
            language: 'c',
            code: `#include <stdio.h>        // библиотека ввода-вывода (printf, scanf)

int main(void) {          // точка входа, отсюда начинается программа
  printf("Hello!");       // печать
  return 0;               // "завершилась успешно"
}`
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-4-1',
        title: 'Упражнение 4.1: Первая программа hi.c без подсказок',
        taskType: 'c_code',
        condition: 'Без подглядывания напиши программу hi.c: печатает "Hi, School 21!" (без \\n).',
        initialCode: `#include <stdio.h>

int main(void) {
    // Твой код
    
    return 0;
}`,
        hint: 'Подключи <stdio.h>, используй printf("Hi, School 21!"); и верни return 0;',
        solution: `#include <stdio.h>

int main(void) {
  printf("Hi, School 21!");
  return 0;
}`,
        solutionExplanation: [
          '#include <stdio.h> — подключает функции printf и scanf.',
          'int main(void) — главная функция, точка входа.',
          'printf("Hi, School 21!"); — выводит точную строку без лишних символов.',
          'return 0; — возвращает код 0 (успешное завершение).'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-4-1',
        question: 'Что делает флаг `-Werror` при сборке проекта в gcc?',
        options: [
          { id: 'a', text: 'Игнорирует ошибки сборки', isCorrect: false },
          { id: 'b', text: 'Превращает каждое предупреждение (warning) в критическую ошибку компиляции', isCorrect: true },
          { id: 'c', text: 'Выводит подсказки на русском языке', isCorrect: false },
          { id: 'd', text: 'Создаёт резервную копию кода', isCorrect: false }
        ],
        explanation: '-Werror заставляет компилятор падать при наличии хотя бы одного warning, гарантируя чистоту кода.'
      }
    ]
  },

  {
    id: 'lesson-5',
    slug: 'input-types-validation-main',
    number: 5,
    moduleId: 'module-3',
    moduleNumber: 3,
    title: 'Урок 5. Ввод, типы, валидация — ГЛАВНЫЙ УРОК ⭐',
    subtitle: 'Ловушка %c-детектора мусора, %lf vs %f, обработка ошибок n/a',
    icon: 'AlertTriangle',
    durationMinutes: 30,
    theoryContent: [
      {
        title: 'Типы переменных (ящики для данных)',
        paragraphs: [
          'В C переменные — это типизированные ячейки памяти.'
        ],
        tables: [
          {
            headers: ['Тип', 'Что хранит', 'scanf', 'printf'],
            rows: [
              ['int', 'целые: 5, -42', '%d', '%d'],
              ['double', 'дробные: 3.14', '%lf', '%f'],
              ['char', 'один символ: \'A\'', '%c', '%c']
            ]
          }
        ],
        callouts: [
          {
            type: 'warning',
            title: '⚠️ Ловушка №1: %lf vs %f',
            content: 'double читается через `%lf`, а печатается через `%f`. Просто железное правило стандарта языка C!'
          }
        ]
      },
      {
        title: 'Ловушка №2 — Валидация ввода (%c-ловушка)',
        paragraphs: [
          'scanf читает с клавиатуры и **возвращает число успешно прочитанных значений**. Символ `&` перед переменной означает "адрес ящика, куда положить".',
          'Читаем 2 значения, но ждём ровно 1! Символ `%c` работает как **детектор мусора**:'
        ],
        codeSnippets: [
          {
            title: 'Каноническая %c-ловушка мусора',
            language: 'c',
            code: `int a;
char extra;

if (scanf("%d %c", &a, &extra) != 1) {
  printf("n/a");
  return 0;
}`
          }
        ],
        tables: [
          {
            headers: ['Ввод', 'Что происходит', 'scanf вернул', 'Итог'],
            rows: [
              ['123', 'прочитал число, ловушка пуста', '1', '✅ работаем'],
              ['abc', '%d не смог прочитать букву', '0', '❌ n/a'],
              ['12x', 'прочитал 12, x попал в ловушку', '2', '❌ n/a'],
              ['12.5', 'прочитал 12, точка в ловушке', '2', '❌ n/a']
            ]
          }
        ],
        callouts: [
          {
            type: 'danger',
            title: 'Почему без ловушки тесты падают?',
            content: 'Без ловушки ввод `8 2.5` проскочил бы как валидный: scanf молча остановился бы на точке, вернул 2 — и дробный хвост остался бы незамеченным!'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-5-1',
        title: 'Упражнение 5.1: Программа double_it.c',
        taskType: 'c_code',
        condition: 'Напиши double_it.c: читает целое число, печатает удвоенное. Мусор (например "12abc" или "4.5") → печатает "n/a" (без переноса строки).',
        initialCode: `#include <stdio.h>

int main(void) {
    int a;
    char extra;

    // Твоя валидация и вывод
    
    return 0;
}`,
        hint: 'Используй if (scanf("%d %c", &a, &extra) != 1) { printf("n/a"); return 0; } затем printf("%d", a * 2);',
        solution: `#include <stdio.h>

int main(void) {
  int a;
  char extra;

  if (scanf("%d %c", &a, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  printf("%d", a * 2);
  return 0;
}`,
        solutionExplanation: [
          'Строка 4-5: Объявляем целочисленную переменную a и char extra для детекции мусора.',
          'Строка 7: Проверяем: если прочитано не ровно 1 значение — значит был мусор (0 или 2).',
          'Строка 8: Печатаем n/a и выходим.',
          'Строка 11: Печатаем удвоенное число a * 2.'
        ]
      },
      {
        id: 'ex-5-2',
        title: 'Упражнение 5.2: Программа circle.c',
        taskType: 'c_code',
        condition: 'Напиши circle.c: читает радиус (дробный double!), печатает длину окружности 2πr с двумя знаками после точки (%.2f). Мусор → n/a. (π = 3.14159265358979)',
        initialCode: `#include <stdio.h>

int main(void) {
    double r;
    char extra;

    // Твой код
    
    return 0;
}`,
        hint: 'Чтение double: scanf("%lf %c", &r, &extra). Печать: printf("%.2f", 2 * 3.14159265358979 * r);',
        solution: `#include <stdio.h>

int main(void) {
  double r;
  char extra;

  if (scanf("%lf %c", &r, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  printf("%.2f", 2 * 3.14159265358979 * r);
  return 0;
}`,
        solutionExplanation: [
          'Строка 7: scanf("%lf %c", &r, &extra) читает double через %lf.',
          'Строка 11: printf("%.2f", ...) печатает дробное число с ровно 2 знаками после точки через %f.'
        ]
      },
      {
        id: 'ex-5-3',
        title: 'Упражнение 5.3: Программа pair.c',
        taskType: 'c_code',
        condition: 'Напиши pair.c: читает два целых числа, печатает их сумму и произведение через пробел. Пример: "1 0" -> "1 0". Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int a, b;
    char extra;

    // Читаем 3, ждем ровно 2!
    
    return 0;
}`,
        hint: 'Используй scanf("%d %d %c", &a, &b, &extra) != 2 для проверки двух чисел.',
        solution: `#include <stdio.h>

int main(void) {
  int a;
  int b;
  char extra;

  if (scanf("%d %d %c", &a, &b, &extra) != 2) {
    printf("n/a");
    return 0;
  }
  printf("%d %d", a + b, a * b);
  return 0;
}`,
        solutionExplanation: [
          'scanf("%d %d %c", &a, &b, &extra) читает 2 целых числа и ловит лишний символ.',
          'Если вернулось ровно 2 — значит оба числа прочитаны без мусора в хвосте.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-5-1',
        question: 'Какой спецификатор формата используется для чтения переменной double в scanf?',
        options: [
          { id: 'a', text: '%f', isCorrect: false },
          { id: 'b', text: '%lf', isCorrect: true },
          { id: 'c', text: '%d', isCorrect: false },
          { id: 'd', text: '%double', isCorrect: false }
        ],
        explanation: 'В scanf для типа double строго используется спецификатор %lf (long float), а в printf — %f.'
      },
      {
        id: 'q-5-2',
        question: 'Что возвращает функция scanf при успешном вызове?',
        options: [
          { id: 'a', text: 'Значение прочитанного числа', isCorrect: false },
          { id: 'b', text: 'Количество успешно прочитанных и записанных аргументов', isCorrect: true },
          { id: 'c', text: 'Количество оставшихся символов в буфере', isCorrect: false },
          { id: 'd', text: 'Всегда 0', isCorrect: false }
        ],
        explanation: 'scanf возвращает целое число — количество переменных, в которые удалось успешно записать данные.'
      },
      {
        id: 'q-5-3',
        question: 'Зачем добавляется ловушка `%c` в конструкцию `scanf("%d %c", &a, &extra) != 1`?',
        options: [
          { id: 'a', text: 'Чтобы ускорить чтение данных', isCorrect: false },
          { id: 'b', text: 'Чтобы поймать мусорные символы после числа (например точку у "12.5" или букву у "12x")', isCorrect: true },
          { id: 'c', text: 'Для преобразования int в char', isCorrect: false },
          { id: 'd', text: 'Это обязательное требование стандарта C11', isCorrect: false }
        ],
        explanation: 'Если после целого числа введены мусорные знаки (точка или буквы), они попадают в %c, и scanf возвращает 2 вместо ожидаемой 1.'
      }
    ]
  },

  {
    id: 'lesson-6',
    slug: 'conditions-branches',
    number: 6,
    moduleId: 'module-3',
    moduleNumber: 3,
    title: 'Урок 6. Условия и логика',
    subtitle: 'if / else if / else, сравнения == vs =, логические операторы &&, ||, !',
    icon: 'GitFork',
    durationMinutes: 20,
    theoryContent: [
      {
        title: 'Ветвления в языке C',
        paragraphs: [
          'Конструкция if/else позволяет выполнять разный код в зависимости от условий.'
        ],
        codeSnippets: [
          {
            title: 'Пример ветвления',
            language: 'c',
            code: `if (a > b) {
  printf("a больше");
} else if (a < b) {
  printf("b больше");
} else {
  printf("равны");
}`
          }
        ],
        callouts: [
          {
            type: 'warning',
            title: '⚠️ Ловушка: = vs ==',
            content: '`=` — присваивание значения, `==` — проверка на равенство. Написание `if (a = 5)` вместо `if (a == 5)` — опасная ошибка, которую ловит флаг `-Werror`.'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-6-1',
        title: 'Упражнение 6.1: Чётность числа (even.c)',
        taskType: 'c_code',
        condition: 'Напиши even.c: целое число -> печатает EVEN или ODD. Подсказка: чётное делится на 2 без остатка: a % 2 == 0. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int a;
    char extra;

    if (scanf("%d %c", &a, &extra) != 1) {
        printf("n/a");
        return 0;
    }
    // Твоя проверка четности
    
    return 0;
}`,
        hint: 'if (a % 2 == 0) printf("EVEN"); else printf("ODD");',
        solution: `#include <stdio.h>

int main(void) {
  int a;
  char extra;

  if (scanf("%d %c", &a, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  if (a % 2 == 0) {
    printf("EVEN");
  } else {
    printf("ODD");
  }
  return 0;
}`,
        solutionExplanation: [
          'Оператор % вычисляет остаток от деления.',
          'Если a % 2 == 0, число чётное (EVEN), иначе нечётное (ODD).'
        ]
      },
      {
        id: 'ex-6-2',
        title: 'Упражнение 6.2: Знак числа (sign.c)',
        taskType: 'c_code',
        condition: 'Напиши sign.c: целое число -> печатает POSITIVE, NEGATIVE или ZERO. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int a;
    char extra;

    // Ввод с валидацией и проверка знака
    
    return 0;
}`,
        hint: 'if (a > 0) printf("POSITIVE"); else if (a < 0) printf("NEGATIVE"); else printf("ZERO");',
        solution: `#include <stdio.h>

int main(void) {
  int a;
  char extra;

  if (scanf("%d %c", &a, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  if (a > 0) {
    printf("POSITIVE");
  } else if (a < 0) {
    printf("NEGATIVE");
  } else {
    printf("ZERO");
  }
  return 0;
}`,
        solutionExplanation: [
          'Используем каскадное ветвление if / else if / else для трёх взаимоисключающих состояний.'
        ]
      },
      {
        id: 'ex-6-3',
        title: 'Упражнение 6.3: Попадание в диапазон (between.c)',
        taskType: 'c_code',
        condition: 'Напиши between.c: читает три целых a, b, x. Печатает IN, если x лежит между a и b включительно, иначе OUT. Мусор -> n/a. (Учти краевой случай: вдруг a > b!)',
        initialCode: `#include <stdio.h>

int main(void) {
    int a, b, x;
    char extra;

    if (scanf("%d %d %d %c", &a, &b, &x, &extra) != 3) {
        printf("n/a");
        return 0;
    }
    // Проверка попадания x в отрезок [a, b] или [b, a]
    
    return 0;
}`,
        hint: 'Проверь: (x >= a && x <= b) || (x >= b && x <= a)',
        solution: `#include <stdio.h>

int main(void) {
  int a;
  int b;
  int x;
  char extra;

  if (scanf("%d %d %d %c", &a, &b, &x, &extra) != 3) {
    printf("n/a");
    return 0;
  }
  if ((x >= a && x <= b) || (x >= b && x <= a)) {
    printf("IN");
  } else {
    printf("OUT");
  }
  return 0;
}`,
        solutionExplanation: [
          'Условие (x >= a && x <= b) проверяет случай a <= b.',
          'Условие (x >= b && x <= a) проверяет случай a > b (краевой случай!).'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-6-1',
        question: 'Что вернёт выражение `5 == 5 && 3 > 10`?',
        options: [
          { id: 'a', text: '1 (true)', isCorrect: false },
          { id: 'b', text: '0 (false)', isCorrect: true },
          { id: 'c', text: '5', isCorrect: false },
          { id: 'd', text: 'Ошибку компиляции', isCorrect: false }
        ],
        explanation: 'Оператор && (логическое И) требует истинности обоих операндов. Так как 3 > 10 ложно, результат 0.'
      }
    ]
  },

  {
    id: 'lesson-7',
    slug: 'loops-day3-crucial',
    number: 7,
    moduleId: 'module-3',
    moduleNumber: 3,
    title: 'Урок 7. Циклы — САМЫЙ ВАЖНЫЙ ДЛЯ ДНЯ 3 ⭐⭐⭐',
    subtitle: 'for, while, накопление sum += i, деление 7/2=3 и 7%2=1, имитация вычитанием',
    icon: 'RotateCw',
    durationMinutes: 30,
    theoryContent: [
      {
        title: 'Циклы for и while',
        paragraphs: [
          'Цикл for — "повторить N раз":',
          'Три части через `;`: `int i = 0` — старт; `i < 10` — условие продолжения; `i++` — шаг (увеличить на 1).',
          'Цикл while — "пока верно условие":',
          '⚠️ Забыть `i++` внутри while = вечное зависание программы!'
        ],
        codeSnippets: [
          {
            title: 'Примеры циклов и накопления суммы',
            language: 'c',
            code: `// Цикл for
for (int i = 0; i < 10; i++) {
  printf("%d ", i); // 0 1 2 3 4 5 6 7 8 9
}

// Накопление суммы
int sum = 0;
for (int i = 1; i <= 100; i++) {
  sum += i;
}`
          }
        ],
        callouts: [
          {
            type: 'analogy',
            title: 'Целочисленное деление',
            content: '`7 / 2 = 3` (дробная часть отброшена). `7 % 2 = 1` (остаток от деления).'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-7-1',
        title: 'Упражнение 7.1: Сумма чисел от 1 до N (sum_to.c)',
        taskType: 'c_code',
        condition: 'Напиши sum_to.c: целое N -> печатает сумму чисел от 1 до N. Пример: N=5 -> 15. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1) {
        printf("n/a");
        return 0;
    }
    // Цикл накопления суммы
    
    return 0;
}`,
        hint: 'Объяви int sum = 0; и запусти for (int i = 1; i <= n; i++) sum += i;',
        solution: `#include <stdio.h>

int main(void) {
  int n;
  char extra;

  if (scanf("%d %c", &n, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  int sum = 0;
  for (int i = 1; i <= n; i++) {
    sum += i;
  }
  printf("%d", sum);
  return 0;
}`,
        solutionExplanation: [
          'Инициализируем аккумулятор sum = 0.',
          'В цикле прибавляем каждое число от 1 до n.',
          'Печатаем итоговую сумму.'
        ]
      },
      {
        id: 'ex-7-2',
        title: 'Упражнение 7.2: Лесенка из звёздочек (stairs.c)',
        taskType: 'c_code',
        condition: 'Напиши stairs.c: целое N -> печатает N строк, в строке i ровно i звёздочек. Пример N=3 -> *\\n**\\n***. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1) {
        printf("n/a");
        return 0;
    }
    // Вложенный цикл: внешний по строкам, внутренний по звездочкам
    
    return 0;
}`,
        hint: 'Внешний цикл: for (int i = 1; i <= n; i++). Внутренний: for (int j = 0; j < i; j++) printf("*"); После внутреннего — printf("\\n");',
        solution: `#include <stdio.h>

int main(void) {
  int n;
  char extra;

  if (scanf("%d %c", &n, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  for (int i = 1; i <= n; i++) {
    for (int j = 0; j < i; j++) {
      printf("*");
    }
    printf("\n");
  }
  return 0;
}`,
        solutionExplanation: [
          'Вложенный цикл: внешний отвечает за переход по строкам (1..n).',
          'Внутренний цикл печатает ровно i звёздочек в строке.',
          'printf("\\n") переводит строку строго после завершения внутреннего цикла.'
        ]
      },
      {
        id: 'ex-7-3',
        title: 'Упражнение 7.3: Таблица умножения (table.c)',
        taskType: 'c_code',
        condition: 'Напиши table.c: целое N -> таблица умножения на N от 1 до 9, формат "N*1=N", каждый на своей строке. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1) {
        printf("n/a");
        return 0;
    }
    // Цикл от 1 до 9
    
    return 0;
}`,
        hint: 'for (int i = 1; i <= 9; i++) printf("%d*%d=%d\\n", n, i, n * i);',
        solution: `#include <stdio.h>

int main(void) {
  int n;
  char extra;

  if (scanf("%d %c", &n, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  for (int i = 1; i <= 9; i++) {
    printf("%d*%d=%d\n", n, i, n * i);
  }
  return 0;
}`,
        solutionExplanation: [
          'Цикл for выполняет 9 итераций от 1 до 9, выводя строку N*i=Результат.'
        ]
      },
      {
        id: 'ex-7-4',
        title: 'Упражнение 7.4: Деление вычитанием (divide_sub.c) — Уровень Дня 3!',
        taskType: 'c_code',
        condition: 'Напиши divide_sub.c: читает два целых a и b. Выведи результат целочисленного деления a на b, ИМИТИРУЯ ЕГО ВЫЧИТАНИЕМ (операторы / и % СТРОГО ЗАПРЕЩЕНЫ). Пример: 13 и 4 -> 3. При b == 0 -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    int a, b;
    char extra;

    if (scanf("%d %d %c", &a, &b, &extra) != 2 || b == 0) {
        printf("n/a");
        return 0;
    }
    // Вычитай b из a в цикле while и считай итерации!
    
    return 0;
}`,
        hint: 'int quotient = 0, rem = a; while (rem >= b) { rem -= b; quotient++; } printf("%d", quotient);',
        solution: `#include <stdio.h>

int main(void) {
  int a;
  int b;
  char extra;

  if (scanf("%d %d %c", &a, &b, &extra) != 2) {
    printf("n/a");
    return 0;
  }
  if (b == 0) {
    printf("n/a");
    return 0;
  }
  int quotient = 0;
  int rem = a;
  while (rem >= b) {   // пока можно вычесть
    rem -= b;          // вычитаем
    quotient++;        // считаем, сколько раз
  }
  printf("%d", quotient);
  return 0;
}`,
        solutionExplanation: [
          'Это ядро квеста 1948.c! Вычитаем делитель b пока остаток rem >= b.',
          'Каждое вычитание увеличивает счётчик частного quotient на 1.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-7-1',
        question: 'Что произойдёт, если внутри цикла `while (i < 10)` забыть написать `i++;`?',
        options: [
          { id: 'a', text: 'Цикл выполнится 10 раз', isCorrect: false },
          { id: 'b', text: 'Программа зависнет в бесконечном цикле (Infinite Loop)', isCorrect: true },
          { id: 'c', text: 'Компилятор выдаст ошибку -Werror', isCorrect: false },
          { id: 'd', text: 'Программа сразу завершится', isCorrect: false }
        ],
        explanation: 'Без изменения переменной i условие i < 10 всегда остаётся истинным, приводя к бесконечному зависанию.'
      },
      {
        id: 'q-7-2',
        question: 'Чему равен результат целочисленного выражения `7 / 2` в языке C?',
        options: [
          { id: 'a', text: '3.5', isCorrect: false },
          { id: 'b', text: '3', isCorrect: true },
          { id: 'c', text: '4', isCorrect: false },
          { id: 'd', text: '1', isCorrect: false }
        ],
        explanation: 'При делении двух целых чисел в C дробная часть всегда отбрасывается (усечение к нулю).'
      },
      {
        id: 'q-7-3',
        question: 'Чему равен остаток от деления `7 % 2` в C?',
        options: [
          { id: 'a', text: '1', isCorrect: true },
          { id: 'b', text: '3', isCorrect: false },
          { id: 'c', text: '0', isCorrect: false },
          { id: 'd', text: '0.5', isCorrect: false }
        ],
        explanation: '7 = 3 * 2 + 1. Остаток от деления равен 1.'
      }
    ]
  },

  {
    id: 'lesson-8',
    slug: 'functions-basics',
    number: 8,
    moduleId: 'module-3',
    moduleNumber: 3,
    title: 'Урок 8. Функции',
    subtitle: 'Объявление выше main, параметры, return, тернарный оператор',
    icon: 'Code',
    durationMinutes: 20,
    theoryContent: [
      {
        title: 'Функции в языке C',
        paragraphs: [
          'Функция — именованный блок кода: приняла данные → вернула результат.',
          'Правило: функция объявляется ВЫШЕ main — компилятор читает сверху вниз и должен знать её сигнатуру до вызова.',
          'Тернарный оператор — короткий if/else: `(условие) ? если_да : если_нет`.'
        ],
        codeSnippets: [
          {
            title: 'Пример функции',
            language: 'c',
            code: `int square(int x) {      // принимает int, возвращает int
  return x * x;          // return = вернуть значение и выйти
}

int main(void) {
  printf("%d", square(5));   // 25
}`
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-8-1',
        title: 'Упражнение 8.1: Функция куба числа (pow3.c)',
        taskType: 'c_code',
        condition: 'Напиши pow3.c: целое N -> куб N. Вычисление обязано быть в функции cube(). Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int cube(int x) {
    // Верни x в кубе
}

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1) {
        printf("n/a");
        return 0;
    }
    printf("%d", cube(n));
    return 0;
}`,
        hint: 'int cube(int x) { return x * x * x; }',
        solution: `#include <stdio.h>

int cube(int x) {
  return x * x * x;
}

int main(void) {
  int n;
  char extra;

  if (scanf("%d %c", &n, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  printf("%d", cube(n));
  return 0;
}`,
        solutionExplanation: [
          'Функция cube принимает целое x и возвращает x * x * x.',
          'main считывает n с валидацией и передаёт в cube.'
        ]
      },
      {
        id: 'ex-8-2',
        title: 'Упражнение 8.2: Функция максимума (mymax.c)',
        taskType: 'c_code',
        condition: 'Напиши mymax.c: два целых -> большее из них. Функция max_of_two() обязательна. Если числа равны -> печатай это число. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int max_of_two(int a, int b) {
    // Верни большее через тернарный оператор
}

int main(void) {
    int a, b;
    char extra;

    // Ввод и вызов
    
    return 0;
}`,
        hint: 'int max_of_two(int a, int b) { return (a > b) ? a : b; }',
        solution: `#include <stdio.h>

int max_of_two(int a, int b) {
  return (a > b) ? a : b;
}

int main(void) {
  int a;
  int b;
  char extra;

  if (scanf("%d %d %c", &a, &b, &extra) != 2) {
    printf("n/a");
    return 0;
  }
  printf("%d", max_of_two(a, b));
  return 0;
}`,
        solutionExplanation: [
          'Тернарный оператор (a > b) ? a : b лаконично возвращает максимум.',
          'При равенстве a == b условие ложно и возвращается b (которое равно a) — результат корректен.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-8-1',
        question: 'Почему пользовательские функции объявляют выше main?',
        options: [
          { id: 'a', text: 'Потому что компилятор читает файл сверху вниз и должен знать сигнатуру функции до её первого вызова', isCorrect: true },
          { id: 'b', text: 'Это увеличивает скорость работы процессора', isCorrect: false },
          { id: 'c', text: 'Ниже main писать код запрещено операционной системой', isCorrect: false },
          { id: 'd', text: 'Только для красоты', isCorrect: false }
        ],
        explanation: 'C — язык с однопроходным синтаксическим анализом. Компилятору нужно знать типы аргументов и возвращаемого значения функции до её вызова.'
      }
    ]
  },

  // ==========================================
  // МОДУЛЬ 4. ПРОДВИНУТЫЙ C (ПОДГОТОВКА К ДНЮ 3!)
  // ==========================================
  {
    id: 'lesson-9',
    slug: 'math-floats-epsilon',
    number: 9,
    moduleId: 'module-4',
    moduleNumber: 4,
    title: 'Урок 9. Дробные числа, math.h, форматный вывод',
    subtitle: 'Библиотека math.h, флаг -lm в конце, эпсилон-сравнение 1e-6, стиль Google',
    icon: 'Calculator',
    durationMinutes: 25,
    isDay3Prep: true,
    theoryContent: [
      {
        title: 'Библиотека math.h и компиляция с -lm',
        paragraphs: [
          'Для математических вычислений подключаем `<math.h>`. Компиляция с math.h строго требует добавления **`-lm` в САМЫЙ КОНЕЦ** команды компилятора!',
          'Функции: `pow(x, y)`, `sqrt(x)`, `fabs(x)` (модуль double), `sin(x)`, `isnan(y)`, `isinf(y)`.'
        ],
        codeSnippets: [
          {
            title: 'Форматный вывод и научная запись',
            language: 'c',
            code: `printf("%.7f", x);        // ровно 7 знаков после точки
printf("%.3f | %.3f", x, y);  // с разделителем

// Научная запись чисел
double eps = 1e-6; // 0.000001
double big = 1e3;  // 1000.0`
          }
        ],
        callouts: [
          {
            type: 'danger',
            title: '⚠️ Эпсилон-сравнение вещественных чисел',
            content: 'Дробные числа хранятся в памяти приближённо (`0.1 + 0.2 = 0.30000000000000004`). Поэтому `==` для double НЕ РАБОТАЕТ! Правильное сравнение с нулём:\n```c\nconst double kEpsilon = 1e-6;\nif (fabs(res) < kEpsilon) { /* res считаем нулём */ }\n```'
          },
          {
            type: 'peer_review',
            title: 'Стиль Google: Заголовки по алфавиту',
            content: '#include <math.h> пишется ВЫШЕ #include <stdio.h> (буква m идёт раньше s в алфавите!).'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-9-1',
        title: 'Упражнение 9.1: Таблица функции (pi_table.c)',
        taskType: 'c_code',
        condition: 'Напиши pi_table.c: НИЧЕГО не читает из stdin. Печатает 5 строк: x от 0 до 2π с шагом π/2 и значение sin(x), формат: "%.7f | %.7f\\n". Подсказка: цикл на 5 шагов (i от 0 до 4), x = i * (M_PI / 2).',
        initialCode: `#include <math.h>
#include <stdio.h>

int main(void) {
    // Цикл на 5 шагов
    
    return 0;
}`,
        hint: 'for (int i = 0; i < 5; i++) { double x = i * (M_PI / 2.0); printf("%.7f | %.7f\\n", x, sin(x)); }',
        solution: `#include <math.h>
#include <stdio.h>

int main(void) {
  for (int i = 0; i < 5; i++) {
    double x = i * (M_PI / 2);
    printf("%.7f | %.7f\n", x, sin(x));
  }
  return 0;
}`,
        solutionExplanation: [
          '#include <math.h> стоит выше stdio.h по алфавиту.',
          'M_PI — константа π из math.h.',
          'Это мини-версия квеста door_functions дня 3 (там 42 точки от -π до +π)!'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-9-1',
        question: 'Где в команде компиляции gcc должен стоять флаг `-lm`?',
        options: [
          { id: 'a', text: 'В самом начале команды', isCorrect: false },
          { id: 'b', text: 'В самом конце команды (после файлов исходного кода)', isCorrect: true },
          { id: 'c', text: 'Флаг -lm не нужен при сборке C11', isCorrect: false },
          { id: 'd', text: 'Вместо имени файла', isCorrect: false }
        ],
        explanation: 'Линковщик GCC разрешает зависимости слева направо. Если поставить -lm до исходника, функции sqrt/sin не свяжутся (undefined reference).'
      },
      {
        id: 'q-9-2',
        question: 'Почему прямое сравнение `a == b` опасно для вещественных чисел типа double?',
        options: [
          { id: 'a', text: 'Потому что double хранятся с погрешностью в двоичной форме (IEEE 754), и 0.1 + 0.2 не равно в точности 0.3', isCorrect: true },
          { id: 'b', text: 'Потому что double нельзя сравнивать в C', isCorrect: false },
          { id: 'c', text: 'Компилятор выдаёт Segmentation Fault', isCorrect: false },
          { id: 'd', text: 'double автоматически округляется до int', isCorrect: false }
        ],
        explanation: 'Вещественные числа требуют сравнения через модуль разности с эпсилоном: fabs(a - b) < 1e-6.'
      }
    ]
  },

  {
    id: 'lesson-10',
    slug: 'recursion-quest3-prep',
    number: 10,
    moduleId: 'module-4',
    moduleNumber: 4,
    title: 'Урок 10. Рекурсия — подготовка к квесту 3',
    subtitle: 'База и шаг рекурсии, факториал, Фибоначчи и стек вызовов',
    icon: 'GitFork',
    durationMinutes: 25,
    isDay3Prep: true,
    theoryContent: [
      {
        title: 'Анатомия рекурсии: База и Шаг',
        paragraphs: [
          'Рекурсия — функция вызывает сама себя. Обязательные две части:',
          '1. База — условие выхода (иначе бесконечный вызов = крах программы и переполнение стека).',
          '2. Шаг — вызов себя с меньшими данными.',
          'Классический пример — факториал: `5! = 5 · 4! = 5 · 4 · 3! = ... = 5 · 4 · 3 · 2 · 1 = 120`'
        ],
        codeSnippets: [
          {
            title: 'Рекурсивный факториал и разворачивание вызовов',
            language: 'c',
            code: `int factorial(int n) {
  if (n <= 1) {           // БАЗА: 1! = 1
    return 1;
  }
  return n * factorial(n - 1);   // ШАГ: n! = n * (n-1)!
}

/*
Как разворачивается factorial(4):
factorial(4) = 4 * factorial(3)
             = 4 * (3 * factorial(2))
             = 4 * (3 * (2 * factorial(1)))
             = 4 * (3 * (2 * 1))
             = 24
*/`
          }
        ],
        callouts: [
          {
            type: 'tip',
            title: 'Фибоначчи (задание квеста 3 — решение делаешь сама!)',
            content: 'Формула: F(1)=1, F(2)=1, F(n) = F(n-1) + F(n-2).\nПодсказка: структура точь-в-точь как факториал, но функция вызывает себя ДВАЖДЫ и складывает результаты!'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-10-1',
        title: 'Упражнение 10.1: Рекурсивная сумма (rec_sum.c)',
        taskType: 'c_code',
        condition: 'Напиши rec_sum.c: рекурсивная функция sum_to(int n) для суммы чисел от 1 до N. sum_to(5) = 15. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int sum_to(int n) {
    // База и шаг рекурсии
}

int main(void) {
    int n;
    char extra;

    if (scanf("%d %c", &n, &extra) != 1) {
        printf("n/a");
        return 0;
    }
    printf("%d", sum_to(n));
    return 0;
}`,
        hint: 'if (n <= 1) return 1; return n + sum_to(n - 1);',
        solution: `#include <stdio.h>

int sum_to(int n) {
  if (n <= 1) {          // база
    return 1;
  }
  return n + sum_to(n - 1);   // шаг
}

int main(void) {
  int n;
  char extra;

  if (scanf("%d %c", &n, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  printf("%d", sum_to(n));
  return 0;
}`,
        solutionExplanation: [
          'Базовый случай: при n <= 1 возвращаем 1.',
          'Рекурсивный шаг: возвращаем n + sum_to(n - 1).'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-10-1',
        question: 'Что произойдет, если в рекурсивной функции отсутствует базовый случай (условие выхода)?',
        options: [
          { id: 'a', text: 'Программа вернёт 0', isCorrect: false },
          { id: 'b', text: 'Бесконечные вызовы функции переполнят стек (Stack Overflow) и приведут к краху программы (Segmentation Fault)', isCorrect: true },
          { id: 'c', text: 'Функция автоматически превратится в цикл', isCorrect: false },
          { id: 'd', text: 'Компилятор выдаст предупреждение', isCorrect: false }
        ],
        explanation: 'Без базового случая стек вызовов исчерпывает память, что вызывает падение процесса сигналом SIGSEGV.'
      },
      {
        id: 'q-10-2',
        question: 'Какие две обязательные части должны быть в любой рекурсивной функции?',
        options: [
          { id: 'a', text: 'main и return', isCorrect: false },
          { id: 'b', text: 'База (условие выхода) и шаг (самовызов с уменьшающимися данными)', isCorrect: true },
          { id: 'c', text: 'scanf и printf', isCorrect: false },
          { id: 'd', text: 'for и while', isCorrect: false }
        ],
        explanation: 'Без базы рекурсия бесконечна, а без шага рекурсия не решает поставленную задачу.'
      }
    ]
  },

  {
    id: 'lesson-11',
    slug: 'char-ascii-hex-quest2-prep',
    number: 11,
    moduleId: 'module-4',
    moduleNumber: 4,
    title: 'Урок 11. char и ASCII — подготовка к квесту 2',
    subtitle: 'ASCII коды символов, HEX 48 45 4C 4C 4F, argc и argv',
    icon: 'Terminal',
    durationMinutes: 25,
    isDay3Prep: true,
    theoryContent: [
      {
        title: 'Символ в C — это число (таблица ASCII)',
        paragraphs: [
          'Каждому символу соответствует числовой код в таблице ASCII:'
        ],
        tables: [
          {
            headers: ['Символ', 'Код (десятичный)', 'Код (hex)'],
            rows: [
              ['\'A\'', '65', '41'],
              ['\'B\'', '66', '42'],
              ['\'a\'', '97', '61'],
              ['\'0\'', '48', '30'],
              ['\' \' (пробел)', '32', '20']
            ]
          }
        ],
        codeSnippets: [
          {
            title: 'Форматы вывода символа и hex',
            language: 'c',
            code: `char c = 'A';
printf("%c", c);     // A — как символ
printf("%d", c);     // 65 — как число (десятичный код)
printf("%x", c);     // 41 — код в hex!

// hex-строки квеста: 48 45 4C 4C 4F -> HELLO (48_16 = 72 = 'H', 45_16 = 69 = 'E')`
          }
        ]
      },
      {
        title: 'Аргументы командной строки (argc, argv)',
        paragraphs: [
          'Параметры функции main принимают слова, с которыми запущена программа.'
        ],
        codeSnippets: [
          {
            title: 'Обработка аргументов запуска',
            language: 'c',
            code: `int main(int argc, char *argv[]) {
  // argc — сколько слов в команде (включая имя программы)
  // argv[i] — i-е слово как строка
  if (argc == 2 && argv[1][0] == '1') {
    // запущено: ./program 1
  }
}`
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-11-1',
        title: 'Упражнение 11.1: Десятичный ASCII-код символа (codeof.c)',
        taskType: 'c_code',
        condition: 'Напиши codeof.c: читает ОДИН символ, печатает его ASCII-код (десятичный). Пример: ввели "A" -> выведет 65. Мусор/EOF -> n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    char c;
    if (scanf("%c", &c) != 1) {
        printf("n/a");
        return 0;
    }
    // Печатай символ как число %d
    
    return 0;
}`,
        hint: 'printf("%d", c);',
        solution: `#include <stdio.h>

int main(void) {
  char c;
  if (scanf("%c", &c) != 1) {
    printf("n/a");
    return 0;
  }
  printf("%d", c);
  return 0;
}`,
        solutionExplanation: [
          'Символ char в памяти уже хранится как байтовое число. Спецификатор %d печатает его числовое значение.'
        ]
      },
      {
        id: 'ex-11-2',
        title: 'Упражнение 11.2: Регистр буквы (uplow.c)',
        taskType: 'c_code',
        condition: 'Напиши uplow.c: читает символ-букву. Печатает UPPER, если заглавная (\'A\'..\'Z\'), LOWER, если строчная (\'a\'..\'z\'), иначе n/a.',
        initialCode: `#include <stdio.h>

int main(void) {
    char c;
    if (scanf("%c", &c) != 1) {
        printf("n/a");
        return 0;
    }
    // Сравнивай символ диапазонами: c >= 'A' && c <= 'Z'
    
    return 0;
}`,
        hint: 'if (c >= \'A\' && c <= \'Z\') printf("UPPER"); else if (c >= \'a\' && c <= \'z\') printf("LOWER"); else printf("n/a");',
        solution: `#include <stdio.h>

int main(void) {
  char c;
  if (scanf("%c", &c) != 1) {
    printf("n/a");
    return 0;
  }
  if (c >= 'A' && c <= 'Z') {
    printf("UPPER");
  } else if (c >= 'a' && c <= 'z') {
    printf("LOWER");
  } else {
    printf("n/a");
  }
  return 0;
}`,
        solutionExplanation: [
          'В ASCII символы алфавита идут строго по порядку, поэтому сравнение c >= \'A\' && c <= \'Z\' работает надежно.'
        ]
      },
      {
        id: 'ex-11-3',
        title: 'Упражнение 11.3: Вывод в HEX через пробел (hexout.c) — Уровень Дня 3!',
        taskType: 'c_code',
        condition: 'Напиши hexout.c: читает символы через пробел до конца строки \\n, печатает их hex-коды через пробел. Пример: ввод "H I" -> вывод "48 49".',
        initialCode: `#include <stdio.h>

int main(void) {
    char c;
    int first = 1;
    while (scanf("%c", &c) == 1 && c != '\\n') {
        // Пропускай пробелы, печатай %x
    }
    return 0;
}`,
        hint: 'Спецификатор %x переводит символ в hex-число автоматически.',
        solution: `#include <stdio.h>

int main(void) {
  char c;
  int first = 1;
  while (scanf("%c", &c) == 1 && c != '\n') {
    if (c == ' ') {
      continue;             // пробелы пропускаем
    }
    if (!first) {
      printf(" ");
    }
    printf("%x", c);
    first = 0;
  }
  return 0;
}`,
        solutionExplanation: [
          'Читаем поток посимвольно до переноса строки \\n.',
          'Флаг first предотвращает печать лишнего пробела перед первым числом.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-11-1',
        question: 'Чему равен десятичный ASCII код символа \'A\'?',
        options: [
          { id: 'a', text: '48', isCorrect: false },
          { id: 'b', text: '65', isCorrect: true },
          { id: 'c', text: '97', isCorrect: false },
          { id: 'd', text: '1', isCorrect: false }
        ],
        explanation: 'В таблице ASCII заглавная буква \'A\' имеет код 65 (в hex: 0x41).'
      }
    ]
  },

  {
    id: 'lesson-12',
    slug: 'combination-prep-1948',
    number: 12,
    moduleId: 'module-4',
    moduleNumber: 4,
    title: 'Урок 12. Комбинация всего — подготовка к квесту 1 (1948.c)',
    subtitle: 'Деление вычитанием, проверка простоты, сборка алгоритма 1948.c',
    icon: 'Cpu',
    durationMinutes: 30,
    isDay3Prep: true,
    theoryContent: [
      {
        title: 'Сборка алгоритма 1948.c по кусочкам',
        paragraphs: [
          'Квест 1948.c: **наибольший простой делитель** без `/` и `%`. Соберём по кусочкам:',
          '**Кусок 1 — деление вычитанием:** вычитаем делитель b пока остаток rem >= b, считаем сколько раз.',
          '**Кусок 2 — проверка делимости нацело:** если после вычитания остаток `rem == 0` — делится.',
          '**Кусок 3 — проверка простоты:** простое число делится только на 1 и себя. Проверяем делители от 2 до n-1 (или до i * i <= n).',
          '**Общая идея квеста:** перебираем кандидатов-делители числа a (сверху вниз или снизу вверх), для каждого проверяем: (1) делит ли a нацело, (2) прост ли сам кандидат. Первый подходящий = ответ.'
        ],
        callouts: [
          {
            type: 'warning',
            title: '⚠️ Краевые случаи',
            content: 'Отрицательные числа (пример из задания: `-4` → `2`), а также 0 и 1 — краевые случаи, не забудь обработать знак!'
          },
          {
            type: 'tip',
            title: '💡 Твоя самостоятельная победа',
            content: 'Собери Упражнения 12.1 + 12.2 + перебор кандидатов — и у тебя готов план квеста 1948.c! Решение самого квеста здесь намеренно не приводится — реши его сама!'
          }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-12-1',
        title: 'Упражнение 12.1: Проверка делимости вычитанием (isdiv.c)',
        taskType: 'c_code',
        condition: 'Напиши isdiv.c: два целых a и b. Печатает YES если a делится на b нацело, иначе NO. Операторы / и % ЗАПРЕЩЕНЫ — только вычитание! При b == 0 -> n/a.',
        initialCode: `#include <stdio.h>

int is_divisible(int a, int b) {
    int rem = a;
    while (rem >= b) {
        rem -= b;
    }
    return rem == 0;
}

int main(void) {
    int a, b;
    char extra;

    if (scanf("%d %d %c", &a, &b, &extra) != 2 || b == 0) {
        printf("n/a");
        return 0;
    }
    // Проверка делимости
    
    return 0;
}`,
        hint: 'if (is_divisible(a, b)) printf("YES"); else printf("NO");',
        solution: `#include <stdio.h>

int is_divisible(int a, int b) {
  int rem = a;
  while (rem >= b) {
    rem -= b;
  }
  return rem == 0;      // 1 если разделилось нацело
}

int main(void) {
  int a;
  int b;
  char extra;

  if (scanf("%d %d %c", &a, &b, &extra) != 2) {
    printf("n/a");
    return 0;
  }
  if (b == 0) {
    printf("n/a");
    return 0;
  }
  if (is_divisible(a, b)) {
    printf("YES");
  } else {
    printf("NO");
  }
  return 0;
}`,
        solutionExplanation: [
          'Функция is_divisible вычитает b из a, пока хватает. Если в конце остаток 0 — делится нацело.'
        ]
      },
      {
        id: 'ex-12-2',
        title: 'Упражнение 12.2: Проверка простоты числа (isprime.c)',
        taskType: 'c_code',
        condition: 'Напиши isprime.c: целое N -> печатает PRIME или NOT. Здесь МОЖНО использовать оператор %. Мусор -> n/a.',
        initialCode: `#include <stdio.h>

int is_prime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return 0;
    }
    return 1;
}

int main(void) {
    int n;
    char extra;

    // Ввод и проверка
    
    return 0;
}`,
        hint: 'i * i <= n — оптимизация проверки делителей до корня числа.',
        solution: `#include <stdio.h>

int is_prime(int n) {
  if (n < 2) {
    return 0;            // 0, 1 и отрицательные — не простые
  }
  for (int i = 2; i * i <= n; i++) {
    if (n % i == 0) {
      return 0;          // нашёлся делитель — не простое
    }
  }
  return 1;
}

int main(void) {
  int n;
  char extra;

  if (scanf("%d %c", &n, &extra) != 1) {
    printf("n/a");
    return 0;
  }
  if (is_prime(n)) {
    printf("PRIME");
  } else {
    printf("NOT");
  }
  return 0;
}`,
        solutionExplanation: [
          'Числа меньше 2 не простые по определению.',
          'Цикл до i * i <= n проверяет делители до квадратного корня числа.'
        ]
      }
    ],
    quiz: [
      {
        id: 'q-12-1',
        question: 'Почему при проверке простоты достаточно проверять делители i только до `i * i <= n`?',
        options: [
          { id: 'a', text: 'Потому что у любого составного числа хотя бы один делитель не превышает квадратный корень из числа', isCorrect: true },
          { id: 'b', text: 'Потому что так требует компилятор C11', isCorrect: false },
          { id: 'c', text: 'Это работает только для чётных чисел', isCorrect: false },
          { id: 'd', text: 'Чтобы не превысить лимит int', isCorrect: false }
        ],
        explanation: 'Если у числа n есть делитель a > sqrt(n), то парный делитель b = n / a строго меньше sqrt(n), и мы нашли бы его раньше.'
      }
    ]
  }
];
