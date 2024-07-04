const search = document.getElementById('search')
const submit=document.getElementById('submit')
const generate=document.getElementById('generate')
const resultheading=document.getElementById('results-heading')
const meals=document.getElementById('meals')
const selectedmeal=document.getElementById('selected-meal')
function searchmeal(e){
   e.preventDefault();
   const searchtext=search.value;
   if(searchtext.trim()){
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchtext}
`).then(res => res.json()).then(data => {
    console.log('')
        console.log(data);
        resultheading.innerHTML=`<h2>search results for ${searchtext}</h2>`
        if(data.meal===null){
            resultheading.innerHTML=`<h2>no resultsn found for ${searchtext}</h2>`
 
        }else{
            meals.innerHTML=data.meals.map(meal=>`
                <div class="meal">
                <img src="${meal.strMealThumb}"alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}<h3>
                
                </div>  
                </div>
                `).join('')
        }
      });search.value='';

   } else{
    alert('please enter search keyword')
   }
}
submit.addEventListener('submit',searchmeal)