import type { Brand } from '@/types/utils';
import type { PrismaClient } from '@prisma/client';
import { Subject } from '@/services/auth.server';
import { parseUuid } from '@/utils';
import { err, ok, type Result } from 'neverthrow';

export type MemberId = Brand<'memberId', string>;
export const MemberId = {
  from: parseUuid<'memberId'>,
};

export interface Member {
  id: MemberId;
  subject: Subject;
  createdAt: Date;
  updatedAt: Date;
  admin: boolean;
  receivedAt: Date | null;
}

export class MemberService {
  private client;
  private defaultAdmins: string[];

  public constructor(protected __client: PrismaClient, env: Env) {
    this.client = __client;
    this.defaultAdmins = env.DEFAULT_ADMINS.split(',');
  }

  public async selectFromSubject(subject: Subject): Promise<Member> {
    const res = await this.client.member.upsert({
      where: {
        subject,
      },
      create: {
        subject,
      },
      update: {
        subject,
      }
    });

    return {
      id: MemberId.from(res.id)._unsafeUnwrap(),
      subject: Subject.from(res.subject),
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      admin: res.admin === true || this.defaultAdmins.includes(res.id),
      receivedAt: res.receivedAt,
    };
  }

  public async approve(id: MemberId, receiverSubject: Subject): Promise<Result<Member, string>> {
    const member = await this.selectFromSubject(receiverSubject);
    if (!member.admin) {
      return err('管理者権限がありません');
    }

    const before = await this.client.member.findUnique({
      where: { id },
    });
    if (before == null) {
      return err('未登録のメンバーです');
    }
    if (before?.receivedAt != null) {
      return err('承認済みです');
    }

    const after = await this.client.member.update({
      data: {
        receivedBy: member.id,
        receivedAt: new Date(),
      },
      where: { id },
    });

    return ok({
      id: MemberId.from(after.id)._unsafeUnwrap(),
      subject: Subject.from(after.subject),
      createdAt: after.createdAt,
      updatedAt: after.updatedAt,
      admin: after.admin === true || this.defaultAdmins.includes(after.id),
      receivedAt: after.receivedAt,
    });
  }
}
