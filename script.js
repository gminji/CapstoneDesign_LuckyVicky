let cart = []; // 장바구니 항목을 담을 배열
let totalAmount = 0; // 총 금액

// 장바구니에 항목을 추가하는 함수
function addToCart(itemName, itemPrice) {
    let cartBody = document.getElementById("cart-body");
    let existingRow = document.getElementById(itemName); // 상품명이 id로 설정된 행 확인
    if (existingRow) {
        let quantityCell = existingRow.querySelector(".quantity");
        let quantity = parseInt(quantityCell.textContent);
        quantity++;
        quantityCell.textContent = quantity;

        let totalPriceCell = existingRow.querySelector(".total-price");
        totalPriceCell.textContent = itemPrice * quantity;
    } else {
        let newRow = document.createElement("tr");
        newRow.id = itemName;
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td class="total-price">${itemPrice}</td>
            <td>
                <button class="quantity-button" onclick="updateQuantity('minus', '${itemName}', ${itemPrice})">-</button>
                <span class="quantity">1</span>
                <button class="quantity-button" onclick="updateQuantity('plus', '${itemName}', ${itemPrice})">+</button>
            </td>
        `;
        cartBody.appendChild(newRow);
    }

    updateCart(); // 장바구니 화면 갱신
    updateTotalAmount(itemPrice); // 총 금액 갱신
}

// 장바구니 내용 갱신
function updateCart() {
    const cartBody = document.getElementById('cart-body');
    cartBody.innerHTML = ''; // 기존 항목 삭제

    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.price}원</td><td>${item.quantity}</td>`;
        cartBody.appendChild(row);
    });
}

// 총 금액 갱신
function updateTotalAmount(itemPrice) {
    totalAmount += itemPrice;
    document.getElementById("total-amount").textContent = totalAmount + "원";
}

// 수량 업데이트 함수
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

    updateCart(); // 장바구니 내용 갱신
}

// 장바구니 항목을 팝업에 추가하는 함수
function openOrderPopup() {
    const popupCartBody = document.getElementById('popup-cart-body');
    popupCartBody.innerHTML = ''; // 팝업 내용 초기화

    cart.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${item.name}</td><td>${item.price}원</td><td>${item.quantity}</td>`;
        popupCartBody.appendChild(row);
    });

    document.getElementById('order-popup').style.display = 'flex'; // 팝업 표시
}

// 팝업 닫기
function closeOrderPopup() {
    document.getElementById('order-popup').style.display = 'none'; // 팝업 숨기기
}

// 결제 페이지로 이동하는 함수
function goToPaymentPage() {
    alert('결제 페이지로 이동합니다.');
    // 예시: window.location.href = 'paymentPage.html';
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

// 주문 버튼 클릭 시 팝업 열기
document.getElementById('orderButton').addEventListener('click', function() {
    openOrderPopup();
});
