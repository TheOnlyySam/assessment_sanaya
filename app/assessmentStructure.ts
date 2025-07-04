const assessmentStructure = {
  "Facility Architecture": {
    "Room Layout": {
      "IT Room": ["Room Dimension (LxWxH)"],
      "UPS Room": ["Room Dimension (LxWxH)"],
      "Battery Room": ["Room Dimension (LxWxH)"],
      "Electrical Room": ["Room Dimension (LxWxH)"],
      "Telecom Room": ["Room Dimension (LxWxH)"],
    },
    "Raised Floor": {
      "Floor System": ["Height of Raised Floor"],
      "Grounding Connected": ["Is Grounding Connected? (Yes/No)"],
      "Perforated Tile": ["Perforated Tile Present? (Yes/No)", "Quantity (if Yes)"],
      "Cable Management": [
        "Is Cable Management Present? (Yes/No)",
        "Separated Path? (Yes/No)",
      ],
    },
  },
  "Power Infrastructure": {
    "Utility Feed A & B": {
      "General": ["How many sources feed?", "Cable Size"],
    },
    "Automatic Transfer Switch": {
      "ATS": ["Describe ATS Components", "Quantity of ATS"],
    },
    "Main Distribution Board": {
      "MDB": ["Describe MDB Components", "Quantity of MDB"],
    },
    "Generator Sets": {
      "General": [
        "Generator Model",
        "Generator Capacity",
        "Quantity of Generators",
      ],
    },
    "Fuel System": {
      "General": [
        "How many Tanks?",
        "Fuel Type Used",
        "Separated Pipe System? (Yes/No)",
        "Tank Capacity",
      ],
    },
    "Grounding & Bonding Grid": {
      "General": ["Is Grounding and Bonding Available? (Yes/No)"],
    },
  },
  "UPS & Battery Systems": {
    "UPS & Battery": {
      "General": [
        "Number of UPS",
        "UPS Model",
        "Number of Batteries",
        "Battery Model",
      ],
    },
  },
  "Cooling Infrastructure": {
    "Indoor Unit": {
      "General": [
        "Cooling Type",
        "Cooling Unit Quantity",
        "Cooling Unit Capacity",
      ],
    },
    "Outdoor Unit": {
      "General": [
        "Condenser Type",
        "Condenser Quantity",
        "Condenser Capacity",
      ],
    },
  },
  "Fire & Life-Safety": {
    "Fire Suppression": {
      "General": ["Fire Suppression Type"],
    },
    "Smoke Detectors": {
      "General": ["Number of Smoke Detectors", "Model Number"],
    },
    "Heat Detectors": {
      "General": ["Number of Heat Detectors", "Model Number"],
    },
    "Fire-alarm Control Panel": {
      "General": ["Number of Fire Panels", "Model Number"],
    },
    "Fire-suppression Cylinders": {
      "FM-200": [
        "Number of Cylinders",
        "Cylinder Capacity",
        "Cylinder Model Number",
      ],
      "Novec": [
        "Number of Cylinders",
        "Cylinder Capacity",
        "Cylinder Model Number",
      ],
    },
    "Nozzles": {
      "General": ["Size of Nozzle", "Number of Nozzles"],
    },
    "Fire Doors": {
      "General": ["Number of Doors", "Size of Doors (WxH)"],
    },
    "Dampers": {
      "General": ["Number of Dampers", "Size of Dampers (WxH)"],
    },
    "Emergency Lighting": {
      "General": [
        "Number of Emergency Lights",
        "Lighting Capacity (Wattage)",
        "Size of Emergency Light (WxL)",
      ],
    },
  },
  "Security & Access Control": {
    "Readers": {
      "General": ["Number of Readers", "Model of Readers"],
    },
    "Exit Buttons": {
      "General": ["Number of Exit Buttons", "Model of Exit Buttons"],
    },
    "Access Control Panels": {
      "General": ["Number of Panels", "Model of Panels"],
    },
    "NVR/DVR": {
      "General": ["Number of NVR/DVRs", "Model of NVR/DVRs"],
    },
    "CCTV Cameras": {
      "General": ["Number of Cameras", "Model of Cameras"],
    },
  },
  "Environmental Monitoring / DCIM": {
    "T/H Sensors": {
      "General": ["Number of Sensors", "Model of Sensors"],
    },
    "Leakage Sensors": {
      "General": ["Number of Sensors", "Model of Sensors"],
    },
    "EMS Appliances": {
      "General": ["Number of Appliances", "Model of Appliances"],
    },
    "Generic Sensors": {
      "General": ["Number of Sensors", "Model of Sensors"],
    },
    "Energy Meters": {
      "General": ["Number of Devices", "Model of Devices"],
    },
  },
};

export default assessmentStructure;
