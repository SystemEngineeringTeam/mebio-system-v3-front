import type { Brand } from '@/types/utils';
import { parseUuid, toBrand } from '@/utils';

describe('branded type', () => {
  it('作成できるか', () => {
    const userIdRaw = 'foo';
    const userId = toBrand<'userId'>(userIdRaw);

    expect(userId).toBe(userIdRaw);
    expect(userId).toBeTypeOf('string');
    expectTypeOf(userId).toEqualTypeOf<Brand<'userId', string>>();
  });

  it('キーが異なるとエラーになるか', () => {
    const userIdRaw = 'foo';
    const userId = toBrand<'userId'>(userIdRaw);

    const paymentIdRaw = 'bar';
    const paymentId = toBrand<'paymentId'>(paymentIdRaw);

    expectTypeOf(userId).not.toEqualTypeOf<Brand<'paymentId', string>>();
    expectTypeOf(paymentId).not.toEqualTypeOf<Brand<'userId', string>>();
  });
});

describe('parse UUID', () => {
  const valid = '0188c0f2-8e47-11ec-b909-0242ac120002';
  const invalid = 'invalid';

  it('正しい UUID は OK になるか', () => {
    const result = parseUuid<'userId'>(valid);
    expect(result.isOk()).toBe(true);
  });

  it('不正な UUID は Err になるか', () => {
    const result = parseUuid<'userId'>(invalid);
    expect(result.isErr()).toBe(true);
  });
});
