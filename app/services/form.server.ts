import type { MemberId } from '@/services/member.server';
import type { PrismaClient } from '@prisma/client';

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
    return await crypto.subtle.digest(
      {
        name: 'SHA-256',
      },
      new TextEncoder().encode(memberId),
    );
  }

  public async getFormUrl(memberId: MemberId): Promise<string> {
    const token = await this.getToken(memberId);

    const url = new URL(this.formUrl);
    url.searchParams.set('usp', 'pp_url');
    url.searchParams.set(this.queryMap.uuid, memberId);
    url.searchParams.set(this.queryMap.token, new Uint8Array(token).toString());

    return url.toString();
  }
}
