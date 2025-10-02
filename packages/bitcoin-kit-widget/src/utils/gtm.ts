import TagManager from "react-gtm-module";

declare global {
  interface Window {
    bitcoinKitWidgetDataLayer: object[];
  }
}

export enum GtmEvent {
  ClickConnectWallet = "bitcoinkit_click_connect_wallet",

  // Deposit Flow
  ClickTabDeposit = "bitcoinkit_click_tab_deposit",
  ClickDeposit = "bitcoinkit_click_deposit",
  ClickCopyAddress = "bitcoinkit_click_copy_address",
  ClickSelectBitcoinWallet = "bitcoinkit_click_select_bitcoin_wallet",
  ClickDepositBitcoinWallet = "bitcoinkit_click_deposit_bitcoin_wallet",
  ClickSwitchWallet = "bitcoinkit_click_switch_wallet",
  ClickChangeAmount = "bitcoinkit_click_change_amount",
  ClickDepositConfirm = "bitcoinkit_click_deposit_confirm",
  ClickDepositCancel = "bitcoinkit_click_deposit_cancel",

  // Withdraw Flow
  ClickTabWithdraw = "bitcoinkit_click_tab_withdraw",
  ClickWithdraw = "bitcoinkit_click_withdraw",
  ClickWithdrawBitcoinWallet = "bitcoinkit_click_withdraw_bitcoin_wallet",
  ClickWithdrawConfirm = "bitcoinkit_click_withdraw_confirm",
  ClickWithdrawCancel = "bitcoinkit_click_withdraw_cancel",

  // Activity
  ClickTabActivity = "bitcoinkit_click_tab_activity",
  ClickInteraction = "bitcoinkit_click_interaction",
}

export enum GtmEventType {
  Click = "click",
}

function isGTMInitialized() {
  return (
    globalThis.window &&
    "bitcoinKitWidgetDataLayer" in window &&
    Array.isArray(window.bitcoinKitWidgetDataLayer)
  );
}

export function initializeGTM() {
  if (isGTMInitialized()) return;

  TagManager.initialize({
    gtmId: "GTM-K2P3PF5R",
    dataLayerName: "bitcoinKitWidgetDataLayer",
  });
}

export function pushGTMEvent(event: string, payload?: object) {
  if (!isGTMInitialized()) return;
  window.bitcoinKitWidgetDataLayer.push({ ...payload, event });
}
