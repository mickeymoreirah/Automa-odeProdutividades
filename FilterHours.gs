function formatDateAndFilterHours() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  
  //Encontrar a coluna com o cabeçalho "DATA",se der erro verificar se o nome da coluna está certo
  var headerRow = data[0];
  var dateColumnIndex = -1;
  for (var i = 0; i < headerRow.length; i++) {
    if (String(headerRow[i]).toUpperCase() === "DATA") {
      dateColumnIndex = i;
      break;
    }
  }
  if (dateColumnIndex === -1) {
    throw new Error("Coluna 'DATA' não encontrada no cabeçalho.");
  }
  
  // Log para depuração
  Logger.log("Coluna 'DATA' encontrada na posição: " + dateColumnIndex);(pode ser removido após verificar que o codigo funciona,para melhorar a velocidade de execução)
  
  //Obter a data atual e anterior
  var today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar para 00:00:00 do dia atual (21/07/2025)
  var yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Dia anterior (20/07/2025)
  
  // Log para depuração
  Logger.log("Data atual: " + today.toLocaleDateString("pt-BR"));
  Logger.log("Data anterior: " + yesterday.toLocaleDateString("pt-BR"));(pode ser removido após verificar que o codigo funciona,para melhorar a velocidade de execução)
  
  // Filtrar linhas: manter 00h-05h do dia atual e 22h-23h do dia anterior
  var filteredData = [];
  filteredData.push(data[0]); // Manter o cabeçalho original
  
  for (var i = 1; i < data.length; i++) {
    var date = data[i][dateColumnIndex]; // Coluna "DATA"
    
    // Extrair a hora diretamente com JavaScript
    var hour = date instanceof Date ? date.getHours() : null;
    
    // Log para depuração
    Logger.log("Linha " + (i + 1) + ": Data = " + (date instanceof Date ? date.toLocaleString("pt-BR") : "Não é data") + ", Hora = " + hour);(pode ser removido após verificar que o codigo funciona,para melhorar a velocidade de execução)
    
    if (date instanceof Date && hour !== null) {
      var dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Manter linhas do dia atual com horas 00h a 05h
      if (dateOnly.getTime() === today.getTime() && hour >= 0 && hour <= 5) {
        filteredData.push(data[i]);
        Logger.log("Incluído: Dia atual, hora " + hour);
      }
      // Manter linhas do dia anterior com horas 22h ou 23h
      else if (dateOnly.getTime() === yesterday.getTime() && (hour === 22 || hour === 23)) {
        filteredData.push(data[i]);
        Logger.log("Incluído: Dia anterior, hora " + hour);
      } else {
        Logger.log("Ignorado: Fora do intervalo de horas na linha " + (i + 1));
      }
    } else {
      Logger.log("Ignorado: Data inválida na linha " + (i + 1));
    }
  }
  
  // Log para depuração
  Logger.log("Total de linhas filtradas (incluindo cabeçalho): " + filteredData.length);(pode ser removido após verificar que o codigo funciona,para melhorar a velocidade de execução)
  
  // Limpar a planilha e redimensionar para o número correto de colunas
  sheet.clear();
  if (filteredData.length > 0) {
    // Ajustar a planilha para ter o número correto de colunas
    if (sheet.getMaxColumns() < filteredData[0].length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), filteredData[0].length - sheet.getMaxColumns());
    }
    
    // Escrever os dados filtrados
    sheet.getRange(1, 1, filteredData.length, filteredData[0].length).setValues(filteredData);
  } else {
    Logger.log("Nenhum dado filtrado. A planilha permanecerá vazia (apenas com cabeçalhos).");
  }
}
