import type { TwcComponentProps } from "react-twc";

import { twx } from "@/utils/tailwind";

export type AddonSide = { $side?: "left" | "right" };

type ContainerProps = TwcComponentProps<"div"> & AddonSide;

export const Container = twx.div.attrs<ContainerProps>((props) => {
	return {
		"data-addon-side": props.$side ?? "right",
	};
})`
  h-full shrink-0 overflow-hidden
  border-2 border-ring-inner bg-background-base

  data-[addon-side=right]:border-l-0 data-[addon-side=right]:rounded-r-md
  data-[addon-side=left]:border-r-0 data-[addon-side=left]:rounded-l-md

  field-focus:outline-palette-solid field-focus:outline-1 field-focus:z-10
`;
