// 장바구니 배열
let cart = [];

// 장바구니에 항목 추가 함수
function addToCart(item, price) {
    let cartItem = cart.find((cartItem) => cartItem.name === item);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ name: item, price: price, quantity: 1 });
    }
    updateCart(); // 장바구니 내용은 갱신하지만 총 가격은 표시하지 않음
}

// 장바구니 업데이트 함수
function updateCart() {
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = ''; // 기존 항목 제거

    // 장바구니에 아이템만 표시 (총 가격은 표시하지 않음)
    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}원</td>
            <td class="quantity">${item.quantity}</td>
        `;
        cartBody.appendChild(row);
    });
}

// 팝업 열기 함수
function openOrderPopup() {
    const popupCartBody = document.getElementById('popup-cart-body');
    popupCartBody.innerHTML = ''; // 팝업 내용 초기화

    // 장바구니에 있는 항목을 팝업에 추가 (총 가격 제외)
    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.price}원</td>
            <td>${item.quantity}</td>
        `;
        popupCartBody.appendChild(row);
    });

    // 팝업 창 표시
    document.getElementById('order-popup').style.display = 'flex';

    // 총 금액 업데이트
    updateTotalPrice();
}

// 총 금액 업데이트 함수
function updateTotalPrice() {
    let totalPrice = 0;

    // 장바구니의 각 항목을 순회하며 총 금액 계산
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    // 총 금액을 팝업에서만 표시 (₩ 제거하고 원 추가)
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = `${totalPrice.toLocaleString()}원`;  // 숫자 포맷팅 후 '원' 추가
}


// 팝업 닫기 함수
function closeOrderPopup() {
    document.getElementById('order-popup').style.display = 'none';
}

// 결제하기 함수
function processPayment() {
    alert('결제가 완료되었습니다!');
}

// 주문 버튼 클릭 시 팝업 창 열기
document.getElementById('orderButton').addEventListener('click', function() {
    openOrderPopup();
});

// 뒤로 가기 함수
function goBack() {
    window.history.back();
}

// 메뉴 변경 함수
function changeMenu(menuType) {
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

    for (let i = 1; i <= 6; i++) {
        document.getElementById('menu-image-' + i).src = images[menuType][i - 1];
    }
}

// 장바구니에서 항목 수량 업데이트 함수
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

    updateTotalPrice(); // 팝업에서만 총 금액 재계산
}
