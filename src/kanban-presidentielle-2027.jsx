import React, { useState, useEffect, useRef } from 'react';
import { GripVertical, Plus, Edit2, Trash2, X, Save, ExternalLink, Lock, LogOut, Search, Upload } from 'lucide-react';
import { db, storage } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const initialCandidates = [
  {
    id: '1',
    name: 'Jordan Bardella',
    party: 'Rassemblement National',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Jordan_Bardella_2024.jpg/220px-Jordan_Bardella_2024.jpg',
    polls: '35%',
    declaredDate: null,
    programUrl: 'https://www.rassemblementnational.fr',
    status: 'potentiels'
  },
  {
    id: '2',
    name: 'Marine Le Pen',
    party: 'Rassemblement National',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Marine_Le_Pen_%282023%29.jpg/220px-Marine_Le_Pen_%282023%29.jpg',
    polls: '32%',
    declaredDate: null,
    programUrl: 'https://www.rassemblementnational.fr',
    status: 'potentiels',
    note: "Condamnée à 5 ans d'inéligibilité (appel en cours)"
  },
  {
    id: '3',
    name: 'Édouard Philippe',
    party: 'Horizons',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%C3%89douard_Philippe_par_Claude_Truong-Ngoc_juin_2017_%28cropped%29.jpg/220px-%C3%89douard_Philippe_par_Claude_Truong-Ngoc_juin_2017_%28cropped%29.jpg',
    polls: '20%',
    declaredDate: null,
    programUrl: 'https://www.horizons.fr',
    status: 'potentiels'
  },
  {
    id: '4',
    name: 'Bruno Retailleau',
    party: 'Les Républicains',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bruno_Retailleau_2024.jpg/220px-Bruno_Retailleau_2024.jpg',
    polls: '8%',
    declaredDate: '12/02/2026',
    programUrl: 'https://www.republicains.fr',
    status: 'declares'
  },
  {
    id: '5',
    name: 'Gabriel Attal',
    party: 'Renaissance',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Gabriel_Attal_2024_%28cropped%29.jpg/220px-Gabriel_Attal_2024_%28cropped%29.jpg',
    polls: '18%',
    declaredDate: null,
    programUrl: 'https://www.renaissance-en-marche.fr',
    status: 'potentiels'
  },
  {
    id: '6',
    name: 'Raphaël Glucksmann',
    party: 'Place Publique / PS',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Rapha%C3%ABl_Glucksmann_2024.jpg/220px-Rapha%C3%ABl_Glucksmann_2024.jpg',
    polls: '14%',
    declaredDate: null,
    programUrl: 'https://www.place-publique.eu',
    status: 'primaires',
    note: 'Primaire gauche prévue le 11/10/2026'
  },
  {
    id: '7',
    name: 'Jean-Luc Mélenchon',
    party: 'La France Insoumise',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Jean-Luc_M%C3%A9lenchon_2023.jpg/220px-Jean-Luc_M%C3%A9lenchon_2023.jpg',
    polls: '10%',
    declaredDate: null,
    programUrl: 'https://lafranceinsoumise.fr',
    status: 'potentiels'
  },
  {
    id: '8',
    name: 'Marine Tondelier',
    party: 'Europe Écologie Les Verts',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Marine_Tondelier_2024.jpg/220px-Marine_Tondelier_2024.jpg',
    polls: '6%',
    declaredDate: null,
    programUrl: 'https://www.eelv.fr',
    status: 'primaires',
    note: 'Primaire gauche prévue le 11/10/2026'
  },
  {
    id: '9',
    name: 'François Ruffin',
    party: 'Debout !',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Fran%C3%A7ois_Ruffin_2024.jpg/220px-Fran%C3%A7ois_Ruffin_2024.jpg',
    polls: '5%',
    declaredDate: null,
    programUrl: null,
    status: 'primaires',
    note: 'Primaire gauche prévue le 11/10/2026'
  },
  {
    id: '10',
    name: 'Fabien Roussel',
    party: 'Parti Communiste Français',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Fabien_Roussel_2024.jpg/220px-Fabien_Roussel_2024.jpg',
    polls: '4%',
    declaredDate: null,
    programUrl: 'https://www.pcf.fr',
    status: 'potentiels'
  },
  {
    id: '11',
    name: 'Éric Zemmour',
    party: 'Reconquête',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/%C3%89ric_Zemmour_2022.jpg/220px-%C3%89ric_Zemmour_2022.jpg',
    polls: '7%',
    declaredDate: null,
    programUrl: 'https://www.reconquete.fr',
    status: 'potentiels'
  }
];

