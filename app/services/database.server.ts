import type { PrismaClient } from '@prisma/client';
import { $Member } from '@/models/member';
import { $MemberActive } from '@/models/member/active';
import { $MemberActiveExternal } from '@/models/member/active/external';
import { $MemberActiveInternal } from '@/models/member/active/internal';
import { $MemberAlumni } from '@/models/member/alumni';
import { $MemberBase } from '@/models/member/base';
import { $MemberSensitive } from '@/models/member/sensitive';
import { $MemberStatus } from '@/models/member/status';
import { $Payment } from '@/models/payment';
import { $Snapshot } from '@/models/snapshot';

export class Database {
  public models;
  public modelsFlat;

  public constructor(protected client: PrismaClient) {
    this.models = {
      Member: $Member.with(client),
      member: {
        Status: $MemberStatus.with(client),
        Base: $MemberBase.with(client),
        Sensitive: $MemberSensitive.with(client),
        Active: $MemberActive.with(client),
        active: {
          Internal: $MemberActiveInternal.with(client),
          External: $MemberActiveExternal.with(client),
        },
        Alumni: $MemberAlumni.with(client),
      },
      Payment: $Payment.with(client),
      Snapshot: $Snapshot.with(client),
    };

    this.modelsFlat = {
      Member: $Member.with(client),
      MemberStatus: $MemberStatus.with(client),
      MemberBase: $MemberBase.with(client),
      MemberSensitive: $MemberSensitive.with(client),
      MemberActive: $MemberActive.with(client),
      MemberActiveInternal: $MemberActiveInternal.with(client),
      MemberActiveExternal: $MemberActiveExternal.with(client),
      MemberAlumni: $MemberAlumni.with(client),
      Payment: $Payment.with(client),
      Snapshot: $Snapshot.with(client),
    };
  }
}
