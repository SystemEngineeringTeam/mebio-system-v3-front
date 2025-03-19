import type { ModelSchemaOf, ModelSchemaRawOf } from '@/types/model';
import type { PrismaClient } from '@prisma/client';
import { Database } from '@/services/database.server';
import { PrismockClient } from 'prismock';
import { $Member, MemberId, Subject } from './member';

const memberDataRaw = {
  id: '0188c0f2-8e47-11ec-b909-0242ac120002',
  subject: 'foo|bar',
  securityRole: 'MEMBER',
  email: 'sample@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
} as const satisfies ModelSchemaRawOf<$Member>;
const rawData = { __raw: memberDataRaw, __rawResolved: undefined };

const memberData = {
  ...memberDataRaw,
  id: MemberId.from(memberDataRaw.id)._unsafeUnwrap(),
  subject: Subject.from(memberDataRaw.subject),
} as const satisfies ModelSchemaOf<$Member>;

describe('部員モデル', () => {
  let client: PrismaClient;
  let Member: ReturnType<typeof $Member['with']>;

  beforeEach(async () => {
    client = new PrismockClient();
    Member = $Member.with(client);
    await client.$connect();
  });

  afterEach(async () => {
    await client.$disconnect();
  });

  it('生データから作成できるか', () => {
    const rBuild = Member.__build.bySelf(rawData);
    expect(() => rBuild._unsafeUnwrap().default).not.toThrow();
  });

  it('生データを取得できるか', () => {
    const member = Member.__build.bySelf(rawData)._unsafeUnwrap().default;
    expect(member.__raw).toEqual(memberDataRaw);
  });

  it('データが正規化されるか', () => {
    const member = Member.__build.bySelf(rawData)._unsafeUnwrap().default;
    expect(member.data).toEqual(memberData);
  });

  it('自身の MemberId から部員モデルをコンストラクトできるか', async () => {
    (await Database.transformResult(
      client.member.create({
        data: memberDataRaw,
      }),
    ))._unsafeUnwrap();

    const member = (await Member.from(memberData.id))._unsafeUnwrap().buildBySelf()._unsafeUnwrap();
    expect(member.data).toEqual(memberData);
  });

  it('存在しない MemberId のときに `NO_ROWS_FOUND` になるか', async () => {
    const rMember = (await Member.from(memberData.id)).map((m) => m.buildBySelf()._unsafeUnwrap());

    expect(rMember.isErr()).toBe(true);
    if (rMember.isErr()) {
      expect(rMember.error.type).toBe('NO_ROWS_FOUND');
    }
  });

  it('リレーション済みでないモデルでリレーションを解決できるか', () => {
    const _member = Member.__build.bySelf(rawData)._unsafeUnwrap().default;
    expectTypeOf<ReturnType<typeof _member['resolveRelation']>>().not.toEqualTypeOf<never>();
  });

  it('リレーション済みのモデルでリレーションを解決できないか', () => {
    const _member = Member.__build.bySelf(rawData)._unsafeUnwrap().withResolved;
    expectTypeOf<ReturnType<typeof _member['resolveRelation']>>().toEqualTypeOf<never>();
  });
});
