// 자연어 처리 유틸리티 객체
const NaturalLanguageProcessor = {
    // 음성 텍스트에서 불필요한 단어(불용어)를 제거하는 전처리 함수
    preprocessTranscript: function(transcript) {
        const stopwords = [
            "한잔", "한 잔", "잔", "하나", "둘", "셋", "개", "추가", "해주세요",
            "주세요", "부탁", "주문", "시키", "싶어", "할게요", "해줘", "있나요",
            "있어", "있니", "있습니까", "좀", "더", "할래", "먹고", "싶다", "같은"
        ];

        let cleaned = transcript.toLowerCase(); // 소문자로 통일

        // 불용어 제거
        stopwords.forEach(word => {
            const regex = new RegExp(word, 'g');
            cleaned = cleaned.replace(regex, '');
        });

        // 공백 제거 후 반환
        cleaned = cleaned.replace(/\s+/g, '').trim();
        return cleaned;
    }
};

// 최근 요청된 메뉴 카테고리를 기억
let lastMenuCategory = null;

// 음성 처리 관련 로직을 담은 객체
const Voice = {
    // 음성 안내 후 음성 인식을 시작
    voiceRecognition: function () {
        const message = "원하시는 메뉴를 말씀해주세요. 예: 아메리카노 한 잔, 달콤한 음료 추천해줘, 결제할게요";
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'ko-KR';

        utterance.onend = () => {
            console.log("음성 안내 끝. 음성 인식 시작");
            this.startRecognition(); // 안내 끝난 뒤 음성 인식 시작
        };

        speechSynthesis.cancel(); // 중복 음성 방지
        speechSynthesis.speak(utterance); // 안내 음성 실행
    },

    // 음성 인식 로직 시작
    startRecognition: function () {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ko-KR';

        recognition.onstart = () => console.log("🎙 음성 인식 시작");

        // 음성 인식 결과 처리
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            console.log("🎤 인식된 음성:", transcript);

            // 단일 메뉴 카테고리로 이동
            if (["커피", "주스", "스무디", "프라페"].includes(transcript)) {
                if (transcript === "커피") App.changeMenu("coffee");
                else if (transcript === "주스") App.changeMenu("juice");
                else App.changeMenu("smoothie");
                this.speakText(`${transcript} 메뉴로 이동합니다.`);
                return;
            }

            // "그 중" 키워드로 다중 태그 필터링
            if (transcript.includes("그 중") && lastMenuCategory !== null) {
                const keywordMap = {
                    "달콤": "달콤함", "시원": "차가움", "쓴": "쓴맛", "카페인": "카페인",
                    "무카페인": "무카페인", "따뜻": "따뜻함", "과일": "과일", "새콤": "새콤함", "상큼": "상큼함"
                };

                const tagsToFilter = Object.entries(keywordMap)
                    .filter(([k]) => transcript.includes(k))
                    .map(([, v]) => v);

                const filteredItems = App.menuItems[lastMenuCategory].filter(item =>
                    tagsToFilter.every(tag => item.tags.includes(tag))
                );

                if (filteredItems.length > 0) {
                    const names = filteredItems.map(item => item.name).join(', ');
                    this.speakText(`그 중 ${tagsToFilter.join(" ")} 메뉴는 ${names}입니다.`);
                } else {
                    this.speakText(`해당 조건에 맞는 메뉴가 없습니다.`);
                }
                return;
            }

            // "메뉴", "뭐", "보여" 등으로 메뉴 요청
            if (transcript.includes("메뉴") || transcript.includes("뭐") || transcript.includes("보여")) {
                if (transcript.includes("커피")) return this.readMenuItems("coffee");
                if (transcript.includes("주스")) return this.readMenuItems("juice");
                if (transcript.includes("스무디") || transcript.includes("프라페")) return this.readMenuItems("smoothie");
            }

            // 장바구니 아이템 제거
            if (transcript.includes("빼줘") || transcript.includes("삭제") || transcript.includes("지워")) {
                this.handleCartRemoval(transcript);
            }
            // 추천 요청
            else if (transcript.includes("추천")) {
                this.handleMenuRecommendation(transcript);
            }
            // 결제 요청
            else if (transcript.includes("결제") || transcript.includes("계산")) {
                this.speakText("결제를 진행합니다.");
                App.processPayment();
            }
            // 장바구니 초기화
            else if (transcript.includes("장바구니 비워") || transcript.includes("초기화")) {
                this.speakText("장바구니를 초기화합니다.");
                App.cart = [];
                const cartBody = document.getElementById("cart-body");
                if (cartBody) cartBody.innerHTML = '';
                App.updatePopupPrices?.();
            }
            // 홈 화면 이동
            else if (transcript.includes("처음으로") || transcript.includes("홈으로")) {
                this.speakText("처음 화면으로 이동합니다.");
                App.goHome();
            }
            // 장바구니에 메뉴 추가 시도
            else {
                this.addToCartFromSpeech(transcript);
            }
        };

        // 인식 오류 처리
        recognition.onerror = (event) => {
            console.error("음성 인식 오류:", event.error);
            this.speakText("음성 인식에 실패했습니다. 다시 시도해주세요.");
        };

        try {
            recognition.start();
        } catch (error) {
            console.error("음성 인식 초기화 오류:", error);
            alert("마이크 권한을 허용해주세요.");
        }
    },

    // 특정 메뉴 카테고리 메뉴 이름을 읽어줌
    readMenuItems: function (menuType) {
        lastMenuCategory = menuType;
        const items = App.menuItems[menuType] || [];
        if (items.length === 0) {
            this.speakText("해당 메뉴가 없습니다.");
            return;
        }
        const itemNames = items.map(item => item.name).join(", ");
        const categoryName = menuType === 'coffee' ? '커피' : menuType === 'juice' ? '주스' : '스무디';
        this.speakText(`${categoryName} 메뉴는 ${itemNames}가 있습니다.`);
    },

    // TTS로 텍스트 읽어줌
    speakText: function (text) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        speechSynthesis.speak(utterance);
    },

    // 음성 명령으로 장바구니에 항목 추가
    addToCartFromSpeech: function (transcript) {
        const cleanedTranscript = NaturalLanguageProcessor.preprocessTranscript(transcript);
        const allMenus = Object.values(App.menuItems).flat();

        const item = allMenus.sort((a, b) => b.name.length - a.name.length)
            .find(menuItem => cleanedTranscript.includes(menuItem.name.replace(/\s/g, '')));

        if (item) {
            App.addToCart(item.name, item.price, item.tags);
            this.speakText(`${item.name}을 장바구니에 추가했습니다.`);
        } else {
            this.speakText("해당 메뉴 항목을 찾을 수 없습니다.");
            alert("해당 메뉴 항목을 찾을 수 없습니다.");
        }
    },

    // 장바구니 항목 제거 처리
    handleCartRemoval: function (transcript) {
        const allItems = Object.values(App.menuItems).flat();
        const cleaned = NaturalLanguageProcessor.preprocessTranscript(transcript);

        const matchedItem = allItems.sort((a, b) => b.name.length - a.name.length)
            .find(item => cleaned.includes(item.name.replace(/\s/g, '')));

        if (!matchedItem) {
            this.speakText("해당 메뉴 항목을 찾을 수 없습니다.");
            alert("해당 메뉴 항목을 찾을 수 없습니다.");
            return;
        }

        const itemName = matchedItem.name;
        const cartItem = App.cart.find(item => item.name === itemName);

        if (!cartItem) {
            this.speakText(`${itemName}은(는) 장바구니에 없습니다.`);
            alert(`${itemName}은(는) 장바구니에 없습니다.`);
            return;
        }

        const isAllRemove = /다|모두|전체/.test(transcript);
        const isSingleRemove = /한|하나|1/.test(transcript);

        // 전체 제거
        if (isAllRemove || cartItem.quantity === 1 || !isSingleRemove) {
            const row = document.getElementById(itemName);
            if (row) row.remove();
            App.cart = App.cart.filter(item => item.name !== itemName);
            this.speakText(`${itemName}을 장바구니에서 제거했습니다.`);
        } else {
            // 수량만 1 감소
            cartItem.quantity -= 1;
            const row = document.getElementById(itemName);
            const quantityCell = row.querySelector(".quantity");
            const totalPriceCell = row.querySelector(".total-price");
            quantityCell.textContent = cartItem.quantity;
            totalPriceCell.textContent = cartItem.quantity * cartItem.price;
            this.speakText(`${itemName} 한 잔을 뺐습니다.`);
        }

        App.updatePopupPrices?.();
    },

    // 메뉴 추천 요청 처리
    handleMenuRecommendation: function (input) {
        const recommended = this.recommendMenu(input);
        if (recommended.length > 0) {
            this.speakText(`추천 메뉴는 ${recommended.join(', ')}입니다.`);
        } else {
            this.speakText("죄송합니다. 추천할 수 있는 메뉴가 없습니다.");
        }
    },

    // 메뉴 추천 알고리즘 (태그 매칭 기반)
    recommendMenu: function (input) {
        const keywordMap = {
            "달콤": "달콤함", "시원": "차가움", "쓴": "쓴맛", "카페인": "카페인",
            "무카페인": "무카페인", "따뜻": "따뜻함", "과일": "과일", "새콤": "새콤함", "상큼": "상큼함"
        };

        const matchedTags = Object.entries(keywordMap)
            .filter(([k]) => input.includes(k))
            .map(([, v]) => v);

        if (matchedTags.length === 0) return [];

        const allMenus = Object.values(App.menuItems).flat();

        // 태그 매칭 점수 계산 및 상위 3개 반환
        const scoredMenus = allMenus.map(item => {
            const tags = item.tags || [];
            const matchedCount = matchedTags.filter(tag => tags.includes(tag)).length;
            return { name: item.name, score: matchedCount };
        });

        return scoredMenus.filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(m => m.name);
    }
};

// DOM 로딩 후 음성 인식 버튼 리스너 연결
document.addEventListener("DOMContentLoaded", () => {
    const voiceButton = document.getElementById("voiceButton");
    const voiceRecognitionButton = document.getElementById("voiceRecognitionButton");

    if (voiceButton) {
        voiceButton.addEventListener("click", () => {
            if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
                alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
                return;
            }
            Voice.voiceRecognition();
        });
    }

    if (voiceRecognitionButton) {
        voiceRecognitionButton.addEventListener("click", () => {
            Voice.startRecognition();
        });
    }
});
