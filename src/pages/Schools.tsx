import { useState } from 'react'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { mockSchools } from '@/data/mockData'
import type { School } from '@/types'

export default function Schools() {
    const [schools, setSchools] = useState<School[]>(mockSchools)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
    const { showToast } = useToast()

    const filteredSchools = schools.filter(school =>
        school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredSchools, initialItemsPerPage: 10 })

    const handleDelete = () => {
        if (!selectedSchool) return
        setSchools(schools.filter(s => s.id !== selectedSchool.id))
        setSelectedSchool(null)
        showToast('success', 'School deleted successfully!')
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Schools Management</h1>
                <p className="text-muted-foreground">Manage school information and records</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search schools..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                    </div>
                    <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add School
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>School ID</TableHead>
                            <TableHead>School Name</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Principal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((school) => (
                            <TableRow key={school.id}>
                                <TableCell className="font-medium">{school.id}</TableCell>
                                <TableCell>{school.schoolName}</TableCell>
                                <TableCell>{school.address}</TableCell>
                                <TableCell>{school.phone}</TableCell>
                                <TableCell>{school.principalName}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${school.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {school.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedSchool(school); setIsDeleteDialogOpen(true) }} className="gap-1">
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    itemsPerPage={pagination.itemsPerPage}
                    totalItems={pagination.totalItems}
                    startIndex={pagination.startIndex}
                    endIndex={pagination.endIndex}
                    onPageChange={pagination.goToPage}
                    onItemsPerPageChange={pagination.setItemsPerPage}
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {pagination.currentItems.map((school) => (
                    <div key={school.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{school.schoolName}</h3>
                                <p className="text-sm text-muted-foreground">ID: {school.id}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${school.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {school.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                            <div>
                                <span className="text-muted-foreground">Address:</span>
                                <p className="font-medium">{school.address}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Phone:</span>
                                <p className="font-medium">{school.phone}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Principal:</span>
                                <p className="font-medium">{school.principalName}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedSchool(school); setIsDeleteDialogOpen(true) }} className="flex-1 gap-1">
                                <Trash2 className="w-3 h-3" />
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
                <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        itemsPerPage={pagination.itemsPerPage}
                        totalItems={pagination.totalItems}
                        startIndex={pagination.startIndex}
                        endIndex={pagination.endIndex}
                        onPageChange={pagination.goToPage}
                        onItemsPerPageChange={pagination.setItemsPerPage}
                    />
                </div>
            </div>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete School"
                message={`Are you sure you want to delete "${selectedSchool?.schoolName}"?`}
            />
        </div>
    )
}
