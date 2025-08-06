import HermesApi from "@/apis/hermes";
import ZeusService, { type CreateZeusServiceParams } from "@/lib/service";

export default class EmissionSettingModel extends ZeusService {
  private readonly hermesApi: HermesApi;

  constructor(params: CreateZeusServiceParams) {
    super(params);
    this.hermesApi = this.core.getOrInstall(HermesApi);
  }

  async findMany() {
    const response = await this.hermesApi.getEmissionSettings();
    return response.data.items;
  }
}
