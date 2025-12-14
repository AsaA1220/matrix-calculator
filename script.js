//Утилиты
function readInt(id) {
  return parseInt(document.getElementById(id).value, 10);
}

function nearlyZero(x) {
  return Math.abs(x) < 1e-10;
}

function clone2D(a) {
  return a.map(row => row.slice());
}

function setResultHTML(html) {
  document.getElementById('result-output').innerHTML = html;
}

function showMatrix(mat) {
  let html = '<table class="matrix-table">';
  for (let i = 0; i < mat.length; i++) {
    html += '<tr>';
    for (let j = 0; j < mat[i].length; j++) {
      const v = mat[i][j];
      html += '<td>' + (Number.isFinite(v) ? v.toFixed(4) : String(v)) + '</td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  setResultHTML(html);
}

function createMatrix(containerId, rowsId, colsId, prefix) {
  const rows = readInt(rowsId);
  const cols = readInt(colsId);

  if (rows < 1 || rows > 10 || cols < 1 || cols > 10) {
    alert('Размер матрицы должен быть от 1 до 10');
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'matrix-table';

  for (let i = 0; i < rows; i++) {
    const tr = table.insertRow();
    for (let j = 0; j < cols; j++) {
      const td = tr.insertCell();
      const input = document.createElement('input');
      input.type = 'number';
      input.step = 'any';
      input.value = '0';
      input.id = prefix + '-' + i + '-' + j;
      td.appendChild(input);
    }
  }

  container.appendChild(table);
}

function getMatrix(prefix, rowsId, colsId) {
  const rows = readInt(rowsId);
  const cols = readInt(colsId);
  const mat = [];

  for (let i = 0; i < rows; i++) {
    const r = [];
    for (let j = 0; j < cols; j++) {
      const inp = document.getElementById(prefix + '-' + i + '-' + j);
      if (!inp) {
        return null;
      }
      r.push(parseFloat(inp.value) || 0);
    }
    mat.push(r);
  }
  return mat;
}

//Создание матриц

function createMatrixA() {
  createMatrix('matrixA-container', 'rowsA', 'colsA', 'A');
}

function createMatrixB() {
  createMatrix('matrixB-container', 'rowsB', 'colsB', 'B');
}

function clearAll() {
  document.getElementById('matrixA-container').innerHTML = '';
  document.getElementById('matrixB-container').innerHTML = '';
  setResultHTML('');

  document.getElementById('rowsA').value = '3';
  document.getElementById('colsA').value = '3';
  document.getElementById('rowsB').value = '3';
  document.getElementById('colsB').value = '3';
}

//Операции

function add() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  const B = getMatrix('B', 'rowsB', 'colsB');
  if (!A || !B) {
    alert('Сначала создайте матрицы A и B');
    return;
  }

  const rA = A.length, cA = A[0].length;
  const rB = B.length, cB = B[0].length;

  if (rA !== rB || cA !== cB) {
    alert('Для сложения размеры A и B должны совпадать');
    return;
  }

  const R = [];
  for (let i = 0; i < rA; i++) {
    const row = [];
    for (let j = 0; j < cA; j++) {
      row.push(A[i][j] + B[i][j]);
    }
    R.push(row);
  }

  showMatrix(R);
}

function subtract() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  const B = getMatrix('B', 'rowsB', 'colsB');
  if (!A || !B) {
    alert('Сначала создайте матрицы A и B');
    return;
  }

  const rA = A.length, cA = A[0].length;
  const rB = B.length, cB = B[0].length;

  if (rA !== rB || cA !== cB) {
    alert('Для вычитания размеры A и B должны совпадать');
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

  showMatrix(R);
}

function multiplyMatrices() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  const B = getMatrix('B', 'rowsB', 'colsB');
  if (!A || !B) {
    alert('Сначала создайте матрицы A и B');
    return;
  }

  const rA = A.length, cA = A[0].length;
  const rB = B.length, cB = B[0].length;

  if (cA !== rB) {
    alert('Для умножения нужно: столбцы A = строки B');
    return;
  }

  const R = [];
  for (let i = 0; i < rA; i++) {
    const row = [];
    for (let j = 0; j < cB; j++) {
      let s = 0;
      for (let k = 0; k < cA; k++) {
        s += A[i][k] * B[k][j];
      }
      row.push(s);
    }
    R.push(row);
  }

  showMatrix(R);
}

function transposeA() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  if (!A) {
    alert('Сначала создайте матрицу A');
    return;
  }

  const r = A.length;
  const c = A[0].length;
  const T = [];

  for (let j = 0; j < c; j++) {
    const row = [];
    for (let i = 0; i < r; i++) {
      row.push(A[i][j]);
    }
    T.push(row);
  }

  showMatrix(T);
}

