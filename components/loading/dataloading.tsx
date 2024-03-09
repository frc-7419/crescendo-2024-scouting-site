import Loadinganim from "@/components/loading/loadinganim";
import React, {useEffect, useState} from "react";

export default function Dataloading() {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDots((prevDots) => (prevDots.length === 3 ? "" : prevDots + "."));
        }, 500);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={'p-4'}>
            <div className="w-40">
                <Loadinganim/>
            </div>
            <div className="text-xl">
                Loading{dots}
            </div>
        </div>
    );
}
