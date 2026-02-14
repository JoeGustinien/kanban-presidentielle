
console.log('🔥 FIREBASE VERSION LOADED');

import React, { useState, useEffect } from 'react';
import { GripVertical, Plus, Edit2, Trash2, X, Save, ExternalLink, Lock, LogOut } from 'lucide-react';
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// Données initiales
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
    note: 'Condamnée à 5 ans d\'inéligibilité (appel en cours)'
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

// Mot de passe admin simple (à changer !)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ VITE_ADMIN_PASSWORD non défini dans .env');
  throw new Error('Configuration manquante : mot de passe admin non défini');
}
export default function KanbanPresidentielle() {
  const [candidates, setCandidates] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');

  // Charger les données depuis Firebase en temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'candidates'), (snapshot) => {
      if (snapshot.empty) {
        // Initialiser avec les données par défaut
        initializeData();
      } else {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCandidates(data);
      }
    }, (error) => {
      console.error('Error loading candidates:', error);
      setCandidates(initialCandidates);
    });

    return () => unsubscribe();
  }, []);

  const initializeData = async () => {
    try {
      for (const candidate of initialCandidates) {
        await setDoc(doc(db, 'candidates', candidate.id), candidate);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
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

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    if (localStorage.getItem('isAdmin') === 'true') {
      setIsAdmin(true);
    }
  }, []);

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

  const handleDragOver = (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, newStatus) => {
    if (!isAdmin) return;
    e.preventDefault();
    if (draggedCard) {
      const updatedCandidate = { ...draggedCard, status: newStatus };
      await saveCandidate(updatedCandidate);
      setDraggedCard(null);
    }
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
      name: '',
      party: '',
      photo: '',
      polls: '',
      declaredDate: '',
      programUrl: '',
      status: 'potentiels',
      note: ''
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

  const getCandidatesByStatus = (status) => {
    return candidates.filter(c => c.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                🗳️ Présidentielles France 2027
              </h1>
              <p className="text-gray-600 mt-1">
                Kanban des candidats potentiels et déclarés
              </p>
              {lastSaved && isAdmin && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Dernière sauvegarde : {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus size={20} />
                    Ajouter un candidat
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <LogOut size={20} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Lock size={20} />
                  Mode Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto overflow-x-auto">
        <div className="flex gap-4 min-w-min lg:grid lg:grid-cols-4">
          {COLUMNS.map(column => (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              className="bg-gray-100 rounded-lg p-4 min-h-[500px] min-w-[280px] lg:min-w-0"
            >
              <div className={`font-bold text-lg mb-4 pb-2 border-b-4 ${column.color}`}>
                {column.title}
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({getCandidatesByStatus(column.id).length})
                </span>
              </div>

              <div className="space-y-3">
                {getCandidatesByStatus(column.id).map(candidate => (
                  <div
                    key={candidate.id}
                    draggable={isAdmin}
                    onDragStart={(e) => handleDragStart(e, candidate)}
                    className={`bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all border-2 border-transparent ${isAdmin ? 'cursor-move hover:border-blue-400' : ''} group relative`}
                  >
                    {isAdmin && (
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 size={14} className="text-gray-600" />
                      </button>
                    )}

                    {isAdmin && (
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical size={16} className="text-gray-400" />
                      </div>
                    )}

                    {candidate.photo ? (
                      <img
                        src={candidate.photo}
                        alt={candidate.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                        PHOTO
                      </div>
                    )}

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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Connexion Admin</h2>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setPassword('');
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
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
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Entrez le mot de passe admin"
                  autoFocus
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCard && isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {isAddingNew ? 'Nouveau candidat' : 'Modifier le candidat'}
              </h2>
              <button
                onClick={() => {
                  setEditingCard(null);
                  setIsAddingNew(false);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input
                  type="text"
                  value={editingCard.name}
                  onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ex: Marine Le Pen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Parti *</label>
                <input
                  type="text"
                  value={editingCard.party}
                  onChange={(e) => setEditingCard({ ...editingCard, party: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ex: Rassemblement National"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Photo</label>
                <input
                  type="text"
                  value={editingCard.photo}
                  onChange={(e) => setEditingCard({ ...editingCard, photo: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sondages</label>
                <input
                  type="text"
                  value={editingCard.polls}
                  onChange={(e) => setEditingCard({ ...editingCard, polls: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ex: 25%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date de déclaration</label>
                <input
                  type="text"
                  value={editingCard.declaredDate || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, declaredDate: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ex: 15/01/2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lien programme/site</label>
                <input
                  type="text"
                  value={editingCard.programUrl || ''}
                  onChange={(e) => setEditingCard({ ...editingCard, programUrl: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Statut</label>
                <select
                  value={editingCard.status}
                  onChange={(e) => setEditingCard({ ...editingCard, status: e.target.value })}
                  className="w-full border rounded px-3 py-2"
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
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  placeholder="Ex: Primaire prévue le..."
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              {!isAddingNew && (
                <button
                  onClick={() => handleDelete(editingCard.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Astuce :</strong> {isAdmin ? 'Glissez-déposez les cartes entre les colonnes. Survolez une carte pour l\'éditer.' : ''} Les données sont synchronisées en temps réel pour tous les visiteurs.
        </p>
      </div>
    </div>
  );
}
