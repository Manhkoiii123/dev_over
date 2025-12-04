# 🚀 Hướng dẫn Setup Prisma cho Auth Service

## 📋 Tổng quan

Prisma đã được cấu hình cho Auth Service với:

- ✅ Schema: `auth` (PostgreSQL)
- ✅ Database URL được tự động generate từ config
- ✅ Prisma Client output: `@prisma/auth-client`
- ✅ Tích hợp với NestJS qua `nestjs-prisma`

## 🔧 Cấu trúc Files

```
apps/auth/
├── prisma/
│   ├── schema.prisma          # Prisma schema definition
│   └── README.md              # Hướng dẫn chi tiết
├── src/
│   ├── configuration/
│   │   └── index.ts           # Configuration với PrismaConfiguration
│   └── app/
│       ├── app.module.ts      # Import PrismaProvider
│       └── modules/auth/
│           └── services/
│               └── auth.service.ts  # Example service sử dụng Prisma
└── .env.example               # Environment variables template
```

## ⚙️ Configuration

### 1. Environment Variables

Tạo file `.env` trong `apps/auth/`:

```env
# Database Configuration
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5434
AUTH_DB_USERNAME=postgres
AUTH_DB_PASSWORD=example
AUTH_DB_DATABASE=overflow-app
```

### 2. PrismaConfiguration

Configuration được định nghĩa trong `apps/auth/src/configuration/index.ts`:

```typescript
@ValidateNested()
@Type(() => PrismaConfiguration)
PRISMA_CONFIG = new PrismaConfiguration({
  HOST: process.env['AUTH_DB_HOST'] || 'localhost',
  PORT: Number(process.env['AUTH_DB_PORT']) || 5434,
  USERNAME: process.env['AUTH_DB_USERNAME'] || 'postgres',
  PASSWORD: process.env['AUTH_DB_PASSWORD'] || 'example',
  DATABASE: process.env['AUTH_DB_DATABASE'] || 'overflow-app',
  SCHEMA: 'auth',  // Schema name cố định là 'auth'
});
```

### 3. AppModule Integration

`PrismaProvider` được import trong `app.module.ts`:

```typescript
import { PrismaProvider } from '@common/configuration/prisma.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    PrismaProvider, // Tự động tạo DATABASE_URL và connect
  ],
})
export class AppModule {}
```

## 🎯 Cách hoạt động (Prisma 7)

1. **PrismaConfiguration** trong `apps/auth/src/configuration/index.ts` được khởi tạo với constructor nhận các tham số:
   - HOST, PORT, USERNAME, PASSWORD, DATABASE, SCHEMA
2. **PrismaService** (custom service extend PrismaClient):

   - Đọc config từ `ConfigService` với key `PRISMA_CONFIG`
   - Tự động generate datasourceUrl: `postgresql://user:pass@host:port/database?schema=auth`
   - Pass `datasourceUrl` vào PrismaClient constructor (Prisma 7 requirement)
   - Auto connect/disconnect qua lifecycle hooks

3. **Schema** `auth` được sử dụng cho tất cả tables trong service này

4. **Prisma 7 Changes**:
   - ❌ Không dùng `url = env("DATABASE_URL")` trong schema.prisma
   - ✅ Pass `datasourceUrl` trực tiếp vào PrismaClient constructor
   - ✅ Đơn giản hơn, không cần adapter hay prisma.config.ts phức tạp

## 📝 Commands

### Generate Prisma Client

```bash
nx run auth:prisma:generate
# hoặc
npx prisma generate --schema apps/auth/prisma/schema.prisma
```

### Create Migration

```bash
nx run auth:prisma:migrate
# hoặc
npx prisma migrate dev --name init --schema apps/auth/prisma/schema.prisma
```

### Push Schema (Dev Only)

```bash
nx run auth:prisma:push
# hoặc
npx prisma db push --schema apps/auth/prisma/schema.prisma
```

### Open Prisma Studio

```bash
nx run auth:prisma:studio
# hoặc
npx prisma studio --schema apps/auth/prisma/schema.prisma
```

## 💻 Sử dụng trong Code

### Inject PrismaService

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../services/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
    });
  }
}
```

### Transactions

```typescript
async transferData(fromId: string, toId: string) {
  return this.prisma.$transaction(async (tx) => {
    const fromUser = await tx.user.findUnique({ where: { id: fromId } });
    const toUser = await tx.user.findUnique({ where: { id: toId } });

    // Your transaction logic here
  });
}
```

## 🗄️ Database Schema

Schema hiện tại trong `apps/auth/prisma/schema.prisma`:

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  username  String   @unique
  firstName String?  @map("first_name")
  lastName  String?  @map("last_name")
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
  @@schema("auth")
}
```

## 🚦 Bắt đầu sử dụng

1. **Tạo file .env**:

   ```bash
   cp apps/auth/.env.example apps/auth/.env
   ```

2. **Chỉnh sửa thông tin database trong .env**

3. **Generate Prisma Client**:

   ```bash
   nx run auth:prisma:generate
   ```

4. **Push schema hoặc tạo migration**:

   ```bash
   # Option 1: Push schema (dev)
   nx run auth:prisma:push

   # Option 2: Create migration (production)
   nx run auth:prisma:migrate
   ```

5. **Start service**:
   ```bash
   nx serve auth
   ```

## 📚 Lưu ý quan trọng

1. **Schema name**: `auth` - Đảm bảo schema này đã được tạo trong PostgreSQL

   ```sql
   CREATE SCHEMA IF NOT EXISTS auth;
   ```

2. **Client Output**: Prisma client được generate vào `node_modules/@prisma/auth-client`

3. **Migration files**: Sẽ được lưu trong `apps/auth/prisma/migrations/`

4. **Connection String**: Được tự động tạo trong `PrismaService` constructor, không cần set env `DATABASE_URL`

5. **Multiple Services**: Mỗi service có thể có schema riêng (auth, invoice, product, etc.)

6. **Prisma 7**: Không cần `url` trong datasource block của schema.prisma, pass `datasourceUrl` vào constructor

## 🔗 References

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Prisma](https://github.com/notiz-dev/nestjs-prisma)
- [PostgreSQL Schemas](https://www.postgresql.org/docs/current/ddl-schemas.html)
