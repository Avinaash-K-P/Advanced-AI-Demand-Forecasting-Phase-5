export const getThemeStyles = (darkMode) => ({
  
  layout: darkMode 
     ? "bg-gray-950 text-white"
       :"bg-gray-100 text-black",
  
  navBar: darkMode
        ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white"
        :"bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-800 text-white",
  
  card: darkMode
    ? "bg-gray-900 text-white border border-gray-700"
    : "bg-white text-black shadow-lg",

  tableHeader: darkMode
    ? "bg-gray-800 text-gray-200"
    : "bg-gray-100 text-gray-700",

  tableRow: darkMode
    ? "border-gray-700 hover:bg-gray-800"
    : "border-gray-200 hover:bg-gray-50",

  input: darkMode
    ? "bg-gray-800 text-white border-gray-600"
    : "bg-white text-black border-gray-300",
});