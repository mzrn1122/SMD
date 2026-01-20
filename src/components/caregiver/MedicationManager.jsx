import { useState } from 'react';
import { Pill, Plus, Edit2, Trash2, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export const MedicationManager = ({ medications = [], onAdd, onEdit, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: 'daily',
        times: ['08:00'],
        startDate: '',
        endDate: '',
        instructions: '',
    });

    const resetForm = () => {
        setFormData({
            name: '',
            dosage: '',
            frequency: 'daily',
            times: ['08:00'],
            startDate: '',
            endDate: '',
            instructions: '',
        });
        setEditingMed(null);
    };

    const handleOpenModal = (med = null) => {
        if (med) {
            setEditingMed(med);
            setFormData(med);
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.dosage || !formData.startDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (editingMed) {
            onEdit?.({ ...formData, id: editingMed.id });
            toast.success('Medication updated successfully');
        } else {
            onAdd?.({ ...formData, id: Date.now(), active: true });
            toast.success('Medication added successfully');
        }

        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            onDelete?.(id);
            toast.success('Medication deleted');
        }
    };

    const addTimeSlot = () => {
        setFormData({
            ...formData,
            times: [...formData.times, '12:00'],
        });
    };

    const removeTimeSlot = (index) => {
        setFormData({
            ...formData,
            times: formData.times.filter((_, i) => i !== index),
        });
    };

    const updateTimeSlot = (index, value) => {
        const newTimes = [...formData.times];
        newTimes[index] = value;
        setFormData({ ...formData, times: newTimes });
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Pill className="w-6 h-6 text-primary-500" />
                    Medication Management
                </h3>
                <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Medication
                </button>
            </div>

            {/* Medications List */}
            <div className="space-y-3">
                {medications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No medications added yet</p>
                        <p className="text-sm mt-1">Click "Add Medication" to create a schedule</p>
                    </div>
                ) : (
                    medications.map((med) => (
                        <div
                            key={med.id}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-slate-900 dark:text-white text-lg">{med.name}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${med.active
                                                ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                            }`}>
                                            {med.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <div>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">Dosage:</span> {med.dosage}
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-700 dark:text-slate-300">Frequency:</span> {med.frequency}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {med.times.map((time, idx) => (
                                            <div key={idx} className="flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-medium">
                                                <Clock className="w-3 h-3" />
                                                {time}
                                            </div>
                                        ))}
                                    </div>

                                    {med.instructions && (
                                        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded">
                                            📝 {med.instructions}
                                        </p>
                                    )}

                                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Start: {new Date(med.startDate).toLocaleDateString()}
                                        </div>
                                        {med.endDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                End: {new Date(med.endDate).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => handleOpenModal(med)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(med.id, med.name)}
                                        className="p-2 text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                {editingMed ? 'Edit Medication' : 'Add New Medication'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Medication Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-field w-full"
                                        placeholder="e.g., Aspirin"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Dosage *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.dosage}
                                        onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                        className="input-field w-full"
                                        placeholder="e.g., 100mg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Frequency
                                </label>
                                <select
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                    className="input-field w-full"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="twice-daily">Twice Daily</option>
                                    <option value="three-times-daily">Three Times Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="as-needed">As Needed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Time Slots
                                </label>
                                <div className="space-y-2">
                                    {formData.times.map((time, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => updateTimeSlot(index, e.target.value)}
                                                className="input-field flex-1"
                                            />
                                            {formData.times.length > 1 && (
                                                <button
                                                    onClick={() => removeTimeSlot(index)}
                                                    className="btn-secondary px-3"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button onClick={addTimeSlot} className="btn-secondary w-full">
                                        + Add Time Slot
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-field w-full"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        End Date (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input-field w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Instructions
                                </label>
                                <textarea
                                    value={formData.instructions}
                                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                    className="input-field w-full"
                                    rows="3"
                                    placeholder="e.g., Take with food"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="btn-primary flex-1">
                                {editingMed ? 'Update' : 'Add'} Medication
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
