//Утилиты

//читает число из input элемента
function readInt(id) {
  return parseInt(document.getElementById(id).value, 10);
}

//проверяет не равно ли число почти нулю, чтобы избежать ошибок округления
function nearlyZero(x) {
  return Math.abs(x) < 1e-10;
}

function clone2D(a) {
  return a.map(row => row.slice());
}

function setResultHTML(html) {
  document.getElementById("result-output").innerHTML = html;

  if (window.MathJax && window.MathJax.typeset) {
    try {
      window.MathJax.typeset();
    } catch (e) {}
  }
}

function showError(msg) {
  const html = 
    '<div style="background:#ffe5e5; border-left:4px solid #dc3545; padding:14px; border-radius:10px;">' +
      '<strong style="color:#dc3545">❗ Ошибка</strong><br>' +
      '<span style="color:#333">' + msg + '</span>' +
    '</div>';
  setResultHTML(html);
}

//глобальная переменная для пошаговой визуализации
let st = {
  arr: [],
  i: 0,
  ans: null,
  mode: ""
};

function clearSteps() {
  st.arr = [];
  st.i = 0;
  st.ans = null;
  st.mode = "";
}

//рисуем матрицу, opt - это параметры: pr (pivot), hr (highlight row), sepCol (разделитель)
function matHTML(mat, opt) {
  opt = opt || {};
  const pr = opt.pr || null;
  const hr = (opt.hr === 0 || opt.hr) ? opt.hr : null;
  const sepCol = (opt.sepCol === 0 || opt.sepCol) ? opt.sepCol : null;

  let html = '<table class="matrix-table">';

  for (let i = 0; i < mat.length; i++) {
    html += "<tr" + ((hr === i) ? ' class="rowhl"' : "") + ">";

    for (let j = 0; j < mat[i].length; j++) {
      const v = mat[i][j];
      const ok = Number.isFinite(v);

      //форматируем число: очень маленькие -> 0
      const txt = ok ? (Math.abs(v) < 1e-12 ? "0" : v.toFixed(4)) : String(v);

      let cls = "";
      //если это pivot, подсвечиваем красным
      if (pr && pr[0] === i && pr[1] === j) cls += " pivot";
      //если это разделитель (для расширенной матрицы)
      if (sepCol !== null && j === sepCol) cls += " sep";

      html += '<td class="' + cls.trim() + '">' + txt + "</td>";
    }
    html += "</tr>";
  }
  html += "</table>";
  return html;
}

function showMatrix(mat) {
  clearSteps();
  setResultHTML(matHTML(mat));
}

//Создает таблицу с ipnut элементами для ввода матрицы
function createMatrix(containerId, rowsId, colsId, prefix) {
  const rows = readInt(rowsId);
  const cols = readInt(colsId);

//проверка размера
  if (!Number.isFinite(rows) || !Number.isFinite(cols)) {
  showError("Введите размеры матрицы");
  return;
}
  if (rows < 1 || rows > 12 || cols < 1 || cols > 12) {
    showError("Размер матрицы должен быть от 1 до 12");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "matrix-table";

//создаем ячейки
  for (let i = 0; i < rows; i++) {
    const tr = table.insertRow();
    for (let j = 0; j < cols; j++) {
      const td = tr.insertCell();
      const input = document.createElement("input");
      input.type = "number";
      input.step = "any";
      input.value = "0";
      input.id = prefix + "-" + i + "-" + j; //типа A-0-0, A-0-1
      td.appendChild(input);
    }
  }

  container.appendChild(table);
}

//читает матрицу из input элементов
function getMatrix(prefix, rowsId, colsId) {
  const rows = readInt(rowsId);
  const cols = readInt(colsId);
  const mat = [];

  for (let i = 0; i < rows; i++) {
    const r = [];
    for (let j = 0; j < cols; j++) {
      const inp = document.getElementById(prefix + "-" + i + "-" + j);
      if (!inp) return null;
      r.push(parseFloat(inp.value) || 0);
    }
    mat.push(r);
  }
  return mat;
}

function createMatrixA() {
  createMatrix("matrixA-container", "rowsA", "colsA", "A");
}

function createMatrixB() {
  createMatrix("matrixB-container", "rowsB", "colsB", "B");
}

function clearAll() {
  document.getElementById("matrixA-container").innerHTML = "";
  document.getElementById("matrixB-container").innerHTML = "";
  setResultHTML("");
  clearSteps();

//сбрасываем значения
  document.getElementById("rowsA").value = "3";
  document.getElementById("colsA").value = "3";
  document.getElementById("rowsB").value = "3";
  document.getElementById("colsB").value = "3";
}

//Операции (базовые)
function add() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  const B = getMatrix("B", "rowsB", "colsB");
  if (!A || !B) {
    showError("Сначала создайте матрицы A и B");
    return;
  }

  const rA = A.length, cA = A[0].length;
  const rB = B.length, cB = B[0].length;
  if (rA !== rB || cA !== cB) {
    showError("Для сложения размеры A и B должны совпадать");
    return;
  }

//суммируем поэлементно
  const R = [];
  for (let i = 0; i < rA; i++) {
    const row = [];
    for (let j = 0; j < cA; j++) row.push(A[i][j] + B[i][j]);
    R.push(row);
  }

  setResultHTML("<h3>A + B</h3>" + matHTML(R));
}

