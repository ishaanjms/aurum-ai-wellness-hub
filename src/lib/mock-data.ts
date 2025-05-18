
export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  contact: string;
  email: string;
  address: string;
  createdAt: string;
  lastVisit: string;
  primaryPatientId?: string; // ID of primary account holder if this is a dependent
  dependents?: string[]; // Array of IDs for dependent patients
};

export type Consultation = {
  id: string;
  patientId: string;
  date: string;
  symptoms: string;
  aiSummary?: string;
  diagnosis?: string;
  remedies: Remedy[];
  notes?: string;
};

export type Remedy = {
  name: string;
  potency: string;
  dosage: string;
  instructions: string;
};

// Mock patients data
const patients: Patient[] = [
  {
    id: "P001",
    name: "Jane Smith",
    age: 42,
    gender: "female",
    contact: "555-123-4567",
    email: "jane.smith@example.com",
    address: "123 Elm Street, Springfield",
    createdAt: "2023-03-15T10:30:00Z",
    lastVisit: "2025-05-10T14:15:00Z",
    dependents: ["P006"]
  },
  {
    id: "P002",
    name: "John Doe",
    age: 35,
    gender: "male",
    contact: "555-987-6543",
    email: "john.doe@example.com",
    address: "456 Oak Avenue, Rivertown",
    createdAt: "2023-05-20T09:00:00Z",
    lastVisit: "2025-05-01T11:30:00Z"
  },
  {
    id: "P003",
    name: "Emma Wilson",
    age: 28,
    gender: "female",
    contact: "555-456-7890",
    email: "emma.wilson@example.com",
    address: "789 Maple Road, Hillsdale",
    createdAt: "2023-07-03T13:45:00Z",
    lastVisit: "2025-04-22T09:00:00Z"
  },
  {
    id: "P004",
    name: "Michael Brown",
    age: 51,
    gender: "male",
    contact: "555-789-0123",
    email: "michael.brown@example.com",
    address: "321 Pine Lane, Woodland",
    createdAt: "2023-09-12T15:20:00Z",
    lastVisit: "2025-04-15T16:45:00Z"
  },
  {
    id: "P005",
    name: "Sophia Lee",
    age: 32,
    gender: "female",
    contact: "555-234-5678",
    email: "sophia.lee@example.com",
    address: "654 Cedar Court, Lakeside",
    createdAt: "2023-11-05T10:10:00Z",
    lastVisit: "2025-05-05T10:30:00Z"
  },
  {
    id: "P006",
    name: "Lily Smith",
    age: 13,
    gender: "female",
    contact: "",
    email: "",
    address: "123 Elm Street, Springfield",
    createdAt: "2024-01-15T10:30:00Z",
    lastVisit: "2025-05-08T11:30:00Z",
    primaryPatientId: "P001"
  }
];

// Mock consultations data
const consultations: Consultation[] = [
  {
    id: "C001",
    patientId: "P001",
    date: "2025-05-10T14:15:00Z",
    symptoms: "Patient reports recurring headaches, primarily in the frontal region. Pain is described as throbbing and worsens in the afternoon. Associated symptoms include sensitivity to light and occasional nausea. Patient mentions stress at work as a possible trigger.",
    aiSummary: "Frontal headaches with throbbing pain, photosensitivity, and nausea, worsening in afternoons. Potentially stress-induced.",
    diagnosis: "Tension headache with possible migraine component",
    remedies: [
      {
        name: "Belladonna",
        potency: "30C",
        dosage: "3 pellets",
        instructions: "Take 3 times daily for 5 days. Dissolve under tongue away from food and strong odors."
      },
      {
        name: "Nux Vomica",
        potency: "6C",
        dosage: "5 drops",
        instructions: "Take once in the evening for 7 days. Mix in small amount of water."
      }
    ],
    notes: "Follow-up in 2 weeks. Recommended stress management techniques and adequate hydration."
  },
  {
    id: "C002",
    patientId: "P001",
    date: "2025-04-12T11:30:00Z",
    symptoms: "Patient experiencing seasonal allergies with itchy, watery eyes and frequent sneezing. Symptoms worsen outdoors and in the morning. Clear nasal discharge. No fever present.",
    aiSummary: "Seasonal allergy symptoms: itchy/watery eyes, sneezing, clear nasal discharge. Worse outdoors and mornings.",
    diagnosis: "Seasonal allergic rhinitis",
    remedies: [
      {
        name: "Allium Cepa",
        potency: "12C",
        dosage: "3 pellets",
        instructions: "Take twice daily for 10 days. Dissolve under tongue."
      }
    ],
    notes: "Advised to keep windows closed during high pollen count days. Consider air purifier for bedroom."
  },
  {
    id: "C003",
    patientId: "P002",
    date: "2025-05-01T11:30:00Z",
    symptoms: "Patient reports digestive issues including bloating after meals, occasional acid reflux, and discomfort that improves with warm drinks. Symptoms worse after eating spicy or fatty foods. Reports increased stress at work recently.",
    aiSummary: "Digestive issues: postprandial bloating, acid reflux, discomfort relieved by warm drinks. Aggravated by spicy/fatty foods and stress.",
    diagnosis: "Functional dyspepsia with stress component",
    remedies: [
      {
        name: "Lycopodium",
        potency: "200C",
        dosage: "1 dose",
        instructions: "Take single dose now and repeat in one week."
      },
      {
        name: "Nux Vomica",
        potency: "30C",
        dosage: "3 pellets",
        instructions: "Take nightly before bed for 5 days."
      }
    ],
    notes: "Dietary adjustments recommended: smaller, more frequent meals and avoiding trigger foods. Suggested relaxation techniques before meals."
  },
  {
    id: "C004",
    patientId: "P003",
    date: "2025-04-22T09:00:00Z",
    symptoms: "Patient presents with anxiety, racing thoughts, and difficulty sleeping. Reports waking frequently during the night with mind racing about work concerns. Symptoms began approximately 3 weeks ago coinciding with new job responsibilities.",
    aiSummary: "Anxiety, racing thoughts, insomnia related to work stress. Onset coincides with new job responsibilities 3 weeks ago.",
    diagnosis: "Acute situational anxiety with insomnia",
    remedies: [
      {
        name: "Arsenicum Album",
        potency: "30C",
        dosage: "3 pellets",
        instructions: "Take once before bedtime for 7 days."
      },
      {
        name: "Coffea Cruda",
        potency: "12C",
        dosage: "5 drops",
        instructions: "Take 30 minutes before bedtime in water."
      }
    ],
    notes: "Recommended establishing regular sleep schedule and bedtime routine. Suggested journaling to document worries before bed."
  },
  {
    id: "C005",
    patientId: "P004",
    date: "2025-04-15T16:45:00Z",
    symptoms: "Patient experiencing joint pain primarily in knees and fingers, worse in morning and during damp weather. Reports stiffness lasting approximately 30 minutes after waking. Pain improves with gentle movement and warm applications.",
    aiSummary: "Joint pain in knees and fingers, morning stiffness lasting 30 minutes. Worse in damp weather, better with movement and warmth.",
    diagnosis: "Early osteoarthritis",
    remedies: [
      {
        name: "Rhus Toxicodendron",
        potency: "30C",
        dosage: "3 pellets",
        instructions: "Take twice daily for 14 days."
      },
      {
        name: "Bryonia",
        potency: "6C",
        dosage: "3 pellets",
        instructions: "Take as needed for acute pain, up to 3 times daily."
      }
    ],
    notes: "Recommended gentle exercise program focused on joint mobility. Advised on anti-inflammatory diet options."
  }
];

