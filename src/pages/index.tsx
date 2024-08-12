import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [rows, setRows] = useState(12);
  const [cols, setCols] = useState(8);
  const [notes, setNotes] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [circleStates, setCircleStates] = useState<boolean[]>(Array(12 * 8).fill(true));

  useEffect(() => {
    const totalCircles = rows * cols;
    setCircleStates((prev) => {
      if (prev.length !== totalCircles) {
        return Array(totalCircles).fill(true);
      }
      return prev;
    });
    setSelectedIndex((prev) => Math.min(prev, totalCircles - 1));
  }, [rows, cols]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const totalCircles = rows * cols;
    if (e.key === "PageDown" || e.key === "ArrowRight") {
      setSelectedIndex((prev) => Math.min(prev + 1, totalCircles - 1));
    } else if (e.key === "PageUp" || e.key === "ArrowLeft") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
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

  const handleExport = () => {
    const values = circleStates.map((state) => (state ? 1 : 0));
    const data = {
      rows,
      cols,
      notes,
      values,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const now = new Date();
    const datetime = now.toISOString().replace(/[:.-]/g, "_");
    link.href = url;
    link.download = `binary-assigner-${datetime}.json`;

    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      try {
        const data = JSON.parse(e.target.result as string);
        if (data.values && Array.isArray(data.values)) {
          setRows(data.rows || 1);
          setCols(data.cols || 1);
          setNotes(data.notes || "");
          setCircleStates(data.values.map((v: number) => v === 1));
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, rows, cols]);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setRows(value);
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setCols(value);
  };

  return (
    <>
      <Head>
        <title>Binary Assigner</title>
      </Head>
      <main className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <header className="bg-white shadow-md py-4 px-8 text-center">
          <h1 className="text-2xl font-bold">Binary Assigner</h1>
        </header>
        <div className="flex flex-col items-center py-4 space-y-4">
          <div className="flex space-x-4">
            <label className="flex flex-col">
              Rows
              <input
                type="number"
                value={rows}
                min={1}
                onChange={handleRowsChange}
                className="border p-2 rounded w-20"
              />
            </label>
            <label className="flex flex-col">
              Columns
              <input
                type="number"
                value={cols}
                min={1}
                onChange={handleColsChange}
                className="border p-2 rounded w-20"
              />
            </label>
          </div>
          <label className="flex flex-col w-44 sm:w-48 md:w-64 lg:w-72">
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 rounded h-24"
            />
          </label>
          <button
            onClick={handleExport}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Export
          </button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="border p-2 rounded mt-4"
          />
        </div>
        <hr className="border-t border-gray-300" />
        <div className="flex-grow flex justify-center items-center py-4">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: "0.5rem",
            }}
          >
            {Array.from({ length: rows * cols }).map((_, index) => (
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
        </div>
      </main>
    </>
  );
}
