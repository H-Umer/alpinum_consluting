"use client";

import React, { useState } from "react";

const BulkResumeUpload = () => {
  const [files, setFiles] = useState([]);
  const [codes, setCodes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Generate codes based on filenames (you can modify this logic)
    const generatedCodes = selectedFiles.map((file) =>
      file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-")
    );

    setCodes(generatedCodes);
  };

  const handleCodeChange = (index, value) => {
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    codes.forEach((code) => {
      formData.append("codes", code);
    });

    try {
      const response = await fetch("/api/public-resume-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error("Upload error:", error);
      setResults({ error: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Bulk Resume Upload</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Select Resume Files (PDF, DOC, DOCX)
        </label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Files and Codes:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex gap-4 items-center">
                <span className="flex-1 text-sm">{file.name}</span>
                <input
                  type="text"
                  value={codes[index] || ""}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  placeholder="Enter resume code"
                  className="flex-1 p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className="bg-blue-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
      >
        {uploading ? "Uploading..." : `Upload ${files.length} Files`}
      </button>

      {results && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-semibold mb-2">Upload Results:</h3>
          <p>Successful: {results.successful}</p>
          <p>Failed: {results.failed}</p>

          {results.results && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Details:</h4>
              <div className="space-y-1 text-sm">
                {results.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded ${result.success ? "bg-green-100" : "bg-red-100"}`}
                  >
                    {result.fileName}: {result.success ? "Success" : `Failed - ${result.error}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkResumeUpload;
