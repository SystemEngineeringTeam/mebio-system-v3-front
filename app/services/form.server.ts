export class FormService {
  private client;
  private formUrl;

  public constructor(protected __client: any, env: Env) {
    this.client = __client;
    this.formUrl = env.FORM_URL;
  }
}
