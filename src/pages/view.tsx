import { useState } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

type GridData = {
  id: number;
  rows: number;
  cols: number;
  notes: string;
  values: number[];
};

export default function View() {
  const [dataList, setDataList] = useState<GridData[]>([]);
  const [showyellow, setShowyellow] = useState(true);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const readers = Array.from(files).map((file, index) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!e.target?.result) return;
          try {
            const jsonData = JSON.parse(e.target.result as string);
            setDataList((prevData) => [
              ...prevData,
              { ...jsonData, id: prevData.length + index },
            ]);
            resolve();
          } catch (err) {
            alert("Failed to parse JSON file.");
          }
        };
        reader.readAsText(file);
      });
    });

    await Promise.all(readers);
  };

  const getCoordinate = (index: number, cols: number) => {
    const row = String.fromCharCode("A".charCodeAt(0) + Math.floor(index / cols));
    const col = (index % cols) + 1;
    return `${row}${col}`;
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <>
      <Head>
        <title>View Binary Assigner</title>
        <style>
          {`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }

              .bg-green-500 {
                background-color: #10B981 !important;
              }

              .bg-yellow-500 {
                background-color: #ECC94B !important;
              }

              .bg-red-500 {
                background-color: #EF4444 !important;
              }

              .hidden {
                display: none !important;
              }
            }
          `}
        </style>
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
            multiple
            onChange={handleImport}
            className="border p-2 rounded"
          />
          {dataList.map((data) => {
            const yellowCount = data.values.filter((value) => value === 2).length;
            const greenCount = data.values.filter((value) => value === 1).length;

            const hiddenCells = data.values
              .map((value, index) => (value === 2 && !showyellow ? index + 1 : null))
              .filter((index) => index !== null) as number[];

            const rowLabels = Array.from({ length: data.rows }, (_, i) => alphabet[i % 26]);
            const colLabels = Array.from({ length: data.cols }, (_, i) => i + 1);

            return (
              <div key={data.id} className="flex flex-col items-center py-4 space-y-4 border rounded-lg p-4 bg-white shadow-lg">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showyellow}
                    onChange={(e) => setShowyellow(e.target.checked)}
                    className="form-checkbox"
                  />
                  <span>Show yellow circles</span>
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
                              ${value === 1 ? "bg-green-500" : value === 2 ? (showyellow ? "bg-yellow-500" : "hidden") : "bg-red-500"}`}
                          >
                            <span className="text-white text-xs sm:text-sm md:text-base lg:text-sm xl:text-base">
                              {getCoordinate(index, data.cols)}
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
                <div className="text-center mt-4">
                  <p><strong>Green Circles:</strong> {greenCount}</p>
                  <p><strong>Yellow Circles:</strong> {yellowCount}</p>
                </div>
                {!showyellow && hiddenCells.length > 0 && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">Hidden yellow Circles:</h2>
                    <ul className="list-disc list-inside mt-2">
                      {hiddenCells.map((index) => (
                        <li key={index}>Circle {index}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
