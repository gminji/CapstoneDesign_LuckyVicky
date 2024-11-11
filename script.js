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
