import { Day2Quest } from '../types';

export const day2QuestsData: Day2Quest[] = [
  {
    id: 'd2-q1',
    name: 'Квест 1: hello.c',
    file: 'src/hello.c',
    title: 'Hello, World! в Школе 21',
    description: 'Базовая программа вывода приветствия. Главный урок — отсутствие лишнего переноса строки в конце для посимвольной сверки автотестов.',
    code: `#include <stdio.h>

int main(void) {
    printf("Hello, World!");
    return 0;
}`,
    lineByLine: [
      { line: 1, concept: 'Директива препроцессора', explanation: '#include <stdio.h> подключает стандартную библиотеку ввода-вывода (printf).' },
      { line: 3, concept: 'Точка входа', explanation: 'int main(void) — каноническое объявление главной функции в стандарте C11, не принимающей параметров.' },
      { line: 4, concept: 'Посимвольный вывод', explanation: 'printf("Hello, World!"); печатает точную строку. Обрати внимание: в конце нет \\n — требование многих автотестов.' },
      { line: 5, concept: 'Код возврата', explanation: 'return 0; сообщает операционной системе об успешном завершении программы.' }
    ],
    keyTakeaways: [
      'Стандарт C11 строго требует int main(void)',
      'Любой лишний пробел или \\n ломает строгую сверку автотеста'
    ],
    peerReviewQuestions: [
      'Что означает int перед main?',
      'Почему в stdio.h есть буква h?'
    ]
  },
  {
    id: 'd2-q2',
    name: 'Квест 2: named_hello.c',
    file: 'src/named_hello.c',
    title: 'Именное приветствие и чтение целого числа',
    description: 'Программа считывает номер или имя и печатает персонализированное приветствие Hello, <name>!',
    code: `#include <stdio.h>

int main(void) {
    int name_id;
    char extra;

    if (scanf("%d %c", &name_id, &extra) != 1) {
        printf("n/a");
        return 0;
    }

    printf("Hello, %d!", name_id);
    return 0;
}`,
    lineByLine: [
      { line: 4, concept: 'Переменная', explanation: 'int name_id — ячейка памяти под целое число.' },
      { line: 5, concept: 'Детектор мусора', explanation: 'char extra — ловушка для лишних символов в строке ввода.' },
      { line: 7, concept: 'Строгая валидация', explanation: 'if (scanf("%d %c", &name_id, &extra) != 1) проверяет, что успешно прочитано ровно 1 число без мусора.' },
      { line: 8, concept: 'Отказ при ошибке', explanation: 'printf("n/a"); — стандартное сообщение об ошибке в Школе 21.' },
      { line: 12, concept: 'Форматная подстановка', explanation: 'printf("Hello, %d!", name_id); подставляет значение переменной на место спецификатора %d.' }
    ],
    keyTakeaways: [
      'Всегда проверяй возвращаемое значение scanf',
      'Мусор в конце строки должен отсекаться'
    ],
    peerReviewQuestions: [
      'Что вернёт scanf, если пользователь введёт "42abc"? (Ответ: 2, потому что %c поймает \'a\')'
    ]
  },
  {
    id: 'd2-q3',
    name: 'Квест 3: arithmetic.c',
    file: 'src/arithmetic.c',
    title: 'Четыре арифметических действия и деление на ноль',
    description: 'Считывает два целых числа и выводит сумму, разность, произведение и результат деления. При делении на 0 выводит n/a вместо частного.',
    code: `#include <stdio.h>

int main(void) {
    int a, b;
    char extra;

    if (scanf("%d %d %c", &a, &b, &extra) != 2) {
        printf("n/a");
        return 0;
    }

    int sum = a + b;
    int diff = a - b;
    int mult = a * b;

    if (b == 0) {
        printf("%d %d %d n/a", sum, diff, mult);
    } else {
        int div = a / b;
        printf("%d %d %d %d", sum, diff, mult, div);
    }

    return 0;
}`,
    lineByLine: [
      { line: 7, concept: 'Чтение пары', explanation: 'scanf("%d %d %c", &a, &b, &extra) != 2 — читаем 3 значения, но ждём ровно 2 (без мусора).' },
      { line: 12, concept: 'Арифметика', explanation: 'Вычисляем сумму, разность и произведение целых чисел.' },
      { line: 16, concept: 'Защита от деления на ноль', explanation: 'if (b == 0) — критически важная проверка: деление на ноль вызывает аппаратное прерывание SIGFPE (Floating point exception)!' },
      { line: 17, concept: 'Вывод с n/a', explanation: 'При b=0 печатаем "sum diff mult n/a".' }
    ],
    keyTakeaways: [
      'Деление на ноль в C — фатальный сбой программы',
      'Формат вывода через один пробел между числами'
    ],
    peerReviewQuestions: [
      'Какой сигнал ОС посылает программе при делении на ноль? (SIGFPE)'
    ]
  },
  {
    id: 'd2-q4',
    name: 'Квест 4: max.c',
    file: 'src/max.c',
    title: 'Максимум двух чисел с вынесенной функцией',
    description: 'Разделение кода на подпрограммы. Функция max_of_two() объявляется выше main.',
    code: `#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main(void) {
    int a, b;
    char extra;

    if (scanf("%d %d %c", &a, &b, &extra) != 2) {
        printf("n/a");
        return 0;
    }

    printf("%d", max(a, b));
    return 0;
}`,
    lineByLine: [
      { line: 3, concept: 'Объявление функции', explanation: 'int max(int a, int b) — объявляется ВЫШЕ main, чтобы компилятор знал сигнатуру.' },
      { line: 4, concept: 'Тернарный оператор', explanation: 'return (a > b) ? a : b; — элегантная однострочная замена конструкции if/else.' }
    ],
    keyTakeaways: [
      'Принцип модульности Дейкстры: каждая подзадача — отдельная функция',
      'Тернарный оператор возвращает значение'
    ],
    peerReviewQuestions: [
      'Что произойдёт, если объявить функцию max ниже main без прототипа? (-Werror выдаст ошибку неявного объявления)'
    ]
  },
  {
    id: 'd2-q5',
    name: 'Квест 5: important_function.c',
    file: 'src/important_function.c',
    title: 'Вычисление математической формулы с math.h',
    description: 'Вычисление функции $y = 7e-3 \cdot x^4 + \dots$ с проверкой деления на ноль и извлечения корня из отрицательного числа.',
    code: `#include <math.h>
#include <stdio.h>

double compute_function(double x) {
    return 7e-3 * pow(x, 4) +
           ((22.8 * pow(x, (1.0 / 3.0)) - 1e3) * x + 3.0) / (x * x / 2.0) -
           x * pow((10.0 + x), (2.0 / x)) - 1.01;
}

int main(void) {
    double x;
    char extra;

    if (scanf("%lf %c", &x, &extra) != 1) {
        printf("n/a");
        return 0;
    }

    if (x == 0.0 || (10.0 + x) < 0.0) {
        printf("n/a");
        return 0;
    }

    double y = compute_function(x);
    if (isnan(y) || isinf(y)) {
        printf("n/a");
    } else {
        printf("%.1f", y);
    }

    return 0;
}`,
    lineByLine: [
      { line: 1, concept: 'Стиль Google', explanation: '#include <math.h> стоит выше #include <stdio.h> (алфавитный порядок).' },
      { line: 5, concept: 'Формула', explanation: 'Используем pow(), научную запись 7e-3 (0.007) и 1e3 (1000.0).' },
      { line: 20, concept: 'Область определения', explanation: 'Проверяем x != 0 (деление на ноль) и 10+x >= 0 (основание степени).' },
      { line: 26, concept: 'Проверка NaN / Inf', explanation: 'isnan(y) и isinf(y) ловят неопределенности вычислений.' }
    ],
    keyTakeaways: [
      'Вещественные формулы требуют проверки области определения',
      'Флаг -lm ставится в самый конец сборки gcc'
    ],
    peerReviewQuestions: [
      'Что делает функция isnan()? (Проверяет, является ли значение Not-a-Number)'
    ]
  },
  {
    id: 'd2-q6',
    name: 'Квест 6: float_compare.c',
    file: 'src/float_compare.c',
    title: 'Эпсилон-сравнение вещественных чисел',
    description: 'Классическая задача: почему нельзя писать a == b для double, и как сравнивать числа через разность с погрешностью 1e-6.',
    code: `#include <math.h>
#include <stdio.h>

const double kEpsilon = 1e-6;

int main(void) {
    double a, b;
    char extra;

    if (scanf("%lf %lf %c", &a, &b, &extra) != 2) {
        printf("n/a");
        return 0;
    }

    if (fabs(a - b) < kEpsilon) {
        printf("EQUAL");
    } else if (a > b) {
        printf("FIRST");
    } else {
        printf("SECOND");
    }

    return 0;
}`,
    lineByLine: [
      { line: 4, concept: 'Константа погрешности', explanation: 'const double kEpsilon = 1e-6 (0.000001) — допустимый порог равенства.' },
      { line: 14, concept: 'Модуль разности', explanation: 'fabs(a - b) < kEpsilon — единственный математически корректный способ проверки равенства double в C.' }
    ],
    keyTakeaways: [
      'Никогда не сравнивай float/double через ==',
      'fabs() вычисляет модуль для double (в отличие от abs() для int)'
    ],
    peerReviewQuestions: [
      'Почему 0.1 + 0.2 != 0.3 в памяти компьютера? (Погрешность представления в двоичной плавающей точке IEEE 754)'
    ]
  },
  {
    id: 'd2-q7',
    name: 'Квест 7: crack.c',
    file: 'src/crack.c',
    title: 'Квест взлома: Попадание точки в круг $x^2 + y^2 \le 25$',
    description: 'Определяет, попадает ли точка (x, y) внутрь защитного контура радиусом 5 (уравнение окружности $x^2 + y^2 \le 25$). Выводит GOTCHA при попадании или MISS.',
    code: `#include <stdio.h>

int main(void) {
    double x, y;
    char extra;

    if (scanf("%lf %lf %c", &x, &y, &extra) != 2) {
        printf("n/a");
        return 0;
    }

    if (x * x + y * y <= 25.0) {
        printf("GOTCHA");
    } else {
        printf("MISS");
    }

    return 0;
}`,
    lineByLine: [
      { line: 7, concept: 'Ввод координат', explanation: 'scanf("%lf %lf %c", &x, &y, &extra) != 2 считывает координаты точки.' },
      { line: 12, concept: 'Геометрическое условие', explanation: 'x*x + y*y <= 25.0 — уравнение круга радиуса 5. При истинности выводит GOTCHA, иначе MISS.' }
    ],
    keyTakeaways: [
      'Квадрат расстояния от начала координат $r^2 = x^2 + y^2$',
      'Четкие ветвления условий без лишних библиотек'
    ],
    peerReviewQuestions: [
      'Попадает ли точка (3.0, 4.0) в круг? (Ответ: 3²+4²=25, 25<=25 -> GOTCHA)'
    ]
  }
];
