import type { ModelBuilderType, ModelSchemaOf, ModelSchemaRawOf } from '@/types/model';
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
const memberDataRaw2 = {
  id: '0188c0f2-8e47-11ec-b909-0242ac120004',
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

const memberData2 = {
  ...memberDataRaw2,
  id: MemberId.from(memberDataRaw2.id)._unsafeUnwrap(),
  subject: Subject.from(memberDataRaw2.subject),
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
    const member = Member.__build.bySelf(rawData).map((m) => m.default)._unsafeUnwrap();
    expect(member.__raw).toEqual(memberDataRaw);
  });

  it('データが正規化されるか', () => {
    const member = Member.__build.bySelf(rawData).map((m) => m.default)._unsafeUnwrap();
    expect(member.data).toEqual(memberData);
  });

  describe('READ', () => {
    it('自身の MemberId から部員モデルをコンストラクトできるか', async () => {
      (await Database.wrapResult(
        client.member.create({
          data: memberDataRaw,
        }),
      ))._unsafeUnwrap();

      const member = (await Member.from(memberData.id)).andThen((m) => m.buildBySelf())._unsafeUnwrap();
      expect(member.data).toEqual(memberData);
    });
    it('複数取得ができるか', async () => {
      (await Database.wrapResult(
        client.member.createMany({
          data: [memberDataRaw, memberDataRaw2],
        }),
      ))._unsafeUnwrap();

      const members = ((await Member.fetchMany({}))._unsafeUnwrap()).buildBySelf().map((m) => m._unsafeUnwrap());

      expect(members).toHaveLength(2);
      expect(members[0]?.data).toEqual(memberData);
      expect(members[1]?.data).toEqual(memberData2);
    });
    it('複数取得 (個数制限) ができるか', async () => {
      (await Database.wrapResult(
        client.member.createMany({
          data: [memberDataRaw, memberDataRaw2],
        }),
      ))._unsafeUnwrap();

      const members = ((await Member.fetchMany({ take: 1 }))._unsafeUnwrap()).buildBySelf().map((m) => m._unsafeUnwrap());

      expect(members).toHaveLength(1);
      expect(members[0]?.data).toEqual(memberData);
    });

    it('存在しない MemberId のときに `NO_ROWS_FOUND` になるか', async () => {
      const rMember = (await Member.from(memberData.id)).andThen((m) => m.buildBySelf());

      expect(rMember.isErr()).toBe(true);
      if (rMember.isErr()) {
        expect(rMember.error.error.type).toBe('PRISMA_BRIDGE_ERROR');
        expect(rMember.error.error.detail.type).toBe('NO_ROWS_FOUND');
      }
    });

    it('匿名アクセスのときに `PERMISSION_DENIED` になるか', async () => {
      (await Database.wrapResult(
        client.member.create({
          data: memberDataRaw,
        }),
      ))._unsafeUnwrap();

      const builder: ModelBuilderType = { type: 'ANONYMOUS' };
      const rMember = (await Member.from(memberData.id)).andThen((m) => m.build(builder));

      expect(rMember.isErr()).toBe(true);
      if (rMember.isErr()) {
        expect(rMember.error.error.type).toBe('MODEL_BUILD_ERROR');
        expect(rMember.error.error.detail.type).toBe('PERMISSION_DENIED');
      }
    });
  });
  describe('UPDATE', () => {
    it('部員の情報を更新できるか', async () => {
      (await Database.wrapResult(
        client.member.create({
          data: memberDataRaw,
        }),
      ))._unsafeUnwrap();

      const member = (await Member.from(memberData.id)).andThen((m) => m.buildBySelf())._unsafeUnwrap();
      const rUpdatedMember = await member.update({ email: 'newemail@example.com' });

      expect(rUpdatedMember.isOk()).toBe(true);
      if (rUpdatedMember.isOk()) {
        expect(rUpdatedMember.value.data).toEqual({
          ...memberData,
          email: 'newemail@example.com',
        });
      }
    });
  });
  describe('DELETE', () => {
    it('部員を削除できるか', async () => {
      (await Database.wrapResult(
        client.member.create({
          data: memberDataRaw,
        }),
      ))._unsafeUnwrap();

      const member = (await Member.from(memberData.id)).andThen((m) => m.buildBySelf())._unsafeUnwrap();
      const rDeletedMember = await member.delete();

      expect(rDeletedMember.isOk()).toBe(true);
      if (rDeletedMember.isOk()) {
        expect(rDeletedMember.value).toBeUndefined();
      }

      const rMember = (await Member.from(memberData.id)).andThen((m) => m.buildBySelf());
      expect(rMember.isErr()).toBe(true);
      if (rMember.isErr()) {
        expect(rMember.error.error.type).toBe('PRISMA_BRIDGE_ERROR');
        expect(rMember.error.error.detail.type).toBe('NO_ROWS_FOUND');
      }
    });
  });
  it('リレーション済みでないモデルでリレーションを解決できるか', () => {
    const _member = Member.__build.bySelf(rawData).map((m) => m.default)._unsafeUnwrap();
    expectTypeOf<ReturnType<typeof _member['resolveRelation']>>().not.toEqualTypeOf<never>();
  });

  it('リレーション済みのモデルでリレーションを解決できないか', () => {
    const _member = Member.__build.bySelf(rawData).map((m) => m.withResolved)._unsafeUnwrap();
    expectTypeOf<ReturnType<typeof _member['resolveRelation']>>().toEqualTypeOf<never>();
  });
});
