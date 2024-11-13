// 주문을 장바구니에 추가하는 함수
let cart = [];

function addToCart(item, price) {
    // 장바구니에 아이템 추가
    let cartItem = cart.find((cartItem) => cartItem.name === item);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ name: item, price: price, quantity: 1 });
    }
    updateCart();
}

// 장바구니 업데이트
function updateCart() {
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = ''; // 기존 항목 제거

    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.price}원</td><td>${item.quantity}</td>`;
        cartBody.appendChild(row);
    });
}

// 팝업 열기
function openOrderPopup() {
    const popupCartBody = document.getElementById('popup-cart-body');
    popupCartBody.innerHTML = ''; // 팝업 내용 초기화

    // 장바구니에 있는 항목을 팝업에 추가
    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.price}원</td><td>${item.quantity}</td>`;
        popupCartBody.appendChild(row);
    });

    // 팝업 창 표시
    document.getElementById('order-popup').style.display = 'flex';
}

// 팝업 닫기
function closeOrderPopup() {
    document.getElementById('order-popup').style.display = 'none';
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
    // 매장 식사 화면으로 이동
    window.location.href = 'dineInDetail.html';  // dineInDetail.html 페이지로 이동
});

// 포장 주문 화면을 보여주는 함수
document.getElementById('takeOutButton').addEventListener('click', function() {
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('takeOutScreen').classList.remove('hidden');
    // 포장 주문 화면으로 이동
    window.location.href = 'takeOutDetail.html';  // takeOutDetail.html 페이지로 이동
});

// 결제 버튼 클릭 시 새로운 페이지로 이동
document.getElementById('payButton').addEventListener('click', function() {
    window.location.href = 'paymentPage.html';  // 결제 페이지로 이동
});

// 메뉴 변경 함수
function changeMenu(menuType) {
    // 메뉴에 맞는 이미지 경로 설정
    let images = {
        'coffee': [
            'img/아메리카노.jpg',
            'img/라이트바닐라아몬드라떼.jpg',
            'img/미숫가루커피.jpg',
            'img/티라미수라떼.jpg',
            'img/바닐라라떼.jpg',
            'img/카페모카.jpg'
        ],
        'juice': [
            'img/자몽주스.jpg',
            'img/샤인머스캣주스.jpg',
            'img/딸기주스.jpg',
            'img/딸기바나나주스.jpg',
            'img/라임모히또.jpg',
            'img/레몬에이드.jpg'
        ],
        'smoothie': [
            'img/골드망고스무디.jpg',
            'img/코코넛커피스무디.jpg',
            'img/딸기요거트스무디.jpg',
            'img/딸기쿠키프라페.jpg',
            'img/쿠키프라페.jpg',
            'img/녹차프라페.jpg'
        ]
    };

    // 6개의 이미지 ID에 해당하는 이미지 변경
    for (let i = 1; i <= 6; i++) {
        document.getElementById('menu-image-' + i).src = images[menuType][i - 1];
    }
}

// 장바구니에 항목을 추가하는 함수
function addToCart(itemName, itemPrice) {
    // 장바구니에 이미 해당 아이템이 있는지 확인
    let cartBody = document.getElementById("cart-body");
    let existingRow = document.getElementById(itemName); // id를 상품명으로 설정
    if (existingRow) {
        // 이미 장바구니에 있는 경우, 수량만 증가
        let quantityCell = existingRow.querySelector(".quantity");
        let quantity = parseInt(quantityCell.textContent);
        quantity++;
        quantityCell.textContent = quantity;

        // 총 가격도 업데이트
        let totalPriceCell = existingRow.querySelector(".total-price");
        totalPriceCell.textContent = itemPrice * quantity;
    } else {
        // 장바구니에 없는 경우 새로운 행 추가
        let newRow = document.createElement("tr");
        newRow.id = itemName;
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td class="total-price">${itemPrice}</td> <!-- 가격은 total-price에 표시 -->
            <td>
                <button class="quantity-button" onclick="updateQuantity('minus', '${itemName}', ${itemPrice})">-</button>
                <span class="quantity">1</span>
                <button class="quantity-button" onclick="updateQuantity('plus', '${itemName}', ${itemPrice})">+</button>
            </td>
        `;
        cartBody.appendChild(newRow);
    }
}

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

    // 총 가격을 업데이트
    let totalPriceCell = row.querySelector(".total-price");
    totalPriceCell.textContent = itemPrice * quantity; // 총 가격 갱신
}

// 뒤로 가기 함수
function goBack() {
    window.history.back();
}
