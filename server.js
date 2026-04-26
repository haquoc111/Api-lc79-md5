// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// URL gốc của hai bàn
const BAN_HU_URL = 'https://wtx.tele68.com/v1/tx/lite-sessions?cp=R&cl=R&pf=web&at=62385f65eb49fcb34c72a7d6489ad91d';
const BAN_MD5_URL = 'https://wtxmd52.tele68.com/v1/txmd5/lite-sessions?cp=R&cl=R&pf=web&at=62385f65eb49fcb34c72a7d6489ad91d';

// Middleware để parse JSON (nếu cần gửi request body)
app.use(express.json());

// Helper function để fetch dữ liệu từ URL
async function fetchData(url, endpointName) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Một số server yêu cầu User-Agent, thêm để tránh bị chặn
                'User-Agent': 'Mozilla/5.0 (compatible; MyServer/1.0)'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error(`Lỗi khi fetch ${endpointName}:`, error.message);
        return { success: false, error: error.message };
    }
}

// API Bàn hũ
app.get('/ban-hu', async (req, res) => {
    const result = await fetchData(BAN_HU_URL, 'Bàn hũ');
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json({ error: 'Không thể lấy dữ liệu từ Bàn hũ', detail: result.error });
    }
});

// API Bàn md5
app.get('/ban-md5', async (req, res) => {
    const result = await fetchData(BAN_MD5_URL, 'Bàn md5');
    if (result.success) {
        res.json(result.data);
    } else {
        res.status(500).json({ error: 'Không thể lấy dữ liệu từ Bàn md5', detail: result.error });
    }
});

// Route kiểm tra server hoạt động
app.get('/', (req, res) => {
    res.send('Server đang chạy. Các API: GET /ban-hu , GET /ban-md5');
});

// Bắt lỗi 404
app.use((req, res) => {
    res.status(404).json({ error: 'Không tìm thấy endpoint' });
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${PORT}`);
    console.log(`- Bàn hũ: http://localhost:${PORT}/ban-hu`);
    console.log(`- Bàn md5: http://localhost:${PORT}/ban-md5`);
});