# @nestjs-libs/example-lib

example-lib integration for NestJS applications.

## Installation

```bash
npm install @nestjs-libs/example-lib
# or
pnpm add @nestjs-libs/example-lib
# or
yarn add @nestjs-libs/example-lib
```

## Usage

```typescript
import { Module } from '@nestjs/common';
import { ExampleUlibModule } from '@nestjs-libs/example-lib';

@Module({
  imports: [ExampleUlibModule],
})
export class AppModule {}
```

## License

MIT
