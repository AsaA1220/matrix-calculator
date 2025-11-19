function createMatrix() {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);

  if (rows < 1 || rows > 10 || cols < 1 || cols > 10) {
    alert('Размер матрицы должен быть от 1 до 10');
    return;
  }
  const container = document.getElementById('matrix-container');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'matrix-table';
  for (let i = 0; i < rows; i++) { // исправил баг (было > )
    const row = table.insertRow();
    for (let j = 0; j  < cols; j++){
      const cell = row.insertCell();
      const input = document.createElement('input');
      input.type = 'number';
      input.id = `cell-${i}-${j}`;
      input.placeholder = '0';
      input.value = '0';
      cell.appendChild(input);
    }
  }
  container.appendChild(table);
}
//Вспомогательная функция
function getMat(){
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);

  let mat = [];
  for (let i = 0; i < rows; i++){
    let r = []; //строка матрицы
    for (let j = 0; j < cols; j++){
      const inp = document.getElementById('cell-${i}-${j}');
      if (!inp){
        alert('Сначало создайте матрицу');
        return null;
      }
      r.push(parseFloat(inp.value) || 0);
    }
    mat.push(r);
  }
  return mat;
}
//Результат
function Res(resMAt){
  const resDiv = document.getElementById('result');
  let hrtml = '<h2>Результат:</h2><table class="matrix-table">';

  for (let i = 0; i < resMAt.length; i++){
    html += '<tr>';
    for (let j = 0; j < resMat[i].length; j++){
      html += '<td>${resMat[i][j].toFixed(2)}</td>'; //должен быть два знака после запятой
    }
    html += '</tr>';
  }
  html += '</table>';
  resDiv.innerHTML = html;
}
//Транспонирвать
function transposeMatrix1(){
  const mat = getMat();
  if (!mat)return;

  let transp = [];
  const rows = mat.length;
  const cols = mat[0].length;
  for (let j = 0; j < cols; j++){
    let newR = [];
    for (let i = 0; i < rows; i++){
      newR.push(mat[i][j]);
    }
    transp.push(newR);
  }
  showRes(transp);
}
//Умножение
function multiplyByNumber() {
  const mat = getMat();
  if (!mat) return;
  const num = parseFloat(prompt('Введите число для умножения:'));
}