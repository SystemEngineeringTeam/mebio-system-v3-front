import type { $Member } from '@/models/member';
import type { $MemberActive } from '@/models/member/active';
import type { $MemberActiveExternal } from '@/models/member/active/external';
import type { $MemberActiveInternal } from '@/models/member/active/internal';
import type { $MemberAlumni } from '@/models/member/alumni';
import type { BuildModelResult, ModelEntityOf, ModelSchemaRawOf } from '@/types/model';
import type { PartialNullable } from '@/types/utils';
import type { PrismaClient } from '@prisma/client';
import { Database } from '@/services/database.server';

export type MemberDetailActive =
  | {
    activeType: 'INTERNAL';
    ActiveData: () => BuildModelResult<ModelEntityOf<$MemberActiveInternal>>;
  }
  | {
    activeType: 'EXTERNAL';
    ActiveData: () => BuildModelResult<ModelEntityOf<$MemberActiveExternal>>;
  };

export type MemberDetail =
  | {
    type: 'ACTIVE';
    Data: () => BuildModelResult<ModelEntityOf<$MemberActive>>;
  } & MemberDetailActive
  | {
    type: 'ALUMNI';
    Data: () => BuildModelResult<ModelEntityOf<$MemberAlumni>>;
  };

export function toMemberDetailActive(
  client: PrismaClient,
  data: PartialNullable<{
    MemberActiveInternal: ModelSchemaRawOf<$MemberActiveInternal>;
    MemberActiveExternal: ModelSchemaRawOf<$MemberActiveExternal>;
  }>,
  builder?: ModelEntityOf<$Member>,
): MemberDetailActive {
  const models = new Database(client).models;
  const { MemberActiveInternal: internal, MemberActiveExternal: external } = data;

  if (internal != null && external != null) {
    throw new Error('不正なデータ: 現役生において, 内部生の情報と外部生の情報が両方存在します！', { cause: data });
  }

  if (internal != null) {
    return {
      activeType: 'INTERNAL',
      ActiveData: () => models.member.active.Internal.__build({ __raw: internal }, builder),
    } as const;
  }

  if (external != null) {
    return {
      activeType: 'EXTERNAL',
      ActiveData: () => models.member.active.External.__build({ __raw: external }, builder),
    } as const;
  }

  throw new Error('不正なデータ: 現役生において, 内部生の情報も外部生の情報も存在しません！', { cause: data });
}

export function toMemberDetail(
  client: PrismaClient,
  data: PartialNullable<{
    MemberAlumni: ModelSchemaRawOf<$MemberAlumni>;
    MemberActive: ModelSchemaRawOf<$MemberActive>;
    MemberActiveInternal: ModelSchemaRawOf<$MemberActiveInternal>;
    MemberActiveExternal: ModelSchemaRawOf<$MemberActiveExternal>;
  }>,
  builder?: ModelEntityOf<$Member>,
): MemberDetail {
  const models = new Database(client).models;
  const { MemberAlumni, MemberActive, MemberActiveInternal, MemberActiveExternal } = data;

  if (MemberActive == null && MemberAlumni != null) {
    throw new Error('不正なデータ: 現役生の情報が存在しないにも関わらず, 卒業生の情報が存在します！', { cause: data });
  }

  // NOTE:
  //   `MemberAlumni` が存在する場合は, 直ちに `ALUMNI` として扱う.
  //   ∵ 部員の卒業処理は, 現役生の情報 (`MemberActive`) を持ったまま卒業生の情報 (`MemberAlumni`) を追加するため.
  // see: https://aitsysken.slack.com/archives/C0867ER5WUD/p1735579525501279?thread_ts=1735573868.359969&cid=C0867ER5WUD
  if (MemberAlumni != null) {
    return {
      type: 'ALUMNI',
      Data: () => models.member.Alumni.__build({ __raw: MemberAlumni }, builder),
    } as const;
  }

  if (MemberActive != null) {
    return {
      type: 'ACTIVE',
      Data: () => models.member.Active.__build({ __raw: MemberActive }, builder),
      ...toMemberDetailActive(client, { MemberActiveInternal, MemberActiveExternal }),
    } as const;
  }

  throw new Error('不正なデータ: 現役生の情報も卒業生の情報も存在しません！', { cause: data });
};
