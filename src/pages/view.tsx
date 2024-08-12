import { useState } from "react";
import Head from "next/head";

export default function View() {
  const [circleStates, setCircleStates] = useState<boolean[]>([]);
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      try {
        const data = JSON.parse(e.target.result as string);
        if (data.values && Array.isArray(data.values)) {
          setRows(data.rows);
          setCols(data.cols);
          setNotes(data.notes || "");
          setCircleStates(data.values.map((v: number) => v === 1));
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <Head>
        <title>View Binary Assigner</title>
      </Head>
      <main className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-white shadow-md py-4 px-8 text-center">
          <h1 className="text-2xl font-bold">View Binary Assigner</h1>
        </header>
        <div className="flex flex-col items-center py-4 space-y-4">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="border p-2 rounded"
          />
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex-grow flex justify-center items-center py-4">
          <div className={`grid grid-cols-${cols} gap-2 sm:gap-3 md:gap-4 lg:gap-5`}>
            {Array.from({ length: rows * cols }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex justify-center items-center
                  ${circleStates[index] ? "bg-green-500" : "bg-red-500"}
                `}
              >
                <span className="text-white text-xs sm:text-sm md:text-base lg:text-sm xl:text-base">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow-md py-4 px-8 text-center">
          <p className="text-lg font-semibold">Details</p>
          <p className="text-md">Rows: {rows}</p>
          <p className="text-md">Columns: {cols}</p>
          <p className="text-md">Notes: {notes}</p>
        </div>
      </main>
    </>
  );
}
