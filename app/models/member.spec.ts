import type { ModelSchemaOf, ModelSchemaRawOf } from '@/types/model';
import type { PrismaClient } from '@prisma/client';
import type { $Member } from './member';
import { Database } from '@/services/database.server';
import { PrismockClient } from 'prismock';
import { __Member, MemberId, Subject } from './member';

const memberDataRaw = {
  id: '0188c0f2-8e47-11ec-b909-0242ac120002',
  subject: 'foo|bar',
  securityRole: 'MEMBER',
  email: 'sample@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
} as const satisfies ModelSchemaRawOf<$Member>;

const memberData = {
  ...memberDataRaw,
  id: MemberId.from(memberDataRaw.id)._unsafeUnwrap(),
  subject: Subject.from(memberDataRaw.subject),
} as const satisfies ModelSchemaOf<$Member>;

describe('部員モデル', () => {
  let client: PrismaClient;
  let Member: ReturnType<typeof __Member>;

  beforeEach(async () => {
    client = new PrismockClient();
    Member = __Member(client);
    await client.$connect();
  });

  afterEach(async () => {
    await client.$disconnect();
  });

  it('生データから作成できるか', () => {
    expect(() => new Member(memberDataRaw)).not.toThrow();
  });

  it('生データを取得できるか', () => {
    const member = new Member(memberDataRaw);
    expect(member.__raw).toEqual(memberDataRaw);
  });

  it('データが正規化されるか', () => {
    const member = new Member(memberDataRaw);
    expect(member.data).toEqual(memberData);
  });

  it('部員 ID から部員モデルをコンストラクトできるか', async () => {
    (await Database.transformResult(
      client.member.create({
        data: memberDataRaw,
      }),
    ))._unsafeUnwrap();

    const memberId = memberData.id;
    const member = (await Member.from(memberId))._unsafeUnwrap();

    expect(member.data).toEqual(memberData);
  });

  it('不正な部員 ID のときに `NO_ROWS_FOUND` になるか', async () => {
    const memberId = memberData.id;
    const rMember = await Member.from(memberId);

    expect(rMember.isErr()).toBe(true);
    if (rMember.isErr()) {
      expect(rMember.error.type).toBe('NO_ROWS_FOUND');
    }
  });

  it('リレーション済みでないモデルでリレーションを解決できるか', () => {
    const _member = new Member(memberDataRaw);
    expectTypeOf<ReturnType<typeof _member['resolveRelation']>>().not.toEqualTypeOf<never>();
  });

  it('リレーション済みのモデルでリレーションを解決できないか', () => {
    const _member = new Member<'WITH_RESOLVED'>(memberDataRaw /* 本当は第 2 引数に ResolvedRaw が必要 */);
    expectTypeOf<ReturnType<typeof _member['resolveRelation']>>().toEqualTypeOf<never>();
  });
});
