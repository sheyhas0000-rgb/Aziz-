/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, User, Users, Calendar, Trash2, Heart, Info, X, Save } from 'lucide-react';
import { FamilyMember, Relation } from './types.ts';

const INITIAL_USER: FamilyMember = {
  id: 'root',
  name: 'Azizbek Lutfullayev',
  relation: 'Oʻzim',
  birthDate: '2014-06-10',
  description: 'Mening shajaramning asoschisi.',
  gender: 'Erkak',
};

const RELATIONS: Relation[] = [
  'Ota', 'Ona', 'Bobo', 'Buvijon', 'Katta bobo', 'Katta buvi', 'Aka', 'Opa', 'Uka', 'Singil', 'Turmush oʻrtogʻi', 'Farzand'
];

interface FamilyNodeProps {
  member: FamilyMember;
  startEdit: (member: FamilyMember) => void;
  deleteMember: (id: string) => void;
  hasTop?: boolean;
  hasBottom?: boolean;
  key?: string | number;
}

function FamilyNode({ member, startEdit, deleteMember, hasTop, hasBottom }: FamilyNodeProps) {
  return (
    <div className="tree-node-wrapper">
      {hasTop && <div className="connector-top" />}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="tree-node bg-white p-5 rounded-2xl border border-border-subtle shadow-polish-sm min-w-[200px] group relative"
      >
        <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => startEdit(member)} className="p-1.5 text-text-muted hover:text-brand-primary">
            <Info className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => deleteMember(member.id)} className="p-1.5 text-text-muted hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="flex flex-col items-center text-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${member.gender === 'Erkak' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-main line-clamp-1">{member.name}</h4>
            <span className="badge-indigo mt-1 inline-block">{member.relation}</span>
            {member.birthDate && (
              <div className="text-[9px] font-bold text-text-muted mt-1 uppercase tracking-tight">
                {member.birthDate}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {hasBottom && <div className="connector-bottom" />}
    </div>
  );
}

export default function App() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    relation: 'Farzand',
    gender: 'Erkak',
  });

  // Calculate generations
  const calculateGenerations = () => {
    const types = new Set<number>();
    types.add(3); // Level for 'O'zim'
    
    members.forEach(m => {
      if (['Katta bobo', 'Katta buvi'].includes(m.relation)) types.add(0);
      if (['Bobo', 'Buvijon'].includes(m.relation)) types.add(1);
      if (['Ota', 'Ona'].includes(m.relation)) types.add(2);
      if (['Oʻzim', 'Aka', 'Opa', 'Uka', 'Singil', 'Turmush oʻrtogʻi'].includes(m.relation)) types.add(3);
      if (['Farzand'].includes(m.relation)) types.add(4);
    });
    
    return types.size;
  };

  // Level groupings
  const greatGrandparents = members.filter(m => ['Katta bobo', 'Katta buvi'].includes(m.relation));
  const grandparents = members.filter(m => ['Bobo', 'Buvijon'].includes(m.relation));
  const parents = members.filter(m => ['Ota', 'Ona'].includes(m.relation));
  const siblingsSpouse = members.filter(m => ['Aka', 'Opa', 'Uka', 'Singil', 'Turmush oʻrtogʻi'].includes(m.relation));
  const childrenList = members.filter(m => ['Farzand'].includes(m.relation));

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('family_members');
    if (saved) {
      setMembers(JSON.parse(saved));
    } else {
      setMembers([]);
    }
  }, []);

  // Save to localStorage whenever members change
  useEffect(() => {
    localStorage.setItem('family_members', JSON.stringify(members));
  }, [members]);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.relation) return;

    const member: FamilyMember = {
      id: editingId || crypto.randomUUID(),
      name: newMember.name,
      relation: newMember.relation as Relation,
      birthDate: newMember.birthDate,
      deathDate: newMember.deathDate,
      description: newMember.description,
      gender: (newMember.gender as 'Erkak' | 'Ayol') || 'Erkak',
    };

    if (editingId) {
      setMembers(prev => prev.map(m => m.id === editingId ? member : m));
    } else {
      setMembers(prev => [...prev, member]);
    }

    setIsAdding(false);
    setEditingId(null);
    setNewMember({ relation: 'Farzand', gender: 'Erkak' });
  };

  const deleteMember = (id: string) => {
    if (confirm('Ishonchingiz komilmi?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const startEdit = (member: FamilyMember) => {
    setNewMember(member);
    setEditingId(member.id);
    setIsAdding(true);
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-20">
      {/* Header Section - Professional Indigo Theme */}
      <header className="bg-brand-dark text-white p-8 md:p-12 relative overflow-hidden shadow-polish mb-12">
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <svg width="400" height="400" viewBox="0 0 100 100">
            <path fill="currentColor" d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 rounded-full border-4 border-brand-primary/40 bg-white flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0"
            >
              <span className="text-4xl font-extrabold text-brand-dark">AL</span>
            </motion.div>
            
            <div className="text-center md:text-left space-y-2">
              <span className="text-brand-light text-xs font-bold uppercase tracking-widest block mb-1">Tizim Asoschisi</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                {INITIAL_USER.name}
              </h1>
              <p className="text-brand-light/80 max-w-md text-sm md:text-base font-medium">
                Oila shajarasi arxivi va nasl-nasab xronologiyasi. Mening ajdodlarim va avlodlarim tarixi.
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20 text-center min-w-[100px]">
              <div className="text-3xl font-bold">{members.length + 1}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">A'zolar</div>
            </div>
            <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-white/20 text-center min-w-[100px]">
              <div className="text-3xl font-bold">{calculateGenerations()}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">Avlodlar</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Tree Section Heading */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-text-main flex items-center">
              <span className="w-2 h-8 bg-brand-primary rounded-full mr-4"></span>
              Shajara Daraxti
            </h2>
            <button 
              onClick={() => { setEditingId(null); setNewMember({ relation: 'Farzand', gender: 'Erkak' }); setIsAdding(true); }}
              className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
            >
              <Plus className="w-5 h-5" />
              <span>A'zo qo'shish</span>
            </button>
          </div>

          <div className="tree-container">
            {/* Level 0: Great Grandparents */}
            {greatGrandparents.length > 0 && (
              <div className="generation-level">
                {greatGrandparents.map(member => (
                   <FamilyNode 
                    key={member.id} 
                    member={member} 
                    startEdit={startEdit} 
                    deleteMember={deleteMember} 
                    hasBottom={true}
                  />
                ))}
              </div>
            )}

            {/* Level 1: Grandparents */}
            {grandparents.length > 0 && (
              <div className="generation-level">
                {grandparents.map(member => (
                   <FamilyNode 
                    key={member.id} 
                    member={member} 
                    startEdit={startEdit} 
                    deleteMember={deleteMember} 
                    hasTop={greatGrandparents.length > 0} 
                    hasBottom={true}
                  />
                ))}
              </div>
            )}

            {/* Level 2: Parents */}
            {parents.length > 0 && (
              <div className="generation-level">
                {parents.map(member => (
                   <FamilyNode 
                    key={member.id} 
                    member={member} 
                    startEdit={startEdit} 
                    deleteMember={deleteMember} 
                    hasTop={grandparents.length > 0 || greatGrandparents.length > 0} 
                    hasBottom={true}
                  />
                ))}
              </div>
            )}

            {/* Level 3: Self and Siblings */}
            <div className="generation-level">
               {/* Root User */}
               <div className="tree-node-wrapper">
                 {(parents.length > 0 || grandparents.length > 0 || greatGrandparents.length > 0) && <div className="connector-top" />}
                 <motion.div 
                   layout
                   className="tree-node bg-brand-dark p-6 rounded-2xl shadow-polish text-white border-2 border-white/20 min-w-[240px]"
                 >
                   <div className="flex flex-col items-center text-center gap-3">
                     <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                     </div>
                     <div>
                       <h3 className="font-extrabold">{INITIAL_USER.name}</h3>
                       <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase font-bold tracking-widest">{INITIAL_USER.relation}</span>
                       <div className="text-[10px] opacity-60 mt-1 uppercase font-bold">{INITIAL_USER.birthDate}</div>
                     </div>
                   </div>
                 </motion.div>
                 {childrenList.length > 0 && <div className="connector-bottom" />}
               </div>

               {/* Siblings / Spouse */}
               {siblingsSpouse.map(member => (
                  <FamilyNode key={member.id} member={member} startEdit={startEdit} deleteMember={deleteMember} />
               ))}
            </div>

            {/* Level 4: Children */}
            {childrenList.length > 0 && (
              <div className="generation-level">
                {childrenList.map(member => (
                   <FamilyNode 
                    key={member.id} 
                    member={member} 
                    startEdit={startEdit} 
                    deleteMember={deleteMember} 
                    hasTop={true}
                  />
                ))}
              </div>
            )}

            {members.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white border border-border-subtle rounded-3xl flex flex-col items-center shadow-polish-sm w-full"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-brand-primary/30" />
                </div>
                <h3 className="text-xl font-extrabold text-text-main">Hali a'zolar qo'shilmadi</h3>
                <p className="text-text-muted max-w-sm mx-auto mt-2 leading-relaxed text-sm">
                  Ota-onangiz, bobo-buvilaringiz va farzandlaringizni qo'shib shajarani to'ldiring.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>

      {/* Modal - Professional Styled */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 py-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-text-main/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-2xl shadow-polish z-10 overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-border-subtle flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-extrabold text-text-main leading-tight">
                    {editingId ? 'Ma\'lumotlarni tahrirlash' : 'Yangi a\'zo ma\'lumotlari'}
                  </h3>
                  <p className="text-text-muted text-sm font-medium mt-1">Oila a'zosi haqida barcha ma'lumotlarni to'ldiring.</p>
                </div>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-text-muted"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">To'liq ism-sharif</label>
                    <input 
                      type="text"
                      value={newMember.name || ''}
                      onChange={e => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Masalan: Anvar Lutfullayev"
                      className="w-full bg-slate-50 border border-border-subtle px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-text-main font-medium placeholder:text-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 flex-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Qarindoshlik</label>
                      <select 
                        value={newMember.relation}
                        onChange={e => setNewMember(prev => ({ ...prev, relation: e.target.value as Relation }))}
                        className="w-full bg-slate-50 border border-border-subtle px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-text-main font-medium appearance-none"
                      >
                        {RELATIONS.map(rel => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2 flex-1">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Jinsi</label>
                      <div className="flex bg-slate-50 p-1 rounded-xl border border-border-subtle">
                        <button 
                          onClick={() => setNewMember(prev => ({ ...prev, gender: 'Erkak' }))}
                          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${newMember.gender === 'Erkak' ? 'bg-white shadow-sm text-brand-primary' : 'text-text-muted opacity-60'}`}
                        >
                          ERKAK
                        </button>
                        <button 
                          onClick={() => setNewMember(prev => ({ ...prev, gender: 'Ayol' }))}
                          className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all ${newMember.gender === 'Ayol' ? 'bg-white shadow-sm text-pink-600' : 'text-text-muted opacity-60'}`}
                        >
                          AYOL
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Tug'ilgan kuni</label>
                      <input 
                        type="date"
                        value={newMember.birthDate || ''}
                        onChange={e => setNewMember(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full bg-slate-50 border border-border-subtle px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-text-main font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Vafot etgan kuni</label>
                      <input 
                        type="date"
                        value={newMember.deathDate || ''}
                        onChange={e => setNewMember(prev => ({ ...prev, deathDate: e.target.value }))}
                        className="w-full bg-slate-50 border border-border-subtle px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-text-main font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Qisqacha ma'lumot</label>
                    <textarea 
                      value={newMember.description || ''}
                      onChange={e => setNewMember(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Kasbi, yutuqlari va hayoti haqida..."
                      rows={3}
                      className="w-full bg-slate-50 border border-border-subtle px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all text-text-main font-medium placeholder:text-slate-300 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-border-subtle flex gap-4">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 bg-white border border-border-subtle text-text-main py-4 rounded-xl font-bold hover:bg-white/50 transition-all"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleAddMember}
                  className="flex-[2] bg-brand-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" />
                  <span>Ma'lumotni saqlash</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-20 py-10 text-center border-t border-border-subtle bg-white">
         <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-muted opacity-40">
           © {new Date().getFullYear()} Mening Shajaram — Professional Arxiv Tizimi
         </p>
      </footer>
    </div>
  );
}
