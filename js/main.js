var Amount = document.getElementById("Amount");
var Expense = document.getElementById("Expense");
var Category = document.getElementById("Category");
var desc = document.getElementById("desc");
var add = document.getElementById("add");
var days = document.getElementById("Days");
var TIncome = document.getElementById("Tin");
var TEpenses = document.getElementById("Tou");
var total = document.getElementById("T");
var in1 = document.getElementById("in1");
var in2 = document.getElementById("in2");
var in3 = document.getElementById("in3");
var in4 = document.getElementById("in4");
var in5 = document.getElementById("in5");
var in6 = document.getElementById("in6");
var in7 = document.getElementById("in7");
var out1 = document.getElementById("out1");
var out2 = document.getElementById("out2");
var out3 = document.getElementById("out3");
var out4 = document.getElementById("out4");
var out5 = document.getElementById("out5");
var out6 = document.getElementById("out6");
var out7 = document.getElementById("out7");
var Reset = document.getElementById("Reset");
var addWallet = document.getElementById("add-wallet");
var getWallet = document.getElementById("getWallet");
var CWallet = document.getElementById("CWallet");
var TShopping = document.getElementById("Shopping");
var TFood = document.getElementById("Food");
var TBills = document.getElementById("Bills");
var TEnter = document.getElementById("Enter");
var TTrans = document.getElementById("Trans");
var PS = document.getElementById("PS");
var PF = document.getElementById("PF");
var PB = document.getElementById("PB");
var PT = document.getElementById("PT");
var PE = document.getElementById("PE");
var cash = document.getElementById("cash");
var n = 0;
var o = 0;
var t = 0;
tin = 0;
var c = 0;
var w = [];
var NW = [];
var today = new Date();
var now;
setday(today);
var money = [];
var indays = [];
var outdays = [];
var wallets = [];
if (localStorage.getItem("money") != null) {
  money = JSON.parse(localStorage.getItem("money"));

  // إعادة تعيين القيم
  n = 0;
  o = 0;
  indays = [0, 0, 0, 0, 0, 0, 0];
  outdays = [0, 0, 0, 0, 0, 0, 0];

  // إعادة الحساب من البيانات المخزنة
  money.forEach((item) => {
    let incomeVal = Number(item.in) || 0;
    let outVal = Number(item.out) || 0;

    n += incomeVal;
    o += outVal;

    let dayIndex = check(item.day) - 1;

    indays[dayIndex] += incomeVal;
    outdays[dayIndex] += outVal;
  });

  t = n - o;

  // تحديث الأرقام في الصفحة
  TIncome.innerHTML = n;
  TEpenses.innerHTML = o;
  total.innerHTML = t;

  // إعادة رسم الأعمدة
  indays.forEach((value, i) => {
    let totalIncome = indays.reduce((a, b) => a + b, 0);
    let ratio = totalIncome ? (value / totalIncome) * 100 : 0;

    [in1, in2, in3, in4, in5, in6, in7][i].style.height = `${ratio}%`;
  });

  outdays.forEach((value, i) => {
    let ratio = indays[i] ? (value / indays[i]) * 100 : 0;
    if (ratio > 100) ratio = 100;

    [out1, out2, out3, out4, out5, out6, out7][i].style.height = `${ratio}%`;
  });

  display(money);
  displayMoney();
}
wallets = JSON.parse(localStorage.getItem("wallets")) || [];
w = JSON.parse(localStorage.getItem("walletBalances")) || [];
// إذا طول w أقل من wallets زود 0 تلقائي
while (w.length < wallets.length) {
  w.push(0);
}

