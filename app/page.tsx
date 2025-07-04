"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type AssessmentStructure = {
  [domain: string]: {
    [subsystem: string]: {
      [component: string]: string[];
    };
  };
};

const assessmentStructure: AssessmentStructure = {
  "Facility Architecture": {
    "Room Layout": {
      "IT Room": ["Room Dimensions (LxWxH)"],
      "UPS Room": ["Room Dimensions (LxWxH)"],
      "Battery Room": ["Room Dimensions (LxWxH)"],
      "Electrical Room": ["Room Dimensions (LxWxH)"],
      "Telecom Room": ["Room Dimensions (LxWxH)"]
    },
    "Raised Floor": {
      "Floor System": ["Height of Raised Floor"],
      "Grounding Connected": ["Yes/No"],
      "Perforated Tile": ["Yes/No", "Quantity (if Yes)"],
      "Cable Management": ["Yes/No", "Separated Path (Yes/No)"]
    }
  },
  "Power Infrastructure": {
    "Utility Feed A & B": {
      "Feed": ["Number of Sources", "Cable Size"]
    },
    "Automatic Transfer Switch ATS": {
      "ATS": ["Describe Component", "Quantity"]
    },
    "Main Distribution Board MDB": {
      "MDB": ["Describe Component", "Quantity"]
    },
    "Generator Sets": {
      "Generator": ["Model", "Capacity", "Quantity"]
    },
    "Fuel System": {
      "Fuel Tanks": [
        "Number of Tanks",
        "Fuel Type",
        "Separated Pipe System (Yes/No)",
        "Tank Capacity"
      ]
    },
    "Grounding & Bonding Grid": {
      "Grid": ["Available (Yes/No)"]
    }
  },
  "UPS & Battery Systems": {
    "UPS & Battery": {
      "UPS": ["Number of UPS", "UPS Model"],
      "Battery": ["Number of Batteries", "Battery Model"]
    }
  },
  "Cooling Infrastructure": {
    "Indoor Unit": {
      "Cooling Unit": [
        "Cooling Type",
        "Quantity",
        "Capacity"
      ]
    },
    "Outdoor Unit": {
      "Condenser Unit": [
        "Condenser Type",
        "Quantity",
        "Capacity"
      ]
    }
  },
  "Fire & Life-Safety": {
    "Fire Suppression": {
      "Suppression System": ["Type"]
    },
    "Smoke Detectors": {
      "Detectors": ["Number", "Model Number"]
    },
    "Heat Detectors": {
      "Detectors": ["Number", "Model Number"]
    },
    "Fire-alarm Control Panel": {
      "Control Panel": ["Number of Panels", "Model Number"]
    },
    "Fire-suppression Cylinders": {
      "Cylinders": [
        "Number of Cylinders",
        "Cylinder Capacity",
        "Cylinder Model Number"
      ]
    },
    "Nozzles": {
      "Nozzle": ["Size", "Number of Nozzles"]
    },
    "Fire Doors": {
      "Doors": ["Number of Doors", "Size (WxH)"]
    },
    "Dampers": {
      "Dampers": ["Number of Dampers", "Size (WxH)"]
    },
    "Emergency Lighting": {
      "Lights": [
        "Number of Emergency Lights",
        "Lighting Capacity (Wattage)",
        "Size (WxL)"
      ]
    }
  },
  "Security & Access Control": {
    "Readers": {
      "Badge Readers": ["Number of Readers", "Model"]
    },
    "Exit Buttons": {
      "Buttons": ["Number of Exit Buttons", "Model"]
    },
    "Access Control Panel": {
      "Control Panel": ["Number of Panels", "Model"]
    },
    "NVR/DVR": {
      "Recording Devices": ["Number", "Model"]
    },
    "CCTV Cameras": {
      "Cameras": ["Number", "Model"]
    }
  },
  "Environmental Monitoring / DCIM": {
    "T/H Sensors": {
      "Sensors": ["Number", "Model"]
    },
    "Leakage Sensors": {
      "Sensors": ["Number", "Model"]
    },
    "EMS Appliance": {
      "Appliance": ["Number", "Model"]
    },
    "Generic Sensors": {
      "Sensors": ["Number", "Model"]
    },
    "Energy Meter": {
      "Meters": ["Number", "Model"]
    }
  }
};


