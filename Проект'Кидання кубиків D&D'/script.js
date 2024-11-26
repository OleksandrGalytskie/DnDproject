let currentDiceType = null;
let currentLanguage = "uk";
// Мультимовна підтримка
const languages={
  uk:{
    pageTitle: "Кидання кубиків D&D",
    mainTitle: "Кидання кубиків D&D",
    selectDice: "Спочатку оберіть тип кубика!",
    rollNormal: "Кидок ",
    rollAdvantage: " з перевагою",
    rollDisadvantage: " з перешкодою",
    results: "Результати кидання:",
    modifier: "Модифікатор:",
    total: "Загальна сума з модифікатором:",
    diceCountLabel: "Кількість кубиків:",
    modifierLabel: "Модифікатор:",
    normalRoll: "Звичайний кидок",
    advantageRoll: "Кидок з перевагою",
    disadvantageRoll: "Кидок з перешкодою",
  },
  en:{
    pageTitle: "D&D Dice Rolling",
    mainTitle: "D&D Dice Rolling",
    selectDice: "Please select a dice type first!",
    rollNormal: "Roll ",
    rollAdvantage: " with advantage",
    rollDisadvantage: " with disadvantage",
    results: "Roll results:",
    modifier: "Modifier:",
    total: "Total with modifier:",
    diceCountLabel: "Number of dice:",
    modifierLabel: "Modifier:",
    normalRoll: "Normal Roll",
    advantageRoll: "Roll with Advantage",
    disadvantageRoll: "Roll with Disadvantage",
  }
};
// Зміна мови
function changeLanguage(lang) 
{
  currentLanguage=lang;
  const texts=languages[lang];
  document.getElementById("page-title").textContent=texts.pageTitle;
  document.getElementById("main-title").textContent=texts.mainTitle;
  document.getElementById("dice-count-label").textContent=texts.diceCountLabel;
  document.getElementById("modifier-label").textContent=texts.modifierLabel;
  document.getElementById("normal-roll").textContent=texts.normalRoll;
  document.getElementById("advantage-roll").textContent=texts.advantageRoll;
  document.getElementById("disadvantage-roll").textContent=texts.disadvantageRoll;
  if (!currentDiceType) 
  {
    document.getElementById("result").innerHTML=`<p>${texts.selectDice}</p>`;
  }
}
document.getElementById("language-select").addEventListener("change",(e)=> 
{
  changeLanguage(e.target.value);
});
const getMessage=(key)=>languages[currentLanguage][key];
// обробник подій для вибору кубика
document.querySelectorAll(".dice-button").forEach((button)=> 
{
  button.addEventListener("click",()=> 
  {
    currentDiceType=parseInt(button.getAttribute("data-dice"));
    document.getElementById("result").innerHTML=`<p>${getMessage("rollNormal")}D${currentDiceType}</p>`;
  });
});
// обробник подій для типів кидків
['normal-roll','advantage-roll','disadvantage-roll'].forEach(type=> 
  {
  document.getElementById(type).addEventListener('click',()=> 
  {
    if(!currentDiceType) 
    {
      alert(getMessage('selectDice'));
      return;
    }
    const rollType=type.split('-')[0]; // Визначення типу 
    rollDiceAndDisplay(currentDiceType,rollType);
  });
});
function rollDiceAsync(diceType,rollType,numberOfDice) 
{
  return new Promise((resolve)=> 
  {
    const results=rollType==="normal"
      ? rollDice(numberOfDice,diceType)
      : rollWithAdvantageOrDisadvantage(diceType,rollType,numberOfDice);
    resolve(results);
  });
}
// Функція для обробки результатів
async function rollDiceAndDisplay(diceType,rollType) 
{
  const modifier=parseInt(document.getElementById('modifier').value) || 0;
  const numberOfDice = parseInt(document.getElementById('dice-count').value) || 1;
  try 
  {
    const rollResult=await rollDiceAsync(diceType,rollType,numberOfDice);
    const totalWithModifier=rollResult.total+modifier;
    document.getElementById('result').innerHTML= `
      <p>${getMessage('rollNormal')}D${diceType}${rollType==="advantage"?getMessage('rollAdvantage'):rollType==="disadvantage"?getMessage('rollDisadvantage'):""}</p>
      <p>${getMessage('results')}${Array.isArray(rollResult.results[0])? 
        rollResult.results.map((res,idx)=>`(${idx+1}:${res.join(', ')})`).join('; '): 
        rollResult.results.join(', ')}</p>
      <p>${getMessage('modifier')}${modifier>= 0?"+"+modifier:modifier}</p>
      <p>${getMessage('total')}${totalWithModifier}</p>
    `;
  }catch(error) 
  {
    console.error("Error during dice roll:",error);
  }
}
// Функція для звичайного кидка
function rollDice(numberOfDice,diceType) 
{
  const results=Array.from({length:numberOfDice},()=>Math.floor(Math.random()*diceType)+1);
  return{
    results,
    total:results.reduce((acc,num)=>acc+num,0)
  };
}
//Кидок з перевагою або перешкодою
function rollWithAdvantageOrDisadvantage(diceType,rollType,numberOfDice) 
{
  const firstRollResults=rollDice(numberOfDice,diceType).results;
  const secondRollResults=rollDice(numberOfDice,diceType).results;
  const firstTotal=firstRollResults.reduce((acc,num)=>acc+num,0);
  const secondTotal=secondRollResults.reduce((acc,num)=>acc+num,0);
  const finalRoll=rollType==="advantage"?Math.max(firstTotal,secondTotal):Math.min(firstTotal,secondTotal);
  return{
    results:[firstRollResults,secondRollResults],
    total:finalRoll
  };
}
