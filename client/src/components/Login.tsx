import * as React from "react";
import { twStyled } from "utils/styles";

export interface LoginProps {}

export const LoginStyle = twStyled.div();

export const Login: React.FC<LoginProps> = (props: LoginProps) => {
  return <LoginStyle>{}</LoginStyle>;
};