function subtract() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  const B = getMatrix("B", "rowsB", "colsB");
  if (!A || !B) {
    showError("Сначала создайте матрицы A и B");
    return;
  }

  const rA = A.length, cA = A[0].length;
  const rB = B.length, cB = B[0].length;
  if (rA !== rB || cA !== cB) {
    showError("Для вычитания размеры A и B должны совпадать");
    return;
  }

  const R = [];
  for (let i = 0; i < rA; i++) {
    const row = [];
    for (let j = 0; j < cA; j++) {
      row.push(A[i][j] - B[i][j]);
    }
    R.push(row);
  }

  setResultHTML("<h3>A - B</h3>" + matHTML(R));
}

//умножение матриц: A(m*n) * B(n*p) = C(m*p)
function mult() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  const B = getMatrix("B", "rowsB", "colsB");
  if (!A || !B) {
    showError("Сначала создайте матрицы A и B");
    return;
  }

  const rA = A.length, cA = A[0].length;
  const rB = B.length, cB = B[0].length;

  //проверка: столбцы A должны равняться строкам B
  if (cA !== rB) {
    showError("Для умножения нужно: столбцы A = строки B");
    return;
  }

  const R = [];
  for (let i = 0; i < rA; i++) {
    const row = [];
    for (let j = 0; j < cB; j++) {
      //c[i][j] = сумма произведений
      let s = 0;
      for (let k = 0; k < cA; k++) {
        s += A[i][k] * B[k][j];
      }
      row.push(s);
    }
    R.push(row);
  }

  setResultHTML("<h3>A × B</h3>" + matHTML(R));
}

function transposeA() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }

  const r = A.length;
  const c = A[0].length;
  const T = [];

//меняем строки и столбцы местами
  for (let j = 0; j < c; j++) {
    const row = [];
    for (let i = 0; i < r; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }

  setResultHTML("<h3>Aᵀ</h3>" + matHTML(T));
}

//умножение матрицы на число
function multiplyScalarA() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }

  let num = prompt("Введите число:");
  if (num === null) return;
  num = parseFloat(num);
  if (isNaN(num)) {
    showError("Некорректное число");
    return;
  }

  const R = [];
  for (let i = 0; i < A.length; i++) {
    const row = [];
    for (let j = 0; j < A[i].length; j++) {
      row.push(A[i][j] * num);
    }
    R.push(row);
  }

  setResultHTML("<h3>A * " + num + "</h3>" + matHTML(R));
}

