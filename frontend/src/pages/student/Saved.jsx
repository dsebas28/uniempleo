import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, Trash2 } from 'lucide-react';
import { studentAPI } from '../../services/api';
import JobCard from '../../components/JobCard';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

export default function Saved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getSavedJobs().then(res => {
      setSaved(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await studentAPI.unsaveJob(jobId);
      setSaved(prev => prev.filter(j => j.id !== jobId));
      toast.success('Eliminada de favoritos');
    } catch { toast.error('Error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>Vacantes guardadas</h1>
        {saved.length > 0 && (
          <span className="text-sm text-gray-500">{saved.length} guardada{saved.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="text-blue-400 animate-spin" />
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          type="saved"
          title="No tienes vacantes guardadas"
          description="Guarda las vacantes que te interesen para revisarlas después."
          actionLabel="Explorar empleos"
          actionTo="/empleos"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {saved.map(job => (
            <div key={job.id} className="relative group">
              <JobCard job={job} saved={true} onSaveToggle={(id, newState) => { if (!newState) setSaved(prev => prev.filter(j => j.id !== id)); }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
