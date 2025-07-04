"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF type for previousAutoTable
declare module "jspdf" {
  interface jsPDF {
    previousAutoTable?: { finalY: number };
  }
}

type DomainsType = {
  [domain: string]: {
    [subsystem: string]: string[];
  };
};

const domains: DomainsType = {
  "Facility Architecture": {
    "Room Layout": ["IT Room", "UPS Room", "Battery Room", "Electrical Room", "Telecom Room"],
    "Raised Floor": ["Floor System", "Tile Type", "Grounding", "Air Plenum", "Cable Management"],
    "Building Envelope": ["Walls", "Roof", "Floor", "Fire Doors & Seals"],
    Structural: ["Seismic Bracing", "Vibration Isolation"],
  },
  "Power Infrastructure": {
    "Utility Feed A & B": ["General"],
    "Main Transformer(s)": ["General"],
    Switchgear: ["GIS", "AIS"],
    "Automatic Transfer Switch": ["ATS"],
    "Main Distribution Board": ["MDB"],
    "Generator Sets and Synchronizing Panel": ["General"],
    "Fuel System": ["Bulk Tank", "Day Tank", "Pumps", "Filters"],
    "Grounding & Bonding Grid": ["General"],
  },
};

const fields = [
  "Location / ID",
  "Asset Tag / Serial No.",
  "Mfr / Model",
  "Capacity / Rating",
  "Install Date",
  "Last Maintenance",
  "Vendor / Contractor",
  "Tier Clause Ref.",
  "Specs / Config",
  "Redundancy",
  "Oper. Status",
  "Test Records (Date/Result)",
  "Compliance Status",
  "Criticality (H/M/L)",
  "Risk if Failed",
  "Gap Description",
  "Recommendation",
  "Est. Upgrade Cost",
  "Photo / Doc Ref",
];

export default function Page() {
  const [domain, setDomain] = useState<string>("");
  const [subsystem, setSubsystem] = useState<string>("");
  const [component, setComponent] = useState<string>("");
  const [activeFieldIndex, setActiveFieldIndex] = useState(0);
  const [form, setForm] = useState<{ [key: string]: string }>({});

  const handleNextField = () => {
    if (activeFieldIndex < fields.length - 1) {
      setActiveFieldIndex(activeFieldIndex + 1);
    }
  };

  const handleChange = (value: string) => {
    setForm({
      ...form,
      [fields[activeFieldIndex]]: value,
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Mapping Inventory Item to Tier III Assessment Table", 14, 20);

    // Subtitle
    doc.setFontSize(12);
    doc.text("Inventory Breakdown", 14, 30);

    // First table (Domain, Subsystem, Component)
    autoTable(doc, {
      startY: 35,
      head: [["Field", "Value"]],
      body: [
        ["Domain", domain],
        ["Subsystem", subsystem],
        ["Component", component],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Blue header
      styles: { cellPadding: 3, fontSize: 10 },
    });

    // Get Y position after first table
    const afterFirstTableY = (doc as any).lastAutoTable.finalY + 10;

    // Section Title
    doc.setFontSize(12);
    doc.text(
      "Corresponding Filled Assessment Table Row",
      14,
      afterFirstTableY
    );

    // Second table (Assessment fields)
    autoTable(doc, {
      startY: afterFirstTableY + 5,
      head: [["Field", "Value"]],
      body: fields.map((field) => [field, form[field] || "-"]),
      theme: "grid",
      headStyles: { fillColor: [0, 153, 76], textColor: 255 }, // Green header
      styles: { cellPadding: 3, fontSize: 10 },
    });

    doc.save("tier-iii-assessment.pdf");
  };




  const allFieldsFilled = Object.keys(form).length === fields.length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-xl space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-6">
          Inventory Breakdown
        </h1>

        {/* Domain */}
        <div className="flex flex-col">
          <label className="font-bold mb-2 text-gray-800">Domain</label>
          <select
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setSubsystem("");
              setComponent("");
              setActiveFieldIndex(0);
              setForm({});
            }}
            className="border border-gray-400 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Domain</option>
            {Object.keys(domains).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Subsystem */}
        {domain && (
          <div className="flex flex-col">
            <label className="font-bold mb-2 text-gray-800">Subsystem</label>
            <select
              value={subsystem}
              onChange={(e) => {
                setSubsystem(e.target.value);
                setComponent("");
                setActiveFieldIndex(0);
                setForm({});
              }}
              className="border border-gray-400 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Subsystem</option>
              {Object.keys(domains[domain]).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Component */}
        {subsystem && (
          <div className="flex flex-col">
            <label className="font-bold mb-2 text-gray-800">Component</label>
            <select
              value={component}
              onChange={(e) => {
                setComponent(e.target.value);
                setActiveFieldIndex(0);
                setForm({});
              }}
              className="border border-gray-400 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Component</option>
              {domains[domain][subsystem].map((c: string) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Assessment Fields */}
        {component && activeFieldIndex < fields.length && (
          <div className="flex flex-col">
            <label className="font-bold mb-2 text-gray-800">
              {fields[activeFieldIndex]}
            </label>
            <input
              type="text"
              value={form[fields[activeFieldIndex]] || ""}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={`Enter ${fields[activeFieldIndex]}`}
              className="border border-gray-400 rounded-lg px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleNextField}
              className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Download Button */}
        {component && activeFieldIndex === fields.length - 1 && allFieldsFilled && (
          <button
            onClick={exportPDF}
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition mt-4"
          >
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
}
