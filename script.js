'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const displayMovements = function (movements,sort=false) {
  containerMovements.innerHTML = '';

const movs= sort ? movements.slice().sort((a,b)=>a-b) :movements

  movs.forEach((mov, i) => {
    let mode = mov > 0 ? 'deposit' : 'withdrawal';
    let html = ` <div class="movements__row">
 <div class="movements__type movements__type--${mode}">${i + 1} ${mode}</div>
 <div class="movements__date">3 days ago</div>
 <div class="movements__value">${mov}€</div>
</div>`;
    // containerMovements.innerHTML+=html
    containerMovements.insertAdjacentHTML('afterbegin', html);
  
  });
};
// displayMovements(account1.movements);


const calcDisplayBalance =function(acc){
  acc.balance=acc.movements.reduce((acc,val)=>acc+val,0)
    labelBalance.innerHTML=`${acc.balance}€`;
   
}

// calcDisplayBalance(account1.movements)


const calcDisplaySummary=function(acc){
  // console.log(acc.mov);
let sumIn=acc.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0)
let sumOut=acc.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0)
labelSumIn.innerHTML=`${sumIn}€`;
labelSumOut.innerHTML=`${Math.abs(sumOut)}€`;

// let ac=accounts.find((acc)=>acc.movements==mov);
let sumInterest=acc.movements.filter((mov)=>mov>0).map(mov=>mov*acc.interestRate/100).filter(mov=>mov>1).reduce((acc,mov)=>acc+mov,0)
labelSumInterest.textContent=`${sumInterest}€` ;


}

// calcDisplaySummary(account1.movements)

const createUserName=(accs)=>{
accs.forEach((acc)=>{
  acc.username=acc.owner.toLowerCase().split(' ').map((name)=>name[0]).join('')
})
}
createUserName(accounts);


const updateUI=function(currentAccount){
  displayMovements(currentAccount.movements);
calcDisplayBalance(currentAccount);
calcDisplaySummary(currentAccount);
}

///
let currentAccount;

btnLogin.addEventListener('click',(e)=>{

  e.preventDefault();

  currentAccount=accounts.find(acc=>acc.username==inputLoginUsername.value)
if(currentAccount?.pin==inputLoginPin.value){
labelWelcome.innerHTML=`Welcome back ${currentAccount.owner.split(' ')[0]}`
containerApp.style.opacity='1';
updateUI(currentAccount)
inputLoginPin.value=inputLoginUsername.value='';
inputLoginPin.blur();
inputLoginUsername.blur();


}
})


btnTransfer.addEventListener('click',(e)=>{
  e.preventDefault();
  const amount=+inputTransferAmount.value;
  const receiverAcc=accounts.find(acc=>acc.username==inputTransferTo.value);

  if(amount>0 && currentAccount.balance>=amount && receiverAcc && receiverAcc?.username!==currentAccount){
   currentAccount.movements.push(-amount);
   receiverAcc.movements.push(amount)
   updateUI(currentAccount)
  }

  inputTransferAmount.value=inputTransferTo.value='';
  inputTransferAmount.blur();
  inputTransferTo.blur();
})


btnLoan.addEventListener('click',(e)=>{
  e.preventDefault();
let deposit=+inputLoanAmount.value;

if(deposit>0 && currentAccount.movements.some(mov=>mov>=deposit*0.1)){
currentAccount.movements.push(deposit)
updateUI(currentAccount);
}
inputLoanAmount.value='';

})


btnClose.addEventListener('click',(e)=>{
  e.preventDefault();
 
  if(inputCloseUsername.value===currentAccount.username && Number(currentAccount.pin)==inputClosePin.value){
    const index=accounts.findIndex(acc=>acc==currentAccount)
accounts.splice(index,1)
containerApp.style.opacity=0;

  }
  inputClosePin.value=inputCloseUsername.value='';
  
})

let sorted=false;
btnSort.addEventListener('click',(e)=>{
  e.preventDefault();
 displayMovements(currentAccount.movements,!sorted)
 sorted=!sorted
// updateUI(currentAccount)
})





