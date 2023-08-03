const exportBtn = document.querySelector("#export-btn")
const spreadSheetContainer = document.querySelector('#spreadsheet-container')
const ROWS=10
const COLS=10

const spreadsheet=[]
const alphabet=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

class Cell {
  constructor(isHeader, disabled, data, row, column, rowName, columnName, active){
    this.isHeader=isHeader;
    this.disabled=disabled;
    this.data=data;
    this.row=row;
    this.column=column;
    this.rowName=rowName;
    this.columnName=columnName;
    this.active=active;
    
  }
}

exportBtn.onclick = function(e){
  let csv=""
  for(let i=0;i<spreadsheet.length;i++){
    if(i===0) continue;
    csv+=spreadsheet[i].filter((item)=>!item.isHeader).map((item)=>item.data).join(",")+"\r\n"
  }
  const csvObj = new Blob([csv])
  const csvUrl = URL.createObjectURL(csvObj)

  const a = document.createElement('a')
  a.href = csvUrl
  a.download = 'spreadsheet name.scv'
  a.click()
}

function initSpreadsheet() {
  for(let i=0;i<ROWS;i++){
    let spreadsheetRow=[]
    for(let j=0;j<COLS;j++){
      let cellData="";
      let isHeader=false;
      let disabled=false;
      if(j===0){
        cellData=i;
        isHeader=true;
        disabled=true;
      }
      if(i===0){
        cellData=alphabet[j-1];
        isHeader=true;
        disabled=true;
      }
      if(!cellData){
        cellData="";
      }
      const rowName=i;
      const columnName=alphabet[j-1];
      const cell = new Cell(isHeader,disabled,cellData,i,j,rowName,columnName,false)
      spreadsheetRow.push(cell)
    }
    spreadsheet.push(spreadsheetRow)
  }
  drawSheet()
  console.log(spreadsheet)

}

initSpreadsheet()

function createCellEl(cell){
  const cellEl=document.createElement("input")
  cellEl.className="cell"
  cellEl.id="cell_"+cell.row+cell.column
  cellEl.value=cell.data
  cellEl.disabled=cell.disabled

  if(cell.isHeader){
    cellEl.classList.add('header')
  }
  cellEl.onclick=()=>handleCellClick(cell)
  cellEl.oninput=(event)=>handleOnChange(event.target.value, cell)
  return cellEl
}

function handleOnChange(data, cell){
  cell.data=data
}

function handleCellClick(cell){
  // 이전의 하이라이트 된 부분 지워주기
  clearHeaderActiveStates()
  // 헤더들의 데이터 가져오기
  console.log('clicked cell',cell)
  const columnHeader = spreadsheet[0][cell.column]
  const rowHeader = spreadsheet[cell.row][0]

  // 헤더들의 요소 반환하기
  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column)
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column)

  // active class 추가
  columnHeaderEl.classList.add('active')
  rowHeaderEl.classList.add('active')
  document.querySelector("#cell-status").innerHTML=cell.columnName + "-" + cell.rowName
}


function clearHeaderActiveStates(){
  // header class로 가지고 있는 모든 요소들 리턴
  const headers = document.querySelectorAll(".header")

  // header 요소에서 active 클래스를 지우기
  headers.forEach(header => {
    header.classList.remove("active")
  })
}

function getElFromRowCol(row, col){
  return document.querySelector("#cell_"+row+col)
}

function drawSheet(){
  for(let i=0;i<spreadsheet.length;i++){
    const rowContainerEl = document.createElement("div")
    rowContainerEl.className="cell-row"
    for(let j=0; j<spreadsheet[i].length;j++){
      const cell=spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl)

  }
}
