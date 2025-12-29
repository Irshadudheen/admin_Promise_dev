import { useState } from 'react'
import { Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { mockCountryCodes } from '@/data/mockData'
import type { CountryCode } from '@/types'

export default function CountryCode() {
    const [countryCodes, setCountryCodes] = useState<CountryCode[]>(mockCountryCodes)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedCode, setSelectedCode] = useState<CountryCode | null>(null)
    const { showToast } = useToast()

    const filteredCodes = countryCodes.filter(code =>
        code.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.dialCode.includes(searchTerm)
    )

    const pagination = usePagination({ items: filteredCodes, initialItemsPerPage: 10 })

    const handleDelete = () => {
        if (!selectedCode) return
        setCountryCodes(countryCodes.filter(c => c.id !== selectedCode.id))
        setSelectedCode(null)
        showToast('success', 'Country code deleted successfully!')
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Country Code Management</h1>
                <p className="text-muted-foreground">Manage international dialing codes</p>
            </div>

            <div className="bg-white rounded-lg border border-border shadow-sm p-4 mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search country codes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Country Name</TableHead>
                            <TableHead>Dial Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((code) => (
                            <TableRow key={code.id}>
                                <TableCell className="font-medium">{code.countryName}</TableCell>
                                <TableCell className="font-mono">{code.dialCode}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${code.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {code.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Edit className="w-3 h-3" />
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => { setSelectedCode(code); setIsDeleteDialogOpen(true) }} className="gap-1">
                                            <Trash2 className="w-3 h-3" />
                                            Delete
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
                {pagination.currentItems.map((code) => (
                    <div key={code.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-lg">{code.countryName}</h3>
                                <p className="text-sm text-muted-foreground font-mono">{code.dialCode}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${code.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {code.status}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 gap-1">
                                <Edit className="w-3 h-3" />
                                Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => { setSelectedCode(code); setIsDeleteDialogOpen(true) }} className="flex-1 gap-1">
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
                title="Delete Country Code"
                message={`Are you sure you want to delete the country code for "${selectedCode?.countryName}"?`}
            />
        </div>
    )
}
