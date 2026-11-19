// Turso(libSQL) 접속은 이 파일 한 곳에서만 한다 (ESLint no-restricted-imports로 강제).
// server-only: 클라이언트 컴포넌트에서 import하면 빌드가 실패한다.
import "server-only";
import { createClient, type Client } from "@libsql/client";

const REQUIRED_ENV = ["TURSO_DATABASE_URL", "TURSO_AUTH_TOKEN"] as const;

let client: Client | null = null;
let schemaReady: Promise<void> | null = null;

function createDbClient(): Client {
  // 빠진 변수의 "이름"만 알린다. 값은 절대 출력하지 않는다.
  const missing = REQUIRED_ENV.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    const message = `환경변수가 설정되지 않았습니다: ${missing.join(", ")}`;
    console.error(`[db] ${message}`);
    throw new Error(message);
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

function ensureSchema(db: Client): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .execute(
        `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          done INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )`,
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        // 실패하면 다음 요청에서 다시 시도한다.
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

/** 테이블이 준비된 DB 클라이언트를 돌려준다. */
export async function getDb(): Promise<Client> {
  if (!client) {
    client = createDbClient();
  }
  await ensureSchema(client);
  return client;
}

/** 로그용: 오류 메시지에 접속 주소가 섞일 수 있으므로 종류와 코드만 남긴다. */
export function describeDbError(error: unknown): string {
  if (error instanceof Error) {
    const code = (error as { code?: unknown }).code;
    return typeof code === "string" ? `${error.name} (${code})` : error.name;
  }
  return "Unknown error";
}
