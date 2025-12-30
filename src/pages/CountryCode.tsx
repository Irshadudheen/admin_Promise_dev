import { useState, useEffect } from 'react'
import { Edit, Trash2, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { usePagination } from '@/hooks/usePagination'
import { Loader } from '@/components/ui/Loader'
import useCountryCodeStore from '@/store/countryCodeStore'
import type { CountryCode } from '@/types/school'

interface CountryCodeFormData {
    code: string
    digitCount: string
    flagImage: string
}

export default function CountryCodePage() {
    const {
        countryCodes,
        isLoading,
        fetchCountryCodes,
        createCountryCode,
        updateCountryCode,
        deleteCountryCode
    } = useCountryCodeStore()

    const [searchTerm, setSearchTerm] = useState('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCode, setSelectedCode] = useState<CountryCode | null>(null)
    const [formData, setFormData] = useState<CountryCodeFormData>({
        code: '',
        digitCount: '',
        flagImage: ''
    })
    const { showToast } = useToast()

    // Fetch country codes on component mount
    useEffect(() => {
        fetchCountryCodes()
    }, [fetchCountryCodes])

    const filteredCodes = countryCodes.filter(code =>
        code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        code.flagImage.includes(searchTerm)
    )

    const pagination = usePagination({ items: filteredCodes, initialItemsPerPage: 10 })

    const handleOpenAddModal = () => {
        setSelectedCode(null)
        setFormData({
            code: '',
            digitCount: '',
            flagImage: ''
        })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (code: CountryCode) => {
        setSelectedCode(code)
        setFormData({
            code: code.code,
            digitCount: code.digitCount.toString(),
            flagImage: code.flagImage
        })
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedCode(null)
        setFormData({
            code: '',
            digitCount: '',
            flagImage: ''
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.code.trim()) {
            showToast('error', 'Country code is required')
            return
        }
        if (!formData.digitCount.trim()) {
            showToast('error', 'Digit count is required')
            return
        }
        if (!formData.flagImage.trim()) {
            showToast('error', 'Flag emoji is required')
            return
        }

        const digitCount = parseInt(formData.digitCount)
        if (isNaN(digitCount) || digitCount < 1) {
            showToast('error', 'Digit count must be a positive number')
            return
        }

        const data = {
            code: formData.code,
            digitCount,
            flagImage: formData.flagImage
        }

        let success = false
        if (selectedCode) {
            success = await updateCountryCode(selectedCode.id, data)
        } else {
            success = await createCountryCode(data)
        }

        if (success) {
            handleCloseModal()
        }
    }

    const handleDelete = async () => {
        if (!selectedCode) return

        const success = await deleteCountryCode(selectedCode.id)

        if (success) {
            setIsDeleteDialogOpen(false)
            setSelectedCode(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    if (isLoading && countryCodes.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
            </div>
        )
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
                        <Input
                            placeholder="Search country codes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
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
                            <TableHead>Country Code</TableHead>
                            <TableHead>Digit Limit</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pagination.currentItems.map((code) => (
                            <TableRow key={code.id}>
                                <TableCell>
                                    {code.flagImage ? (
                                        <img
                                            src={code.flagImage}
                                            alt="Flag"
                                            className="w-8 h-6 object-cover rounded"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="24"><rect width="32" height="24" fill="%23ddd"/></svg>'
                                            }}
                                        />
                                    ) : (
                                        <span className="text-gray-400">No flag</span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium font-mono">{code.code}</TableCell>
                                <TableCell>{code.digitCount} digits</TableCell>
                                <TableCell>{formatDate(code.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenEditModal(code)}
                                            className="gap-1"
                                        >
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                                setSelectedCode(code);
                                                setIsDeleteDialogOpen(true)
                                            }}
                                            className="gap-1"
                                        >
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
                {pagination.currentItems.map((code) => (
                    <div key={code.id} className="bg-white rounded-lg border border-border shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                {code.flagImage ? (
                                    <img
                                        src={code.flagImage}
                                        alt="Flag"
                                        className="w-12 h-9 object-cover rounded"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="36"><rect width="48" height="36" fill="%23ddd"/></svg>'
                                        }}
                                    />
                                ) : (
                                    <div className="w-12 h-9 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                        No flag
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-lg font-mono">{code.code}</h3>
                                    <p className="text-sm text-muted-foreground">{code.digitCount} digits</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Created: {formatDate(code.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEditModal(code)}
                                className="flex-1 gap-1"
                            >
                                <Edit className="w-3 h-3" />
                                Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                    setSelectedCode(code);
                                    setIsDeleteDialogOpen(true)
                                }}
                                className="flex-1 gap-1"
                            >
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
                footer={
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Saving...' : selectedCode ? 'Update' : 'Add'}
                        </Button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Country Code <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., +1, +91"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Include the + symbol (e.g., +1, +91, +44)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Flag Image URL <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="e.g., https://flagcdn.com/w320/us.png"
                            value={formData.flagImage}
                            onChange={(e) => setFormData({ ...formData, flagImage: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Enter a valid URL to a flag image (e.g., from flagcdn.com or similar)
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                            Digit Count Limit <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="e.g., 10"
                            value={formData.digitCount}
                            onChange={(e) => setFormData({ ...formData, digitCount: e.target.value })}
                            min="1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Maximum number of digits for phone numbers
                        </p>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Country Code"
                message={`Are you sure you want to delete the country code "${selectedCode?.code}"?`}
            />
        </div>
    )
}
