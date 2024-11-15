document.addEventListener('DOMContentLoaded', () => {
    // 음성 안내 버튼 클릭 이벤트
    const voiceButton = document.getElementById('voiceButton');
    voiceButton.addEventListener('click', () => {
        Voice.voiceGuide();  // 음성 안내 실행
    });

    // 음성 인식 버튼 클릭 이벤트
    const voiceRecognitionButton = document.getElementById('voiceRecognitionButton');
    voiceRecognitionButton.addEventListener('click', () => {
        Voice.voiceRecognition();  // 음성 인식 실행
    });
});

// 기존 voice.js 내용
const Voice = {
    // 음성 안내 기능
    voiceGuide: function() {
        const message = "원하시는 메뉴를 선택해주세요. 음성 인식 버튼을 눌러 주문하실 수 있습니다.";
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'ko-KR'; // 한국어 설정
        speechSynthesis.speak(utterance);
    },

    // 음성 인식 기능
    voiceRecognition: function() {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ko-KR'; // 한국어 설정

        recognition.onstart = () => {
            console.log("음성 인식 시작");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("인식된 음성:", transcript);

            // 메뉴 항목을 인식하여 장바구니에 추가
            if (transcript.includes("커피")) {
                App.changeMenu("coffee");
                this.addToCartFromSpeech(transcript, "coffee");
            } else if (transcript.includes("주스")) {
                App.changeMenu("juice");
                this.addToCartFromSpeech(transcript, "juice");
            } else if (transcript.includes("스무디")) {
                App.changeMenu("smoothie");
                this.addToCartFromSpeech(transcript, "smoothie");
            } else {
                alert("알 수 없는 명령어입니다.");
            }
        };

        recognition.onerror = (event) => {
            console.error("음성 인식 오류:", event.error);
            alert("음성 인식에 실패했습니다. 다시 시도해주세요.");
        };

        recognition.start();
    },

    // 음성 인식된 텍스트에서 메뉴 아이템을 찾아 장바구니에 추가
    addToCartFromSpeech: function(transcript, menuType) {
        // 각 카테고리의 메뉴 아이템 배열
        const menu = App.menuItems[menuType];

        // 텍스트에서 메뉴 이름을 추출 (예: "아메리카노" 또는 "주스")
        const item = menu.find(menuItem => transcript.includes(menuItem.name));

        if (item) {
            console.log(`${item.name}을 장바구니에 추가합니다.`);
            App.addToCart(item.name, item.price);  // 장바구니에 추가하는 함수 호출
        } else {
            alert("해당 메뉴 항목을 찾을 수 없습니다.");
        }
    }
};
