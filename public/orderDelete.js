document.addEventListener('DOMContentLoaded', () => {
    loadOrderHistory(); // 주문 내역 로드
    document.getElementById('deleteButton').addEventListener('click', deleteOrders); // 삭제 버튼 클릭 이벤트
});

function loadOrderHistory() {
    fetch('/api/orders') // 주문 내역 API 엔드포인트
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('orderTable').getElementsByTagName('tbody')[0];

            data.forEach(order => {
                const row = tableBody.insertRow();

                const cellOrderId = row.insertCell(0);
                const cellMethod = row.insertCell(1);
                const cellMenuNames = row.insertCell(2);
                const cellQuantitySum = row.insertCell(3);
                const cellTotalPrice = row.insertCell(4);
                const cellOrderDate = row.insertCell(5);

                cellOrderId.innerText = order.order_id; // 주문 번호
                cellMethod.innerText = order.order_type; // 주문 유형
                cellMenuNames.innerText = order.menu_names; // 메뉴 이름
                cellQuantitySum.innerText = order.quantity_sum; // 메뉴 개수 합
                cellTotalPrice.innerText = `${order.total_price}원`; // 총 가격
                cellOrderDate.innerText = new Date(order.order_date).toLocaleString(); // 주문 날짜 포맷
            });
        })
        .catch(error => {
            console.error('주문 내역을 가져오는 데 오류가 발생했습니다:', error);
        });
}

function deleteOrders() {
    fetch('/api/delete-orders', { // 데이터 삭제 API 엔드포인트
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('주문 데이터가 성공적으로 삭제되었습니다.');
            clearOrderTable(); // 테이블 내용 지우기
        } else {
            alert('주문 데이터를 삭제하는 데 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('주문 데이터를 삭제하는 데 오류가 발생했습니다:', error);
    });
}

function clearOrderTable() {
    const tableBody = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // 테이블의 내용을 비움
}