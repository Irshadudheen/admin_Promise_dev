import { useState } from 'react'
import { Eye, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { mockClinistinction } from '@/data/mockData'
import type { Clinistinction } from '@/types'

export default function Clinistinction() {
    const [items, setItems] = useState<Clinistinction[]>(mockClinistinction)
    const [searchTerm, setSearchTerm] = useState('')
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<Clinistinction | null>(null)
    const { showToast } = useToast()

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const pagination = usePagination({ items: filteredItems, initialItemsPerPage: 10 })

    const handleDelete = () => {
        if (!selectedItem) return
        setItems(items.filter(i => i.id !== selectedItem.id))
        setSelectedItem(null)
        showToast('success', 'Item deleted successfully!')
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Clinistinction Management</h1>
                <p className="text-muted-foreground">Manage clinical distinctions and support programs</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.createdDate}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => { setSelectedItem(item); setIsViewModalOpen(true) }} className="gap-1">
                                            <Eye className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true) }} className="gap-1">
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
                {pagination.currentItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                            <div>
                                <span className="text-muted-foreground">Description:</span>
                                <p className="font-medium">{item.description}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Category:</span>
                                <p className="font-medium">{item.category}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Created:</span>
                                <p className="font-medium">{item.createdDate}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedItem(item); setIsViewModalOpen(true) }} className="flex-1 gap-1">
                                <Eye className="w-3 h-3" />
                                View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedItem(item); setIsDeleteDialogOpen(true) }} className="flex-1 gap-1">
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

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Clinistinction Details">
                {selectedItem && (
                    <div className="space-y-3">
                        <div><span className="font-semibold">ID:</span> {selectedItem.id}</div>
                        <div><span className="font-semibold">Name:</span> {selectedItem.name}</div>
                        <div><span className="font-semibold">Description:</span> {selectedItem.description}</div>
                        <div><span className="font-semibold">Category:</span> {selectedItem.category}</div>
                        <div><span className="font-semibold">Created Date:</span> {selectedItem.createdDate}</div>
                        <div><span className="font-semibold">Status:</span> {selectedItem.status}</div>
                    </div>
                )}
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Item"
                message={`Are you sure you want to delete "${selectedItem?.name}"?`}
            />
        </div>
    )
}