const subsystemColors: Record<string, string> = {
  // Facility Architecture
  "Room Layout": "bg-blue-100",
  "Raised Floor": "bg-green-100",
  "Building Envelope": "bg-cyan-100",
  "Structural": "bg-indigo-100",

  // Power Infrastructure
  "Utility Feed A & B": "bg-yellow-100",
  "Automatic Transfer Switch ATS": "bg-purple-100",
  "Main Distribution Board MDB": "bg-pink-100",
  "Generator Sets": "bg-red-100",
  "Fuel System": "bg-orange-100",
  "Grounding & Bonding Grid": "bg-lime-100",

  // UPS & Battery Systems
  "UPS & Battery": "bg-emerald-100",

  // Cooling Infrastructure
  "Indoor Unit": "bg-teal-100",
  "Outdoor Unit": "bg-rose-100",

  // Fire & Life-Safety
  "Fire Suppression": "bg-fuchsia-100",
  "Smoke Detectors": "bg-amber-100",
  "Heat Detectors": "bg-violet-100",
  "Fire-alarm Control Panel": "bg-sky-100",
  "Fire-suppression Cylinders": "bg-lime-100",
  "Nozzles": "bg-orange-100",
  "Fire Doors": "bg-indigo-100",
  "Dampers": "bg-green-100",
  "Emergency Lighting": "bg-rose-100",

  // Security & Access Control
  "Readers": "bg-purple-100",
  "Exit Buttons": "bg-teal-100",
  "Access Control Panel": "bg-amber-100",
  "NVR/DVR": "bg-cyan-100",
  "CCTV Cameras": "bg-pink-100",

  // Environmental Monitoring / DCIM
  "T/H Sensors": "bg-lime-100",
  "Leakage Sensors": "bg-yellow-100",
  "EMS Appliance": "bg-sky-100",
  "Generic Sensors": "bg-indigo-100",
  "Energy Meter": "bg-rose-100"
};


