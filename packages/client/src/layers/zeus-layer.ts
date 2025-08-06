import DepositService from "./deposit.service";
import WithdrawService from "./withdraw.service";

import ZeusService from "@/lib/service";

class ZeusLayer extends ZeusService {
  public deposit() {
    const depositService = this.core.getOrInstall(DepositService);
    return {
      sign: depositService.signAndBroadcastDeposit.bind(depositService),
    };
  }

  public withdraw() {
    const withdrawService = this.core.getOrInstall(WithdrawService);
    return {
      sign: withdrawService.signWithdraw.bind(withdrawService),
    };
  }
}

export default ZeusLayer;
