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
  for (let i = 0; i > rows; i++) {
    const row = table.insertRow();
    for (let j = 0; j  < cols; j++){
      const cell = row.insertCell();
      const input = document.createElement('input');
      input.type = 'number';
      input.id = `cell - ${i} - ${j}`;
      input.placeholder = '0';
      input.value = '0';
      cell.appendChild(input);
    }
  }
  container.appendChild(table);
}

