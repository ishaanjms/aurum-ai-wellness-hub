
import { useState } from "react";
import { mockData, Patient } from "@/lib/mock-data";
import { useNavigate } from "react-router-dom";
import { Plus, Search } from "lucide-react";
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
import { toast } from "sonner";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>(mockData.getPatients());
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
  });

  // Filter patients based on search term
  const filteredPatients = searchTerm
    ? patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patients;

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      toast.error("Please fill all required fields");
      return;
    }

    const addedPatient = mockData.addPatient({
      name: newPatient.name,
      age: parseInt(newPatient.age),
      gender: newPatient.gender as "male" | "female" | "other",
      contact: newPatient.contact,
      email: newPatient.email,
      address: newPatient.address,
    });

    setPatients(mockData.getPatients());
    setIsAddPatientOpen(false);
    toast.success("Patient added successfully");
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      contact: "",
      email: "",
      address: "",
    });

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
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search patients by name or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Age/Gender</TableHead>
              <TableHead>Contact</TableHead>
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
                  <TableCell>{patient.contact}</TableCell>
                  <TableCell>
                    {new Date(patient.lastVisit).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
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
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
                    Contact Number
                  </label>
                  <Input
                    id="contact"
                    value={newPatient.contact}
                    onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
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
            <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
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
