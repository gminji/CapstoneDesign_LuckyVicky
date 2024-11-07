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
});

// 포장 주문 화면을 보여주는 함수
document.getElementById('takeOutButton').addEventListener('click', function() {
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('takeOutScreen').classList.remove('hidden');
});

// 매장 식사 버튼 클릭 시 새 페이지로 이동
document.getElementById('dineInButton').addEventListener('click', function() {
    window.location.href = 'dineInDetail.html';
});

