import { useEffect, useState, useRef } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";


const inter = Inter({ subsets: ["latin"] });


export default function Home() {
 const [rows, setRows] = useState(8);
 const [cols, setCols] = useState(12);
 const [notes, setNotes] = useState("");
 const [selectedIndex, setSelectedIndex] = useState(0);
 const [circleStates, setCircleStates] = useState<string[]>(Array(8 * 12).fill("red"));
 const forward = useRef(true);


 useEffect(() => {
   const totalCircles = rows * cols;
   setCircleStates((prev) => {
     if (prev.length !== totalCircles) {
       return Array(totalCircles).fill("red");
     }
     return prev;
   });
   setSelectedIndex((prev) => Math.min(prev, totalCircles - 1));
 }, [rows, cols]);


 useEffect(() => {
   const handleKeyDown = (e: KeyboardEvent) => {
     const totalCircles = rows * cols;
     let changed: boolean = false;
     if (e.key === "PageDown" || e.key === "ArrowRight") {
       const coordinate = getCoordinate(selectedIndex);
       const utterance = new SpeechSynthesisUtterance(`${coordinate}`);
       window.speechSynthesis.speak(utterance);
       if(((selectedIndex + 1) % 12 == 0 && forward.current) && selectedIndex !== 0){
         forward.current = false;
         changed = true;
         setSelectedIndex((prev) => Math.min(prev + 12, totalCircles - 1));
       }


       if(selectedIndex % 12 == 0 && !(forward.current)){
         forward.current = true;
         changed = true;
         setSelectedIndex((prev) => Math.min(prev + 12, totalCircles - 1));
       }


       if(forward.current && !changed){
         setSelectedIndex((prev) => Math.min(prev + 1, totalCircles - 1));
         changed = false;
       }


       if(!forward.current && !changed){
         setSelectedIndex((prev) => Math.min(prev - 1, totalCircles - 1));
         changed = false;
       }
     }else if (e.key === "ArrowLeft") {
        const coordinate = getCoordinate(selectedIndex);
        const utterance = new SpeechSynthesisUtterance(`${coordinate}`);
        window.speechSynthesis.speak(utterance);
        if((selectedIndex % 12 == 0 && forward.current) && selectedIndex !== 0){
         forward.current = false;
         changed = true;
         setSelectedIndex((prev) => Math.max(0, Math.min(prev - 12, totalCircles - 1)));
       }


       if((selectedIndex + 1) % 12 == 0 && !(forward.current)){
         forward.current = true;
         changed = true;
         setSelectedIndex((prev) => Math.max(0, Math.min(prev - 12, totalCircles - 1)));
       }


       if(forward.current && !changed){
         setSelectedIndex((prev) => Math.max(0, Math.min(prev - 1, totalCircles - 1)));
         changed = false;
       }


       if(!forward.current && !changed){
         setSelectedIndex((prev) => Math.max(0, Math.min(prev + 1, totalCircles - 1)));
         changed = false;
       }
     } else if (e.key === "b" || e.key === "B") {
       setCircleStates((prev) => {
         const newStates = [...prev];
         newStates[selectedIndex] = "blue";
         return newStates;
       });

       const coordinate = getCoordinate(selectedIndex);
       const utterance = new SpeechSynthesisUtterance(`${coordinate}`);
       window.speechSynthesis.speak(utterance);

       if(((selectedIndex + 1) % 12 == 0 && forward.current) && selectedIndex !== 0){
        forward.current = false;
        changed = true;
        setSelectedIndex((prev) => Math.min(prev + 12, totalCircles - 1));
      }


      if(selectedIndex % 12 == 0 && !(forward.current)){
        forward.current = true;
        changed = true;
        setSelectedIndex((prev) => Math.min(prev + 12, totalCircles - 1));
      }


      if(forward.current && !changed){
        setSelectedIndex((prev) => Math.min(prev + 1, totalCircles - 1));
        changed = false;
      }


      if(!forward.current && !changed){
        setSelectedIndex((prev) => Math.min(prev - 1, totalCircles - 1));
        changed = false;
      }
     } else if (e.key === "PageUp" || e.key === "n" || e.key === "N") {
       setCircleStates((prev) => {
         const newStates = [...prev];
         newStates[selectedIndex] = newStates[selectedIndex] === "red" ? "green" : "red";
         return newStates;
       });


       const coordinate = getCoordinate(selectedIndex);
       const utterance = new SpeechSynthesisUtterance(`${coordinate}`);
       window.speechSynthesis.speak(utterance);


       if(((selectedIndex + 1) % 12 == 0 && forward.current) && selectedIndex !== 0){
         forward.current = false;
         changed = true;
         setSelectedIndex((prev) => Math.min(prev + 12, totalCircles - 1));
       }


       if(selectedIndex % 12 == 0 && !(forward.current)){
         forward.current = true;
         changed = true;
         setSelectedIndex((prev) => Math.min(prev + 12, totalCircles - 1));
       }


       if(forward.current && !changed){
         setSelectedIndex((prev) => Math.min(prev + 1, totalCircles - 1));
         changed = false;
       }


       if(!forward.current && !changed){
         setSelectedIndex((prev) => Math.min(prev - 1, totalCircles - 1));
         changed = false;
       }
     }
   };


   window.addEventListener("keydown", handleKeyDown);
   return () => {
     window.removeEventListener("keydown", handleKeyDown);
   };
 }, [selectedIndex, rows, cols]);


 const handleCircleClick = (index: number) => {
   setSelectedIndex(index);
 };


 const handleExport = () => {
   const values = circleStates.map((state) => {
     if (state === "green") return 1;
     if (state === "blue") return 2;
     return 0;
   });
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
         setCircleStates(data.values.map((v: number) => {
           if (v === 1) return "green";
           if (v === 2) return "blue";
           return "red";
         }));
       }
     } catch (err) {
       alert("Failed to parse JSON file.");
     }
   };
   reader.readAsText(file);
 };


 const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = Math.max(1, parseInt(e.target.value) || 1);
   setRows(value);
 };


 const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const value = Math.max(1, parseInt(e.target.value) || 1);
   setCols(value);
 };


 const getColumnLabels = () => {
   return Array.from({ length: cols }, (_, i) => i + 1);
 };


 const getRowLabels = () => {
   return Array.from({ length: rows }, (_, i) =>
     String.fromCharCode("A".charCodeAt(0) + i)
   );
 };


 const getCoordinate = (index: number) => {
   const row = String.fromCharCode("A".charCodeAt(0) + Math.floor(index / cols));
   const col = (index % cols) + 1;
   return `${row}${col}`;
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
         <Link href="/view">Want to view generated files? Click me!</Link>
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
       <div className="flex justify-center items-center">
         <div className="flex flex-col">
           <div className="flex space-x-2 justify-center">
             <div className="w-6" />
             {getColumnLabels().map((label) => (
               <div
                 key={label}
                 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex justify-center items-center"
               >
                 {label}
               </div>
             ))}
           </div>
           <div className="flex">
             <div className="flex flex-col space-y-2">
               {getRowLabels().map((label) => (
                 <div
                   key={label}
                   className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 flex justify-center items-center"
                 >
                   {label}
                 </div>
               ))}
             </div>
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
                       ${circleStates[index] === "green" ? "bg-green-500" : circleStates[index] === "blue" ? "bg-blue-500" : "bg-red-500"}
                       ${selectedIndex === index ? "border-4 border-blue-500" : ""}`}
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
       </div>
     </main>
   </>
 );
}



