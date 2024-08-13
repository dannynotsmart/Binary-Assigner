import { useState } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function View() {
  const [data, setData] = useState<{
    rows: number;
    cols: number;
    notes: string;
    values: number[];
  } | null>(null);
  const [showBlue, setShowBlue] = useState(true);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      try {
        const jsonData = JSON.parse(e.target.result as string);
        setData(jsonData);
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const hiddenCells = data?.values
    .map((value, index) => (value === 2 && !showBlue ? index + 1 : null))
    .filter((index) => index !== null) as number[];

  const getCoordinate = (index: number) => {
    const row = String.fromCharCode("A".charCodeAt(0) + Math.floor(index / (data?.cols || 1)));
    const col = (index % (data?.cols || 1)) + 1;
    return `${row}${col}`;
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rowLabels = data ? Array.from({ length: data.rows }, (_, i) => alphabet[i % 26]) : [];
  const colLabels = data ? Array.from({ length: data.cols }, (_, i) => i + 1) : [];

  return (
    <>
      <Head>
        <title>View Binary Assigner</title>
      </Head>
      <main className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <header className="bg-white shadow-md py-4 px-8 text-center">
          <h1 className="text-2xl font-bold">View Binary Assigner</h1>
        </header>
        <div className="flex flex-col items-center py-4 space-y-4">
          <Link href="/">Want to generate these files? Click me!</Link>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="border p-2 rounded"
          />
          {data && (
            <>
              <div className="flex flex-col items-center py-4 space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showBlue}
                    onChange={(e) => setShowBlue(e.target.checked)}
                    className="form-checkbox"
                  />
                  <span>Show blue circles</span>
                </label>
                <div className="flex-grow flex justify-center items-center py-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2 justify-center">
                      <div className="w-8 h-8" />
                      {colLabels.map((label) => (
                        <div
                          key={label}
                          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex justify-center items-center"
                        >
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <div className="flex flex-col space-y-2">
                        {rowLabels.map((label) => (
                          <div
                            key={label}
                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex justify-center items-center"
                          >
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: `repeat(${data.cols}, minmax(0, 1fr))`,
                          gap: "0.5rem",
                        }}
                      >
                        {data.values.map((value, index) => (
                          <div
                            key={index}
                            className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex justify-center items-center
                              ${value === 1 ? "bg-green-500" : value === 2 ? (showBlue ? "bg-blue-500" : "hidden") : "bg-red-500"}`}
                          >
                            <span className="text-white text-xs sm:text-sm md:text-base lg:text-sm xl:text-base">
                              {getCoordinate(index)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p><strong>Rows:</strong> {data.rows}</p>
                  <p><strong>Columns:</strong> {data.cols}</p>
                  <p><strong>Notes:</strong> {data.notes}</p>
                </div>
                {!showBlue && hiddenCells.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Hidden Blue Circles:</h2>
                    <ul className="list-disc list-inside mt-2">
                      {hiddenCells.map((index) => (
                        <li key={index}>Circle {index}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
