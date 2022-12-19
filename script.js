const press = document.getElementsByClassName("press");
const symb = document.getElementsByClassName("symb");
const alph = document.getElementsByClassName("alph");
const toggle = document.getElementById("toggle");
const sin = document.getElementById("sin");
const cos = document.getElementById("cos");
const tan = document.getElementById("tan");
const nlog = document.getElementById("nlog");
const log = document.getElementById("log");
const sqrt = document.getElementById("sqrt");
const pow = document.getElementById("pow");
const ans = document.getElementById("ans");
const his = document.getElementById("history");
const deg = document.getElementById("deg");
const rad = document.getElementById("rad");
const sto = document.getElementById("sto");
const display = document.getElementById("display");
const result = document.getElementById("result");
const brief = document.getElementById("log");

var flag = false;

sto.addEventListener("click", () => {
  stoPressed = true;
  brief.value = "STO";
});

let STO = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
var stoPressed = false;

for (x of alph) {
  x.addEventListener("click", function () {
    if (stoPressed) {
      brief.value = "Define " + this.innerHTML;
      stoPressed = false;
    } else {
      display.value += this.innerHTML;
    }
  });
}

let history = [];

his.addEventListener("click", () => {
  const array = [];
  history.forEach((h) => {
    array.push(`\n${h.exp} = ${h.res}`);
  });
  alert(array);
});

display.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    eq.click();
    return true;
  }
});

let set = "rad";
deg.style.color = "gray";
rad.addEventListener("click", () => {
  set = "rad";
  deg.style.color = "gray";
  rad.style.color = "black";
});

deg.addEventListener("click", () => {
  set = "deg";
  rad.style.color = "gray";
  deg.style.color = "black";
});

ans.addEventListener("click", () => {
  if (history[0]) display.value += history[history.length - 1].res;
});

let clearIt = false;

toggle.addEventListener("click", () => {
  if (flag) {
    sin.innerHTML = "sin";
    cos.innerHTML = "cos";
    tan.innerHTML = "tan";
    nlog.innerHTML = "ln";
    log.innerHTML = "log";
    sqrt.innerHTML = "√";
    pow.innerHTML = "x<sup>y</sup>";
    ans.innerHTML = "Ans";
    flag = false;
  } else if (!flag) {
    sin.innerHTML = "sin<sup>-1</sup>";
    cos.innerHTML = "cos<sup>-1</sup>";
    tan.innerHTML = "tan<sup>-1</sup>";
    nlog.innerHTML = "e<sup>x</sup>";
    log.innerHTML = "10<sup>x</sup>";
    sqrt.innerHTML = "x<sup>2</sup>";
    pow.innerHTML = "<sup>y</sup>√x ";
    ans.innerHTML = "Rnd";
    flag = true;
  }
});
for (x of press) {
  x.addEventListener("click", buttonPress);
}
function buttonPress() {
  if (clearIt) {
    display.value = "";
    result.value = "";
    clearIt = false;
  }
  ce.innerHTML = "CE";
  display.value += this.innerHTML;
  display.value = display.value.replaceAll("EXP", "E");
  display.value = display.value.replaceAll("sin<sup>-1</sup>", "asin");
  display.value = display.value.replaceAll("cos<sup>-1</sup>", "acos");
  display.value = display.value.replaceAll("tan<sup>-1</sup>", "atan");
  display.value = display.value.replaceAll("e<sup>x</sup>", "e^");
  display.value = display.value.replaceAll("10<sup>x</sup>", "10^");
  display.value = display.value.replaceAll("x<sup>y</sup>", "^(");

  display.value = display.value.replaceAll("x!", "!");
  for (s of symb) {
    if (s.innerHTML == this.innerHTML) {
      display.value += "(";
    }
  }
}
function fact(num) {
  var result = num;
  if (num === 0 || num === 1) return 1;
  while (num > 1) {
    num--;
    result *= num;
  }
  return result;
}

