let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let createBtn = document.getElementById('create');
let search = document.getElementById('search');
let searchByTitle = document.getElementById('search-title');
let searchByCategory = document.getElementById('search-category');
let mood = 'create';
let temp;

function getTotal() {
    if (price.value != '') {
        let res = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = res;
        total.style.background = '#040'
    } else {
        total.innerHTML = 0;
        total.style.background = '#990505'
    }
}

window.onload = () => {
    readData();
}

class Record {
    constructor({ id, title, price, taxes, ads, discount, total, count, category }) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.taxes = taxes;
        this.ads = ads;
        this.discount = discount;
        this.total = total;
        this.count = count;
        this.category = category;
    }
}

let allRecords;
if (localStorage.product != null) {
    allRecords = JSON.parse(localStorage.product);
}
else {
    allRecords = [];
}

function createRecord() {
    let newRecord = new Record({
        id: (allRecords.length !== 0) ? allRecords[allRecords.length - 1].id + 1 : 1,
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value
    });
    if(title.value !== '' && price.value !== '' && category.value !== '' && count.value <= 100){
        if (mood === 'create') {
            if (count.value > 1) {
                for (let i = 0; i < newRecord.count; i++) {
                    allRecords.push(newRecord);
                }
            } else {
                allRecords.push(newRecord);
            }
        } else {
            allRecords[temp] = newRecord;
            mood = 'create';
            count.style.visibility = 'visible';
            createBtn.style.backgroundColor = '#39004f';
            createBtn.value = 'create';
        }
        clearData();
    }
    localStorage.setItem('product', JSON.stringify(allRecords));
    readData();
}
createBtn.addEventListener('click', createRecord);

function clearData() {
    title.value = '';
    price.value = '';
    ads.value = '';
    taxes.value = '';
    discount.value = '';
    total.innerHTML = '';
    count.value = '';
    category.value = '';
}

function readData() {
    let table = '';
    for (let i = 0; i < allRecords.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${allRecords[i].title}</td>
            <td>${allRecords[i].price}</td>
            <td>${allRecords[i].taxes}</td>
            <td>${allRecords[i].ads}</td>
            <td>${allRecords[i].discount}</td>
            <td>${allRecords[i].total}</td>
            <td>${allRecords[i].category}</td>
            <td><button onclick= 'updateData(${i})' id="update">update</button></td>
            <td><button onclick= 'deleteData(${i})' id="delete">delete</button></td>
        </tr>
        `

    }

    let tableBody = document.querySelector('tbody');
    tableBody.innerHTML = table;
    let deletebutton = document.getElementById('delete-all');
    if (allRecords.length > 0) {
        deletebutton.innerHTML = '';
        let button = document.createElement('button');
        let buttonText = document.createTextNode(`Delete All (${allRecords.length})`);
        button.appendChild(buttonText);
        button.style.margin = '10px 0px';
        deletebutton.addEventListener('click', () => {
            deleteAll();
        });

        deletebutton.appendChild(button);
    } else {
        deletebutton.innerHTML = '';
    }
    getTotal();
}

function deleteData(i) {
    allRecords.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(allRecords));
    readData();
}

function updateData(i) {
    scroll({
        top: 0,
        behavior: "smooth"
    });
    let recordToBeUpdated = allRecords[i];
    title.value = recordToBeUpdated.title;
    price.value = recordToBeUpdated.price;
    taxes.value = recordToBeUpdated.taxes;
    ads.value = recordToBeUpdated.ads;
    discount.value = recordToBeUpdated.discount;
    getTotal();
    count.value = recordToBeUpdated.count;
    category.value = recordToBeUpdated.category;
    createBtn.style.backgroundColor = '#040';
    createBtn.value = 'update';
    count.style.visibility = 'hidden';

    mood = 'update';
    temp = i;


}

function deleteAll() {
    localStorage.clear();
    allRecords.splice(0);
    readData();
}

let searchType = 'Title';

function getSearchType(id) {
    search.focus();
    if (id == 'search-title') {
        searchType = 'Title';
    } else {
        searchType = 'Category';
    }
    search.placeholder = `Search By ${searchType}`;
    search.value = '';
    readData();
}

search.addEventListener('keyup', () => {
    searchInRecords(search.value);
});

function searchInRecords(text) {
    let table = '';
    for (let i = 0; i < allRecords.length; i++) {
        if (searchType == 'Title') {
            if (allRecords[i].title.toLowerCase().includes(text.toLowerCase())) {
                table += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${allRecords[i].title}</td>
                            <td>${allRecords[i].price}</td>
                            <td>${allRecords[i].taxes}</td>
                            <td>${allRecords[i].ads}</td>
                            <td>${allRecords[i].discount}</td>
                            <td>${allRecords[i].total}</td>
                            <td>${allRecords[i].category}</td>
                            <td><button onclick= 'updateData(${i})' id="update">update</button></td>
                            <td><button onclick= 'deleteData(${i})' id="delete">delete</button></td>
                        </tr>
                        `;
            }
            
        } else {
            if (allRecords[i].category.toLowerCase().includes(text.toLowerCase())) {
                table += `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${allRecords[i].title}</td>
                            <td>${allRecords[i].price}</td>
                            <td>${allRecords[i].taxes}</td>
                            <td>${allRecords[i].ads}</td>
                            <td>${allRecords[i].discount}</td>
                            <td>${allRecords[i].total}</td>
                            <td>${allRecords[i].category}</td>
                            <td><button onclick= 'updateData(${i})' id="update">update</button></td>
                            <td><button onclick= 'deleteData(${i})' id="delete">delete</button></td>
                        </tr>
                        `;
            } 
        }
    }
    

    let tableBody = document.querySelector('tbody');
    tableBody.innerHTML = table;
}


