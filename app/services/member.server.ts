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

  public constructor(protected __client: PrismaClient) {
    this.client = __client;
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
      admin: res.admin,
      createdAt: res.createdAt,
      updatedAt: res.updatedAt,
    };
  }
}
