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

  return (
    <>
      <Head>
        <title>View Binary Assigner</title>
      </Head>
      <main className={`${inter.className} flex flex-col min-h-screen bg-gray-100`}>
        <header className="bg-white shadow-md py-4 px-8 text-center">
          <Link href="https://github.com/dannynotsmart/Binary-Assigner"><h1 className="text-2xl font-bold">View Binary Assigner</h1></Link>
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
              <div className="flex-grow flex justify-center items-center py-4">
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
                        ${value ? "bg-green-500" : "bg-red-500"}`}
                    >
                      <span className="text-white text-xs sm:text-sm md:text-base lg:text-sm xl:text-base">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center mt-4">
                <p><strong>Rows:</strong> {data.rows}</p>
                <p><strong>Columns:</strong> {data.cols}</p>
                <p><strong>Notes:</strong> {data.notes}</p>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
