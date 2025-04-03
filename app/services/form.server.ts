import type { MemberId } from '@/services/member.server';
import type { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';

export class FormService {
  private client: PrismaClient;
  private formUrl: string;
  private tokenKey: string;

  private queryMap = {
    uuid: 'entry.2073416874',
    token: 'entry.1258196302',
  };

  public constructor(protected __client: any, env: Env) {
    this.client = __client;
    this.formUrl = env.FORM_URL;
    this.tokenKey = env.FORM_TOKEN_KEY;
  }

  private getToken(memberId: MemberId) {
    return createHash('sha256').update(`${memberId}:${this.tokenKey}`).digest('hex');
  }

  public getFormUrl(memberId: MemberId): string {
    const token = this.getToken(memberId);

    const url = new URL(this.formUrl);
    url.searchParams.set('usp', 'pp_url');
    url.searchParams.set(this.queryMap.uuid, memberId);
    url.searchParams.set(this.queryMap.token, token);

    return url.toString();
  }
}