function multiplyScalarA() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  if (!A) {
    alert('Сначала создайте матрицу A');
    return;
  }

  let num = prompt('Введите число:');
  if (num === null) return;

  num = parseFloat(num);
  if (isNaN(num)) {
    alert('Некорректное число');
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

  showMatrix(R);
}

//det и rank (через приведение к ступенчатому виду)

function calculateDeterminant() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  if (!A) {
    alert('Сначала создайте матрицу A');
    return;
  }

  const n = A.length;
  const m = A[0].length;
  if (n !== m) {
    alert('Определитель считается только для квадратной матрицы');
    return;
  }

  //det через Гаусса без деления строк (только зануление ниже диагонали)
  const a = clone2D(A);
  let swaps = 0;

  for (let k = 0; k < n; k++) {
    //Частичный выбор главного элемента
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
      setResultHTML('<p><strong>Определитель:</strong> 0</p>');
      return;
    }

    if (pivotRow !== k) {
      const tmp = a[k];
      a[k] = a[pivotRow];
      a[pivotRow] = tmp;
      swaps++;
    }

    for (let i = k + 1; i < n; i++) {
      const factor = a[i][k] / a[k][k];
      for (let j = k; j < n; j++) {
        a[i][j] -= factor * a[k][j];
      }
    }
  }

  let det = (swaps % 2 === 0) ? 1 : -1;
  for (let i = 0; i < n; i++) det *= a[i][i];

  setResultHTML('<p><strong>Определитель:</strong> ' + det.toFixed(6) + '</p>');
}

function Rank() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  if (!A) {
    alert('Сначала создайте матрицу A');
    return;
  }

  const a = clone2D(A);
  const rows = a.length;
  const cols = a[0].length;

  let rank = 0;
  let r = 0;

  for (let c = 0; c < cols && r < rows; c++) {
    //Ищем строку с максимальным pivot в колонке c
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
      continue;
    }

    if (pivot !== r) {
      const tmp = a[r];
      a[r] = a[pivot];
      a[pivot] = tmp;
    }

    //Зануляем ниже
    for (let i = r + 1; i < rows; i++) {
      const factor = a[i][c] / a[r][c];
      for (let j = c; j < cols; j++) {
        a[i][j] -= factor * a[r][j];
      }
    }

    rank++;
    r++;
  }

  setResultHTML('<p><strong>Ранг:</strong> ' + rank + '</p>');
}

//Метод СЛАУ (A как расширенная n×(n+1))

function Gauss() {
  const A = getMatrix('A', 'rowsA', 'colsA');
  if (!A) {
    alert('Сначала создайте матрицу A');
    return;
  }

  const n = A.length;
  const m = A[0].length;

  if (m !== n + 1) {
    alert('Для СЛАУ матрица A должна быть размера n*(n+1)');
    return;
  }

  const a = clone2D(A);
  let steps = '<h3>Шаги (коротко):</h3>';

  //Прямой ход
  for (let k = 0; k < n; k++) {
    //Пивот
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
      steps += '<p>На шаге ' + (k + 1) + ' ведущий элемент почти 0 -> система может не иметь единственного решения.</p>';
      break;
    }

    if (pivotRow !== k) {
      const tmp = a[k];
      a[k] = a[pivotRow];
      a[pivotRow] = tmp;
      steps += '<p>Переставили строки ' + (k + 1) + ' и ' + (pivotRow + 1) + '</p>';
    }

    //Зануляем ниже
    for (let i = k + 1; i < n; i++) {
      const factor = a[i][k] / a[k][k];
      for (let j = k; j < m; j++) {
        a[i][j] -= factor * a[k][j];
      }
    }
  }

  //Проверка на противоречие: 0 0 ... 0 | b (b != 0)
  for (let i = 0; i < n; i++) {
    let allZero = true;
    for (let j = 0; j < n; j++) {
      if (!nearlyZero(a[i][j])) {
        allZero = false;
        break;
      }
    }
    if (allZero && !nearlyZero(a[i][n])) {
      setResultHTML(steps + '<h3>Ответ:</h3><p><strong>Нет решений</strong> (получили строку 0 = ' + a[i][n].toFixed(4) + ')</p>');
      return;
    }
  }

  //Обратный ход (если pivot на диагонали есть)
  const x = new Array(n).fill(0);

  for (let i = n - 1; i >= 0; i--) {
    if (nearlyZero(a[i][i])) {
      setResultHTML(steps + '<h3>Ответ:</h3><p><strong>Бесконечно много решений</strong> (есть нулевой pivot на диагонали)</p>');
      return;
    }

    let s = a[i][n];
    for (let j = i + 1; j < n; j++) {
      s -= a[i][j] * x[j];
    }
    x[i] = s / a[i][i];
  }

  let out = steps + '<h3>Ответ:</h3>';
  for (let i = 0; i < n; i++) {
    out += '<p>x' + (i + 1) + ' = ' + x[i].toFixed(6) + '</p>';
  }

  setResultHTML(out);
}