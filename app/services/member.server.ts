import type { Brand } from '@/types/utils';
import type { PrismaClient } from '@prisma/client';
import { Subject } from '@/services/auth.server';
import { parseUuid } from '@/utils';

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
}

export class MemberService {
  private client;
  private defaultAdmins: string[];

  public constructor(protected __client: PrismaClient, env: Env) {
    this.client = __client;
    this.defaultAdmins = env.DEFAULT_ADMINS.split(',');
  }

  public async selectFromSubject(subject: Subject): Promise<Member> {
    let res = await this.client.member.findFirst({
      where: {
        subject,
      },
    });

    if (!res) {
      res = await this.client.member.create({
        data: {
          subject,
        },
      });
    }

    return {
      id: MemberId.from(res.id)._unsafeUnwrap(),
      subject: Subject.from(res.subject),
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
      admin: res.admin === true || this.defaultAdmins.includes(res.id),
    };
  }
}
