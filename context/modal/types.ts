import { AlertType } from "../../types";
import { ModalsActionsEnum } from "./reducer";

export type ButtonColorVariant =
  | "primary"
  | "secondary"
  | "warning"
  | "error"
  | "neutral"
  | "base";
export type ButtonSizeVariant = "xs" | "sm" | "lg";
export type ButtonRadiusVariant =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "full";

export type TLoading = {
  open: boolean;
  title: string;
  text: string[];
  onClose?: () => void;
};

export type TMetamaskInfo = {
  open: boolean;
  title: string;
  text: string;
  message?: string;
  content: JSX.Element | null;
  actionButtonColor?: ButtonColorVariant;
};

export type TAlert = {
  open: boolean;
  type: AlertType;
  message: string[];
  title?: string;
};

export type TBasic = {
  open: boolean;
  title: string;
  content: JSX.Element | null;
  onClose?: () => void;
};

export interface IModalsStore {
  loading: TLoading;
  metamaskInfo: TMetamaskInfo;
  alert: TAlert;
  basic: TBasic;
}

interface ILoadingAction {
  type: ModalsActionsEnum.SHOW_LOADING;
  payload: TLoading;
}

interface IMetamaskInfoAction {
  type: ModalsActionsEnum.SHOW_METAMASK_INFO;
  payload: TMetamaskInfo;
}

interface TAlertAction {
  type: ModalsActionsEnum.SHOW_ALERT;
  payload: TAlert;
}

interface TBasicAction {
  type: ModalsActionsEnum.SHOW_BASIC;
  payload: TBasic;
}

export type TModalsAction =
  | ILoadingAction
  | IMetamaskInfoAction
  | TAlertAction
  | TBasicAction;
