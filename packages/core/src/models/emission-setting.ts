import HermesClient from "@/clients/hermes";
import CoreConfig from "@/config/core";

interface EmissionSettingModelParams {
  coreConfig?: CoreConfig;
  hermesClient?: HermesClient;
}

export default class EmissionSettingModel {
  private readonly core: CoreConfig;
  private readonly hermesClient: HermesClient;

  constructor({
    coreConfig = new CoreConfig(),
    hermesClient = new HermesClient({ coreConfig }),
  }: EmissionSettingModelParams) {
    this.core = coreConfig;
    this.hermesClient = hermesClient;
  }

  async findMany() {
    const response = await this.hermesClient.getEmissionSettings();
    return response.data.items;
  }
}
