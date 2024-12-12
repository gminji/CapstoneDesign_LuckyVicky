const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


const app = express();

// CORS 미들웨어 추가 - 모든 도메인에서 요청을 허용
app.use(cors());

// JSON 본문 파싱 미들웨어
app.use(bodyParser.json());

// 데이터베이스 연결 설정
const dbConfig = {
    host: '34.64.188.16', // 데이터베이스 호스트
    user: 'gminji',      // 사용자 이름
    password: 'kiosk123', // 비밀번호
    database: 'kiosk', // 데이터베이스 이름
};

// 정적 파일 제공 (public 폴더)
app.use(express.static(path.join(__dirname, 'public')));

// 메뉴 목록 가져오기
app.get('/api/menu', async (req, res) => {
    try {
        console.log('Fetching menu items from database...');
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM menu_items');
        connection.end();
        console.log('Menu items retrieved:', rows);
        res.json(rows);
    } catch (err) {
            console.error('Error occurred:', err.stack);
            res.status(500).send('Failed to create order.');
    }
});

// 장바구니 데이터 삽입
app.post('/api/cart', async (req, res) => {
    const { orderNumber, items, totalPrice } = req.body;
    console.log('Received order data:', req.body);  // 클라이언트로부터 받은 주문 데이터 확인
    try {
        const connection = await mysql.createConnection(dbConfig);
        // consumer_orders에 주문 생성
        console.log('Inserting order into consumer_orders...');
        const [orderResult] = await connection.execute(
            'INSERT INTO consumer_orders (total_price, order_date) VALUES (?, NOW())',
            [totalPrice]
        );

        console.log('Order inserted:', orderResult);

        // order_items에 각 항목 추가
        const orderId = orderResult.insertId;
        for (const item of items) {
            console.log('Inserting item:', item);
            await connection.execute(
                'INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.menuId, item.quantity, item.price]
            );
        }
        connection.end();
        console.log('Order and items inserted successfully');
        res.send('Order created successfully.');
    } catch (err) {
        console.error('Error occurred:', err.stack); // 에러 로그 출력
        res.status(500).send('Failed to create order.'); // 에러 응답
    }
});

// 주문 내역 가져오기
app.get('/api/orders', async (req, res) => {
    try {
        console.log('Fetching orders from database...');
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT o.order_id, o.total_price, o.order_date, 
                   oi.menu_id, oi.quantity, oi.price 
            FROM consumer_orders o
            JOIN order_items oi ON o.order_id = oi.order_id
        `);
        connection.end();
        console.log('Orders retrieved:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error occurred:', err.stack); // 에러 로그 출력
        res.status(500).send('Failed to create order.'); // 에러 응답
    }
});

// 기본 경로 처리
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});