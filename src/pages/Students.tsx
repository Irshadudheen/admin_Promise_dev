import { useState } from 'react'
import { Eye, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { mockStudents } from '@/data/mockData'
import type { Student } from '@/types'

export default function Students() {
    const [students, setStudents] = useState<Student[]>(mockStudents)
    const [searchTerm, setSearchTerm] = useState('')
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const { showToast } = useToast()

    const filteredStudents = students.filter(student =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = () => {
        if (!selectedStudent) return
        setStudents(students.filter(s => s.id !== selectedStudent.id))
        setSelectedStudent(null)
        showToast('success', 'Student deleted successfully!')
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Students Management</h1>
                <p className="text-muted-foreground">View and manage student records</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell className="font-medium">{student.id}</TableCell>
                                <TableCell>{student.fullName}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.phone}</TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {student.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true) }} className="gap-1">
                                            <Eye className="w-3 h-3" />
                                            
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true) }} className="gap-1">
                                            <Edit className="w-3 h-3" />
                                            
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedStudent(student); setIsDeleteDialogOpen(true) }} className="gap-1">
                                            <Trash2 className="w-3 h-3" />
                                            
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Student Details">
                {selectedStudent && (
                    <div className="space-y-3">
                        <div><span className="font-semibold">Student ID:</span> {selectedStudent.id}</div>
                        <div><span className="font-semibold">Full Name:</span> {selectedStudent.fullName}</div>
                        <div><span className="font-semibold">Email:</span> {selectedStudent.email}</div>
                        <div><span className="font-semibold">Phone:</span> {selectedStudent.phone}</div>
                        <div><span className="font-semibold">Grade:</span> {selectedStudent.grade}</div>
                        <div><span className="font-semibold">Enrollment Date:</span> {selectedStudent.enrollmentDate}</div>
                        <div><span className="font-semibold">Status:</span> {selectedStudent.status}</div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student">
                <p className="text-muted-foreground">Edit functionality would be implemented here with a form.</p>
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Student"
                message={`Are you sure you want to delete student "${selectedStudent?.fullName}"?`}
            />
        </div>
    )
}
