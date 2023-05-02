import Papa from "papaparse";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const download = function (csvdata: string) {
  // Creating a Blob for having a csv file format
  // and passing the data with type
  const blob = new Blob([csvdata as BlobPart], { type: "text/csv" });

  // Creating an object for downloading url
  const url = window.URL.createObjectURL(blob);

  // Creating an anchor(a) tag of HTML
  const a = document.createElement("a");

  // Passing the blob downloading url
  a.setAttribute("href", url);

  // Setting the anchor tag attribute for downloading
  // and passing the download file name
  a.setAttribute("download", "download.csv");

  // Performing a download with click
  a.click();
};

// const csvmaker = function (data: object[]) {
//   // Empty array for storing the values
//   const csvRows = [];

//   // Headers is basically a keys of an
//   // object which is id, name, and
//   // profession
//   const headers = Object.keys(data[0] ?? {});

//   // As for making csv format, headers
//   // must be separated by comma and
//   // pushing it into array
//   csvRows.push(headers.join(","));

//   // Pushing Object values into array
//   // with comma separation
//   data.forEach((row) => {
//     const values = Object.values(row).join(",");
//     csvRows.push(values);
//   });

//   // Returning the array joining with new line
//   return csvRows.join("\n");
// };

const getCSV = function (data: object[]) {
  const csvdata = Papa.unparse(data);
  download(csvdata);
};

export default getCSV;
