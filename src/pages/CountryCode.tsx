import { useState } from 'react'
import { Edit, Trash2, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { mockCountryCodes } from '@/data/mockData'
import type { CountryCode } from '@/types'
import { countryCodeSchema } from '@/schema'
import { z } from 'zod'

interface CountryCodeFormData {
    countryName: string
    dialCode: string
    flagImage: string
    digitCountLimit: string
    status: 'Active' | 'Inactive'
}

export default function CountryCode() {
    const [countryCodes, setCountryCodes] = useState<CountryCode[]>(mockCountryCodes)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCode, setSelectedCode] = useState<CountryCode | null>(null)
    const [formData, setFormData] = useState<CountryCodeFormData>({
        countryName: '',
        dialCode: '',
        flagImage: '',
        digitCountLimit: '',
        status: 'Active'
    })
    const [errors, setErrors] = useState<{
        countryName?: string
        dialCode?: string
        flagImage?: string
        digitCountLimit?: string
        status?: string
    }>({})
    const { showToast } = useToast()

    const filteredCodes = countryCodes.filter(code =>
        code.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.dialCode.includes(searchTerm)
    )

    const pagination = usePagination({ items: filteredCodes, initialItemsPerPage: 10 })

    const handleOpenAddModal = () => {
        setSelectedCode(null)
        setFormData({
            countryName: '',
            dialCode: '',
            flagImage: '',
            digitCountLimit: '',
            status: 'Active'
        })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (code: CountryCode) => {
        setSelectedCode(code)
        setFormData({
            countryName: code.countryName,
            dialCode: code.dialCode,
            flagImage: code.flagImage,
            digitCountLimit: code.digitCountLimit.toString(),
            status: code.status
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedCode(null)
        setFormData({
            countryName: '',
            dialCode: '',
            flagImage: '',
            digitCountLimit: '',
            status: 'Active'
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Zod Validation
        try {
            const validatedData = countryCodeSchema.parse({
                ...formData,
                digitCountLimit: parseInt(formData.digitCountLimit) || 0
            })
            setErrors({})

            const digitCountLimit = validatedData.digitCountLimit

            if (selectedCode) {
                // Edit existing
                setCountryCodes(countryCodes.map(code =>
                    code.id === selectedCode.id
                        ? { ...code, ...formData, digitCountLimit }
                        : code
                ))
                showToast('success', 'Country code updated successfully!')
            } else {
                // Add new
                const newCode: CountryCode = {
                    id: `CC${String(countryCodes.length + 1).padStart(3, '0')}`,
                    countryName: formData.countryName,
                    dialCode: formData.dialCode,
                    flagImage: formData.flagImage,
                    digitCountLimit,
                    status: formData.status
                }
                setCountryCodes([...countryCodes, newCode])
                showToast('success', 'Country code added successfully!')
            }

            handleCloseModal()
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors: typeof errors = {}
                error.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        fieldErrors[issue.path[0] as keyof typeof fieldErrors] = issue.message
                    }
                })
                setErrors(fieldErrors)
                showToast('error', 'Please fix the validation errors')
            }
        }
    }

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
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search country codes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
                    </div>
                    <Button onClick={handleOpenAddModal} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Add Country Code
                    </Button>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Flag</TableHead>
                            <TableHead>Country Name</TableHead>
                            <TableHead>Dial Code</TableHead>
                            <TableHead>Digit Limit</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((code) => (
                            <TableRow key={code.id}>
                                <TableCell className="text-2xl">{code.flagImage}</TableCell>
                                <TableCell className="font-medium">{code.countryName}</TableCell>
                                <TableCell className="font-mono">{code.dialCode}</TableCell>
                                <TableCell>{code.digitCountLimit} digits</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${code.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {code.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(code)} className="gap-1">
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
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{code.flagImage}</span>
                                <div>
                                    <h3 className="font-semibold text-lg">{code.countryName}</h3>
                                    <p className="text-sm text-muted-foreground font-mono">{code.dialCode}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{code.digitCountLimit} digits</p>
                                </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${code.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {code.status}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(code)} className="flex-1 gap-1">
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

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedCode ? 'Edit Country Code' : 'Add Country Code'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Country Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., United States"
                            value={formData.countryName}
                            onChange={(e) => {
                                setFormData({ ...formData, countryName: e.target.value })
                                if (errors.countryName) setErrors({ ...errors, countryName: undefined })
                            }}
                            className={errors.countryName ? 'border-destructive' : ''}
                        />
                        {errors.countryName && (
                            <p className="text-sm text-destructive mt-1">{errors.countryName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Dial Code <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., +1"
                            value={formData.dialCode}
                            onChange={(e) => {
                                setFormData({ ...formData, dialCode: e.target.value })
                                if (errors.dialCode) setErrors({ ...errors, dialCode: undefined })
                            }}
                            className={errors.dialCode ? 'border-destructive' : ''}
                        />
                        {errors.dialCode && (
                            <p className="text-sm text-destructive mt-1">{errors.dialCode}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Flag Emoji <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., 🇺🇸"
                            value={formData.flagImage}
                            onChange={(e) => {
                                setFormData({ ...formData, flagImage: e.target.value })
                                if (errors.flagImage) setErrors({ ...errors, flagImage: undefined })
                            }}
                            className={`text-2xl ${errors.flagImage ? 'border-destructive' : ''}`}
                        />
                        {errors.flagImage ? (
                            <p className="text-sm text-destructive mt-1">{errors.flagImage}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground mt-1">
                                Enter a flag emoji (e.g., 🇺🇸 🇬🇧 🇮🇳)
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Digit Count Limit <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="e.g., 10"
                            value={formData.digitCountLimit}
                            onChange={(e) => {
                                setFormData({ ...formData, digitCountLimit: e.target.value })
                                if (errors.digitCountLimit) setErrors({ ...errors, digitCountLimit: undefined })
                            }}
                            min="1"
                            className={errors.digitCountLimit ? 'border-destructive' : ''}
                        />
                        {errors.digitCountLimit ? (
                            <p className="text-sm text-destructive mt-1">{errors.digitCountLimit}</p>
                        ) : (
                            <p className="text-xs text-muted-foreground mt-1">
                                Maximum number of digits for phone numbers
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                            {selectedCode ? 'Update' : 'Add'} Country Code
                        </Button>
                    </div>
                </form>
            </Modal>

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
