import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockData, Patient, Consultation } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Edit, File, Users, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const PatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [primaryPatient, setPrimaryPatient] = useState<Patient | null>(null);
  const [dependents, setDependents] = useState<Patient[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [alternativeContacts, setAlternativeContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      address: "",
    }
  });

  useEffect(() => {
    if (id) {
      const foundPatient = mockData.getPatient(id);
      if (foundPatient) {
        setPatient(foundPatient);
        setConsultations(mockData.getConsultations(id));
        setAlternativeContacts(foundPatient.alternativeContacts || []);
        
        // If patient has a primary patient, fetch that primary patient
        if (foundPatient.primaryPatientId) {
          const primary = mockData.getPatient(foundPatient.primaryPatientId);
          if (primary) {
            setPrimaryPatient(primary);
          }
        }
        
        // If patient has dependents, fetch those dependent patients
        if (foundPatient.dependents && foundPatient.dependents.length > 0) {
          const deps = foundPatient.dependents
            .map(depId => mockData.getPatient(depId))
            .filter(Boolean) as Patient[];
          setDependents(deps);
        }
      }
    }
  }, [id]);

  // Update form when patient data changes
  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        contact: patient.contact,
        email: patient.email,
        address: patient.address,
      });
    }
  }, [patient, form]);

  const openEditDialog = () => {
    if (patient) {
      setIsEditDialogOpen(true);
    }
  };

  const handleAddAlternativeContact = () => {
    if (newContact && !alternativeContacts.includes(newContact)) {
      setAlternativeContacts([...alternativeContacts, newContact]);
      setNewContact("");
    }
  };

  const handleRemoveAlternativeContact = (contact: string) => {
    setAlternativeContacts(alternativeContacts.filter(c => c !== contact));
  };

  const handleUpdatePatient = (data: any) => {
    if (!patient || !id) return;

    // Create updated patient object
    const updatedPatient: Patient = {
      ...patient,
      name: data.name,
      age: parseInt(data.age),
      gender: data.gender as "male" | "female" | "other",
      contact: data.contact,
      alternativeContacts: alternativeContacts,
      email: data.email,
      address: data.address,
    };

    // Update patient in mock data
    const updated = mockData.updatePatient(id, updatedPatient);
    if (updated) {
      setPatient(updated);
      toast.success("Patient details updated successfully");
      setIsEditDialogOpen(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
            {patient.primaryPatientId && (
              <Badge variant="outline" className="text-xs">Dependent</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Patient ID: {patient.id} • Added on{" "}
            {format(new Date(patient.createdAt), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openEditDialog}>
            <Edit size={16} className="mr-1" />
            Edit Profile
          </Button>
          <Button onClick={() => navigate(`/consultation/${patient.id}`)}>
            New Consultation
          </Button>
        </div>
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
                  <p className="text-sm">
                    {patient?.contact || 
                      (primaryPatient ? 
                        <span className="text-muted-foreground">Uses primary: {primaryPatient.contact}</span> : 
                        "—")}
                  </p>
                  
                  {patient?.alternativeContacts && patient.alternativeContacts.length > 0 && (
                    <>
                      <p className="text-sm font-medium">Alternative:</p>
                      <div className="text-sm">
                        {patient.alternativeContacts.map((contact, index) => (
                          <div key={index}>{contact}</div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  <p className="text-sm font-medium">Email:</p>
                  <p className="text-sm">
                    {patient?.email || 
                      (primaryPatient ? 
                        <span className="text-muted-foreground">Uses primary: {primaryPatient.email}</span> : 
                        "—")}
                  </p>
                  <p className="text-sm font-medium">Address:</p>
                  <p className="text-sm">
                    {patient?.address || 
                      (primaryPatient ? 
                        <span className="text-muted-foreground">Uses primary: {primaryPatient.address}</span> : 
                        "—")}
                  </p>
                </div>
              </div>

              {primaryPatient && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Primary Account</h3>
                    <div 
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded-md mt-2 cursor-pointer hover:bg-muted"
                      onClick={() => navigate(`/patients/${primaryPatient.id}`)}
                    >
                      <Users size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{primaryPatient.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {primaryPatient.id}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {dependents.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Dependents</h3>
                    <div className="space-y-2 mt-2">
                      {dependents.map(dep => (
                        <div 
                          key={dep.id}
                          className="flex items-center gap-2 p-2 bg-muted/50 rounded-md cursor-pointer hover:bg-muted"
                          onClick={() => navigate(`/patients/${dep.id}`)}
                        >
                          <div>
                            <p className="text-sm font-medium">{dep.name}</p>
                            <p className="text-xs text-muted-foreground">{dep.age} years • ID: {dep.id}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Patient Details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePatient)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Contact Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <FormLabel>Alternative Contact Numbers</FormLabel>
                  <div className="space-y-2">
                    {alternativeContacts.map((contact, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={contact} disabled className="flex-1" />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveAlternativeContact(contact)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="flex items-center gap-2">
                      <Input 
                        value={newContact} 
                        onChange={(e) => setNewContact(e.target.value)} 
                        placeholder="Add alternative contact"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddAlternativeContact}
                        size="icon"
                        variant="outline"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDetails;
