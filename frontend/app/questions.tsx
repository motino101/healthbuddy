'use client';

import Image from "next/image";
import { Progress } from "@nextui-org/progress";
import React from "react";
import { CheckboxGroup } from "@nextui-org/react";
import { CustomCheckbox } from "./CustomCheckbox";
import { Button } from "@nextui-org/react";
import router from "next/router";

export default function QuestionsPage() {
    const [groupSelected, setGroupSelected] = React.useState<string[]>([]);

    // helper function to navigate to the next page
    const handleNavigate = () => {
        router.push('/solutions');
    };

    return (
        <div className="bg-black grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {/* HEADER WITH LOGO*/}
            <div>
                <Image
                    src="https://i.postimg.cc/pTJQR9k2/Screenshot-2024-11-02-at-10-50-04-AM.png"
                    width={200}
                    height={200}
                    alt="Logo"
                />
            </div>
            {/* MAIN CONTENT */}
            <div className="flex flex-col items-center w-1/2 mt-10">
                {/* QUESTION TYPE */}
                <p className="text-2xl font-bold text-white">Question 1/10</p>


                {/* QUESTION PROGRESS BAR */}

                <Progress label="" value={55} className="max-w-md m-8 w-1/2" />

                {/* ANSWER CHOICES */}

                <div className="w-full max-w-md">

                    {/* QUESTION */}

                    <p className="text-4xl font-bold text-white mb-8">Is the pain sharp, dull, throbbing, or burning?</p>

                    <CheckboxGroup
                        label=""
                        value={groupSelected}
                        onChange={setGroupSelected}
                        classNames={{
                            base: "w-full mb-8"
                        }}
                    >

                        <div className="flex flex-col space-y-4 w-full">
                            <CustomCheckbox
                                value="burning"
                                label={{ name: "Burning" }}
                            />
                            <CustomCheckbox
                                value="sharp"
                                label={{ name: "Sharp" }}
                            />
                            <CustomCheckbox
                                value="dull"
                                label={{ name: "Dull" }}
                            />
                            <CustomCheckbox
                                value="throbbing"
                                label={{ name: "Throbbing" }}
                            />
                        </div>
                    </CheckboxGroup>
                    {/* BUTTONS  */}
                    <div className="flex gap-4 w-full justify-between">
                        <Button variant="bordered" size="lg">
                            <p className="text-white text-lg font-semibold">Back</p>
                        </Button>
                        <Button color="primary" size="lg">
                            <p className="text-white text-lg font-semibold" onClick={handleNavigate}>Next</p>
                        </Button>
                    </div>
                </div>
            </div>
            {/* SLIDER  */}

        </div>


    );
}