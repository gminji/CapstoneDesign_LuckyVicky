let cart = []; // 장바구니 항목을 담을 배열
let totalAmount = 0; // 총 금액

// 매장 식사 화면으로 바로 이동
document.getElementById('dineInButton').addEventListener('click', function() {
    window.location.href = 'dineInDetail.html';  
});

// 포장 주문 화면을 보여주는 함수
document.getElementById('takeOutButton').addEventListener('click', function() {
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('takeOutScreen').classList.remove('hidden');
});

// 결제 버튼 클릭 시 새로운 페이지로 이동
document.getElementById('payButton').addEventListener('click', function() {
    window.location.href = 'paymentPage.html';  // 결제 페이지로 이동
});

// 뒤로가기 버튼 기능
document.getElementById('back-button').addEventListener('click', function() {
    window.location.href = 'index.html';  // index.html 페이지로 이동
});

// 장바구니에 항목을 추가하는 함수
function addToCart(itemName, itemPrice) {
    let cartBody = document.getElementById("cart-body");
    // cart 배열에서 해당 항목을 찾음
    let item = cart.find(item => item.name === itemName);
    if (item) {
        item.quantity++;  // 수량 증가
    } else {
        item = { name: itemName, price: itemPrice, quantity: 1 };
        cart.push(item);  // 새 항목 추가
    }

    updateCart();  // 장바구니 화면 갱신
    updateTotalAmount(itemPrice);  // 총 금액 갱신
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

// 주문 버튼 클릭 시 팝업 열기
document.getElementById('orderButton').addEventListener('click', function() {
    openOrderPopup();
});

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

    let menuImages = images[menuType];
    for (let i = 1; i <= 6; i++) {
        if (menuImages[i - 1]) {
            document.getElementById('menu-image-' + i).src = menuImages[i - 1];
        }
    }
}

// 메뉴 버튼 클릭 시 changeMenu 호출
document.querySelector('.left-icons .icon-circle:nth-child(1)').addEventListener('click', function() {
    changeMenu('coffee');
});

document.querySelector('.left-icons .icon-circle:nth-child(2)').addEventListener('click', function() {
    changeMenu('juice');
});

document.querySelector('.left-icons .icon-circle:nth-child(3)').addEventListener('click', function() {
    changeMenu('smoothie');
});
