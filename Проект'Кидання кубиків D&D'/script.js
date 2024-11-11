let currentDiceType = null;
//вибір кубика
let diceButtons=document.querySelectorAll('.dice-button');
for(let i=0; i<diceButtons.length; i++) 
{
  diceButtons[i].addEventListener('click',function() 
  {
    currentDiceType=parseInt(diceButtons[i].getAttribute('data-dice'));
    document.getElementById('result').innerHTML=`<p> Кидок D${currentDiceType}</p>`;
  });
}
//Звичайний кидок
document.getElementById('normal-roll').addEventListener('click',function() 
{
  if (currentDiceType) 
  {
    rollDiceAndDisplay(currentDiceType, "normal");
  }else 
  {
    alert("Спочатку оберіть тип кубика!");
  }
});
//Кидок з перевагою
document.getElementById('advantage-roll').addEventListener('click',function() 
{
  if (currentDiceType) 
  {
    rollDiceAndDisplay(currentDiceType,"advantage");
  }else 
  {
    alert("Спочатку оберіть тип кубика!");
  }
});
//Кидок з перешкодою
document.getElementById('disadvantage-roll').addEventListener('click',function() 
{
  if (currentDiceType) 
  {
    rollDiceAndDisplay(currentDiceType, "disadvantage");
  }else 
  {
    alert("Спочатку оберіть тип кубика!");
  }
});
//Функція для модифікаторів та кількісті кубиків
function rollDiceAndDisplay(diceType,rollType) 
{
  let modifier=parseInt(document.getElementById('modifier').value) || 0;
  let numberOfDice=parseInt(document.getElementById('dice-count').value) || 2;
  let rollResult;
  if (rollType==="advantage") 
  {
    rollResult=rollWithAdvantageOrDisadvantage(diceType,"advantage",numberOfDice);
  }else if (rollType==="disadvantage") 
  {
    rollResult=rollWithAdvantageOrDisadvantage(diceType,"disadvantage",numberOfDice);
  }else 
  {
    rollResult=rollDice(numberOfDice,diceType);
  }
  let totalWithModifier=rollResult.total+modifier;
  document.getElementById('result').innerHTML = `
    <p>Ви кинули ${numberOfDice} кубики D${diceType}${rollType==="advantage"?"з перевагою":rollType==="disadvantage"?"з перешкодою":""}</p>
    <p>Результати кидання: ${rollResult.results.join(', ')}</p>
    <p>Модифікатор: ${modifier>=0?"+"+modifier:modifier}</p>
    <p>Загальна сума з модифікатором: ${totalWithModifier}</p>
  `;
}
// Функція для звичайного кидка
function rollDice(numberOfDice,diceType) 
{
  let total=0;
  let results=[];

  for (let i=0; i<numberOfDice; i++) 
  {
    let roll=Math.floor(Math.random()*diceType)+1;
    results.push(roll);
    total+=roll;
  }
  return {
    results:results,
    total:total
  };
}
// Кидок з перевагою або перешкодою
function rollWithAdvantageOrDisadvantage(diceType,rollType,numberOfDice) 
{
  let firstRollResults=rollDice(numberOfDice,diceType).results;
  let secondRollResults=rollDice(numberOfDice,diceType).results;
  let firstTotal=firstRollResults.reduce((acc,num)=>acc+num,0);
  let secondTotal=secondRollResults.reduce((acc,num)=>acc+num,0);
  let finalRoll=(rollType==="advantage")?Math.max(firstTotal,secondTotal):Math.min(firstTotal,secondTotal);
  return {
    results:[firstRollResults,secondRollResults],
    total:finalRoll
  };
}
