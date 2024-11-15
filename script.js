// App 객체 정의
const App = {
    // 메뉴 항목을 객체 배열로 정의
    menuItems: {
        coffee: [
            { name: '아메리카노', price: 4500, image: 'img/아메리카노.jpg' },
            { name: '라이트바닐라아몬드라떼', price: 5500, image: 'img/라이트바닐라아몬드라떼.jpg' },
            { name: '미숫가루커피', price: 6000, image: 'img/미숫가루커피.jpg' },
            { name: '티라미수라떼', price: 6500, image: 'img/티라미수라떼.jpg' },
            { name: '바닐라라떼', price: 5000, image: 'img/바닐라라떼.jpg' },
            { name: '카페모카', price: 7000, image: 'img/카페모카.jpg' }
        ],
        juice: [
            { name: '자몽주스', price: 6000, image: 'img/자몽주스.jpg' },
            { name: '샤인머스캣주스', price: 7000, image: 'img/샤인머스캣주스.jpg' },
            { name: '딸기주스', price: 6000, image: 'img/딸기주스.jpg' },
            { name: '딸기바나나주스', price: 6500, image: 'img/딸기바나나주스.jpg' },
            { name: '라임모히또', price: 6500, image: 'img/라임모히또.jpg' },
            { name: '레몬에이드', price: 5500, image: 'img/레몬에이드.jpg' }
        ],
        smoothie: [
            { name: '골드망고스무디', price: 6500, image: 'img/골드망고스무디.jpg' },
            { name: '코코넛커피스무디', price: 7000, image: 'img/코코넛커피스무디.jpg' },
            { name: '딸기요거트스무디', price: 7000, image: 'img/딸기요거트스무디.jpg' },
            { name: '딸기쿠키프라페', price: 6500, image: 'img/딸기쿠키프라페.jpg' },
            { name: '쿠키프라페', price: 6000, image: 'img/쿠키프라페.jpg' },
            { name: '녹차프라페', price: 6500, image: 'img/녹차프라페.jpg' }
        ]
    },

    // 전역 장바구니 배열
    cart: [],

    // 메뉴 변경 함수
    changeMenu: function(menuType) {
        const menuGrid = document.querySelector('.menu-grid');
        menuGrid.innerHTML = '';

        this.menuItems[menuType].forEach((menuItem) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'grid-item';

            const img = document.createElement('img');
            img.src = menuItem.image;
            img.alt = menuItem.name;
            img.className = 'grid-item-image';
            img.onclick = () => this.addToCart(menuItem.name, menuItem.price);

            itemDiv.appendChild(img);
            menuGrid.appendChild(itemDiv);
        });
    },

    // 장바구니에 항목을 추가하는 함수
    addToCart: function(itemName, itemPrice) {
        let cartBody = document.getElementById("cart-body");
        let existingRow = document.getElementById(itemName);
        
        if (existingRow) {
            let quantityCell = existingRow.querySelector(".quantity");
            let quantity = parseInt(quantityCell.textContent);
            quantity++;
            quantityCell.textContent = quantity;

            let totalPriceCell = existingRow.querySelector(".total-price");
            totalPriceCell.textContent = itemPrice * quantity;

            this.cart.forEach(item => {
                if (item.name === itemName) {
                    item.quantity = quantity;
                }
            });
        } else {
            let newRow = document.createElement("tr");
            newRow.id = itemName;
            newRow.innerHTML = `
                <td>${itemName}</td>
                <td class="total-price">${itemPrice}</td>
                <td>
                    <button class="quantity-button" onclick="App.updateQuantity('minus', '${itemName}', ${itemPrice})">-</button>
                    <span class="quantity">1</span>
                    <button class="quantity-button" onclick="App.updateQuantity('plus', '${itemName}', ${itemPrice})">+</button>
                </td>
            `;
            cartBody.appendChild(newRow);

            this.cart.push({ name: itemName, price: itemPrice, quantity: 1 });
        }
    },

    // 수량을 업데이트하는 함수
    updateQuantity: function(action, itemName, itemPrice) {
        let row = document.getElementById(itemName);
        let quantityCell = row.querySelector(".quantity");
        let quantity = parseInt(quantityCell.textContent);

        if (action === "minus") {
            if (quantity > 1) {
                quantity--;
            } else if (quantity === 1) {
                row.remove();
                this.cart = this.cart.filter(item => item.name !== itemName);
                return;
            }
        } else if (action === "plus") {
            quantity++;
        }

        quantityCell.textContent = quantity;
        let totalPriceCell = row.querySelector(".total-price");
        totalPriceCell.textContent = itemPrice * quantity;

        this.cart.forEach(item => {
            if (item.name === itemName) {
                item.quantity = quantity;
            }
        });
    },

    // 팝업 열기 함수
    openOrderPopup: function() {
        const popupCartBody = document.getElementById('popup-cart-body');
        popupCartBody.innerHTML = '';

        this.cart.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price}원</td>
                <td>${item.quantity}</td>
            `;
            popupCartBody.appendChild(row);
        });

        document.getElementById('order-popup').style.display = 'flex';
        this.updateTotalPrice();
    },

    // 총 가격 업데이트 함수
    updateTotalPrice: function() {
        const totalPriceElement = document.getElementById('total-price');
        const totalPrice = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalPriceElement.textContent = `${totalPrice}원`;
    },

    // 팝업 닫기 함수
    closeOrderPopup: function() {
        document.getElementById('order-popup').style.display = 'none';
    },

    // 결제 함수
    processPayment: function() {
        this.cart = [];
        document.getElementById("cart-body").innerHTML = '';
        this.closeOrderPopup();
        window.location.href = 'orderComplete.html';  // 결제 완료 페이지로 이동
    },

    // 뒤로 가기 함수
    goBack: function() {
        window.location.href = 'index.html';  // index.html로 이동
    },

    // 매장 식사 화면으로 이동
    goToDineInDetail: function() {
        window.location.href = 'dineInDetail.html';  // 매장 식사 화면으로 이동
    },

    // 포장 주문 화면으로 이동
    goToTakeOutDetail: function() {
        window.location.href = 'dineInDetail.html';  // 포장 주문 화면으로 이동
    },

    // 홈으로 가기
    goHome: function() {
        // 장바구니와 팝업 내용 초기화
        localStorage.removeItem('cart'); // 로컬 스토리지에 저장된 장바구니 초기화
        this.cart = []; // 전역 cart 배열 초기화

        // index.html로 이동
        window.location.href = 'index.html';
    }
};

// 페이지 로드 시 기본 메뉴 설정
window.onload = () => {
    App.changeMenu('coffee');
    document.getElementById('orderButton').addEventListener('click', () => App.openOrderPopup());
    document.getElementById('homeButton').addEventListener('click', () => App.goHome());
};

// 마우스 포인터 강조
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.pageX}px`;
        cursor.style.top = `${event.pageY}px`;
    });
});
