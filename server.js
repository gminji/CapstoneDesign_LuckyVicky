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
    const { orderNumber, items, totalPrice, orderType } = req.body;
    console.log('Received order data:', req.body);  // 클라이언트로부터 받은 주문 데이터 확인
    try {
        const connection = await mysql.createConnection(dbConfig);
        // consumer_orders에 주문 생성
        console.log('Inserting order into consumer_orders...');
        const [orderResult] = await connection.execute(
            'INSERT INTO consumer_orders (total_price, order_date, order_type) VALUES (?, NOW(), ?)',
            [totalPrice, orderType]
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
            SELECT 
                o.order_id, 
                GROUP_CONCAT(m.menu_name SEPARATOR ', ') AS menu_names, 
                SUM(oi.quantity) AS quantity_sum, 
                o.total_price,
                o.order_date,
                o.order_type
            FROM 
                consumer_orders o
            JOIN 
                order_items oi ON o.order_id = oi.order_id
            JOIN 
                menu_items m ON oi.menu_id = m.menu_id
            GROUP BY 
                o.order_id
        `);
        connection.end();
        console.log('Orders retrieved:', rows);
        res.json(rows);
    } catch (err) {
        console.error('Error occurred:', err.stack); // 에러 로그 출력
        res.status(500).send('Failed to create order.'); // 에러 응답
    }
});

// 최신 주문 번호 가져오기
app.get('/api/getOrderNumber', async (req, res) => {
    try {
        console.log('Fetching latest order number from database...');
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT MAX(order_id) AS latestOrderNumber FROM consumer_orders');
        
        // 최신 주문 번호가 없으면 0으로 설정
        const latestOrderNumber = rows[0].latestOrderNumber || 0;
        connection.end();
        console.log('Latest order number retrieved:', latestOrderNumber);
        res.json({ orderNumber: latestOrderNumber}); // 다음 주문 번호를 반환
    } catch (err) {
        console.error('Error occurred:', err.stack);
        res.status(500).send('Failed to fetch order number.');
    }
});

// 기본 경로 처리
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 주문 데이터 삭제 및 AUTO_INCREMENT 초기화
app.delete('/api/delete-orders', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    try {
        await connection.beginTransaction();

        // 주문 항목 삭제
        await connection.execute('DELETE FROM order_items');

        // 주문 삭제
        await connection.execute('DELETE FROM consumer_orders');

        // AUTO_INCREMENT 값 초기화
        await connection.execute('ALTER TABLE consumer_orders AUTO_INCREMENT = 1');
        await connection.execute('ALTER TABLE order_items AUTO_INCREMENT = 1');

        await connection.commit();
        res.send('주문 데이터 삭제 및 초기화 완료');
    } catch (error) {
        await connection.rollback();
        console.error('주문 데이터 삭제 중 오류 발생:', error);
        res.status(500).send('주문 데이터를 삭제하는 데 오류가 발생했습니다.');
    } finally {
        await connection.end();
    }
});

// 서버 시작
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});