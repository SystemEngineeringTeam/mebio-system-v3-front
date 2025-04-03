import type { PrismaClient } from '@prisma/client';
import { FormService } from '@/services/form.server';
import { MemberService } from '@/services/member.server';

export class Database {
  public services;

  public constructor(protected client: PrismaClient, protected env: Env) {
    this.services = {
      memberService: new MemberService(client, env),
      formService: new FormService(client, env),
    };
  }
}
