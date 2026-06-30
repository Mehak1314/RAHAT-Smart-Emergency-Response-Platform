import { useState, useEffect } from 'react';
import { Phone, Plus, Trash2, Edit2, AlertCircle, PhoneCall } from 'lucide-react';
import { contactsAPI } from '../services/api';
import { RELATIONSHIPS } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingContact, setEditingContact] = useState(null);
  
  const initialForm = { name: '', phone: '', relationship: 'family', priority: 2 };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await contactsAPI.getAll();
      setContacts(data.contacts || []);
    } catch (error) {
      toast.error('Failed to load emergency contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      priority: contact.priority
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingContact) {
        await contactsAPI.update(editingContact._id, formData);
        toast.success('Contact updated');
      } else {
        await contactsAPI.add(formData);
        toast.success('Contact added');
      }
      setIsModalOpen(false);
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this emergency contact?')) return;
    try {
      await contactsAPI.delete(id);
      toast.success('Contact removed');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to remove contact');
    }
  };

  return (
    <div className="page-container py-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Phone className="text-emergency-600" /> Emergency Contacts
          </h1>
          <p className="text-subtle text-sm">These contacts will receive an SMS and Email when you trigger an SOS.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openAddModal}>Add Contact</Button>
      </div>

      {contacts.length === 0 && !isLoading && (
        <div className="alert-strip-red mb-6">
          <AlertCircle size={20} className="shrink-0" />
          <span>You have no emergency contacts. It is highly recommended to add at least 2 contacts.</span>
        </div>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact, index) => (
            <Card key={contact._id} className={contact.priority === 1 ? 'border-t-4 border-t-emergency-500 relative overflow-hidden' : 'relative overflow-hidden'}>
              {contact.priority === 1 && (
                <div className="absolute top-0 right-0 bg-emergency-100 text-emergency-700 text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                  PRIMARY
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3 mt-1">
                <div>
                  <h3 className="font-bold text-ink text-lg">{contact.name}</h3>
                  <p className="text-xs text-subtle uppercase tracking-wider font-semibold">{contact.relationship}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEditModal(contact)} className="p-1.5 text-muted hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(contact._id)} className="p-1.5 text-muted hover:text-emergency-600 hover:bg-emergency-50 rounded"><Trash2 size={16}/></button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-ink font-medium bg-slate-50 p-2 rounded-lg mb-4 border border-border">
                <PhoneCall size={16} className="text-muted" />
                {contact.phone}
              </div>
              
              <Button variant="secondary" size="sm" className="w-full" onClick={() => window.location.href=`tel:${contact.phone}`}>
                Call Now
              </Button>
            </Card>
          ))}

          {contacts.length === 0 && (
            <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={openAddModal}>
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-muted mb-3">
                <Plus size={24} />
              </div>
              <h3 className="font-bold text-ink">Add First Contact</h3>
              <p className="text-sm text-subtle mt-1">Add someone you trust in an emergency.</p>
            </Card>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingContact ? "Edit Contact" : "Add Emergency Contact"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input 
              type="text" 
              className="form-input" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number (10 digits) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">+91</span>
              <input 
                type="tel" 
                className="form-input pl-10" 
                required
                maxLength="10"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Relationship *</label>
            <select 
              className="form-select"
              required
              value={formData.relationship}
              onChange={e => setFormData({...formData, relationship: e.target.value})}
            >
              {RELATIONSHIPS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          
          <div className="form-group pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.priority === 1}
                onChange={e => setFormData({...formData, priority: e.target.checked ? 1 : 2})}
                className="w-4 h-4 accent-emergency-600"
              />
              <div>
                <span className="font-medium text-ink block">Set as Primary Contact</span>
                <span className="text-xs text-subtle">Primary contacts may receive phone calls in the future.</span>
              </div>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={isSubmitting}>
            {editingContact ? 'Save Changes' : 'Add Contact'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
