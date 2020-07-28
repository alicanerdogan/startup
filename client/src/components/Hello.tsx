import * as React from "react";
import styled from "styled-components";

export interface HelloProps {
  compiler: string;
  framework: string;
}

export const HelloStyle = styled.div``;

export const Hello: React.FC<HelloProps> = () => {
  return <HelloStyle>{}</HelloStyle>;
};

Hello.displayName = "Hello";