// Mock remedies data
const commonRemedies: { name: string; count: number }[] = [
  { name: "Nux Vomica", count: 35 },
  { name: "Arnica Montana", count: 42 },
  { name: "Belladonna", count: 28 },
  { name: "Rhus Toxicodendron", count: 22 },
  { name: "Arsenicum Album", count: 18 },
  { name: "Bryonia", count: 24 },
  { name: "Pulsatilla", count: 31 },
  { name: "Lycopodium", count: 26 },
  { name: "Phosphorus", count: 19 },
  { name: "Sulphur", count: 27 }
];

// Mock common symptoms data
const commonSymptoms: { name: string; count: number }[] = [
  { name: "Headache", count: 58 },
  { name: "Joint Pain", count: 43 },
  { name: "Anxiety", count: 39 },
  { name: "Digestive Issues", count: 47 },
  { name: "Fatigue", count: 62 },
  { name: "Allergies", count: 35 },
  { name: "Insomnia", count: 44 },
  { name: "Cough", count: 29 },
  { name: "Skin Rash", count: 25 },
  { name: "Fever", count: 31 }
];

export const mockData = {
  getPatients: () => [...patients],
  getPatient: (id: string) => patients.find(p => p.id === id),
  addPatient: (patient: Omit<Patient, "id" | "createdAt" | "lastVisit">, primaryPatientId?: string) => {
    const newPatient = {
      ...patient,
      id: `P${String(patients.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      primaryPatientId
    };
    
    // If this is a dependent, update the primary patient's dependents array
    if (primaryPatientId) {
      const primaryPatient = patients.find(p => p.id === primaryPatientId);
      if (primaryPatient) {
        if (!primaryPatient.dependents) {
          primaryPatient.dependents = [];
        }
        primaryPatient.dependents.push(newPatient.id);
      }
    }
    
    patients.push(newPatient as Patient);
    return newPatient;
  },
  getConsultations: (patientId?: string) => {
    if (patientId) {
      return consultations.filter(c => c.patientId === patientId);
    }
    return [...consultations];
  },
  getConsultation: (id: string) => consultations.find(c => c.id === id),
  addConsultation: (consultation: Omit<Consultation, "id" | "aiSummary">) => {
    const aiSummary = "AI-generated summary based on symptoms analysis.";
    const newConsultation = {
      ...consultation,
      id: `C${String(consultations.length + 1).padStart(3, '0')}`,
      aiSummary
    };
    consultations.push(newConsultation as Consultation);
    // Update patient's last visit date
    const patient = patients.find(p => p.id === consultation.patientId);
    if (patient) {
      patient.lastVisit = consultation.date;
    }
    return newConsultation;
  },
  getCommonRemedies: () => [...commonRemedies],
  getCommonSymptoms: () => [...commonSymptoms],
  getPrimaryPatients: () => patients.filter(p => !p.primaryPatientId),
  getPatientStats: () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const newPatients = patients.filter(
      p => new Date(p.createdAt) >= thirtyDaysAgo
    ).length;

    const recentConsults = consultations.filter(
      c => new Date(c.date) >= thirtyDaysAgo
    ).length;

    return {
      totalPatients: patients.length,
      newPatients,
      totalConsultations: consultations.length,
      recentConsultations: recentConsults
    };
  }
};