const COLUMNS = [
  { id: 'potentiels', title: 'Potentiels', color: 'border-gray-400' },
  { id: 'primaires', title: 'En primaire', color: 'border-orange-400' },
  { id: 'declares', title: 'Déclarés', color: 'border-blue-400' },
  { id: 'qualifies', title: 'Qualifiés', color: 'border-green-400' }
];

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin2027';

const getPartyColor = (party) => {
  const p = party.toLowerCase();
  if (p.includes('rassemblement national') || p.includes('reconquête')) return 'from-blue-900 to-blue-700';
  if (p.includes('républicain')) return 'from-blue-600 to-blue-500';
  if (p.includes('horizons') || p.includes('renaissance')) return 'from-yellow-500 to-orange-400';
  if (p.includes('écologie') || p.includes('eelv') || p.includes('vert')) return 'from-green-600 to-green-500';
  if (p.includes('socialiste') || p.includes('place publique') || p.includes(' ps')) return 'from-pink-600 to-pink-500';
  if (p.includes('insoumise') || p.includes('lfi')) return 'from-red-600 to-red-500';
  if (p.includes('communiste') || p.includes('pcf')) return 'from-red-700 to-red-600';
  if (p.includes('debout')) return 'from-orange-600 to-red-400';
  return 'from-gray-600 to-gray-500';
};

const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

function CandidatePhoto({ candidate }) {
  const [imgError, setImgError] = useState(false);

  if (!candidate.photo || imgError) {
    return (
      <div className={`w-20 h-20 rounded-full mx-auto mb-3 bg-gradient-to-br ${getPartyColor(candidate.party)} flex items-center justify-center text-white font-bold text-xl border-2 border-gray-200 shadow-md`}>
        {getInitials(candidate.name)}
      </div>
    );
  }

  return (
    <img
      src={candidate.photo}
      alt={candidate.name}
      onError={() => setImgError(true)}
      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-gray-200 shadow-md"
    />
  );
}