//определитель
function det() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }

  const n = A.length;
  const m = A[0].length;

  if (n !== m) {
    showError("Определитель считается только для квадратной матрицы");
    return;
  }

  st.mode = "det";
  const a = clone2D(A);
  let swaps = 0; //счетчик перестановок строк

  pushStep("<strong>Вычисление определителя</strong> методом приведения к треугольному виду.<br>Исходная матрица:", a);

  for (let k = 0; k < n; k++) {
    let pivotRow = k;
    let best = Math.abs(a[k][k]);

    for (let i = k + 1; i < n; i++) {
      const v = Math.abs(a[i][k]);
      if (v > best) {
        best = v;
        pivotRow = i;
      }
    }

    if (nearlyZero(a[pivotRow][k])) {
      st.ans = "<h3>Результат</h3><p><strong>det(A) = 0</strong></p><p class='small'>Столбец обнулился → det = 0</p>";
      st.i = 0;
      renderStep();
      return;
    }

    if (pivotRow !== k) {
      const tmp = a[k];
      a[k] = a[pivotRow];
      a[pivotRow] = tmp;
      swaps++;

      pushStep(
        "Меняем строки " + (k + 1) + " ↔ " + (pivotRow + 1) + " (количество перестановок: " + swaps + ")",
        a,
        { pr: [k, k] }
      );
    } else {
      pushStep("✅Pivot a[" + (k + 1) + "," + (k + 1) + "] = " + a[k][k].toFixed(4), a, { pr: [k, k] });
    }

    for (let i = k + 1; i < n; i++) {
      if (nearlyZero(a[i][k])) continue;

      const factor = a[i][k] / a[k][k];

      pushStep(
        "Зануляем a[" + (i + 1) + "," + (k + 1) + "]: R" + (i + 1) + " = R" + (i + 1) + " − (" + factor.toFixed(4) + ") × R" + (k + 1),
        a,
        { pr: [k, k], hr: i }
      );

      for (let j = k; j < n; j++) {
        a[i][j] -= factor * a[k][j];
      }

      pushStep("✔️Строка " + (i + 1) + " обновлена", a, { pr: [k, k], hr: i });
    }
  }

  let det = (swaps % 2 === 0) ? 1 : -1;
  for (let i = 0; i < n; i++) {
    det *= a[i][i];
    return det;
  }
  pushStep("Матрица приведена к треугольному виду", a);

  st.ans =
    "<h3>Результат</h3>" +
    "<p><strong>det(A) = " + det.toFixed(6) + "</strong></p>" +
    "<p class='small'>Количество перестановок: " + swaps + " → знак " + ((swaps % 2 === 0) ? "+" : "−") + "</p>" +
    "<p class='small'>det = произведение диагональных элементов = " + det.toFixed(6) + "</p>";

  st.i = 0;
  renderStep();
}

//rank с пошаговой визуализацией
function Rank() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }

  st.mode = "rank";
  const a = clone2D(A);
  const rows = a.length;
  const cols = a[0].length;

  pushStep("<strong>Вычисление ранга</strong> методом приведения к ступенчатому виду.<br>Исходная матрица:", a);

  let rank = 0;
  let r = 0;

  for (let c = 0; c < cols && r < rows; c++) {
    let pivot = r;
    let best = Math.abs(a[r][c]);

    for (let i = r + 1; i < rows; i++) {
      const v = Math.abs(a[i][c]);
      if (v > best) {
        best = v;
        pivot = i;
      }
    }

    if (nearlyZero(a[pivot][c])) {
      pushStep("❗Столбец " + (c + 1) + " уже обнулён ниже строки " + (r + 1) + ", пропускаем", a);
      continue;
    }

    if (pivot !== r) {
      const tmp = a[r];
      a[r] = a[pivot];
      a[pivot] = tmp;

      pushStep("Меняем строки " + (r + 1) + " ↔ " + (pivot + 1), a, { pr: [r, c] });
    } else {
      pushStep("✅Pivot найден: a[" + (r + 1) + "," + (c + 1) + "] = " + a[r][c].toFixed(4), a, { pr: [r, c] });
    }

    for (let i = r + 1; i < rows; i++) {
      if (nearlyZero(a[i][c])) continue;

      const factor = a[i][c] / a[r][c];

      pushStep(
        "Зануляем a[" + (i + 1) + "," + (c + 1) + "]: R" + (i + 1) + " = R" + (i + 1) + " − (" + factor.toFixed(4) + ") × R" + (r + 1),
        a,
        { pr: [r, c], hr: i }
      );

      for (let j = c; j < cols; j++) {
        a[i][j] -= factor * a[r][j];
      }

      pushStep("✔️Строка " + (i + 1) + " обновлена", a, { pr: [r, c], hr: i });
    }

    rank++;
    r++;
  }

  pushStep("Матрица приведена к ступенчатому виду", a);

  st.ans =
    "<h3>Результат</h3>" +
    "<p><strong>rank(A) = " + rank + "</strong></p>" +
    "<p class='small'>Количество ненулевых строк после приведения к ступенчатому виду</p>";

  st.i = 0;
  renderStep();
}

