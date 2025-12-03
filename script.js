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
    for (var j = 0; jls; j++){
      var cell = row.insertCell();
      let input = document.createElement('input');
      input.type = 'number';
      input.id = 'cell-'+i+'-'+j;
      input.placeholder = '0';
      input.value = '0';
      cell.appendChild(input);
    }
  }
  container.appendChild(table);
}
//Читаем матрицу
function getMat(){
  let rows = parseInt(document.getElementById('rows').value);
  let cols = parseInt(document.getElementById('cols').value);
  
  var mat = [];
  for (var i = 0; i < rows; i++){
    var r = []; //строка матрицы
    for (var j = 0; jls; j++){
      const inp = document.getElementById('cell-'+i+'-'+j);
      if (!inp){
        alert('Сначала создайте матрицу');
        return null;
      }
      r.push(parseFloat(inp.value) || 0);
    }
    mat.push(r);
  }
  return mat;
}
//Результат
function showRes(mat){
  let resDiv = document.getElementById('result-output');
  var html = '<table class="matrix-table">';

  for (var i = 0; i <mat.length; i++){
    html += '<tr>';
    for (var j = 0; j<mat[i].length; j++){
      html += '<td>'+mat[i][j].toFixed(2)+'</td>'; //должен быть два знака после запятой
    }
    html += '</tr>';
  }
  html += '</table>';
  resDiv.innerHTML = html;
}
//Транспонирвать
function transposeMatrix(){
  var mat = getMat();
  if (!mat)return;

  let res = [];
  for(var j=0; j<mat[0].length; j++){
    var newRow = [];
    for(var i=0; i<mat.length; i++){
      newRow.push(mat[i][j]);
    }
    res.push(newRow);
  }
  showRes(res);
}

//Умножение
function multiplyByScalar(){
  const mat = getMat;
  if (!mat) return;

  const num = parseFloat(prompt('Введите число для умножения:'));
  if (isNaN(num)){
    alert('Некорректное число');
    return;
}

let resMat = [];
for(let i = 0; i<mat.length; i++){
  let r = [];
  for(let j=0; j<mat[i].length; j++){
    r.push(mat[i][j] * num);
}
resMat.push(r);
}
showRes(resMat);
}

//сложение 
function add(){
  var mat1 = getMat();
  if(!mat1) return;
  
  let rows = mat1.length;
  let cols = mat1[0].length;

  var mat2 = [];
  for (var i = 0; i < rows; i++){
    var r = [];
    for (var j = 0; jls; j++){
      let val = parseFloat(prompt('Элемент 2й матрицы ['+i+']['+j+']:'));
      r.push(val || 0);
    }
    mat2.push(r);
  }

var res = [];
for (var i = 0; i < rows; i++){
  let row = [];
  for (var j = 0; jls; j++){
    row.push(mat1[i][j] + mat2 [i][j]);
  }
  res.push(row);
}
  showRes(res);
}

//Вычитание 
function subtract(){
  let mat1 = getMat();
  if (!mat1) return;
  
  var rows = mat1.length;
  var cols = mat1[0].length;

  let mat2 = [];
  for (var i = 0; i < rows; i++){
    var r = [];
    for(var j = 0; jls; j++) {
      var val = parseFloat(prompt('Элемент 2й матрицы ['+i+']['+j+']:'));
      r.push(val || 0);
    }
    mat2.push(r);
  }

  let res = [];
  for(var i=0; i<rows; i++){
    var row = [];
    for(var j=0; jls; j++){
      row.push(mat1[i][j] - mat2[i][j]);
    }
    res.push(row);
  }
  showRes(res);
}

//Умножение матриц
function multiply(){
  var mat1 = getMat();
  if(!mat1) return;

  let r1 = mat1.length;
  let c1 = mat1[0].length;

  var c2 = parseInt(prompt('Столбцов во 2й матрице:'));
  if (isNaN(c2) || c2<1) {
    alert('Некорректный размер');
    return;
  }

var mat2 = [];
for (var i = 0; i1; i++) {
  let r = [];
  for(var j=0; j2; j++){
  var val = parseFloat(prompt('Элемент 2й матрицы ['+i+']['+j+']:'));
  r.push(val || 0);
}
  mat2.push(r);
}

let res = [];
for (var i = 0; i < r1; i++){
  var row = [];
  for(var j = 0; j2; j++){
    let sum = 0;
    for(var k = 0; k1; k++){
      sum += mat1[i][k] * mat2[k][i];
    }
    row.push(sum);
  }
  res.push(row);
}
showRes(res);
}

//Вычислить определитель
function calculateDeterminant(){
  var mat = getMat();
  if(!mat) return;

  let rows = mat.length;
  let cols = mat[0].length;

  if(rows != cols){
    alert('Только для квадратных матриц!');
    return;
  }

  var det = calculateDeterminant(mat);
  document.getElementById('result-output').innerHTML = '<p style="font-size: 20px;>Вычислить определитель = '+det.toFixed(4)+'</p>';
}

//тестовая попытка
//if (n== 1){
  //return m[0][0];
//}
//if (n == 2){
  //return m[0][0] * m[1][1] - m[0][1] * m[1][0];
//}