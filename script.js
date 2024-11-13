let cart = [];

// 메뉴 항목을 객체 배열로 정의
const menuItems = {
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
};

// 메뉴 변경 함수
function changeMenu(menuType) {
    const menuGrid = document.querySelector('.menu-grid');
    menuGrid.innerHTML = '';

    menuItems[menuType].forEach((menuItem, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'grid-item';

        const img = document.createElement('img');
        img.src = menuItem.image;
        img.alt = menuItem.name;
        img.className = 'grid-item-image';
        img.onclick = () => addToCart(menuItem.name, menuItem.price);

        itemDiv.appendChild(img);
        menuGrid.appendChild(itemDiv);
    });
}

// 장바구니에 아이템 추가 함수
function addToCart(itemName, itemPrice) {
    let cartItem = cart.find(item => item.name === itemName);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCart();
}

// 장바구니 업데이트 함수
function updateCart() {
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = '';

    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.price}원</td><td>${item.quantity}</td>`;
        cartBody.appendChild(row);
    });
}

// 팝업 열기
function openOrderPopup() {
    const popupCartBody = document.getElementById('popup-cart-body');
    popupCartBody.innerHTML = '';

    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.price}원</td><td>${item.quantity}</td>`;
        popupCartBody.appendChild(row);
    });

    document.getElementById('order-popup').style.display = 'flex';
}

// 팝업 닫기
function closeOrderPopup() {
    document.getElementById('order-popup').style.display = 'none';
}

// 뒤로 가기 함수
function goBack() {
    window.history.back();
}

// 메인 화면을 보여주는 함수
function showMainScreen() {
    document.getElementById('mainScreen').classList.remove('hidden');
    document.getElementById('dineInScreen').classList.add('hidden');
    document.getElementById('takeOutScreen').classList.add('hidden');
}

// 매장 식사 화면을 보여주는 함수
document.getElementById('dineInButton').addEventListener('click', function() {
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('dineInScreen').classList.remove('hidden');
    window.location.href = 'dineInDetail.html';
});

// 포장 주문 화면을 보여주는 함수
document.getElementById('takeOutButton').addEventListener('click', function() {
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('takeOutScreen').classList.remove('hidden');
    window.location.href = 'takeOutDetail.html';
});

// 결제 버튼 클릭 시 새로운 페이지로 이동
document.getElementById('payButton').addEventListener('click', function() {
    window.location.href = 'paymentPage.html';
});

// 수량을 업데이트하는 함수
function updateQuantity(action, itemName, itemPrice) {
    let row = document.getElementById(itemName);
    let quantityCell = row.querySelector(".quantity");
    let quantity = parseInt(quantityCell.textContent);

    if (action === "minus" && quantity > 1) {
        quantity--;
    } else if (action === "plus") {
        quantity++;
    }

    quantityCell.textContent = quantity;

    let totalPriceCell = row.querySelector(".total-price");
    totalPriceCell.textContent = itemPrice * quantity;
}
