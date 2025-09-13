function atualizarProdutividadeMensal() {
  // IDs das planilhas (substituir pelos IDs reais - valores fictícios para privacidade)
  const pickingSpreadsheetId = '1ABC123defGHI456jklMNO789pqrSTU'; // ID fictício da planilha "produtividade picking"
  const mensalSpreadsheetId = '2DEF456ghiJKL789mnoPQR012stuVWX';  // ID fictício da planilha "produtividade mensal"

  // Configurações (ajuste conforme necessário)
  const pickingSheetName = 'picking';                     // Nome da aba na planilha de picking
  const mensalSheetName = 'prodmensal';                      // Nome da aba na planilha mensal
  const matriculaColPicking = 'id colaborador';               // Nome da coluna de matrícula na picking
  const quantidadeColPicking = 'quantia sep';    // Nome da coluna de quantidade na picking
  const matriculaColMensal = 'Matrícula';                // Nome da coluna de matrícula na mensal

  // Acessar as planilhas
  const ssPicking = SpreadsheetApp.openById(pickingSpreadsheetId).getSheetByName(pickingSheetName);
  const ssMensal = SpreadsheetApp.openById(mensalSpreadsheetId).getSheetByName(mensalSheetName);

  if (!ssPicking || !ssMensal) {
    Logger.log('Erro: Uma das planilhas não foi encontrada.');
    return;
  }

  //dados da planilha de picking
  const pickingData = ssPicking.getDataRange().getValues();
  const pickingHeaders = pickingData[0];
  const matriculaIndexPicking = pickingHeaders.indexOf(matriculaColPicking);
  const quantidadeIndexPicking = pickingHeaders.indexOf(quantidadeColPicking);

  if (matriculaIndexPicking === -1 || quantidadeIndexPicking === -1) {
    Logger.log('Erro: Colunas ' + matriculaColPicking + ' ou ' + quantidadeColPicking + ' não encontradas na planilha de picking.');
    return;
  }

  // Soma de quantidades por matrícula
  const somaPorMatricula = {};
  for (let i = 1; i < pickingData.length; i++) {
    const matricula = pickingData[i][matriculaIndexPicking];
    const quantidade = Number(pickingData[i][quantidadeIndexPicking]) || 0;
    if (matricula) {
      somaPorMatricula[matricula] = (somaPorMatricula[matricula] || 0) + quantidade;
    }
  }

  //dados da planilha mensal
  const mensalData = ssMensal.getDataRange().getValues();
  const mensalHeaders = mensalData[0];
  const matriculaIndexMensal = mensalHeaders.indexOf(matriculaColMensal);

  if (matriculaIndexMensal === -1) {
    Logger.log('Erro: Coluna ' + matriculaColMensal + ' não encontrada na planilha mensal.');
    return;
  }

  if (mensalData.length < 2) {
    Logger.log('Erro: A planilha mensal não tem dados suficientes (necessita pelo menos cabeçalho e uma linha de dados).');
    return;
  }

  //Encontra a próxima coluna vazia (segunda linha em branco, a partir da coluna C)
  let nextColIndex = 3; // Começa da coluna C (índice 3, já que A=1, B=2)
  while (nextColIndex <= mensalHeaders.length && (mensalData[1][nextColIndex - 1] !== '' && mensalData[1][nextColIndex - 1] !== null)) {
    Logger.log('Coluna ' + String.fromCharCode(65 + nextColIndex - 1) + ' (índice ' + nextColIndex + ') tem dados na linha 2: ' + mensalData[1][nextColIndex - 1]);
    nextColIndex++;
  }

  // Verificar se nextColIndex excede o número de colunas
  const maxColumns = ssMensal.getMaxColumns();
  if (nextColIndex > maxColumns) {
    Logger.log('Aviso: Adicionando nova coluna à planilha mensal.');
    ssMensal.insertColumnAfter(maxColumns); // Adiciona uma nova coluna
  }

  const nextColLetter = String.fromCharCode(65 + nextColIndex - 1); // Converte índice para letra (ex: 22 -> V)
  Logger.log('Próxima coluna vazia: ' + nextColLetter + ' (índice: ' + nextColIndex + ')');

  // Passo 4: Copiar formatação da coluna anterior (se existir)
  if (nextColIndex > 3) {
    const prevColRange = ssMensal.getRange(1, nextColIndex - 1, ssMensal.getMaxRows(), 1);
    const nextColRange = ssMensal.getRange(1, nextColIndex, ssMensal.getMaxRows(), 1);
    prevColRange.copyFormatToRange(ssMensal, nextColIndex, nextColIndex, 1, ssMensal.getMaxRows());
  }

  // Passo 5: Atualizar a planilha mensal com as somas
  for (let i = 1; i < mensalData.length; i++) {
    const matricula = mensalData[i][matriculaIndexMensal];
    if (matricula && somaPorMatricula[matricula]) {
      ssMensal.getRange(i + 1, nextColIndex).setValue(somaPorMatricula[matricula]);
    } else {
      ssMensal.getRange(i + 1, nextColIndex).setValue(0); // Preenche 0 se não houver correspondência
    }
  }

  Logger.log('Atualização conclu
