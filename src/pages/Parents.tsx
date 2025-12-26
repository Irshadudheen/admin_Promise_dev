import { useState } from 'react'
import { Eye, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { mockParents } from '@/data/mockData'
import type { Parent } from '@/types'

export default function Parents() {
    const [parents, setParents] = useState<Parent[]>(mockParents)
    const [searchTerm, setSearchTerm] = useState('')
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
    const { showToast } = useToast()

    const filteredParents = parents.filter(parent =>
        parent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = () => {
        if (!selectedParent) return
        setParents(parents.filter(p => p.id !== selectedParent.id))
        setSelectedParent(null)
        showToast('success', 'Parent deleted successfully!')
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Parents Management</h1>
                <p className="text-muted-foreground">View and manage parent records</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search parents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Parent ID</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Associated Students</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredParents.map((parent) => (
                            <TableRow key={parent.id}>
                                <TableCell className="font-medium">{parent.id}</TableCell>
                                <TableCell>{parent.fullName}</TableCell>
                                <TableCell>{parent.email}</TableCell>
                                <TableCell>{parent.phone}</TableCell>
                                <TableCell>{parent.associatedStudents.join(', ')}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${parent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {parent.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedParent(parent); setIsViewModalOpen(true) }} className="gap-1">
                                            <Eye className="w-3 h-3" />
                                            View
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Edit className="w-3 h-3" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedParent(parent); setIsDeleteDialogOpen(true) }} className="gap-1">
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Parent Details">
                {selectedParent && (
                    <div className="space-y-3">
                        <div><span className="font-semibold">Parent ID:</span> {selectedParent.id}</div>
                        <div><span className="font-semibold">Full Name:</span> {selectedParent.fullName}</div>
                        <div><span className="font-semibold">Email:</span> {selectedParent.email}</div>
                        <div><span className="font-semibold">Phone:</span> {selectedParent.phone}</div>
                        <div><span className="font-semibold">Associated Students:</span> {selectedParent.associatedStudents.join(', ')}</div>
                        <div><span className="font-semibold">Registration Date:</span> {selectedParent.registrationDate}</div>
                        <div><span className="font-semibold">Status:</span> {selectedParent.status}</div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Parent"
                message={`Are you sure you want to delete parent "${selectedParent?.fullName}"?`}
            />
        </div>
    )
}
