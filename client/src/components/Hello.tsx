import * as React from "react";
import { twStyled } from "utils/styles";
import {
  text_center,
  py_4,
  leading_tight,
  max_w_sm,
  mx_auto,
  bg_white,
  rounded_lg,
  sm_flex,
  sm_items_center,
  px_6,
  block,
  sm_mx_0,
  sm_flex_shrink_0,
  h_16,
  sm_h_24,
  rounded_full,
  mt_4,
  sm_mt_0,
  sm_ml_4,
  sm_text_left,
  text_xl,
  text_sm,
  text_gray_600,
  text_purple_500,
  hover_text_white,
  hover_bg_purple_500,
  border,
  border_purple_500,
  text_xs,
  font_semibold,
  px_4,
  py_1,
  leading_normal,
  shadow_md
} from "tailwind-in-js";

export interface HelloProps {
  compiler: string;
  framework: string;
}

const Card = twStyled.div(
  max_w_sm,
  mx_auto,
  bg_white,
  shadow_md,
  rounded_lg,
  sm_flex,
  sm_items_center,
  px_6,
  py_4
);
const Image = twStyled.img(
  block,
  mx_auto,
  sm_mx_0,
  sm_flex_shrink_0,
  h_16,
  sm_h_24,
  rounded_full
);
const TextContent = twStyled.div(
  mt_4,
  sm_mt_0,
  sm_ml_4,
  text_center,
  sm_text_left
);
const Name = twStyled.p(text_xl, leading_tight);
const Title = twStyled.p(text_sm, leading_tight, text_gray_600);
const Button = twStyled.button(
  text_purple_500,
  hover_text_white,
  hover_bg_purple_500,
  border,
  border_purple_500,
  text_xs,
  font_semibold,
  rounded_full,
  px_4,
  py_1,
  leading_normal,
  mt_4
);

export class Hello extends React.Component<HelloProps, {}> {
  render() {
    return (
      <Card>
        <Image
          src="https://randomuser.me/api/portraits/women/17.jpg"
          alt="Profile Picture"
        />
        <TextContent>
          <Name>{"Erin Linford"}</Name>
          <Title>{"Customer Support Specialist"}</Title>
          <Button>{"Message"}</Button>
        </TextContent>
      </Card>
    );
  }
}