// إذا طول w أكبر من wallets نقص آخر عناصر
while (w.length > wallets.length) {
  w.pop();
}
function handleAdd() {
  if (Category.value === "none" && Expense.value !== "") {
    alert("please enter your Category");
    return;
  }
  if (Amount.value === "" && Expense.value === "") {
    alert("please enter money");
    return;
  }

  n += Number(Amount.value);
  o += Number(Expense.value);
  if (n < 0 || o < 0) {
    alert("please enter valid number");
    return;
  }
  if (o > n) {
    if (o > t && Expense.value !== "") {
      alert("you don't have money");
      return;
    }
  }

  t = n - o;

  const wallet = {
    in: Amount.value,
    out: Expense.value,
    cat: Category.value,
    day: days.value,
    des: desc.value,
    TWallet: CWallet.value,
  };

  TIncome.innerHTML = `$${n}`;
  TEpenses.innerHTML = `$${o}`;
  total.innerHTML = `$${t}`;


  if (CWallet.value === "cash") {
     let c = Number(localStorage.getItem("cashBalance")) || 0
    c += Number(Amount.value);
    c -= Number(Expense.value);
    if (c < 0) {
      alert("You don't have money in this wallet");
      return;
    }
    localStorage.setItem("cashBalance", c);

    cash.innerHTML = `$${c}`;

  } 
if (CWallet.value !== "cash") {

  for (var i = 0; i < wallets.length; i++) {

    if (CWallet.value === wallets[i]) {
      var currentBalance = Number(w[i]) || 0;  
      var amountIn = Number(Amount.value) || 0;
      var amountOut = Number(Expense.value) || 0;

      // تحقق أولًا قبل أي تحديث
      if (amountOut > currentBalance + amountIn) {
        alert("You don't have enough money in this wallet");
location.reload()
        return; // سيوقف العملية قبل أي خصم
      }

      // العملية صالحة فقط هنا
      var newBalance = currentBalance + amountIn - amountOut;
      w[i] = newBalance;

      // حفظ الرصيد الجديد بعد التأكد
      localStorage.setItem("walletBalances", JSON.stringify(w));

      // تحديث العرض بعد التأكد
      NW[i] = document.getElementById(wallets[i]);
      if (NW[i]) NW[i].innerHTML = `$${w[i]}`;
    }
  }
}

  money.push(wallet);
    localStorage.setItem("money", JSON.stringify(money));

  const h = check(days.value);
  income(h, Number(Amount.value));
  out(h, Number(Expense.value));
  display(money);
  displayMoney();
  Amount.value = "";
  Expense.value = "";
  Category.value = "none";
  days.value = "Saturday";
  desc.value = "";
  CWallet.value = "cash";
  console.log(wallets);
    location.reload();

}
window.onload = function () {
  var savedCash = localStorage.getItem("cashBalance");
 c = Number(savedCash) || 0;


  document.getElementById("cash").innerHTML = `$${c}`;
};
function display(money) {
  Wfood(money);
  WShopping(money);
  WBills(money);
  WEnter(money);
  WTrans(money);
}

add.addEventListener("click", handleAdd);
Reset.addEventListener("click", () => {
  money.splice(0, money.length);
  n = 0;
  o = 0;
  t = 0;
    document.getElementById("cash").innerHTML = `$0`;

  indays.splice(0, indays.length);
  outdays.splice(0, outdays.length);

  [in1, in2, in3, in4, in5, in6, in7].forEach((d) => (d.style.height = "0%"));
  [out1, out2, out3, out4, out5, out6, out7].forEach(
    (d) => (d.style.height = "0%"),
  );
  localStorage.removeItem("money");
  localStorage.removeItem("wallets");
  localStorage.removeItem("cashBalance");
  console.log(wallets);
  if (confirm("Are you sure you want to reset?")) {
    TIncome.innerHTML = `$0`;
    TEpenses.innerHTML = `$0`;
    total.innerHTML = `$0`;
    TFood.style.width = ``;
    TBills.style.width = ``;
    TShopping.style.width = ``;
    TEnter.style.width = ``;
    TTrans.style.width = ``;
    PF.innerHTML = ``;
    PS.innerHTML = ``;
    PB.innerHTML = ``;
    PT.innerHTML = ``;
    PE.innerHTML = ``;
    location.reload();
  } else {
    handleAdd();
  }
});

