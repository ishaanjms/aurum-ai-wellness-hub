import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockData, Patient, Remedy } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Search, Sparkles, Trash2, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const NewConsultation = () => {
  const { patientId } = useParams<{ patientId?: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patientId || "");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingRemedies, setIsGeneratingRemedies] = useState(false);
  const [open, setOpen] = useState(false);
  
  const [consultation, setConsultation] = useState({
    date: new Date().toISOString().split("T")[0],
    symptoms: "",
    aiSummary: "",
    diagnosis: "",
    notes: "",
    remedies: [{ name: "", potency: "", dosage: "", instructions: "" }]
  });

  useEffect(() => {
    const allPatients = mockData.getPatients();
    setPatients(allPatients);
    
    if (patientId) {
      const foundPatient = mockData.getPatient(patientId);
      if (foundPatient) {
        setPatient(foundPatient);
        setSelectedPatientId(patientId);
      }
    }
  }, [patientId]);

  const handlePatientChange = (value: string) => {
    setSelectedPatientId(value);
    const foundPatient = mockData.getPatient(value);
    setPatient(foundPatient || null);
    setOpen(false);
  };

  const handleAddRemedy = () => {
    setConsultation({
      ...consultation,
      remedies: [
        ...consultation.remedies,
        { name: "", potency: "", dosage: "", instructions: "" }
      ]
    });
  };

  const handleRemoveRemedy = (index: number) => {
    const newRemedies = [...consultation.remedies];
    newRemedies.splice(index, 1);
    setConsultation({
      ...consultation,
      remedies: newRemedies
    });
  };

  const handleRemedyChange = (index: number, field: keyof Remedy, value: string) => {
    const newRemedies = [...consultation.remedies];
    newRemedies[index] = {
      ...newRemedies[index],
      [field]: value
    };
    setConsultation({
      ...consultation,
      remedies: newRemedies
    });
  };

  const handleGenerateSummary = () => {
    if (!consultation.symptoms) {
      toast.error("Please enter symptoms before generating a summary");
      return;
    }

    setIsGeneratingSummary(true);
    // Simulate AI processing
    setTimeout(() => {
      const summary = generateAISummary(consultation.symptoms);
      setConsultation({
        ...consultation,
        aiSummary: summary
      });
      setIsGeneratingSummary(false);
      toast.success("Symptom summary generated");
    }, 1500);
  };

  const handleSuggestRemedies = () => {
    if (!consultation.symptoms) {
      toast.error("Please enter symptoms before suggesting remedies");
      return;
    }

    setIsGeneratingRemedies(true);
    // Simulate AI processing
    setTimeout(() => {
      const suggestedRemedies = generateAIRemedySuggestions(consultation.symptoms);
      setConsultation({
        ...consultation,
        remedies: suggestedRemedies
      });
      setIsGeneratingRemedies(false);
      toast.success("Remedy suggestions generated");
    }, 2000);
  };

  const handleSaveConsultation = () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }

    if (!consultation.symptoms || !consultation.remedies[0].name) {
      toast.error("Please enter symptoms and at least one remedy");
      return;
    }

    const validRemedies = consultation.remedies.filter(
      remedy => remedy.name && remedy.potency && remedy.dosage
    );

    if (validRemedies.length === 0) {
      toast.error("Please complete at least one remedy with name, potency and dosage");
      return;
    }

    mockData.addConsultation({
      patientId: selectedPatientId,
      date: new Date().toISOString(),
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      remedies: validRemedies,
      notes: consultation.notes
    });

    toast.success("Consultation saved successfully");
    navigate(`/patients/${selectedPatientId}`);
  };
  
  // Simulate AI summary generation
  const generateAISummary = (symptoms: string): string => {
    // This would normally call an AI API
    const keywords = ["headache", "pain", "anxiety", "digestive", "insomnia", "fatigue"];
    const locations = ["frontal", "temporal", "abdominal", "joint", "chest"];
    const modifiers = ["throbbing", "acute", "chronic", "dull", "sharp", "persistent"];
    const conditions = ["worse with", "improved by", "accompanied by"];
    
    let summary = "";
    
    for (const keyword of keywords) {
      if (symptoms.toLowerCase().includes(keyword)) {
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        summary += `${randomModifier} ${keyword} in ${randomLocation} region, ${randomCondition} various factors. `;
        break;
      }
    }
    
    if (!summary) {
      summary = "Patient reports multiple symptoms requiring evaluation. ";
    }
    
    summary += "Recommend monitoring and follow-up.";
    return summary;
  };

  // Simulate AI remedy suggestions
  const generateAIRemedySuggestions = (symptoms: string): Remedy[] => {
    const commonRemedies = [
      {
        name: "Belladonna",
        potency: "30C",
        dosage: "3 pellets",
        instructions: "Take 3 times daily for 5 days. Dissolve under tongue."
      },
      {
        name: "Nux Vomica",
        potency: "6C",
        dosage: "5 drops",
        instructions: "Take once in the evening for 7 days. Mix in small amount of water."
      },
      {
        name: "Arnica Montana",
        potency: "200C",
        dosage: "1 dose",
        instructions: "Take single dose now and repeat in one week if needed."
      }
    ];

    if (symptoms.toLowerCase().includes("headache")) {
      return [
        {
          name: "Belladonna",
          potency: "30C",
          dosage: "3 pellets",
          instructions: "Take 3 times daily for 3 days. Dissolve under tongue."
        },
        {
          name: "Bryonia",
          potency: "6C",
          dosage: "3 pellets",
          instructions: "Take as needed for pain, up to 3 times daily."
        }
      ];
    }
    
    if (symptoms.toLowerCase().includes("anxiety")) {
      return [
        {
          name: "Arsenicum Album",
          potency: "30C",
          dosage: "3 pellets",
          instructions: "Take twice daily for 7 days."
        }
      ];
    }
    
    if (symptoms.toLowerCase().includes("digest")) {
      return [
        {
          name: "Nux Vomica",
          potency: "30C",
          dosage: "3 pellets",
          instructions: "Take before bedtime for 5 days."
        },
        {
          name: "Lycopodium",
          potency: "200C",
          dosage: "1 dose",
          instructions: "Take single dose weekly."
        }
      ];
    }
    
    // Default suggestion if no specific symptom is matched
    return [commonRemedies[Math.floor(Math.random() * commonRemedies.length)]];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">New Consultation</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Selection</CardTitle>
            <CardDescription>
              Select a patient for this consultation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedPatientId
                    ? patients.find((patient) => patient.id === selectedPatientId)?.name
                    : "Search patients..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search patients..." />
                  <CommandEmpty>No patient found.</CommandEmpty>
                  <CommandGroup>
                    {patients.map((patient) => (
                      <CommandItem
                        key={patient.id}
                        value={patient.id}
                        onSelect={handlePatientChange}
                        className="flex justify-between"
                      >
                        <div>
                          <span>{patient.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {patient.age}/{patient.gender.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {patient.contact}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => navigate("/patients")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Patient
              </Button>
            </div>
            
            {patient && (
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Age:</span> {patient.age}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Gender:</span> {patient.gender}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Contact:</span> {patient.contact}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Consultation Details</CardTitle>
            <CardDescription>
              Enter the consultation date and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="date" className="text-sm font-medium block mb-1">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={consultation.date}
                  onChange={(e) => setConsultation({ ...consultation, date: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="diagnosis" className="text-sm font-medium block mb-1">
                  Diagnosis
                </label>
                <Input
                  id="diagnosis"
                  value={consultation.diagnosis}
                  placeholder="Enter diagnosis..."
                  onChange={(e) => setConsultation({ ...consultation, diagnosis: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Symptoms</CardTitle>
              <CardDescription>
                Record the patient's symptoms in detail
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
              {isGeneratingSummary ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Summarize
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="symptoms" className="text-sm font-medium block mb-1">
                Symptoms Description
              </label>
              <Textarea
                id="symptoms"
                rows={6}
                placeholder="Enter detailed symptoms description..."
                value={consultation.symptoms}
                onChange={(e) => setConsultation({ ...consultation, symptoms: e.target.value })}
              />
            </div>
            
            {consultation.aiSummary && (
              <div className="p-4 bg-accent rounded-md">
                <h3 className="font-medium mb-1 flex items-center">
                  <Sparkles size={16} className="mr-2 text-primary" />
                  AI-Generated Summary
                </h3>
                <p className="text-sm">{consultation.aiSummary}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Prescribed Remedies</CardTitle>
              <CardDescription>
                Add homeopathic remedies to prescribe
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSuggestRemedies} disabled={isGeneratingRemedies}>
                {isGeneratingRemedies ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="mr-2" />
                    AI Suggest
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleAddRemedy}>
                <Plus size={16} className="mr-2" />
                Add Remedy
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {consultation.remedies.map((remedy, index) => (
            <div key={index} className="p-4 border rounded-md mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Remedy #{index + 1}</h3>
                {consultation.remedies.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveRemedy(index)}>
                    <Trash2 size={16} className="text-destructive" />
                  </Button>
                )}
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium block mb-1">Name</label>
                  <Input
                    placeholder="Remedy name"
                    value={remedy.name}
                    onChange={(e) => handleRemedyChange(index, "name", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Potency</label>
                  <Input
                    placeholder="e.g., 30C, 200C"
                    value={remedy.potency}
                    onChange={(e) => handleRemedyChange(index, "potency", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Dosage</label>
                  <Input
                    placeholder="e.g., 3 pellets twice daily"
                    value={remedy.dosage}
                    onChange={(e) => handleRemedyChange(index, "dosage", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Instructions</label>
                  <Input
                    placeholder="Administration instructions"
                    value={remedy.instructions}
                    onChange={(e) => handleRemedyChange(index, "instructions", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="Enter any additional notes, recommendations, or follow-up instructions..."
            value={consultation.notes}
            onChange={(e) => setConsultation({ ...consultation, notes: e.target.value })}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSaveConsultation}>
          Save Consultation
        </Button>
      </div>
    </div>
  );
};

export default NewConsultation;
