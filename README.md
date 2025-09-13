# Filtro de Produtividade T3 para sistema senior e Atualizador Mensal

## Visão Geral
Este repositório contém scripts em Google Apps Script para automação de relatórios de produtividade:
1. **Filtro de Produtividade T3** (`FilterHours.gs`): Filtra dados em uma planilha do Google Sheets para o turno T3 (22:00 às 06:00), mantendo registros das 22:00 às 23:59 do dia anterior e das 00:00 às 05:59 do dia atual, com base em uma coluna chamada "DATA". Isso ajuda a monitorar a produtividade de atividades durante o turno T3.
2. **Atualizador de Produtividade Mensal** (`MonthlyProductivity.gs`): Atualiza uma planilha mensal de produtividade com somas de quantidades separadas por matrícula, extraídas de uma planilha diária de picking. Os dados são adicionados na próxima coluna em branco (a partir da coluna C), mantendo a formatação da coluna anterior. Com um gatilho de tempo ou de atualização, o script pode preencher a planilha mensal automaticamente, assumindo que ambas as planilhas tenham uma coluna de matrículas.
   
## Conformidade com a LGPD
Embora este script não manipule diretamente dados pessoais, ele foi projetado para operar em planilhas que podem conter informações sensíveis. Para garantir conformidade com a **Lei Geral de Proteção de Dados (LGPD)**, este repositório não inclui planilhas, IDs de planilhas ou dados reais. Qualquer dado de exemplo ou configuração mencionada é fictício, e recomenda-se que os usuários protejam suas planilhas de acordo com as diretrizes da LGPD ao implementar este script.

## Estrutura do Projeto
- **`FilterHours.gs`**: Script para filtrar dados de produtividade do turno T3 (22:00 às 06:00). Filtra linhas na planilha com base na coluna "DATA", mantendo registros das 22:00 às 23:59 do dia anterior e das 00:00 às 05:59 do dia atual.
- **`MonthlyProductivity.gs`**: Script para atualizar a planilha mensal de produtividade. Soma quantidades por matrícula da planilha de picking e adiciona os totais na próxima coluna vazia da planilha mensal, copiando a formatação da coluna anterior.
  
## script de produtividade para o t3,como usar:
1. **Configurar a Planilha**:
   - Baixe o arquivo de produtividade da aréa através do sistema senior ou outro site da sua empresa(pode ser necessário alterar nome da coluna de data para DATA(case sensitive),ou alterar a linha do nome da coluna dentro do script)importe para o Google Sheets,valide se há uma coluna chamada "DATA" contendo valores de data e hora (ex.: "13/09/2025 01:00:00").
   - Outras colunas podem incluir dados de produtividade (ex.: tarefas concluídas, quantidades).
3. **Configurar o GApS**:
   - Crie um novo projeto no Google Apps Script (acessível em script.google.com).
   - Crie um arquivo chamado `FilterHours.gs` e cole o conteúdo do script.
4. **Executar o Script**:
   - No editor do Apps Script, selecione a função `formatDateAndFilterHours` e clique em **Executar**.
   - O script limpará a planilha ativa e manterá apenas:
     - Linhas do dia atual (00:00 às 05:59).
     - Linhas do dia anterior (22:00 às 23:59).
   - Verifique os logs (menu **Exibir** > **Logs**) para depuração, como erros de "Coluna 'DATA' não encontrada" ou linhas ignoradas.
5. **Configurar um Gatilho (Opcional)**:
   - Para executar automaticamente (ex.: diariamente), clique em **Gatilhos** > **Adicionar gatilho**.
   - Configure a função `formatDateAndFilterHours` para rodar em um horário específico (ex.: após o turno T3/ou de hora em hora).
  
   - ### Atualizador de Produtividade Mensal
1. **Configurar as Planilhas**:
   - **Planilha de Picking**: Crie ou use uma planilha com abas como "picking", contendo colunas "id do Separador" (matrícula) e "Qtia. Separada" (quantidade).
   - **Planilha Mensal**: Crie ou use uma planilha com abas com o nome o "prod mes", contendo uma coluna "Matrícula" (a partir da linha 2) e colunas vazias a partir da C para os dados mensais.
   - Feito da forma correta é possivel alterar todo começo de mes o nome da aba,para refletir qual mês está sendo atualizado(janeiro,fevereiro,março,abril,etc...) usando gatilhos de edição para não precisar rodar o codigo manualmente toda vez.
2. **Configurar o Google Apps Script**:
   - No mesmo projeto ou em um novo, crie um arquivo chamado `MonthlyProductivity.gs` e cole o conteúdo do script.
   - Substitua os IDs fictícios das planilhas (`pickingSpreadsheetId` e `mensalSpreadsheetId`) pelos IDs reais das suas planilhas.
   - Ajuste nomes de abas e colunas conforme necessário (ex.: `pickingSheetName`, `mensalSheetName`).
3. **Executar o Script**:
   - Selecione a função `atualizarProdutividadeMensal` e clique em **Executar**.
   - O script somará quantidades por matrícula da planilha de picking e adicionará os totais na próxima coluna vazia (a partir da C) da planilha mensal, preenchendo 0 para matrículas sem dados.
   - Verifique os logs para confirmar a coluna adicionada (ex.: "Próxima coluna vazia: D").
4. **Automatizar com Gatilhos**:
   - Para atualização automática diária, adicione um gatilho de tempo (ex.: diariamente às 06:00, após o turno T3).
   - Para atualização em tempo real, adicione um gatilho de edição na planilha de picking (clique em **Gatilhos** > **Adicionar gatilho** > Fonte: Da planilha > Evento: Na edição).
   - Isso fará com que a planilha mensal seja preenchida automaticamente na próxima coluna em branco, desde que haja colunas de matrículas em ambas.

## Adaptando para Outros Turnos
O script filtra dados para o turno T3 (22:00 às 06:00). Para adaptá-lo a outros turnos, modifique as condições de filtragem de horas na função `formatDateAndFilterHours`. Localize as linhas:

```javascript
// Manter linhas do dia atual com horas 00h a 05h
if (dateOnly.getTime() === today.getTime() && hour >= 0 && hour <= 5) {
  filteredData.push(data[i]);
  Logger.log("Incluído: Dia atual, hora " + hour);
}
// Manter linhas do dia anterior com horas 22h ou 23h
else if (dateOnly.getTime() === yesterday.getTime() && (hour === 22 || hour === 23)) {
  filteredData.push(data[i]);
  Logger.log("Incluído: Dia anterior, hora " + hour);
}

A coluna "DATA" deve conter valores de data/hora válidos. Se o nome da coluna for diferente (ex.: "Data e Hora"), atualize a condição String(headerRow[i]).toUpperCase() === "DATA" no script.
Use os logs do Apps Script para diagnosticar erros, como linhas com datas inválidas ou coluna "DATA" não encontrada.
Para proteger dados sensíveis na planilha, configure permissões restritas no Google Sheets e evite compartilhar IDs de planilhas no repositório.

