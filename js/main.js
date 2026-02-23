var Amount = document.getElementById("Amount");
var Expense = document.getElementById("Expense");
Category = document.getElementById("Category");
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
var n = 0;
var o = 0;
var t = 0;
tin = 0;
var money = [];
var indays = [];
var outdays = [];
if (localStorage.getItem("money") != null) {

  money = JSON.parse(localStorage.getItem("money"));

  // إعادة تعيين القيم
  n = 0;
  o = 0;
  indays = [0,0,0,0,0,0,0];
  outdays = [0,0,0,0,0,0,0];

  // إعادة الحساب من البيانات المخزنة
  money.forEach(item => {

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
    let totalIncome = indays.reduce((a,b)=>a+b,0);
    let ratio = totalIncome ? (value / totalIncome) * 100 : 0;

    [in1,in2,in3,in4,in5,in6,in7][i].style.height = `${ratio}%`;
  });

  outdays.forEach((value, i) => {
    let ratio = indays[i] ? (value / indays[i]) * 100 : 0;
    if(ratio>100) ratio=100;

    [out1,out2,out3,out4,out5,out6,out7][i].style.height = `${ratio}%`;
  });

  display(money);
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
  if(n<0||o<0){
    alert("please enter valid number")
    return;
  }
  if(o>n){
     if ((o > t&&Expense.value !== "")) {
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
  };

  TIncome.innerHTML = `$${n}`;
  TEpenses.innerHTML = `$${o}`;
  total.innerHTML = `$${t}`;

  money.push(wallet);
localStorage.setItem("money", JSON.stringify(money));
  const h = check(days.value);
  income(h, Number(Amount.value));
  out(h, Number(Expense.value));
 display(money)
  Amount.value = "";
  Expense.value = "";
  Category.value = "none";
  days.value = "Saturday";
}
function display(money){
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
  indays.splice(0, indays.length);
  outdays.splice(0, outdays.length);

  [in1, in2, in3, in4, in5, in6, in7].forEach((d) => (d.style.height = "0%"));
  [out1, out2, out3, out4, out5, out6, out7].forEach(
    (d) => (d.style.height = "0%"),
  );
localStorage.removeItem("money");
if(confirm("Are you sure you want to reset?")){
  TIncome.innerHTML = `$0`;
  TEpenses.innerHTML = `$0`;
  total.innerHTML = `$0`;
        TFood.style.width = ``;
        TBills.style.width = ``;
        TShopping.style.width = ``;
        TEnter.style.width = ``;
        TTrans.style.width = ``;
        PF.innerHTML = ``
        PS.innerHTML = ``
        PB.innerHTML = ``
        PT.innerHTML = ``
        PE.innerHTML = ``

}else{
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
  if (index === "Monday") {
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
      if(n===0){
        n=1
    }
ws+=Number(money[i].out)
w=(ws/n)*100
      TEnter.style.width = `${w}%`;
      PE.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}
function WTrans(money) {
  ws = 0;
  for (var i = 0; i < money.length; i++) {
    if (money[i].cat === "Trans") {
     if(n===0){
        n=1
    }
ws+=Number(money[i].out)
w=(ws/n)*100
      TTrans.style.width = `${w}%`;
      PT.innerHTML = `${w.toFixed(2)}%`;
    }
  }
}
