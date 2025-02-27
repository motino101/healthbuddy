'use client';

import { Checkbox } from "@nextui-org/react";

interface CustomCheckboxProps {
    children: React.ReactNode;
    value: string;
}

export const CustomCheckbox = ({ children, value }: CustomCheckboxProps) => {
    return (
        <div className="w-full">
            <Checkbox
                value={value}
                color="primary"
                className="inline-flex w-full bg-gray-800 hover:bg-gray-700 items-center justify-start cursor-pointer rounded-lg gap-2 p-3.5 border-2 border-transparent data-[selected=true]:border-primary hover:border-gray-600"
            >
                <div className="text-white text-lg">{children}</div>
            </Checkbox>
        </div>
    );
};