function PhotoField({ editingCard, setEditingCard }) {
  const [searching, setSearching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreviewError(false);
  }, [editingCard.photo]);

  const handleWikipediaSearch = async () => {
    if (!editingCard.name) return;
    setSearching(true);
    try {
      const name = encodeURIComponent(editingCard.name);
      const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${name}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const url = data.thumbnail?.source || data.originalimage?.source;
      if (url) {
        setEditingCard(prev => ({ ...prev, photo: url }));
      } else {
        alert('Aucune photo trouvée sur Wikipedia pour ce nom.');
      }
    } catch {
      alert('Candidat introuvable sur Wikipedia. Essayez un nom différent ou collez une URL manuellement.');
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `candidates/${editingCard.id}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setEditingCard(prev => ({ ...prev, photo: url }));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload. Vérifiez les règles Firebase Storage.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Photo</label>
      <div className="space-y-2">
        <input
          type="text"
          value={editingCard.photo || ''}
          onChange={(e) => setEditingCard(prev => ({ ...prev, photo: e.target.value }))}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          placeholder="https://..."
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleWikipediaSearch}
            disabled={searching || !editingCard.name}
            title={!editingCard.name ? 'Remplissez le nom en premier' : 'Rechercher sur Wikipedia'}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Search size={13} />
            {searching ? 'Recherche…' : 'Wikipedia'}
          </button>
          <label className={`flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-sm cursor-pointer transition-colors ${uploading ? 'opacity-40 pointer-events-none' : ''}`}>
            <Upload size={13} />
            {uploading ? 'Upload…' : 'Uploader'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
        {editingCard.photo && !previewError && (
          <div className="flex justify-center pt-1">
            <img
              src={editingCard.photo}
              alt="Aperçu"
              onError={() => setPreviewError(true)}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow"
            />
          </div>
        )}
        {editingCard.photo && previewError && (
          <p className="text-xs text-red-500 text-center">Image introuvable à cette URL</p>
        )}
      </div>
    </div>
  );
}

export default function KanbanPresidentielle() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const titleClickCount = useRef(0);
  const titleClickTimer = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      if (snapshot.empty) {
        initializeData();
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCandidates(data);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading candidates:', error);
      setCandidates(initialCandidates);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (localStorage.getItem('isAdmin') === 'true') setIsAdmin(true);
  }, []);

  const initializeData = async () => {
    try {
      for (const candidate of initialCandidates) {
        await setDoc(doc(db, 'candidates', candidate.id), candidate);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      setCandidates(initialCandidates);
    }
  };

  const handleTitleClick = () => {
    if (isAdmin) return;
    titleClickCount.current += 1;
    clearTimeout(titleClickTimer.current);
    if (titleClickCount.current >= 3) {
      titleClickCount.current = 0;
      setShowLoginModal(true);
    } else {
      titleClickTimer.current = setTimeout(() => {
        titleClickCount.current = 0;
      }, 600);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPassword('');
      localStorage.setItem('isAdmin', 'true');
    } else {
      alert('Mot de passe incorrect !');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  const saveCandidate = async (candidate) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'candidates', candidate.id), candidate);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      await deleteDoc(doc(db, 'candidates', id));
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleDragStart = (e, candidate) => {
    if (!isAdmin) return;
    setDraggedCard(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => setDragOverColumn(null);

  const handleDrop = async (e, newStatus) => {
    if (!isAdmin) return;
    e.preventDefault();
    setDragOverColumn(null);
    if (draggedCard && draggedCard.status !== newStatus) {
      await saveCandidate({ ...draggedCard, status: newStatus });
    }
    setDraggedCard(null);
  };

  const handleEdit = (candidate) => {
    if (!isAdmin) return;
    setEditingCard({ ...candidate });
    setIsAddingNew(false);
  };

  const handleAdd = () => {
    if (!isAdmin) return;
    setEditingCard({
      id: Date.now().toString(),
      name: '', party: '', photo: '', polls: '',
      declaredDate: '', programUrl: '', status: 'potentiels', note: ''
    });
    setIsAddingNew(true);
  };

  const handleSave = async () => {
    if (!editingCard.name || !editingCard.party) {
      alert('Le nom et le parti sont obligatoires');
      return;
    }
    await saveCandidate(editingCard);
    setEditingCard(null);
    setIsAddingNew(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
      await deleteCandidate(id);
      setEditingCard(null);
    }
  };

  const getCandidatesByStatus = (status) =>
    candidates.filter(c => c.status === status);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🗳️</div>
          <p className="text-gray-600 text-lg">Chargement des candidats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-indigo-400 uppercase mb-1">
                Y'a Candidats et Candidats
              </p>
              <h1
                className="text-3xl font-bold text-gray-900 select-none cursor-default"
                onClick={handleTitleClick}
              >
                🗳️ Présidentielles France 2027
              </h1>
              <p className="text-gray-600 mt-1">Kanban des candidats potentiels et déclarés</p>
              {lastSaved && isAdmin && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Sauvegardé à {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  <Plus size={20} /> Ajouter
                </button>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  <LogOut size={20} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="flex gap-4 min-w-min lg:grid lg:grid-cols-4">
          {COLUMNS.map(column => (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`rounded-lg p-4 min-h-[500px] min-w-[280px] lg:min-w-0 transition-colors ${
                dragOverColumn === column.id && isAdmin
                  ? 'bg-blue-100 ring-2 ring-blue-400'
                  : 'bg-gray-100'
              }`}
            >
              <div className={`font-bold text-lg mb-4 pb-2 border-b-4 ${column.color}`}>
                {column.title}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({getCandidatesByStatus(column.id).length})
                </span>
              </div>

              <div className="space-y-3">
                {getCandidatesByStatus(column.id).map(candidate => (
                  <div
                    key={candidate.id}
                    draggable={isAdmin}
                    onDragStart={(e) => handleDragStart(e, candidate)}
                    className={`bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all border-2 border-transparent ${
                      isAdmin ? 'cursor-move hover:border-blue-300' : ''
                    } group relative`}
                  >
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Edit2 size={14} className="text-gray-600" />
                        </button>
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical size={16} className="text-gray-400" />
                        </div>
                      </>
                    )}

                    <CandidatePhoto candidate={candidate} />

                    <div className="font-bold text-center mb-2 text-gray-900">
                      {candidate.name}
                    </div>

                    <div className="bg-gray-100 text-center py-1 px-2 rounded text-sm mb-2 text-gray-700">
                      {candidate.party}
                    </div>

                    {candidate.polls && (
                      <div className="text-sm text-gray-600 mb-1">
                        <strong>Sondages :</strong> {candidate.polls}
                      </div>
                    )}

                    {candidate.declaredDate && (
                      <div className="text-sm text-gray-600 mb-1">
                        <strong>Déclaré le :</strong> {candidate.declaredDate}
                      </div>
                    )}

                    {candidate.note && (
                      <div className="text-xs text-orange-600 mb-2 italic">
                        ⚠️ {candidate.note}
                      </div>
                    )}

                    {candidate.programUrl && (
                      <a
                        href={candidate.programUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-xs flex items-center justify-center gap-1 hover:underline mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        Site / Programme
                      </a>
                    )}
                  </div>
                ))}

                {getCandidatesByStatus(column.id).length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    {isAdmin ? 'Glissez une carte ici' : 'Aucun candidat'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer info bar */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-blue-800">
            <strong>💡</strong>{' '}
            {isAdmin
              ? 'Mode admin actif — glissez les cartes entre colonnes, survolez pour éditer.'
              : 'Données synchronisées en temps réel.'}
          </p>
          {isAdmin ? (
            <button
              onClick={handleLogout}
              title="Déconnexion admin"
              className="text-gray-400 hover:text-red-400 transition-colors p-1 shrink-0"
            >
              <LogOut size={14} />
            </button>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              title="Accès administration"
              className="text-gray-300 hover:text-gray-400 transition-colors p-1 shrink-0"
            >
              <Lock size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Connexion Admin</h2>
              <button onClick={() => { setShowLoginModal(false); setPassword(''); }} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Mot de passe admin"
                  autoFocus
                />
              </div>
              <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                Se connecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCard && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isAddingNew ? 'Nouveau candidat' : 'Modifier'}
              </h2>
              <button onClick={() => { setEditingCard(null); setIsAddingNew(false); }} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Nom *', key: 'name', placeholder: 'Ex: Marine Le Pen' },
                { label: 'Parti *', key: 'party', placeholder: 'Ex: Rassemblement National' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    value={editingCard[key] || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, [key]: e.target.value })}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <PhotoField editingCard={editingCard} setEditingCard={setEditingCard} />

              {[
                { label: 'Sondages', key: 'polls', placeholder: 'Ex: 25%' },
                { label: 'Date de déclaration', key: 'declaredDate', placeholder: 'Ex: 15/01/2026' },
                { label: 'Lien programme/site', key: 'programUrl', placeholder: 'https://...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    type="text"
                    value={editingCard[key] || ''}
                    onChange={(e) => setEditingCard({ ...editingCard, [key]: e.target.value })}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={editingCard.status}
                  onChange={(e) => setEditingCard({ ...editingCard, status: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {COLUMNS.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Note (optionnelle)</label>
                <textarea
                  value={editingCard.note || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, note: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={2}
                  placeholder="Ex: Primaire prévue le..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                <Save size={18} />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              {!isAddingNew && (
                <button
                  onClick={() => handleDelete(editingCard.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
