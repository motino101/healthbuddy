import {Checkbox, Link, User, Chip, cn} from "@nextui-org/react";

interface Label {
  name: string;
}

interface CustomCheckboxProps {
  label: Label;
  value: any;
}

export const CustomCheckbox = ({ label, value }: CustomCheckboxProps) => {
  return (
    <Checkbox
      aria-label={label.name}
      classNames={{
        base: cn(
          "inline-flex max-w-md w-full bg-slate-600 m-0",
          "hover:bg-content2 items-center justify-start",
          "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: "w-full ",
      }}
      value={value}
    >
      <div className="w-full flex justify-between gap-2">
        <p className="text-lg font-semibold text-content3">{label.name}</p>
      </div>
    </Checkbox>
  );
};