import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react';
import { getMasters, createMaster, updateMaster, deleteMaster } from '../../features/temples/masterApi';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const MASTER_TYPES = [
  { id: 'deity', label: 'Deity', description: 'Manage temple deities' },
  { id: 'district', label: 'District', description: 'Manage Tamil Nadu districts' },
  { id: 'festival', label: 'Festival', description: 'Manage key temple festivals' }
];

const Master = () => {
  const [selectedType, setSelectedType] = useState(MASTER_TYPES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setValue } = useForm();

  // Fetch Masters for selected type
  const { data: masters = [], isLoading } = useQuery({
    queryKey: ['masters', selectedType.id],
    queryFn: () => getMasters(selectedType.id),
    enabled: !!selectedType.id
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (name) => createMaster(selectedType.id, name),
    onSuccess: (res) => {
      toast.success(res.message || `${selectedType.label} created`);
      queryClient.invalidateQueries(['masters', selectedType.id]);
      closeModal();
    },
    onError: (err) => toast.error(err.message || 'Failed to create')
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, name }) => updateMaster(selectedType.id, id, name),
    onSuccess: (res) => {
      toast.success(res.message || `${selectedType.label} updated`);
      queryClient.invalidateQueries(['masters', selectedType.id]);
      closeModal();
    },
    onError: (err) => toast.error(err.message || 'Failed to update')
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteMaster(selectedType.id, id),
    onSuccess: (res) => {
      toast.success(res.message || `${selectedType.label} deleted`);
      queryClient.invalidateQueries(['masters', selectedType.id]);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete')
  });

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setValue('name', item.name);
    } else {
      reset({ name: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, name: data.name });
    } else {
      createMutation.mutate(data.name);
    }
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}" ? `)) {
      deleteMutation.mutate(item._id);
    }
  };

  const columns = [
    {
      title: 'S.No',
      key: 'serial',
      render: (row) => <span className="text-foreground/40 font-mono text-xs">{masters.indexOf(row) + 1}</span>
    },
    {
      title: `${selectedType.label} Name`,
      dataIndex: 'name',
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
            {row.name.charAt(0)}
          </div>
          <span className="font-bold text-foreground/80">{row.name}</span>
        </div>
      )
    },
    {
      title: 'Added On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (row) => (
        <span className="text-xs text-foreground/40 font-medium">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ];

  const actions = [
    {
      icon: Pencil,
      label: 'Edit',
      onClick: (row) => openModal(row),
      className: 'text-blue-500 hover:bg-blue-500/10'
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: (row) => handleDelete(row),
      className: 'text-red-500 hover:bg-red-500/10'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            Master Management
          </h1>
          <p className="text-foreground/40 text-xs md:text-sm font-bold uppercase tracking-[0.1em]">
            Configure and manage system-wide dropdown values
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 shrink-0 border border-white/10 text-xs md:text-sm"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
          Add New {selectedType.label}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Types */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-background border border-border-theme rounded-3xl p-4 shadow-xl">
            <h2 className="text-xs font-black uppercase tracking-widest text-foreground/30 px-4 mb-4">
              Dropdown Categories
            </h2>
            <div className="space-y-2">
              {MASTER_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center justify-between group ${selectedType.id === type.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'hover:bg-foreground/5 text-foreground/60'
                    } `}
                >
                  <div className="flex flex-col">
                    <span className="font-black tracking-tight text-base">{type.label}</span>
                    <span className={`text-[10px] font-medium opacity-60 ${selectedType.id === type.id ? 'text-white' : 'text-foreground/40'} `}>
                      {type.description}
                    </span>
                  </div>
                  {selectedType.id === type.id && (
                    <div className="bg-white/20 p-1 rounded-lg">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats/Info */}
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 hidden lg:block">
            <div className="flex items-center gap-2 text-primary mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">System Info</span>
            </div>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Changes made here will be reflected across all temple entries and filtering systems.
            </p>
          </div>
        </div>

        {/* Right Main Content - List */}
        <div className="lg:col-span-3">
          <DataTable
            key={selectedType.id} // Re-mount when type changes to reset state
            title={`${selectedType.label} List`}
            columns={columns}
            data={masters}
            loading={isLoading}
            actions={actions}
            pageSize={10}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? `Edit ${selectedType.label} ` : `Add New ${selectedType.label} `}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-foreground/40 ml-1">
              {selectedType.label} Name
            </label>
            <div className="relative group/input">
              <input
                {...register('name', { required: true, minLength: 2 })}
                placeholder={`e.g.${selectedType.id === 'district' ? 'Chennai' : selectedType.id === 'deity' ? 'Lord Shiva' : 'Diwali'} `}
                className="w-full bg-secondary-bg border border-border-theme focus:border-primary/50 px-5 py-4 rounded-2xl text-base font-medium outline-none transition-all shadow-inner"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold py-4 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-[2] bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editingItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Master;