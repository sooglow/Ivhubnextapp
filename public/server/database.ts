// lib/server/database.ts
import sql from "mssql";

const config = {
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 60000,
        requestTimeout: 60000,
        enableArithAbort: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 60000,
    },
};

let pool: sql.ConnectionPool | null = null;

// 연결 테스트 함수
export async function testConnection() {
    const configs = [{ name: "기본 설정", config }];

    for (const { name, config } of configs) {
        console.log(`\n${name} 테스트 중...`);

        try {
            const pool = await sql.connect(config);
            console.log(`✅ ${name}: 연결 성공!`);
            await pool.close();
            return config; // 성공한 설정 반환
        } catch (error) {
            console.log(`❌ ${name}: 연결 실패`);
            console.log(`오류: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    throw new Error("모든 설정으로 연결 실패");
}

export async function getConnection(): Promise<sql.ConnectionPool> {
    if (!pool) {
        pool = await sql.connect(config);
        console.log("Connected to MSSQL successfully");
    }
    return pool;
}

export async function closeConnection(): Promise<void> {
    if (pool) {
        await pool.close();
        pool = null;
        console.log("Database connection closed");
    }
}

export { sql };
