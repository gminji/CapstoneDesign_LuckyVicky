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
    menuGrid.innerHTML = ''; // 기존 메뉴 초기화

    menuItems[menuType].forEach((menuItem) => {
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

// 장바구니에 항목을 추가하는 함수
function addToCart(itemName, itemPrice) {
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

    if (action === "minus") {
        if (quantity > 1) {
            quantity--;
        } else if (quantity === 1) {
            // 수량이 1일 때 - 버튼을 누르면 항목을 삭제
            row.remove();
            return; // 삭제 후 더 이상 실행하지 않음
        }
    } else if (action === "plus") {
        quantity++;
    }

    quantityCell.textContent = quantity;

    // 총 가격을 재계산
    let totalPriceCell = row.querySelector(".total-price");
    totalPriceCell.textContent = itemPrice * quantity;
}

// 페이지 로드 후 기본 메뉴(커피) 표시
window.onload = () => {
    changeMenu('coffee');  // 기본적으로 'coffee' 메뉴를 표시
};

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
    window.location.href = 'index.html';  // index.html로 이동
}

// 매장 식사 화면으로 이동
function goToDineInDetail() {
    window.location.href = 'dineInDetail.html';  // 매장 식사 화면으로 이동
}

// 포장 주문 화면으로 이동
function goToTakeOutDetail() {
    window.location.href = 'dineInDetail.html';  // 포장 주문 화면으로 이동
}
