import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const rows = 12;
  const cols = 8;
  const totalCircles = rows * cols;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [circleStates, setCircleStates] = useState<boolean[]>(Array(totalCircles).fill(true));

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "PageDown" || e.key === "ArrowRight") {
      setSelectedIndex((prev) => (prev + 1) % totalCircles);
    } else if (e.key === "PageUp" || e.key === "ArrowLeft") {
      setSelectedIndex((prev) => (prev - 1 + totalCircles) % totalCircles);
    } else if (e.key === "b" || e.key === "B") {
      setCircleStates((prev) => {
        const newStates = [...prev];
        newStates[selectedIndex] = !newStates[selectedIndex];
        return newStates;
      });
    }
  };

  const handleCircleClick = (index: number) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <Head>
        <title>Binary Assigner</title>
      </Head>
      <main className={`${inter.className} flex justify-center items-center h-screen bg-gray-100`}>
        <div className="grid grid-cols-8 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {Array.from({ length: totalCircles }).map((_, index) => (
            <div
              key={index}
              onClick={() => handleCircleClick(index)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex justify-center items-center cursor-pointer
                ${circleStates[index] ? "bg-green-500" : "bg-red-500"}
                ${selectedIndex === index ? "border-4 border-blue-500" : ""}`}
            >
              <span className="text-white text-xs sm:text-sm md:text-base lg:text-sm xl:text-base">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
