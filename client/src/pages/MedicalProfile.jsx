import { useState, useEffect } from 'react';
import { HeartPulse, Edit2, Save, FileText, Upload, Trash2, ShieldAlert } from 'lucide-react';
import { medicalAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COMMON_ALLERGIES, COMMON_DISEASES, BLOOD_GROUPS } from '../constants';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function MedicalProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bloodGroup: '',
    allergies: [],
    chronicConditions: [],
    currentMedications: [],
    previousSurgeries: [],
    insurance: { provider: '', policyNumber: '' }
  });

  const [newMed, setNewMed] = useState('');
  const [newSurg, setNewSurg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await medicalAPI.getProfile();
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          bloodGroup: data.profile.bloodGroup || user?.bloodGroup || '',
          allergies: data.profile.allergies || [],
          chronicConditions: data.profile.chronicConditions || [],
          currentMedications: data.profile.currentMedications || [],
          previousSurgeries: data.profile.previousSurgeries || [],
          insurance: data.profile.insurance || { provider: '', policyNumber: '' }
        });
      }
    } catch (error) {
      console.error('Failed to fetch medical profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await medicalAPI.update(formData);
      setProfile(data.profile);
      // If blood group changed, update user context
      if (formData.bloodGroup !== user?.bloodGroup) {
        updateUser({ bloodGroup: formData.bloodGroup });
      }
      setIsEditing(false);
      toast.success('Medical profile updated');
    } catch (error) {
      toast.error('Failed to update medical profile');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => {
      const array = prev[field];
      if (array.includes(item)) {
        return { ...prev, [field]: array.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...array, item] };
      }
    });
  };

  const addCustomItem = (field, value, setter) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    setter('');
  };

  if (isLoading) return <Loader />;

  return (
    <div className="page-container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HeartPulse className="text-purple-600" /> Medical Profile
          </h1>
          <p className="text-subtle text-sm">Critical health information shared during an SOS.</p>
        </div>
        {!isEditing ? (
          <Button variant="secondary" icon={Edit2} onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => {setIsEditing(false); fetchProfile();}}>Cancel</Button>
            <Button variant="primary" icon={Save} onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card padding="lg">
            <h3 className="section-title mb-4 flex items-center gap-2"><DropletIcon /> Basic Vitals</h3>
            <div className="form-group max-w-xs">
              <label className="form-label">Blood Group</label>
              {isEditing ? (
                <select 
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={e => setFormData({...formData, bloodGroup: e.target.value})}
                >
                  <option value="">Unknown</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              ) : (
                <div className="text-xl font-bold text-emergency-600">{profile?.bloodGroup || 'Not Specified'}</div>
              )}
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="section-title mb-4 flex items-center gap-2"><ShieldAlert size={18} className="text-warn-600" /> Allergies</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {COMMON_ALLERGIES.map(allergy => (
                  <button
                    key={allergy}
                    onClick={() => toggleArrayItem('allergies', allergy)}
                    className={`badge px-3 py-1.5 text-sm cursor-pointer transition-colors ${formData.allergies.includes(allergy) ? 'bg-warn-100 text-warn-800 border-warn-300' : 'bg-slate-50 text-subtle border-border hover:bg-slate-100'}`}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.allergies?.length > 0 ? profile.allergies.map(a => (
                  <span key={a} className="badge bg-warn-50 text-warn-700 border-warn-200 px-3 py-1">{a}</span>
                )) : <span className="text-subtle">None reported</span>}
              </div>
            )}
          </Card>

          <Card padding="lg">
            <h3 className="section-title mb-4 flex items-center gap-2"><HeartPulse size={18} className="text-purple-600" /> Chronic Conditions</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {COMMON_DISEASES.map(disease => (
                  <button
                    key={disease}
                    onClick={() => toggleArrayItem('chronicConditions', disease)}
                    className={`badge px-3 py-1.5 text-sm cursor-pointer transition-colors ${formData.chronicConditions.includes(disease) ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-50 text-subtle border-border hover:bg-slate-100'}`}
                  >
                    {disease}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile?.chronicConditions?.length > 0 ? profile.chronicConditions.map(c => (
                  <span key={c} className="badge bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">{c}</span>
                )) : <span className="text-subtle">None reported</span>}
              </div>
            )}
          </Card>

          <Card padding="lg">
            <h3 className="section-title mb-4 flex items-center gap-2"><PillIcon /> Current Medications</h3>
            {isEditing ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.currentMedications.map(med => (
                    <span key={med} className="badge bg-blue-50 text-blue-700 border-blue-200 pl-3 pr-1 py-1 flex items-center gap-1">
                      {med} <button onClick={() => toggleArrayItem('currentMedications', med)} className="hover:text-blue-900"><Trash2 size={14}/></button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" className="form-input text-sm" placeholder="Add medication..." value={newMed} onChange={e=>setNewMed(e.target.value)} onKeyPress={e => e.key === 'Enter' && addCustomItem('currentMedications', newMed, setNewMed)} />
                  <Button variant="secondary" size="sm" onClick={() => addCustomItem('currentMedications', newMed, setNewMed)}>Add</Button>
                </div>
              </div>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-sm text-ink">
                {profile?.currentMedications?.length > 0 ? profile.currentMedications.map(med => <li key={med}>{med}</li>) : <span className="text-subtle list-none -ml-5">None reported</span>}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card padding="lg" className="bg-slate-50 border-none shadow-inner">
            <h3 className="section-title mb-4 flex items-center gap-2"><FileText size={18} className="text-muted" /> Documents</h3>
            <div className="space-y-3">
              {profile?.documents?.map(doc => (
                <a key={doc._id} href={doc.url} target="_blank" rel="noreferrer" className="flex items-center p-3 bg-white border border-border rounded-lg hover:border-emergency-300 no-underline text-ink group">
                  <FileText size={24} className="text-emergency-500 mr-3 shrink-0" />
                  <div className="flex-1 truncate">
                    <p className="text-sm font-semibold truncate group-hover:text-emergency-600">{doc.name}</p>
                    <p className="text-xs text-subtle">Medical Document</p>
                  </div>
                </a>
              ))}
              {profile?.documents?.length === 0 && <p className="text-sm text-subtle text-center py-4">No documents uploaded.</p>}
              
              <Button variant="secondary" className="w-full border-dashed" icon={Upload}>Upload Document</Button>
              <p className="text-xs text-muted text-center">Feature requires backend multipart form setup currently partially implemented.</p>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="section-title mb-4 text-sm uppercase tracking-wider text-muted font-bold">Health Insurance</h3>
            {isEditing ? (
              <div className="space-y-3">
                <input type="text" className="form-input text-sm" placeholder="Provider Name" value={formData.insurance.provider} onChange={e => setFormData({...formData, insurance: {...formData.insurance, provider: e.target.value}})} />
                <input type="text" className="form-input text-sm" placeholder="Policy Number" value={formData.insurance.policyNumber} onChange={e => setFormData({...formData, insurance: {...formData.insurance, policyNumber: e.target.value}})} />
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted mb-1">Provider</p>
                <p className="font-medium mb-3">{profile?.insurance?.provider || 'Not provided'}</p>
                <p className="text-xs text-muted mb-1">Policy Number</p>
                <p className="font-medium">{profile?.insurance?.policyNumber || 'Not provided'}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Inline icons to avoid lucide imports issues if not all exist
function DropletIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emergency-600"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>; }
function PillIcon() { return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>; }
