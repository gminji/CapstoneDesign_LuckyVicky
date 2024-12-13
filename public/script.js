document.addEventListener('DOMContentLoaded', () => {

    // 매장식사 버튼 클릭 이벤트 설정
    const dineInButton = document.getElementById('dineInButton');
    if (dineInButton) {
        dineInButton.addEventListener('click', () => {
            App.setOrderType('매장');
            App.goToDineInDetail(); // 페이지 이동
        });
    }

    // 포장주문 버튼 클릭 이벤트 설정
    const takeOutButton = document.getElementById('takeOutButton');
    if (takeOutButton) {
        takeOutButton.addEventListener('click', () => {
            App.setOrderType('포장');
            App.goToTakeOutDetail(); // 페이지 이동
        });
    }

    // 주문 버튼 클릭 이벤트 설정
    const orderButton = document.getElementById('orderButton');
    if (orderButton) {
        orderButton.addEventListener('click', () => App.openOrderPopup());
    }

    // 홈 버튼 클릭 이벤트 설정 (추가적인 버튼도 여기에 작성)
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', () => App.goHome());
    }

    // 여기에 다른 DOM 관련 초기화 작업 추가
    console.log("DOM fully loaded and parsed!");
});

const App = {
    // 주문 번호 추가
    orderNumber: 1,
    orderType: '', // 주문 유형을 저장할 변수

    // 주문 유형 설정 함수
    setOrderType: function (type) {
        this.orderType = type;
        localStorage.setItem('orderType', type); // 로컬 스토리지에 저장
        console.log(`주문 유형이 ${type}으로 설정되었습니다.`);
        console.log(`현재 orderType: ${this.orderType}`); // 추가 로그
    },

    // 메뉴 항목을 객체 배열로 정의
    menuItems: {
        coffee: [
            { id: 1, name: '아메리카노', price: 4500, image: 'img/아메리카노.jpg' },
            { id: 2, name: '연유라떼', price: 5500, image: 'img/라이트바닐라아몬드라떼.jpg' },
            { id: 3, name: '미숫가루커피', price: 6000, image: 'img/미숫가루커피.jpg' },
            { id: 4, name: '티라미수라떼', price: 6500, image: 'img/티라미수라떼.jpg' },
            { id: 5, name: '바닐라라떼', price: 5000, image: 'img/바닐라라떼.jpg' },
            { id: 6, name: '카페모카', price: 7000, image: 'img/카페모카.jpg' }
        ],
        juice: [
            { id: 7, name: '자몽주스', price: 6000, image: 'img/자몽주스.jpg' },
            { id: 8, name: '샤인머스캣주스', price: 7000, image: 'img/샤인머스캣주스.jpg' },
            { id: 9, name: '딸기주스', price: 6000, image: 'img/딸기주스.jpg' },
            { id: 10, name: '딸기바나나주스', price: 6500, image: 'img/딸기바나나주스.jpg' },
            { id: 11, name: '라임모히또', price: 6500, image: 'img/라임모히또.jpg' },
            { id: 12, name: '레몬에이드', price: 5500, image: 'img/레몬에이드.jpg' }
        ],
        smoothie: [
            { id: 13, name: '골드망고스무디', price: 6500, image: 'img/골드망고스무디.jpg' },
            { id: 14, name: '딸기스무디', price: 7000, image: 'img/딸기요거트스무디.jpg' },
            { id: 15, name: '커피프라페', price: 7000, image: 'img/커피프라페.jpg' },
            { id: 16, name: '딸기쿠키프라페', price: 6500, image: 'img/딸기쿠키프라페.jpg' },
            { id: 17, name: '쿠키프라페', price: 6000, image: 'img/쿠키프라페.jpg' },
            { id: 18, name: '녹차프라페', price: 6500, image: 'img/녹차프라페.jpg' }
        ]
    },

    // 전역 장바구니 배열
    cart: [],

    // 메뉴 변경 함수
    changeMenu: function (menuType) {
        const menuGrid = document.querySelector('.menu-grid');
        menuGrid.innerHTML = '';

        this.menuItems[menuType].forEach((menuItem) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'grid-item';

            const img = document.createElement('img');
            img.src = menuItem.image;
            img.alt = menuItem.name;
            img.className = 'grid-item-image';
            img.onclick = () => this.addToCart(menuItem.name, menuItem.price, menuItem);

            const itemName = document.createElement('div');
            itemName.className = 'menu-name';
            itemName.textContent = menuItem.name;

            const itemPrice = document.createElement('div');
            itemPrice.className = 'menu-price';
            itemPrice.textContent = `${menuItem.price}원`;

            itemDiv.appendChild(img);
            itemDiv.appendChild(itemName);
            itemDiv.appendChild(itemPrice);

            menuGrid.appendChild(itemDiv);
        });
    },

    // 장바구니에 항목을 추가하는 함수
    addToCart: function (itemName, itemPrice, menuItem) {
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

            this.cart.push({ id: menuItem.id, name: itemName, price: itemPrice, quantity: 1 });
        }
    },

    // 수량을 업데이트하는 함수
    updateQuantity: function (action, itemName, itemPrice) {
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

        // 장바구니 항목의 수량도 갱신
        this.cart.forEach(item => {
            if (item.name === itemName) {
                item.quantity = quantity;
            }
        });

        // 팝업에서 가격 갱신
        this.updatePopupPrices();
    },

    // 팝업 열기 함수
    openOrderPopup: function () {
        const popupCartBody = document.getElementById('popup-cart-body');
        popupCartBody.innerHTML = '';  // 기존 항목들 초기화

        this.cart.forEach((item) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.name}</td>
            <td class="total-price">${item.price * item.quantity}</td>
            <td>${item.quantity}</td>
        `;
            popupCartBody.appendChild(row);
        });

        document.getElementById('order-popup').style.display = 'flex';
        this.updateTotalPrice();  // 총 가격 업데이트
    },

    // 팝업에서 항목들의 가격을 갱신하는 함수
    updatePopupPrices: function () {
        const popupCartBody = document.getElementById('popup-cart-body');
        const rows = popupCartBody.querySelectorAll('tr');

        // 각 항목의 가격을 재계산하여 갱신
        rows.forEach(row => {
            const itemName = row.querySelector('td').textContent;  // 첫 번째 셀에서 이름 가져오기
            const item = this.cart.find(item => item.name === itemName);
            const totalPriceCell = row.querySelector('.total-price');
            totalPriceCell.textContent = item.price * item.quantity;  // 가격 업데이트
        });

        // 총 가격도 다시 갱신
        this.updateTotalPrice();
    },


    // 총 가격 업데이트 함수
    updateTotalPrice: function () {
        const totalPriceElement = document.getElementById('total-price');
        const totalPrice = this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalPriceElement.textContent = `${totalPrice.toFixed(0)}원`;
    },

    // 팝업 닫기 함수
    closeOrderPopup: function () {
        document.getElementById('order-popup').style.display = 'none';
    },

    processPayment: function () {
        // 서버로 보낼 주문 데이터 생성
        const orderData = {
            orderNumber: this.orderNumber,
            items: this.cart.map(item => ({
                menuId: item.id, // 메뉴 ID (데이터베이스의 menu_id와 일치)
                quantity: item.quantity,
                price: item.price,
            })),
            totalPrice: this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            orderType: localStorage.getItem('orderType') || this.orderType // 주문 유형 로컬 스토리지에서 가져오기
        };

        console.log("Order Data to be sent:", orderData);

        // 서버에 주문 데이터 전송
        fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        })
            .then(response => {
                if (response.ok) {
                    console.log('Order saved successfully.');

                    // 결제가 완료되면 장바구니를 초기화
                    this.cart = [];
                    document.getElementById("cart-body").innerHTML = '';

                    // 주문 번호 증가
                    this.orderNumber++;
                    localStorage.setItem('orderNumber', this.orderNumber);

                    // 결제 완료 페이지로 이동
                    this.closeOrderPopup();
                    window.location.href = 'orderComplete.html';
                } else {
                    console.error('Failed to save order.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('주문 처리에 실패했습니다. 다시 시도해주세요.');
            });
    },

    // 결제 완료 페이지에서 주문 번호를 처리할 함수
    handleOrderComplete: function () {
        // 주문 번호를 서버에서 가져옵니다.
        fetch('/api/getOrderNumber')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 서버에서 받은 주문 번호를 페이지에 표시
                const orderNumber = data.orderNumber; // 예를 들어, { orderNumber: 1 } 형태로 응답
                document.getElementById('order-number-display').textContent = orderNumber.toString().padStart(3, '0');
            })
            .catch(error => {
                console.error('주문 번호를 가져오는 데 실패했습니다:', error);
                document.getElementById('order-number-display').textContent = '000'; // 기본값
            });
    },

    // 뒤로 가기 함수
    goBack: function () {
        window.location.href = 'index.html';  // index.html로 이동
    },

    // 매장 식사 화면으로 이동
    goToDineInDetail: function () {
        window.location.href = 'dineInDetail.html';  // 매장 식사 화면으로 이동
    },

    // 포장 주문 화면으로 이동
    goToTakeOutDetail: function () {
        window.location.href = 'dineInDetail.html';  // 포장 주문 화면으로 이동
    },

    // 홈으로 가기
    goHome: function () {
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
