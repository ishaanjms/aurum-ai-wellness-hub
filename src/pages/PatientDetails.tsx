
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockData, Patient, Consultation } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, Edit, File } from "lucide-react";
import { format } from "date-fns";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    if (id) {
      const foundPatient = mockData.getPatient(id);
      if (foundPatient) {
        setPatient(foundPatient);
        setConsultations(mockData.getConsultations(id));
      }
    }
  }, [id]);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Patient not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-muted-foreground">
            Patient ID: {patient.id} • Added on{" "}
            {format(new Date(patient.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <Button onClick={() => navigate(`/consultation/${patient.id}`)}>
          New Consultation
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Personal Information</h3>
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <p className="text-sm font-medium">Age:</p>
                  <p className="text-sm">{patient.age}</p>
                  <p className="text-sm font-medium">Gender:</p>
                  <p className="text-sm capitalize">{patient.gender}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Contact Information</h3>
                <div className="grid grid-cols-[100px_1fr] gap-1 mt-2">
                  <p className="text-sm font-medium">Phone:</p>
                  <p className="text-sm">{patient.contact}</p>
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">{patient.email}</p>
                  <p className="text-sm font-medium">Address:</p>
                  <p className="text-sm">{patient.address}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Visit Information</h3>
                <div className="grid grid-cols-[120px_1fr] gap-1 mt-2">
                  <p className="text-sm font-medium">First Visit:</p>
                  <p className="text-sm">
                    {format(new Date(patient.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm font-medium">Last Visit:</p>
                  <p className="text-sm">
                    {format(new Date(patient.lastVisit), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm font-medium">Total Consultations:</p>
                  <p className="text-sm">{consultations.length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="consultations">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="consultations" className="pt-4">
              {consultations.length > 0 ? (
                <div className="space-y-4">
                  {consultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => {}}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon size={16} className="text-muted-foreground" />
                          <span className="font-medium">
                            {format(new Date(consultation.date), "MMMM d, yyyy")}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {consultation.id}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="font-medium">Symptoms Summary</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {consultation.aiSummary || "No summary available"}
                        </p>
                      </div>
                      <div className="mt-3">
                        <h3 className="font-medium">Prescribed Remedies</h3>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {consultation.remedies.map((remedy, idx) => (
                            <div key={idx} className="bg-accent px-2 py-1 rounded-md text-xs">
                              {remedy.name} {remedy.potency}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button variant="ghost" size="sm">
                          <File size={14} className="mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No consultation records found</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => navigate(`/consultation/${patient.id}`)}
                  >
                    Create First Consultation
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="timeline" className="pt-4">
              <div className="relative pl-6 border-l-2 border-muted space-y-6">
                {consultations.map((consultation, idx) => (
                  <div key={consultation.id} className="relative">
                    <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-primary"></div>
                    <div className="mb-1 flex items-baseline justify-between">
                      <h3 className="font-medium">
                        Consultation
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(consultation.date), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm">{consultation.diagnosis || "No diagnosis recorded"}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {consultation.remedies.map((remedy, idx) => (
                        <span key={idx} className="text-xs bg-accent px-2 py-0.5 rounded-md">
                          {remedy.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="relative">
                  <div className="absolute -left-[25px] h-4 w-4 rounded-full bg-secondary"></div>
                  <div className="mb-1 flex items-baseline justify-between">
                    <h3 className="font-medium">
                      Patient Added
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(patient.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm">Patient record was created</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