//Обратная матрица с пошаговой визуализацией
function inverseA() {
  clearSteps();
  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }

  const n = A.length;
  if (A[0].length !== n) {
    showError("Обратная матрица только для квадратной");
    return;
  }

  st.mode = "inverse";

  const a = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) row.push(A[i][j]);
    for (let j = 0; j < n; j++) row.push(i === j ? 1 : 0);
    a.push(row);
  }

  pushStep(
    "<strong>Вычисление обратной матрицы</strong> методом Гаусса-Жордана.<br>Создаём расширенную матрицу [A|I]:",
    a,
    { sepCol: n }
  );

  for (let k = 0; k < n; k++) {
    let pr = k;
    let best = Math.abs(a[k][k]);
    for (let i = k + 1; i < n; i++) {
      const v = Math.abs(a[i][k]);
      if (v > best) {
        best = v;
        pr = i;
      }
    }

    if (nearlyZero(a[pr][k])) {
      st.ans = "<h3>Результат</h3><p><strong>Обратной матрицы не существует</strong></p><p class='small'>det(A) = 0</p>";
      st.i = 0;
      renderStep();
      return;
    }

    if (pr !== k) {
      const tmp = a[k];
      a[k] = a[pr];
      a[pr] = tmp;

      pushStep("🔁 Меняем строки " + (k + 1) + " ↔ " + (pr + 1), a, { pr: [k, k], sepCol: n });
    }

    const piv = a[k][k];
    pushStep(
      "➗Делим строку " + (k + 1) + " на pivot = " + piv.toFixed(4),
      a,
      { pr: [k, k], sepCol: n }
    );

    for (let j = 0; j < 2 * n; j++) a[k][j] /= piv;

    pushStep("✔️Строка " + (k + 1) + " нормирована", a, { pr: [k, k], sepCol: n });

    for (let i = 0; i < n; i++) {
      if (i === k) continue;
      const factor = a[i][k];
      if (nearlyZero(factor)) continue;

      pushStep(
        "Зануляем a[" + (i + 1) + "," + (k + 1) + "]: R" + (i + 1) + " = R" + (i + 1) + " − (" + factor.toFixed(4) + ") × R" + (k + 1),
        a,
        { pr: [k, k], hr: i, sepCol: n }
      );

      for (let j = 0; j < 2 * n; j++) {
        a[i][j] -= factor * a[k][j];
      }

      pushStep("✔️Строка " + (i + 1) + " обновлена", a, { pr: [k, k], hr: i, sepCol: n });
    }
  }

  const inv = [];
  for (let i = 0; i < n; i++) {
    inv.push(a[i].slice(n, 2 * n));
  }

  pushStep("✨Приведено к виду [I|A⁻¹]", a, { sepCol: n });

  st.ans = "<h3>Результат: A⁻¹</h3>" + matHTML(inv);
  st.i = 0;
  renderStep();
}

//Шаги (общие функции)
function pushStep(text, mat, opt) {
  st.arr.push({
    text: text,
    mat: clone2D(mat),
    pr: opt && opt.pr ? opt.pr : null,
    hr: (opt && (opt.hr === 0 || opt.hr)) ? opt.hr : null,
    sepCol: (opt && (opt.sepCol === 0 || opt.sepCol)) ? opt.sepCol : null
  });
}

