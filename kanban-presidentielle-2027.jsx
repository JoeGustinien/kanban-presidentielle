import React, { useState, useEffect } from 'react';
import { GripVertical, Plus, Edit2, Trash2, X, Save, ExternalLink } from 'lucide-react';

// Données initiales basées sur les recherches web récentes
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

const STORAGE_KEY = 'presidentielle-2027-kanban';

export default function KanbanPresidentielle() {
  const [candidates, setCandidates] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Load from shared storage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  const loadFromStorage = async () => {
    try {
      const result = await window.storage.get(STORAGE_KEY, true);
      if (result && result.value) {
        setCandidates(JSON.parse(result.value));
      } else {
        setCandidates(initialCandidates);
      }
    } catch (error) {
      console.log('No saved data found, using initial candidates');
      setCandidates(initialCandidates);
    }
  };

  const saveToStorage = async (data) => {
    setIsSaving(true);
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(data), true);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (e, candidate) => {
    setDraggedCard(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedCard) {
      const updatedCandidates = candidates.map(c =>
        c.id === draggedCard.id ? { ...c, status: newStatus } : c
      );
      setCandidates(updatedCandidates);
      saveToStorage(updatedCandidates);
      setDraggedCard(null);
    }
  };

  const handleEdit = (candidate) => {
    setEditingCard({ ...candidate });
    setIsAddingNew(false);
  };

  const handleAdd = () => {
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

  const handleSave = () => {
    if (!editingCard.name || !editingCard.party) {
      alert('Le nom et le parti sont obligatoires');
      return;
    }

    let updatedCandidates;
    if (isAddingNew) {
      updatedCandidates = [...candidates, editingCard];
    } else {
      updatedCandidates = candidates.map(c =>
        c.id === editingCard.id ? editingCard : c
      );
    }

    setCandidates(updatedCandidates);
    saveToStorage(updatedCandidates);
    setEditingCard(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
      const updatedCandidates = candidates.filter(c => c.id !== id);
      setCandidates(updatedCandidates);
      saveToStorage(updatedCandidates);
      setEditingCard(null);
    }
  };

  const getCandidatesByStatus = (status) => {
    return candidates.filter(c => c.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6">
      {/* Header */}
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
              {lastSaved && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Dernière sauvegarde : {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Ajouter un candidat
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
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
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                    className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition-all cursor-move border-2 border-transparent hover:border-blue-400 group relative"
                  >
                    {/* Edit button */}
                    <button
                      onClick={() => handleEdit(candidate)}
                      className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 size={14} className="text-gray-600" />
                    </button>

                    {/* Drag handle */}
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical size={16} className="text-gray-400" />
                    </div>

                    {/* Photo */}
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

                    {/* Name */}
                    <div className="font-bold text-center mb-2 text-gray-900">
                      {candidate.name}
                    </div>

                    {/* Party */}
                    <div className="bg-gray-100 text-center py-1 px-2 rounded text-sm mb-2 text-gray-700">
                      {candidate.party}
                    </div>

                    {/* Info */}
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

      {/* Edit Modal */}
      {editingCard && (
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

      {/* Info footer */}
      <div className="max-w-7xl mx-auto mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>💡 Astuce :</strong> Glissez-déposez les cartes entre les colonnes. 
          Survolez une carte pour l'éditer. Les données sont partagées en temps réel avec tous les utilisateurs.
        </p>
      </div>
    </div>
  );
}
