function createMatrix() {
  var rows = parseInt(document.getElementById('rows').value);
  var cols = parseInt(document.getElementById('cols').value);

  if (rows < 1 || rows > 10 || cols < 1 || cols > 10) {
    alert('Размер матрицы должен быть от 1 до 10');
    return;
  }

  let container = document.getElementById('matrix-container');
  container.innerHTML = '';

  var table = document.createElement('table');
  table.className = 'matrix-table';

  for (var i = 0; i < rows; i++) {
    let row = table.insertRow();
    for (var j = 0; j < cols; j++) {
      var cell = row.insertCell();
      let input = document.createElement('input');
      input.type = 'number';
      input.id = 'cell-' + i + '-' + j;
      input.placeholder = '0';
      input.step = 'any';
      cell.appendChild(input);
    }
  }

  container.appendChild(table);
}

//Читаем матрицу
function getMat() {
  let rows = parseInt(document.getElementById('rows').value);
  let cols = parseInt(document.getElementById('cols').value);
  var mat = [];

  for (var i = 0; i < rows; i++) {
    var r = [];
    for (var j = 0; j < cols; j++) {
      const inp = document.getElementById('cell-' + i + '-' + j);
      if (!inp) {
        alert('Сначала создайте матрицу');
        return null;
      }
      r.push(parseFloat(inp.value) || 0);
    }
    mat.push(r);
  }
  return mat;
}

//Показать результат
function showRes(mat) {
  let resDiv = document.getElementById('result-output');
  var html = '<table class="matrix-table">';

  for (var i = 0; i < mat.length; i++) {
    html += '<tr>';
    for (var j = 0; j < mat[i].length; j++) {
      html += '<td>' + mat[i][j].toFixed(2) + '</td>';
    }
    html += '</tr>';
  }
  html += '</table>';

  resDiv.innerHTML = html;
}

//Транспонировать
function transpose() {
  var mat = getMat();
  if (!mat) return;

  var rows = mat.length;
  var cols = mat[0].length;
  var result = [];

  for (var i = 0; i < cols; i++) {
    var r = [];
    for (var j = 0; j < rows; j++) {
      r.push(mat[j][i]);
    }
    result.push(r);
  }

  showRes(result);
}

//Умножение на число
function multiply() {
  var mat = getMat();
  if (!mat) return;

  let num = prompt('Введите число для умножения:');
  if (num === null) return;

  num = parseFloat(num);
  if (isNaN(num)) {
    alert('Неверное число');
    return;
  }

  var result = [];
  for (var i = 0; i < mat.length; i++) {
    var r = [];
    for (var j = 0; j < mat[i].length; j++) {
      r.push(mat[i][j] * num);
    }
    result.push(r);
  }

  showRes(result);
}

//Определитель (только для 2x2 и 3x3)
function calculateDeterminant() {
  var mat = getMat();
  if (!mat) return;

  var n = mat.length;
  var m = mat[0].length;

  if (n !== m) {
    alert('Матрица должна быть квадратной');
    return;
  }

  var det = 0;

  if (n === 2) {
    det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
  } else if (n === 3) {
    det = mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
          mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
          mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
  } else {
    alert('Определитель можно вычислить только для матриц 2x2 и 3x3');
    return;
  }

  document.getElementById('result-output').innerHTML = '<p><strong>Определитель:</strong> ' + det.toFixed(2) + '</p>';
}

//Метод Гаусса
function gauss() {
  var mat = getMat();
  if (!mat) return;

  var n = mat.length;
  var m = mat[0].length;

  if (m !== n + 1) {
    alert('Для СЛАУ создайте расширенную матрицу размером n×(n+1)');
    return;
  }

  //Копируем матрицу
  var a = [];
  for (var i = 0; i < n; i++) {
    a[i] = [];
    for (var j = 0; j < m; j++) {
      a[i][j] = mat[i][j];
    }
  }

  var steps = '<h3>Шаги решения:</h3>';

  //Прямой ход
  for (var k = 0; k < n; k++) {
    //Поиск главного элемента
    var maxRow = k;
    for (var i = k + 1; i < n; i++) {
      if (Math.abs(a[i][k]) > Math.abs(a[maxRow][k])) {
        maxRow = i;
      }
    }

    //Перестановка строк
    if (maxRow !== k) {
      var temp = a[k];
      a[k] = a[maxRow];
      a[maxRow] = temp;
      steps += '<p>Переставили строки ' + (k + 1) + ' и ' + (maxRow + 1) + '</p>';
    }

    //Проверка на ноль
    if (Math.abs(a[k][k]) < 0.0001) {
      alert('Система не имеет единственного решения');
      return;
    }

    //Деление строки на главный элемент
    var div = a[k][k];
    steps += '<p>Шаг ' + (k + 1) + ': Делим строку ' + (k + 1) + ' на ' + div.toFixed(2) + '</p>';
    for (var j = k; j < m; j++) {
      a[k][j] = a[k][j] / div;
    }

    //Вычитание из нижних строк
    for (var i = k + 1; i < n; i++) {
      var factor = a[i][k];
      steps += '<p>Вычитаем из строки ' + (i + 1) + ' строку ' + (k + 1) + ' умноженную на ' + factor.toFixed(2) + '</p>';
      for (var j = k; j < m; j++) {
        a[i][j] = a[i][j] - factor * a[k][j];
      }
    }
  }

  //Обратный ход
  var x = [];
  for (var i = n - 1; i >= 0; i--) {
    x[i] = a[i][m - 1];
    for (var j = i + 1; j < n; j++) {
      x[i] = x[i] - a[i][j] * x[j];
    }
  }

  steps += '<h3>Решение:</h3>';
  for (var i = 0; i < n; i++) {
    steps += '<p>x' + (i + 1) + ' = ' + x[i].toFixed(4) + '</p>';
  }

  document.getElementById('result-output').innerHTML = steps;
}
function clearAll() {
  document.getElementById('matrix-container').innerHTML = '';
  document.getElementById('result-output').innerHTML = '';
  document.getElementById('rows').value = '2';
  document.getElementById('cols').value = '2';
}