function renderStep() {
  if (!st.arr.length) return;

  const step = st.arr[st.i];
  const top =
    '<div class="step-bar">' +
      '<button type="button" onclick="stepPrev()">◀ Назад</button>' +
      '<button type="button" onclick="stepNext()">Вперёд ▶</button>' +
      '<span class="badge">Шаг ' + (st.i + 1) + ' / ' + st.arr.length + '</span>' +
      '<button type="button" onclick="showAllSteps()">Все шаги</button>' +
    "</div>";

  const txt = '<div class="step-text">' + step.text + "</div>";
  const mat = matHTML(step.mat, { pr: step.pr, hr: step.hr, sepCol: step.sepCol });

  let ans = "";
  if (st.ans) ans = "<hr>" + st.ans;

  setResultHTML(top + txt + mat + ans);
}

function stepPrev() {
  if (!st.arr.length) return;
  st.i--;
  if (st.i < 0) st.i = 0;
  renderStep();
}

function stepNext() {
  if (!st.arr.length) return;
  st.i++;
  if (st.i >= st.arr.length) st.i = st.arr.length - 1;
  renderStep();
}

function showAllSteps() {
  if (!st.arr.length) return;

  let html =
    '<div class="step-bar">' +
      '<button type="button" onclick="renderStep()">◀ Назад к шагам</button>' +
      '<span class="badge">Все ' + st.arr.length + ' шагов</span>' +
    "</div><hr>";

  for (let i = 0; i < st.arr.length; i++) {
    const s = st.arr[i];
    html += "<h3 style='margin-top:16px'>Шаг " + (i + 1) + "</h3>";
    html += '<div class="step-text">' + s.text + "</div>";
    html += matHTML(s.mat, { pr: s.pr, hr: s.hr, sepCol: s.sepCol });
  }

  if (st.ans) html += "<hr>" + st.ans;

  setResultHTML(html);
}

