import { CommandCheat } from '../types';

/**
 * Полные последовательности команд: «хочу сделать квест — печатаю вот это по порядку».
 * Каждый шаг = одна команда + зачем она нужна.
 */
export const commandsData: CommandCheat[] = [
  {
    id: 'start',
    title: '0. Подготовка станка (один раз)',
    goal: 'Ключ, клон репозитория, рабочая ветка develop',
    emoji: '🔑',
    lessonId: 'lesson-3',
    steps: [
      { command: 'ssh-keygen -t ed25519 -C "breashee@er-d9"', what: 'Генерирует SSH-ключ, чтобы пушить без пароля' },
      { command: 'cat ~/.ssh/id_ed25519.pub', what: 'Показывает ПУБЛИЧНЫЙ ключ — его копируешь и кладёшь в профиль Git' },
      { command: 'git clone git@vcs.git.academy:breashee/D03T03.git', what: 'Скачивает твой репозиторий квеста на станок' },
      { command: 'cd D03T03 && pwd', what: 'Заходишь в папку проекта и проверяешь, что ты реально внутри' },
      { command: 'git checkout -b develop', what: 'Создаёт ветку develop и сразу переключает на неё — рабочая ветка Школы 21' },
      { command: 'mkdir -p src data && ls -la', what: 'Создаёт структуру папок проекта (-p не ругается, если папка уже есть)' }
    ],
    pitfalls: [
      'Приватный ключ (без .pub) никому не показывай, в репозиторий его не клади',
      'В master писать нельзя — только develop, master защищён для проверки'
    ]
  },
  {
    id: 'quest1',
    title: '1. Квест hello.c',
    goal: 'Создать файл, написать вывод, собрать, проверить посимвольно, отправить',
    emoji: '🐣',
    lessonId: 'lesson-4',
    steps: [
      { command: 'touch src/hello.c && ls src/', what: 'Создаёт пустой файл и показывает, что он появился' },
      { command: 'nano src/hello.c', what: 'Открывает редактор; пишем #include <stdio.h> и printf("Hello, World!");' },
      { command: 'cat -A src/hello.c', what: 'Показывает невидимое: $ = конец строки. Лишний перенос в конце вывода ломает автотест' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/hello.c -o hello', what: 'Собирает строго как в Школе 21: все варнинги = ошибки' },
      { command: './hello', what: 'Запуск программы из текущей папки (точка и слэш обязательны)' },
      { command: './hello | wc -c', what: 'Считает байты в выводе: должно быть ровно 13 (без \\n)' },
      { command: 'clang-format -n src/*.c', what: 'Проверяет стиль БЕЗ исправления файлов (ключ -n!)' },
      { command: 'rm -f hello hello.o && git status', what: 'Удаляет бинарь перед коммитом и смотрит, что реально изменено' },
      { command: 'git add src/hello.c && git commit -m "D01T01: hello.c" && git push origin develop', what: 'Индекс → коммит → пуш в develop' }
    ],
    pitfalls: [
      'Бинарник (hello, *.o, a.out) в Git класть нельзя — только .c и .h',
      'Забытый -std=c11 или лишний \\n — самая частая причина «локально работает, на проверке нет»'
    ]
  },
  {
    id: 'quest2',
    title: '2. Квест named_hello.c (валидация ввода)',
    goal: 'Читаем int, отсекаем мусор, печатаем n/a',
    emoji: '🪤',
    lessonId: 'lesson-6',
    steps: [
      { command: 'touch src/named_hello.c', what: 'Файл под квест' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/named_hello.c -o named_hello', what: 'Сборка со строгими флагами' },
      { command: "echo '7' | ./named_hello", what: 'Правильный ввод: ждём Hello, 7!' },
      { command: "echo '12.5' | ./named_hello", what: 'Проверка мусора: ждём ровно n/a, без переноса' },
      { command: "echo 'abc' | ./named_hello", what: 'Ещё один негативный тест' },
      { command: "echo '7x' | ./named_hello", what: 'Ловушка %c должна поймать лишний x и вернуть n/a' },
      { command: 'rm -f named_hello && git add . && git commit -m "D02: named_hello.c" && git push origin develop', what: 'Убрала бинарь, закоммитила, запушила' }
    ],
    pitfalls: ['scanf без проверки возвращаемого значения = проваленная защита: всегда if (scanf(...) != 1)']
  },
  {
    id: 'quest3',
    title: '3. Квест arithmetic.c',
    goal: 'Калькулятор +,-,*,/ с проверкой деления на ноль',
    emoji: '➗',
    lessonId: 'lesson-7',
    steps: [
      { command: 'touch src/arithmetic.c', what: 'Файл квеста' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/arithmetic.c -o arithmetic', what: 'Сборка' },
      { command: "printf '8 / 2\\n' | ./arithmetic", what: 'Обычный случай' },
      { command: "printf '8 / 0\\n' | ./arithmetic", what: 'Деление на ноль → RuntimeError (по условию Школы 21)' },
      { command: "printf '8 % 3\\n' | ./arithmetic", what: 'Остаток от деления' },
      { command: "printf '8 x 3\\n' | ./arithmetic", what: 'Неизвестный оператор → n/a' },
      { command: 'rm -f arithmetic', what: 'Чистим за собой перед коммитом' }
    ],
    pitfalls: ['Целочисленное деление отбрасывает дробь: 7 / 2 = 3, а не 3.5']
  },
  {
    id: 'quest4',
    title: '4. Квест max.c',
    goal: 'Максимум из чисел через свою функцию',
    emoji: '⛰️',
    lessonId: 'lesson-8',
    steps: [
      { command: 'touch src/max.c', what: 'Файл квеста' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/max.c -o max', what: 'Сборка' },
      { command: "printf '3 9\\n' | ./max", what: 'Ждём 9' },
      { command: "printf '5 5\\n' | ./max", what: 'Равные числа — тоже максимум, не ошибка' },
      { command: 'grep -n "int max_of_two" src/max.c', what: 'Быстрая самопроверка: функция объявлена выше main?' },
      { command: 'git add src/max.c && git commit -m "D04: max.c" && git push origin develop', what: 'Отправка' }
    ],
    pitfalls: ['Функция, объявленная ниже main, без прототипа — ошибка компиляции']
  },
  {
    id: 'quest5',
    title: '5. Квест important_function.c',
    goal: 'Функция с выходным параметром через указатель',
    emoji: '📍',
    lessonId: 'lesson-10',
    steps: [
      { command: 'touch src/important_function.c', what: 'Файл квеста' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/important_function.c -o imp', what: 'Сборка' },
      { command: './imp', what: 'Проверяем: деление вычитанием + запись остатка через *' },
      { command: 'grep -n "\\*quotient\\|\\*remainder" src/important_function.c', what: 'Смотрим, что разыменование действительно есть' },
      { command: 'rm -f imp && git add . && git commit -m "D05: important_function" && git push origin develop', what: 'Коммит и пуш' }
    ],
    pitfalls: ['Забытый & при передаче адреса — сегфолт, а не варнинг']
  },
  {
    id: 'quest6',
    title: '6. Квест float_compare.c',
    goal: 'Дробные числа, math.h, эпсилон, флаг -lm',
    emoji: '🌊',
    lessonId: 'lesson-9',
    steps: [
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/float_compare.c -lm -o fc', what: '-lm — в САМЫЙ КОНЕЦ команды, иначе линкер не найдёт fabs' },
      { command: "printf '1.0 1.0000001\\n' | ./fc", what: 'Граница эпсилон: сравнение через fabs(a - b) < 1e-6' },
      { command: "printf '0.3 0.1 0.2\\n' | ./fc", what: '0.1 + 0.2 != 0.3 в двоичной дроби — на этом ловят' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/float_compare.c -o fc2', what: 'Эксперимент: без -lm получишь undefined reference to `fabs`' },
      { command: 'rm -f fc fc2 && git add . && git commit -m "D06: float_compare" && git push origin develop', what: 'Уборка и отправка' }
    ],
    pitfalls: ['%f для double в printf, но %lf в scanf — запутаться легче легкого']
  },
  {
    id: 'quest7',
    title: '7. Квест crack.c (перебор пароля)',
    goal: 'Двоичный поиск / перебор, printf в одну строку',
    emoji: '🔓',
    lessonId: 'lesson-12',
    steps: [
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/crack.c -lm -o crack', what: 'Сборка с математической библиотекой' },
      { command: './crack', what: 'Запуск: смотрим, что вывод совпадает с ожидаемой строкой' },
      { command: './crack > out.txt && diff out.txt data/expected.txt', what: 'Сверка вывода с эталоном из папки data' },
      { command: 'rm -f out.txt crack && git add . && git commit -m "D07: crack.c" && git push origin develop', what: 'Финальная чистка + отправка' }
    ],
    pitfalls: ['Перенаправление > создаёт файл в репозитории — не закоммить его (или добавь в .gitignore)']
  },
  {
    id: 'git',
    title: '8. Git: полный цикл дня',
    goal: 'Каждый рабочий день от и до',
    emoji: '🐙',
    lessonId: 'lesson-3',
    steps: [
      { command: 'git status', what: 'Что изменилось, что в индексе, в какой я ветке' },
      { command: 'git diff', what: 'Показывает незакоммиченные изменения построчно' },
      { command: 'git add src/1948.c', what: 'Кладём в индекс только нужное, а не всё подряд' },
      { command: 'git commit -m "D03T03: 1948.c ready"', what: 'Упаковали индекс в коммит с внятным сообщением' },
      { command: 'git log --oneline --graph -10', what: 'История последних 10 коммитов — проверяем, что ничего не потерялось' },
      { command: 'git push origin develop', what: 'Отправляем в удалённый репозиторий — только после этого работу видно' },
      { command: 'git restore --source=HEAD~1 src/1948.c', what: 'Спасение файла: вернуть версию из прошлого коммита' },
      { command: 'git checkout -b fix-1948', what: 'Ветка для эксперимента, если боишься сломать develop' },
      { command: 'git status --short && git ls-files', what: 'Короткий статус и список файлов, которые реально отслеживаются' }
    ],
    pitfalls: [
      'Unpushed commit = работы нет. Проверяй git status: «Your branch is up to date»',
      'git push НЕ пушит то, что не закоммичено; git add НЕ добавляет то, что в .gitignore'
    ]
  },
  {
    id: 'build',
    title: '9. Сборка, стиль, чистота',
    goal: 'Команды, которые спасают на peer review',
    emoji: '🛠️',
    lessonId: 'lesson-4',
    steps: [
      { command: 'gcc -Wall -Wextra -Werror -std=c11 -c src/*.c', what: 'Только компиляция в .o: видно все варнинги без линковки' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/*.c -lm -o bin', what: 'Полная сборка нескольких файлов разом' },
      { command: 'clang-format -n -i src/*.c', what: '-n проверить, -i исправить по стилю (обычно нужно и то, и другое)' },
      { command: 'echo "*.o\\nbin\\na.out\\n*.out" > .gitignore', what: 'Файл-стоп-кран для мусора в репозитории' },
      { command: 'find . -type f ! -name "*.c" ! -name "*.h" ! -path "./.git/*"', what: 'Найти всё лишнее, что ты случайно создаёшь в репо' },
      { command: 'du -sh .git', what: 'Размер истории: большие файлы-бинарники выдают себя здесь' },
      { command: 'rm -f *.o *.out bin a.out', what: 'Удалить артефакты сборки перед git add' }
    ],
    pitfalls: ['Бинарник, закоммиченный один раз, остаётся в истории навсегда — чинить придётся git rm --cached + force push']
  },
  {
    id: 'debug',
    title: '10. Отладка без debugger’а',
    goal: 'Как понять, почему вывод не тот',
    emoji: '🔍',
    lessonId: 'lesson-2',
    steps: [
      { command: './bin; echo "код возврата: $?"', what: 'Код возврата программы: 0 = ок, 139 = сегфолт, 137 = убили по лимиту' },
      { command: "printf '5\\n' | ./bin", what: 'Подать ввод вручную, не запуская интерактив' },
      { command: './bin | cat -A', what: 'Показать пробелы и переносы: $ в конце = лишний \\n' },
      { command: './bin | head -5', what: 'Смотреть только начало вывода' },
      { command: './bin | tail -3', what: 'Смотреть только конец — там чаще всего и ошибка' },
      { command: './bin | wc -l', what: 'Сколько строк реально напечатано (ожидаем ровно нужное число)' },
      { command: 'grep -n "printf" src/*.c', what: 'Найти все места вывода и сверить форматы' },
      { command: 'gcc -g src/*.c -lm -o bin_dbg && valgrind ./bin_dbg', what: 'Утечки памяти и чтение за границами (когда дойдём до malloc)' }
    ],
    pitfalls: ['Если вывод «правильный», но тест красный — почти всегда лишний пробел или перенос строки']
  },
  {
    id: 'exam',
    title: '11. Экзаменационный день на станции',
    goal: 'Ритуал, чтобы не забыть главное за 45 минут',
    emoji: '🎯',
    lessonId: 'lesson-12',
    steps: [
      { command: 'pwd && ls && git checkout develop', what: 'Первым делом: где я и в какой я ветке' },
      { command: 'cat data/expected.txt', what: 'Прочитать формат вывода ДО того, как писать код' },
      { command: 'nano src/1948.c', what: 'Пишем код: сначала валидация, потом алгоритм, потом вывод' },
      { command: 'gcc -Wall -Wextra -Werror -std=c11 src/1948.c -lm -o 1948', what: 'Сборка. Все предупреждения — это ошибки' },
      { command: "printf '100\\n' | ./1948", what: 'Граничные тесты: 0, 1, отрицательное, мусор, max int' },
      { command: './1948 | diff - data/expected.txt', what: 'Сверка вывода с эталоном из терминала' },
      { command: 'rm -f 1948 && clang-format -n src/*.c', what: 'Убрать бинарь и проверить стиль' },
      { command: 'git add . && git commit -m "exam: 1948.c" && git push origin develop', what: 'Отправить. Не пушнул = не сдал' }
    ],
    pitfalls: [
      'Один непущенный коммит обнуляет всю работу: пуш за 5 минут до конца, не в последнюю секунду',
      'Не ставь \\n там, где его нет в эталоне, и не ставь пробелов больше, чем в образце'
    ]
  }
];

export default commandsData;
