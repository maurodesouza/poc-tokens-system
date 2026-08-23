import { twx } from "@/utils/tailwind";

const Container = twx.div`
  flex flex-col gap-xs w-full
  has-disabled:cursor-not-allowed  has-disabled:**:!cursor-not-allowed has-disabled:opacity-50
`;

const Wrapper = twx.div`
  flex items-center w-full h-control-height min-w-0 text-sm
  text-foreground shadow-xs
  has-[[data-addon-side=left]]:[&_[data-field=content]]:rounded-l-none
  has-[[data-addon-side=right]]:[&_[data-field=content]]:rounded-r-none

`;

const Content = twx.div.attrs({
	"data-field": "content",
})`
  flex items-center gap-xs w-full h-control-height min-w-0  px-sm text-sm
  full-border bg-background-base text-foreground shadow-xs

  field-focus:outline-palette-solid field-focus:outline-1 field-focus:z-10

`;

export const Field = {
	Container,
	Wrapper,
	Content,
};