export default function Page() {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [savedDomains, setSavedDomains] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<{ [domain: string]: any }>({});
  const [expandedSubsystem, setExpandedSubsystem] = useState<string | null>(null);
  const [downloadPool, setDownloadPool] = useState<Set<string>>(new Set());

  const handleInputChange = (
    domain: string,
    subsystem: string,
    component: string,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [subsystem]: {
          ...prev[domain]?.[subsystem],
          [component]: {
            ...prev[domain]?.[subsystem]?.[component],
            [field]: value,
          },
        },
      },
    }));
  };

  const isDomainComplete = (domain: string): boolean => {
    const subsystems = assessmentStructure[domain];
    for (const [subsystem, components] of Object.entries(subsystems)) {
      for (const [component, fields] of Object.entries(components)) {
        for (const field of fields) {
          if (
            !formData[domain]?.[subsystem]?.[component]?.[field] ||
            formData[domain][subsystem][component][field].trim() === ""
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSaveDomain = (domain: string) => {
    setSavedDomains((prev) => ({ ...prev, [domain]: true }));
    alert(`✅ ${domain} saved!`);
  };

  const toggleDomainInPool = (domain: string) => {
    if (!isDomainComplete(domain)) return; // Prevent adding incomplete domains
    const newPool = new Set(downloadPool);
    if (newPool.has(domain)) {
      newPool.delete(domain);
    } else {
      newPool.add(domain);
    }
    setDownloadPool(newPool);
  };

  const handleDownloadDomainPDF = (domain: string): jsPDF => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${domain} Assessment Report`, 14, 20);

    const subsystems = formData[domain];
    let y = 30;

    if (subsystems) {
      Object.entries(subsystems).forEach(([subsystem, components]: [string, any]) => {
        // Add subsystem title above the table
        doc.setFontSize(14);
        doc.text(subsystem, 14, y);
        y += 6;

        const tableRows = Object.entries(components).flatMap(
          ([component, details]: [string, any]) => {
            if (typeof details === "object" && details !== null) {
              return Object.entries(details).map(([field, value]: [string, any]) => [
                component,
                field,
                value || "-",
              ]);
            }
            return [];
          }
        );

        autoTable(doc, {
          head: [["Component", "Field", "Value"]],
          body: tableRows,
          startY: y,
          margin: { top: 10 },
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        });

        // Update y position for the next subsystem
        y = (doc as any).lastAutoTable.finalY + 10;
      });
    }

    return doc;
  };


  const handleDownloadAll = async () => {
    const zip = new JSZip();
    downloadPool.forEach((domain) => {
      const doc = handleDownloadDomainPDF(domain);
      const pdfBlob = doc.output("blob");
      const safeFileName = domain.trim().replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
zip.file(`${safeFileName}_Assessment.pdf`, pdfBlob);
    });
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "Assessment_Reports.zip");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 space-y-3 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">📋 Domains</h2>
        {Object.keys(assessmentStructure).map((domain) => (
          <div key={domain} className="mb-3">
            <button
              onClick={() => {
                setActiveDomain(domain);
                setExpandedSubsystem(null);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeDomain === domain ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {savedDomains[domain] ? "✅ " : "📝 "} {domain}
            </button>
            <div className="flex items-center mt-1">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={downloadPool.has(domain)}
                  onChange={() => toggleDomainInPool(domain)}
                  disabled={!isDomainComplete(domain)}
                  className="sr-only peer"
                />
                <div
                  className={`w-10 h-5 rounded-full transition-all ${
                    downloadPool.has(domain)
                      ? "bg-green-500"
                      : isDomainComplete(domain)
                      ? "bg-gray-600"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                ></div>
                <div className="ml-2 text-sm">
                  {downloadPool.has(domain)
                    ? "Added to Pool"
                    : isDomainComplete(domain)
                    ? "Add to Pool"
                    : "Complete fields first"}
                </div>
              </label>
            </div>
          </div>
        ))}
        <button
          onClick={handleDownloadAll}
          disabled={downloadPool.size === 0}
          className={`w-full mt-6 px-4 py-3 rounded-lg text-lg flex items-center justify-center transition-all duration-200 ${
            downloadPool.size > 0
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          📦 Download All Selected
          {downloadPool.size > 0 && (
            <span className="ml-2 bg-white text-green-700 rounded-full px-2 text-sm font-bold">
              {downloadPool.size}
            </span>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeDomain ? (
          <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-800">{activeDomain}</h1>

            {Object.entries(assessmentStructure[activeDomain]).map(
              ([subsystem, components]) => (
                <div
                  key={subsystem}
                  className={`mb-6 p-4 rounded-lg shadow ${subsystemColors[subsystem] || "bg-gray-50"}`}
                >
                  <button
                    onClick={() =>
                      setExpandedSubsystem(
                        expandedSubsystem === subsystem ? null : subsystem
                      )
                    }
                    className="w-full text-left text-2xl font-semibold text-gray-800 mb-2 hover:underline"
                  >
                    {expandedSubsystem === subsystem ? "▼" : "►"} {subsystem}
                  </button>

                  {expandedSubsystem === subsystem && (
                    <div className="space-y-4">
                      {Object.entries(components).map(([component, fields]) => (
                        <div
                          key={component}
                          className="p-4 border rounded-lg bg-white shadow-md"
                        >
                          <h3 className="text-xl font-medium mb-3 text-gray-700">
                            {component}
                          </h3>
                          {fields.map((field) => (
                            <div key={field} className="mb-3">
                              <label className="block font-medium text-gray-800 mb-1">
                                {field}
                              </label>
                              <input
                                type="text"
                                value={
                                  formData[activeDomain]?.[subsystem]?.[component]?.[field] || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    activeDomain,
                                    subsystem,
                                    component,
                                    field,
                                    e.target.value
                                  )
                                }
                                placeholder={`Enter ${field}`}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => handleSaveDomain(activeDomain)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                💾 Save {activeDomain}
              </button>
              <button
                onClick={() =>
                  handleDownloadDomainPDF(activeDomain).save(
                    `${activeDomain.replace(/\s+/g, "_")}_Assessment.pdf`
                  )
                }
                disabled={!isDomainComplete(activeDomain)}
                className={`px-6 py-3 rounded-lg transition ${
                  isDomainComplete(activeDomain)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-400 text-gray-300 cursor-not-allowed"
                }`}
              >
                📥 Download {activeDomain} PDF
              </button>
            </div>
            {!isDomainComplete(activeDomain) && (
              <p className="mt-3 text-red-500 font-medium">
                ⚠️ Please complete all fields to enable download.
              </p>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center text-xl mt-20">
            👉 Select a domain from the left to start filling data
          </div>
        )}
      </div>
    </div>
  );
}
