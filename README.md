# Filtro de Produtividade T3

## Visão Geral
Este repositório contém um script em Google Apps Script (`FilterHours.gs`) projetado para facilitar o acompanhamento da produtividade do turno T3 (22:00 às 06:00). O script filtra dados em uma planilha do Google Sheets, mantendo apenas os registros das 22:00 às 23:59 do dia anterior e das 00:00 às 05:59 do dia atual, com base em uma coluna chamada "DATA". Isso ajuda a monitorar a produtividade de atividades realizadas durante o turno T3, como movimentações de estoque ou outras tarefas.

## Conformidade com a LGPD
Embora este script não manipule diretamente dados pessoais, ele foi projetado para operar em planilhas que podem conter informações sensíveis. Para garantir conformidade com a **Lei Geral de Proteção de Dados (LGPD)**, este repositório não inclui planilhas, IDs de planilhas ou dados reais. Qualquer dado de exemplo ou configuração mencionada é fictício, e recomenda-se que os usuários protejam suas planilhas de acordo com as diretrizes da LGPD ao implementar este script.

## Estrutura do Projeto
- **`FilterHours.gs`**: Contém o script Google Apps Script (extensão .gs) com a função `formatDateAndFilterHours`, que:
  - Localiza a coluna "DATA" na planilha.
  - Filtra linhas com base nas horas do turno T3 (22:00–23:59 do dia anterior e 00:00–05:59 do dia atual).
  - Limpa a planilha e reescreve apenas os dados filtrados.
- **`.gitignore`**: Especifica arquivos e diretórios a serem ignorados pelo Git, como configurações sensíveis (ex.: `appsscript.json`), arquivos de dados (ex.: `.csv`, `.xlsx`) e arquivos temporários, para proteger dados e manter o repositório limpo.

## Como Usar
1. **Configurar a Planilha**:
   - Crie uma planilha no Google Sheets com uma coluna chamada "DATA" contendo valores de data e hora (ex.: "13/09/2025 01:00:00").
   - Outras colunas podem incluir dados de produtividade (ex.: tarefas concluídas, quantidades).
2. **Configurar o Google Apps Script**:
   - Crie um novo projeto no Google Apps Script (acessível em script.google.com).
   - Crie um arquivo chamado `FilterHours.gs` e cole o conteúdo do script.
3. **Executar o Script**:
   - No editor do Apps Script, selecione a função `formatDateAndFilterHours` e clique em **Executar**.
   - O script limpará a planilha ativa e manterá apenas:
     - Linhas do dia atual (00:00 às 05:59).
     - Linhas do dia anterior (22:00 às 23:59).
   - Verifique os logs (menu **Exibir** > **Logs**) para depuração, como erros de "Coluna 'DATA' não encontrada" ou linhas ignoradas.
4. **Configurar um Gatilho (Opcional)**:
   - Para executar automaticamente (ex.: diariamente), clique em **Gatilhos** > **Adicionar gatilho**.
   - Configure a função `formatDateAndFilterHours` para rodar em um horário específico (ex.: após o turno T3).

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