function income(index, n) {
  n = Number(n) || 0;

  // تحديث قيمة اليوم المحدد (index يبدأ من 1 لليوم الأول)
  indays[index - 1] = Number(indays[index - 1]) || 0;
  indays[index - 1] += n;

  // مجموع كل الأيام
  let total = indays.reduce((sum, val) => sum + val, 0);

  // مصفوفة divs للأيام
  const dayDivs = [in1, in2, in3, in4, in5, in6, in7];

  // تحديث ارتفاع كل div حسب نسبة اليوم من المجموع
  indays.forEach((value, i) => {
    let ratio = total ? (value / total) * 100 : 0;
    dayDivs[i].style.height = `${ratio}%`;
    dayDivs[i].setAttribute("data-height", `${ratio.toFixed(2)}%`);
  });
}
function out(index, n) {
  n = Number(n) || 0;

  // تحديث قيمة اليوم المحدد
  outdays[index - 1] = Number(outdays[index - 1]) || 0;
  outdays[index - 1] += n;

  // مصفوفة divs لكل الأيام
  const dayDivs = [out1, out2, out3, out4, out5, out6, out7];

  // مصفوفة divs للإيرادات
  const inDivs = [in1, in2, in3, in4, in5, in6, in7];

  outdays.forEach((value, i) => {
    // جلب ارتفاع الإيراد المقابل لليوم
    let inHeight = Number(inDivs[i].style.height.replace("%", "")) || 0;

    // النسبة = out / in * 100
    let ratio = inHeight ? (value / Number(indays[i])) * 100 : 0;

    // الحد الأعلى = 100%
    if (ratio > 100) ratio = 100;

    // تحديث ارتفاع div المصروفات
    dayDivs[i].style.height = `${ratio}%`;
    dayDivs[i].setAttribute("data-height", `${ratio.toFixed(2)}%`);
  });
}
function check(index) {
  if (index === "Saturday") {
    return 1;
  }
  if (index === "Sunday") {
    return 2;
  }
  if (index === "Monday")   {
    return 3;
  }
  if (index === "Tuesday") {
    return 4;
  }
  if (index === "Wednesday") {
    return 5;
  }
  if (index === "Thursday") {
    return 6;
  }
  if (index === "Friday") {
    return 7;
  }
}
function Wfood(money) {
  let ws = 0;

  for (var i = 0; i < money.length; i++) {
    if (money[i].cat === "Food") {
      if (n === 0) {
        n = 1;
      }
      ws += Number(money[i].out);
      w = (ws / n) * 100;
      TFood.style.width = `${w}%`;
      PF.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}
function WShopping(money) {
  ws = 0;
  for (var i = 0; i < money.length; i++) {
    if (money[i].cat === "Sh") {
      if (n === 0) {
        n = 1;
      }
      ws += Number(money[i].out);
      w = (ws / n) * 100;
      TShopping.style.width = `${w}%`;
      PS.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}
function WBills(money) {
  ws = 0;
  for (var i = 0; i < money.length; i++) {
    if (money[i].cat === "Bills") {
      if (n === 0) {
        n = 1;
      }
      ws += Number(money[i].out);
      w = (ws / n) * 100;
      TBills.style.width = `${w}%`;
      PB.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}
function WEnter(money) {
  ws = 0;
  for (var i = 0; i < money.length; i++) {
    if (money[i].cat === "Enter") {
      if (n === 0) {
        n = 1;
      }
      ws += Number(money[i].out);
      w = (ws / n) * 100;
      TEnter.style.width = `${w}%`;
      PE.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}
function WTrans(money) {
  ws = 0;
  for (var i = 0; i < money.length; i++) {
    if (money[i].cat === "Trans") {
      if (n === 0) {
        n = 1;
      }
      ws += Number(money[i].out);
      w = (ws / n) * 100;
      TTrans.style.width = `${w}%`;
      PT.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}

function displayMoney() {
  var p = "";
  for (var i = 0; i < money.length; i++) {
    var str = money[i].des || "None";
    if (money[i].out !== "") {
      p += `<tr> 

  
  <td>${money[i].day}</td>
   <td>${money[i].cat}</td>
   <td>${money[i].out}</td>
         <td>${str.slice(0, 20)}</td> 
       <td >${money[i].TWallet}</td> 

    <td class="text-danger" >EXPENSE</td>
     </tr> `;
    }

    if (money[i].in !== "") {
      p += `<tr> 

  
  <td>${money[i].day}</td>
   <td></td> 
    <td>${money[i].in}</td>
       <td >${str.slice(0, 20)}</td> 
       <td >${money[i].TWallet}</td> 

    <td class="text-success ">INCOME</td>
     </tr> `;
    }
  }
  document.getElementById("tableBody").innerHTML = p;
}
function setday(today) {
  if (today.getDay() === 0) {
    days.value = "Sunday";
  }
  if (today.getDay() === 1) {
    days.value = "Monday";
  }
  if (today.getDay() === 2) {
    days.value = "Tuesday";
  }
  if (today.getDay() === 3) {
    days.value = "Wednesday";
  }
  if (today.getDay() === 4) {
    days.value = "Thursday";
  }
  if (today.getDay() === 5) {
    days.value = "Friday";
  }
  if (today.getDay() === 6) {
    days.value = "Saturday";
  }
}

addWallet.addEventListener("click", () => {
  getWallet.innerHTML = `<div class="get-wallet z-3 p-5">
            <div class="h-get-wallet d-flex justify-content-between">
              <h3>Enter your wallet data</h3>
              <div class="btn" id="c"><i class="fa-solid fa-circle-xmark"></i>
</div>


  
</div>
 <div class="input-group input-group-sm mb-3 d-flex flex-column">
          <label for="wallet-Name"> Wallet Name</label>
          <input
            type="text"
            class="form-control w-50 mt-1"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            id="wallet-Name"
          />
        </div>
        <div class="add w-100 d-flex justify-content-end mt-4">
          <div class="btn bg-btn" id="F-add-wallet">ADD</div>
        </div>
          </div>`;
  var walletName = document.getElementById("wallet-Name");
  var FAddWallet = document.getElementById("F-add-wallet");
  var c = document.getElementById("c");
  FAddWallet.addEventListener("click", () => {
    console.log(wallets);

wallets.push(walletName.value);
w.push(0); // <== لازم تديها صفر كبداية

localStorage.setItem("wallets", JSON.stringify(wallets));
localStorage.setItem("walletBalances", JSON.stringify(w));
   
    localStorage.setItem("wallets", JSON.stringify(wallets));
    localStorage.setItem("walletBalances", JSON.stringify(w));
    

    walletName.value = "";
    getWallet.innerHTML = "";

    var SWallets = document.getElementById("SWallets");
    var p = "";
    for (var i = 0; i < wallets.length; i++) {
      p += `<option value="${wallets[i]}">${wallets[i]}</option>`;
    }
    SWallets.innerHTML = p;

    var ShowWallets = document.getElementById("show-wallets");
    var x = "";
    for (var i = 0; i < wallets.length; i++) {
      w[i] || 0;
      x += `
     <div class="card mb-3">
          <div class="card-body">
            <h6 class="card-title">${wallets[i]}</h6>
            <div class="d-flex w-100 justify-content-between align-content-center">
              <p class="card-text" id="${wallets[i]}">$${w[i]}</p> 
              
<div class="d-flex w-25 align-items-center justify-content-end ">
                                <i class="fa-solid fa-wallet bg-success-subtle p-1 rounded-1 fs-2"></i>

                                <div class="btn btn-outline-danger ms-3" onclick="deleteWallet(${i})">remove</div>

                </div>
            </div>
          </div>
        </div>`;
    }
    ShowWallets.innerHTML = x;
  });
  c.addEventListener("click", () => {
    getWallet.innerHTML = "";
  });
});
document.addEventListener("DOMContentLoaded", () => {
  loadWalletsFromStorage();
});

function loadWalletsFromStorage() {
  if (
    localStorage.getItem("wallets") !== null &&
    localStorage.getItem("walletBalances") !== null
  ) {
    wallets = JSON.parse(localStorage.getItem("wallets"));
    w = JSON.parse(localStorage.getItem("walletBalances"));

    var SWallets = document.getElementById("SWallets");
    var p = "";
    for (var i = 0; i < wallets.length; i++) {
      p += `<option value="${wallets[i]}">${wallets[i]}</option>`;
    }
    SWallets.innerHTML = p;

    var ShowWallets = document.getElementById("show-wallets");
    var x = "";
    for (var i = 0; i < wallets.length; i++) {
      x += `
        <div class="card mb-3">
          <div class="card-body">
            <h6 class="card-title">${wallets[i]}</h6>
            <div class="d-flex w-100 justify-content-between align-content-center">
              <p class="card-text" id="${wallets[i]}">$${w[i]}</p> 
              
<div class="d-flex w-25 align-items-center justify-content-end ">
                                <i class="fa-solid fa-wallet bg-success-subtle p-1 rounded-1 fs-2"></i>

                                <div class="btn btn-outline-danger ms-3" onclick="deleteWallet(${i})">remove</div>

                </div>
            </div>
          </div>
        </div>`;
    }
    ShowWallets.innerHTML = x;
  }
}
function deleteWallet(index) {
  // التأكد إن w مصفوفة
  if (!Array.isArray(w)) w = [];

  wallets.splice(index, 1);
  w.splice(index, 1); // ⚡ لازم يكون array

  localStorage.setItem("wallets", JSON.stringify(wallets));
  localStorage.setItem("walletBalances", JSON.stringify(w));

  renderWallets();       // دالة تعرض المحافظ
  loadWalletsFromStorage();// تحدث الـ select
}
function renderWallets() {
  var container = document.getElementById("show-wallets");
  if (!container) return;

  var html = "";
  for (let i = 0; i < wallets.length; i++) {
    let name = wallets[i];
    html += `
      <div class="card mb-3">
        <div class="card-body">
          <h6 class="card-title">${name}</h6>
          <div class="d-flex justify-content-between align-items-center">
            <p class="card-text" id="${name}">$${w[i]}</p>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteWallet(${i})">
              remove
            </button>
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}