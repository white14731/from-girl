const foodData = [
    { name: 'Пицца', image: 'pizza.jpg', calories: 300, id: 'pizza' },
    { name: 'Бургер', image: 'burger.jpg', calories: 400, id: 'burger' },
    { name: 'Суши', image: 'sushi.jpg', calories: 250, id: 'sushi' },
    { name: 'Салат', image: 'salad.jpg', calories: 150, id: 'salad' },
    { name: 'Суп', image: 'soup.jpg', calories: 200, id: 'soup' },
    { name: 'Картофель фри', image: 'fries.jpg', calories: 350, id: 'fries' },
    { name: 'Мороженое', image: 'ice-cream.jpg', calories: 280, id: 'ice-cream' },
    { name: 'Торт', image: 'cake.jpg', calories: 500, id: 'cake' },
];

const foodList = document.querySelector('.food-list');
const caloriesFilterInput = document.getElementById('caloriesFilter');
const applyFilterButton = document.getElementById('applyFilter');

function renderFood(foodArray) {
    foodList.innerHTML = '';
    foodArray.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.classList.add('food-item');
        foodItem.innerHTML = `
            <img src="" alt="${food.name}">
            <h3>${food.name}</h3>
            <p>Калории: ${food.calories}</p>
             <button class="select-button" data-food-id="${food.id}">Выбрать</button>
         `;
        foodList.appendChild(foodItem);
    });

    // Добавляем обработчик события после рендеринга
    attachButtonHandlers();

}

function attachButtonHandlers(){
    const selectButtons = document.querySelectorAll('.select-button');
    selectButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const foodId = event.target.dataset.foodId
            notifyAdmin(foodId);
        });
    });
}


function filterFood() {
    const filterValue = parseInt(caloriesFilterInput.value);
    if (isNaN(filterValue)) {
        renderFood(foodData);
        return;
    }
    const filteredFood = foodData.filter(food => food.calories <= filterValue);
    renderFood(filteredFood);
}

applyFilterButton.addEventListener('click', filterFood);

function notifyAdmin(foodId) {
    const selectedFood = foodData.find(food => food.id === foodId)
    if (!selectedFood) {
        console.error("Еда не найдена!");
        return;
    }

    fetch('https://from-girl.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: `Выбрана еда: ${selectedFood.name}`})
    })
        .then(response => {
            if (!response.ok){
                throw new Error (`Ошибка сервера:${response.status}`)
            }
            console.log("Уведомление отправлено")
        })
        .catch(error => {
            console.error("Ошибка при отправке уведомления:", error)
        })
}
renderFood(foodData);