//СЛАУ (Гаусс)
function Gauss() {
  clearSteps();

  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }

  const n = A.length;
  const m = A[0].length;
  if (m !== n + 1) {
    showError("Для СЛАУ матрица A должна быть размера n×(n+1)");
    return;
  }

  st.mode = "gauss";

  const a = clone2D(A);

  pushStep(
    "<strong>Решение СЛАУ методом Гаусса</strong><br>Исходная расширенная матрица [A|b]:",
    a,
    { sepCol: n }
  );

  //прямой ход
  for (let k = 0; k < n; k++) {
    pushStep(
      "<strong>Итерация " + (k + 1) + ":</strong> обрабатываем столбец " + (k + 1),
      a,
      { pr: [k, k], sepCol: n }
    );

    let pr = k;
    let best = Math.abs(a[k][k]);
    for (let i = k + 1; i < n; i++) {
      const v = Math.abs(a[i][k]);
      if (v > best) {
        best = v;
        pr = i;
      }
    }

    if (nearlyZero(a[pr][k])) {
      pushStep(
        "❌Pivot ≈ 0 → система вырождена",
        a,
        { pr: [k, k], sepCol: n }
      );
      break;
    }

    if (pr !== k) {
      const tmp = a[k];
      a[k] = a[pr];
      a[pr] = tmp;

      pushStep("Меняем строки " + (k + 1) + " ↔ " + (pr + 1), a, { pr: [k, k], sepCol: n });
    } else {
      pushStep("✅Pivot = " + a[k][k].toFixed(4), a, { pr: [k, k], sepCol: n });
    }

    let hadZero = true;
    for (let i = k + 1; i < n; i++) {
      if (nearlyZero(a[i][k])) continue;

      hadZero = false;
      const factor = a[i][k] / a[k][k];

      pushStep(
        "Зануляем a[" + (i + 1) + "," + (k + 1) + "]: R" + (i + 1) + " -= (" + factor.toFixed(4) + ") × R" + (k + 1),
        a,
        { pr: [k, k], hr: i, sepCol: n }
      );

      for (let j = k; j < m; j++) {
        a[i][j] -= factor * a[k][j];
      }

      pushStep("✔️ Строка " + (i + 1) + " обновлена", a, { pr: [k, k], hr: i, sepCol: n });
    }

    if (hadZero) {
      pushStep("Под pivot уже нули", a, { pr: [k, k], sepCol: n });
    }
  }

  pushStep("🔼 Прямой ход завершён", a, { sepCol: n });

  // проверка противоречий
  for (let i = 0; i < n; i++) {
    let allZero = true;
    for (let j = 0; j < n; j++) {
      if (!nearlyZero(a[i][j])) {
        allZero = false;
        break;
      }
    }
    if (allZero && !nearlyZero(a[i][n])) {
      st.ans =
        "<h3>⛔Результат</h3>" +
        "<p><strong>Система несовместна (нет решений)</strong></p>" +
        "<p class='small'>Строка вида 0 = " + a[i][n].toFixed(4) + "</p>";
      st.i = 0;
      renderStep();
      return;
    }
  }

  pushStep("✅Противоречий нет. Обратный ход:", a, { sepCol: n });

  //обратный ход
  const x = new Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    if (nearlyZero(a[i][i])) {
      st.ans =
        "<h3>❗Результат</h3>" +
        "<p><strong>Бесконечно много решений</strong></p>" +
        "<p class='small'>Нулевой pivot на диагонали</p>";
      st.i = 0;
      renderStep();
      return;
    }

    let s = a[i][n];
    let details = "";

    if (i < n - 1) {
      details = "<br>Подставляем найденные x: ";
      for (let j = i + 1; j < n; j++) {
        s -= a[i][j] * x[j];
        if (j > i + 1) details += " + ";
        details += "(" + a[i][j].toFixed(4) + ")×(" + x[j].toFixed(6) + ")";
      }
      details += " = " + s.toFixed(4);
    } else {
      details = "<br>Последняя строка: x = b / a";
    }

    x[i] = s / a[i][i];

    pushStep(
      "<strong>x" + (i + 1) + " = " + x[i].toFixed(6) + "</strong>" + details,
      a,
      { pr: [i, i], sepCol: n }
    );
  }

  pushStep("🎉Обратный ход завершён", a, { sepCol: n });

  //проверка
  const chk = [];
  for (let i = 0; i < n; i++) {
    let left = 0;
    for (let j = 0; j < n; j++) left += A[i][j] * x[j];
    chk.push({ left: left, right: A[i][n], diff: left - A[i][n] });
  }

  let out = "<h3>✅Решение</h3>";
  for (let i = 0; i < n; i++) {
    out += "<p><strong>x" + (i + 1) + " = " + x[i].toFixed(6) + "</strong></p>";
  }

  out += "<hr><h3>🔍 Проверка</h3>";
  out += "<div class='small' style='font-family:monospace'>";
  for (let i = 0; i < n; i++) {
    const ok = Math.abs(chk[i].diff) < 1e-6;
    out +=
      "Строка " + (i + 1) + ": A·x = " + chk[i].left.toFixed(6) +
      ", b = " + chk[i].right.toFixed(6) +
      ", разница = " + chk[i].diff.toFixed(6) + " " +
      (ok ? "✅" : "❗") + "<br>";
  }
  out += "</div>";

  st.ans = out;
  st.i = 0;
  renderStep();
}

//случайная матрица (для тестов)
function randomMatrixA() {
  const A = getMatrix("A", "rowsA", "colsA");
  if (!A) {
    showError("Сначала создайте матрицу A");
    return;
  }
  
  const rows = readInt("rowsA");
  const cols = readInt("colsA");
  
  //заполняем случайными числами
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const val = Math.floor(Math.random() * 21) - 10;
      const inp = document.getElementById("A-" + i + "-" + j);
      if (inp) inp.value = val;
    }
  }
  
  clearSteps();
  setResultHTML("<p>✅Матрица A заполнена случайными числами</p>");
}

function randomMatrixB() {
  const B = getMatrix("B", "rowsB", "colsB");
  if (!B) {
    showError("Сначала создайте матрицу B");
    return;
  }
  
  const rows = readInt("rowsB");
  const cols = readInt("colsB");
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const val = Math.floor(Math.random() * 21) - 10;
      const inp = document.getElementById("B-" + i + "-" + j);
      if (inp) inp.value = val;
    }
  }
  
  clearSteps();
  setResultHTML("<p>✅Матрица B заполнена случайными числами</p>");
}
//Инициализация при загрузке страницы (один раз)
window.addEventListener("load", function() {
  createMatrixA();
  createMatrixB();
});

//совместимость с кнопками из index.html
function multiplyMatrices() {
  mult();
}

function calculateDeterminant() {
  det();
}