const ce = document.getElementById("clear");
ce.addEventListener("click", () => {
  let str = display.value;
  if (ce.innerHTML == "AC") {
    str[-1] = "";
    result.value = "";
    display.value = "";
    brief.value = "";
  } else {
    display.value = str.substring(0, str.length - 1);
  }
});
const eq = document.getElementById("equal");
const bucketSize = 10;
eq.addEventListener("click", function () {
  if (brief.value) {
    STO[brief.value.replace("Define ", "")] = display.value;
    brief.value = "";
    ce.click();
    return;
  }
  ce.innerHTML = "AC";
  str = display.value;

  for (key in STO) {
    str = str.replace(key, STO[key]);
  }
  str = str.split(" ").join("");

  let re = /(\d+\.?\d*e)|(\d+\.?\d*%)|(\d+\.?\d*π)|(\d+!)/g;
  const arr = [...str.matchAll(re)];
  arr.forEach((x) => {
    temp = x[0];
    temp = temp.replace("e", "*e");
    str = str.replace(x[0], temp);
    temp = temp.replace("π", "*π");
    str = str.replace(x[0], temp);
    temp = temp.replace("%", "*%");
    str = str.replace(x[0], temp);
    if (temp.includes("!")) {
      let matches = temp.match(/\d+/);
      let number = matches["0"];
      str = str.replace(temp, fact(number));
    }
  });
  str = str.replaceAll("e", `${Math.E}`);
  str = str.replaceAll("π", `${Math.PI}`);
  str = str.replaceAll("%", `${0.01}`);
  str = str.replaceAll("÷", "/");
  str = str.replaceAll("×", "*");

  let trgExp =
    /(sin\(\d+\.?\d*\))|(cos\(\d+\.?\d*\))|(tan\(\d+\.?\d*\))|(log\(\d+\.?\d*\))|(ln\(\d+\.?\d*\))|(asin\(\d+\.?\d*\))|(acos\(\d+\.?\d*\))|(atan\(\d+\.?\d*\))|(\d+\.?\d*\^\(\d+\.?\d*\))|(\d+\.?\d*\^\d+\.?\d*)|(\d*\.?\d*√\d+\.?\d*)/g;

  const array = [...str.matchAll(trgExp)];

  array.forEach((x) => {
    let s = x[0];
    if (s.includes("sin(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      if (set == "deg")
        str = str.replace(
          s,
          Math.sin((parseFloat(eval(number)) * Math.PI) / 180)
        );
      else str = str.replace(s, Math.sin(eval(number)));
    }

    if (s.includes("cos(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      if (set == "deg")
        str = str.replace(s, Math.cos((parseFloat(number) * Math.PI) / 180));
      else str = str.replace(s, Math.cos(number));
    }

    if (s.includes("tan(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      if (set == "deg")
        str = str.replace(s, Math.tan((parseFloat(number) * Math.PI) / 180));
      else str = str.replace(s, Math.tan(number));
    }

    if (s.includes("asin(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      if (set == "deg")
        str = str.replace(s, Math.asin((parseFloat(number) * Math.PI) / 180));
      else str = str.replace(s, Math.asin(number));
    }

    if (s.includes("acos(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      if (set == "deg")
        str = str.replace(s, Math.acos((parseFloat(number) * Math.PI) / 180));
      else str = str.replace(s, Math.acos(number));
    }

    if (s.includes("atan(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      if (set == "deg")
        str = str.replace(s, Math.atan((parseFloat(number) * Math.PI) / 180));
      else str = str.replace(s, Math.atan(number));
    }

    if (s.includes("log(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      str = str.replace(s, Math.log10(number));
    }

    if (s.includes("ln(")) {
      let matches = s.match(/\d+\.?\d*/);
      let number = matches["0"];
      str = str.replace(s, Math.log(number));
    }

    if (s.includes("^")) {
      let matches = [...s.matchAll(/\d+\.?\d*/g)];
      let number = matches["0"];
      let number2 = matches["1"];
      str = str.replace(s, Math.pow(number, number2));
    }

    if (s.includes("√")) {
      let matches = [...s.matchAll(/\d+\.?\d*/g)];
      if (matches.length == 1) {
        str = str.replace(s, Math.pow(matches[0], 0.5));
      } else {
        str = str.replace(
          s,
          parseFloat(matches[0]) * Math.pow(matches[1], 0.5)
        );
      }
    }

    str = str.replaceAll("+-", "-");
  });

  try {
    number = eval(str);

    if (isNaN(number)) {
      try {
        throw new Error("NaN");
      } catch (error) {
        brief.value = error.message;
      }
    } else if (Math.abs(number) === Infinity) {
      try {
        throw new Error("Division by zero");
      } catch (error) {
        brief.value = error.message;
      }
    } else {
      number = Number.isInteger(number)
        ? number
        : parseFloat(number.toFixed(4));
      result.value = number;
    }

    const exp = display.value;
    const res = result.value;

    if (history.length == bucketSize) {
      history.shift();
    }
    history.push({ exp, res });
    clearIt = true;
  } catch (error) {
    if (error instanceof SyntaxError) {
      brief.value = error.message;
    }
  }
});
