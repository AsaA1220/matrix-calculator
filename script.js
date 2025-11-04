function createMatrix() {
  const rows = parseint(document.getElementById('rows').value);
  const cols = parseint(document.getElementById('cols').value);

  if (rows < 1 || rows > 10 || cols < 1 || cols > 10) {
    alert('Размер матрицы должен быть оь 1 до 10');
    return;
  }
  const container = document.getElementById('matrix-container');
  container.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'matrix-table';
  
}

