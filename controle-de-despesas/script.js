
const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []


const removeTransaction = ID => {
  transactions = transactions.filter(transaction => 
    transaction.id !== ID)
  updateLocalStorage()
  init()
}

const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+' // Se o valor do 'amount' em transaction, se for menor que 0 um operador de subtração é armazenado, caso contrário um operador de adição
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus'
  const amountWithoutOperator = Math.abs(transaction.amount) // Math.abs retorna o valor absoluto do numero independe do mumero ser negativo ou positivo
  const li = document.createElement('li')

  li.classList.add(CSSClass) // Add CSSClass na Li
  li.innerHTML = `
    ${transaction.name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">
      x
    </button>
  `
  // 
  transactionsUl.append(li) // .append recebe como argumento elemento a ser inserido, no caso na Ul;
  
}

const updateBalanceValues = () => {
  const transactionsAmounts = transactions
    .map(transaction => transaction.amount) 
  // .map itera pelo transactions separando os valores em um novo array
  // itera pelo array de objetos para transformar em array de numeros

  const total = transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)
  // .reduce recebe uma função por argumento e executa essa função para cada item do array
 // que tá sendo iterado. quando precisar reduzir o array a algum tipo de dado pode ser object literal, string, mumber
  const income = transactionsAmounts
    .filter(value => value > 0) // .filter cria e recebe somente alguns itens de um array e transfere para outro array
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2) //income filtra somente os números > 0
  const expense = Math.abs (transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)) // expanse filtra somente os números < 0

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`

}

 const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
   
}  
  // init, é a função que executa o preenchimento das
  //informações do estado da aplicação quando a pagina for carregada;

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random()* 1000)

form.addEventListener('submit', event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()

  if (transactionName === '' || transactionAmount === '') {
    alert('Por favor, preencha tanto o nome quanto o valor da transação')
    return
  }

  const transaction = { 
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionAmount)
   }

   transactions.push(transaction)
   init()
   updateLocalStorage()

   inputTransactionName.value = ''
   inputTransactionAmount.value = ''
})

