import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { ModelSchemaRawOf } from '@/types/model';
import type { PrismaClient } from '@prisma/client';
import { toMemberDetail, toMemberDetailActive } from '@/utils/member';
import { PrismockClient } from 'prismock';

const MemberAlumni = {} as ModelSchemaRawOf<$MemberAlumni>;
const MemberActive = {} as ModelSchemaRawOf<$MemberActive>;
const MemberActiveInternal = {} as ModelSchemaRawOf<$MemberActiveInternal>;
const MemberActiveExternal = {} as ModelSchemaRawOf<$MemberActiveExternal>;

let client: PrismaClient;

beforeEach(async () => {
  client = new PrismockClient();
  await client.$connect();
});

afterEach(async () => {
  await client.$disconnect();
});

describe('部員の詳細情報 (現役生)', () => {
  it('内部生の判定ができるか', () => {
    const data = { MemberActiveInternal };
    const result = toMemberDetailActive(client, data);
    expect(result.activeType).toBe('INTERNAL');
  });

  it('外部生の判定ができるか', () => {
    const data = { MemberActiveExternal };
    const result = toMemberDetailActive(client, data);
    expect(result.activeType).toBe('EXTERNAL');
  });

  it('不正なデータを異常系として判定できるか', () => {
    const data = { MemberActiveInternal, MemberActiveExternal };
    expect(() => toMemberDetailActive(client, data)).toThrow();

    const data2 = {};
    expect(() => toMemberDetailActive(client, data2)).toThrow();
  });
});

describe('部員の詳細情報', () => {
  it('現役生の判定ができるか', () => {
    const data = { MemberActive, MemberActiveInternal };
    const result = toMemberDetail(client, data);
    expect(result.type).toBe('ACTIVE');

    const data2 = { MemberActive, MemberActiveExternal };
    const result2 = toMemberDetail(client, data2);
    expect(result2.type).toBe('ACTIVE');
  });

  it('卒業生の判定ができるか', () => {
    const data = { MemberActive, MemberAlumni };
    const result = toMemberDetail(client, data);
    expect(result.type).toBe('ALUMNI');
  });

  it('不正なデータを異常系として判定できるか', () => {
    const data = { MemberAlumni };
    expect(() => toMemberDetail(client, data)).toThrow();

    const data2 = {};
    expect(() => toMemberDetail(client, data2)).toThrow();
  });
});
