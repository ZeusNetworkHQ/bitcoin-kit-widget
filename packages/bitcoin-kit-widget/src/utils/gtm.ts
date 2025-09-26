import TagManager from "react-gtm-module";

declare global {
  interface Window {
    zeusStakeWidgetDataLayer: object[];
  }
}

export enum GtmEvent {
  ClickConnectWallet = "zeusstack_click_connect_wallet",

  // Deposit Flow
  ClickTabDeposit = "zeusstack_click_tab_deposit",
  ClickDeposit = "zeusstack_click_deposit",
  ClickCopyAddress = "zeusstack_click_copy_address",
  ClickSelectBitcoinWallet = "zeusstack_click_select_bitcoin_wallet",
  ClickDepositBitcoinWallet = "zeusstack_click_deposit_bitcoin_wallet",
  ClickSwitchWallet = "zeusstack_click_switch_wallet",
  ClickChangeAmount = "zeusstack_click_change_amount",
  ClickDepositConfirm = "zeusstack_click_deposit_confirm",
  ClickDepositCancel = "zeusstack_click_deposit_cancel",

  // Withdraw Flow
  ClickTabWithdraw = "zeusstack_click_tab_withdraw",
  ClickWithdraw = "zeusstack_click_withdraw",
  ClickWithdrawBitcoinWallet = "zeusstack_click_withdraw_bitcoin_wallet",
  ClickWithdrawConfirm = "zeusstack_click_withdraw_confirm",
  ClickWithdrawCancel = "zeusstack_click_withdraw_cancel",

  // Activity
  ClickTabActivity = "zeusstack_click_tab_activity",
  ClickInteraction = "zeusstack_click_interaction",
}

export enum GtmEventType {
  Click = "click",
}

function isGTMInitialized() {
  return (
    globalThis.window &&
    "zeusStakeWidgetDataLayer" in window &&
    Array.isArray(window.zeusStakeWidgetDataLayer)
  );
}

export function initializeGTM() {
  if (isGTMInitialized()) return;

  TagManager.initialize({
    gtmId: "GTM-K2P3PF5R",
    dataLayerName: "zeusStakeWidgetDataLayer",
  });
}

export function pushGTMEvent(event: string, payload?: object) {
  if (!isGTMInitialized()) return;
  window.zeusStakeWidgetDataLayer.push({ ...payload, event });
}
