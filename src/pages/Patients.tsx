
import { useState } from "react";
import { mockData, Patient } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Phone, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(mockData.getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isDependent, setIsDependent] = useState(false);
  const [primaryPatients, setPrimaryPatients] = useState<Patient[]>(mockData.getPrimaryPatients());
  const [selectedPrimaryPatient, setSelectedPrimaryPatient] = useState<string>("");
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
  });

  // Filter patients based on search term and search type
  const filteredPatients = searchTerm
    ? patients.filter((patient) => {
        if (searchType === "name") {
          return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === "id") {
          return patient.id.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === "phone") {
          return patient.contact.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return true;
      })
    : patients;

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      toast.error("Please fill all required fields");
      return;
    }

    // If it's a dependent, we don't require contact info
    if (!isDependent && !newPatient.contact) {
      toast.error("Contact information is required for primary patients");
      return;
    }

    const addedPatient = mockData.addPatient(
      {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        gender: newPatient.gender as "male" | "female" | "other",
        contact: newPatient.contact,
        email: newPatient.email,
        address: newPatient.address,
      }, 
      isDependent ? selectedPrimaryPatient : undefined
    );

    // Update both patients and primaryPatients lists
    setPatients(mockData.getPatients());
    setPrimaryPatients(mockData.getPrimaryPatients());
    
    setIsAddPatientOpen(false);
    toast.success(`Patient ${isDependent ? "(Dependent)" : ""} added successfully`);
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      address: "",
    });
    setIsDependent(false);
    setSelectedPrimaryPatient("");

    navigate(`/patients/${addedPatient.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <Button onClick={() => setIsAddPatientOpen(true)}>
          <Plus size={18} className="mr-1" />
          Add Patient
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Tabs 
          defaultValue="name" 
          value={searchType} 
          onValueChange={setSearchType}
          className="w-[400px]"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="name">Name</TabsTrigger>
            <TabsTrigger value="id">ID</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          <TabsContent value="name" className="mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search patients by name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="id" className="mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search patients by ID..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </TabsContent>
          <TabsContent value="phone" className="mt-2">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search patients by phone number..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    {patient.age} / {patient.gender.charAt(0).toUpperCase()}
                  </TableCell>
                  <TableCell>{patient.contact || "—"}</TableCell>
                  <TableCell>
                    {patient.primaryPatientId ? (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>Dependent</span>
                      </div>
                    ) : patient.dependents?.length ? (
                      <div className="flex items-center text-sm">
                        <Users size={14} className="mr-1" />
                        <span>Primary ({patient.dependents.length})</span>
                      </div>
                    ) : (
                      "Primary"
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  {searchTerm
                    ? "No patients found matching your search criteria"
                    : "No patients found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add {isDependent ? "Dependent" : "New"} Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isDependent" 
                checked={isDependent} 
                onCheckedChange={(checked) => {
                  setIsDependent(checked === true);
                  if (!checked) setSelectedPrimaryPatient("");
                }}
              />
              <label 
                htmlFor="isDependent" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                This is a dependent patient (child, etc.)
              </label>
            </div>

            {isDependent && (
              <div>
                <label htmlFor="primaryPatient" className="text-sm font-medium leading-none mb-2 block">
                  Primary Patient Account <span className="text-red-500">*</span>
                </label>
                <Select
                  value={selectedPrimaryPatient}
                  onValueChange={setSelectedPrimaryPatient}
                  required
                >
                  <SelectTrigger id="primaryPatient">
                    <SelectValue placeholder="Select primary patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {primaryPatients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.contact})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium leading-none mb-2 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="text-sm font-medium leading-none mb-2 block">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="120"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="text-sm font-medium leading-none mb-2 block">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={newPatient.gender}
                    onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact" className="text-sm font-medium leading-none mb-2 block">
                    Contact Number {!isDependent && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    id="contact"
                    value={newPatient.contact}
                    onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                    required={!isDependent}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium leading-none mb-2 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="text-sm font-medium leading-none mb-2 block">
                  Address
                </label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddPatientOpen(false);
              setIsDependent(false);
              setSelectedPrimaryPatient("");
              setNewPatient({
                name: "",
                age: "",
                gender: "",
                contact: "",
                email: "",
                address: "",
              });
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;
