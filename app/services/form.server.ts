import type { MemberId } from '@/services/member.server';
import type { PrismaClient } from '@prisma/client';
import { sha256 } from 'cf-workers-hash';

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

  private async getToken(memberId: MemberId) {
    return await sha256(`${memberId}:${this.tokenKey}`);
  }

  public async getFormUrl(memberId: MemberId): Promise<string> {
    const token = await this.getToken(memberId);

    const url = new URL(this.formUrl);
    url.searchParams.set('usp', 'pp_url');
    url.searchParams.set(this.queryMap.uuid, memberId);
    url.searchParams.set(this.queryMap.token, token);

    return url.toString();
  }

  public async verifyToken(memberId: MemberId, token: string): Promise<boolean> {
    const expectedToken = await this.getToken(memberId);
    return expectedToken === token;
  }
}
