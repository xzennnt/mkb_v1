import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

target_imports = "import { auth } from '../lib/firebase';"
replacement_imports = "import { auth } from '../lib/firebase';\nimport { useAuth } from '../contexts/AuthContext';"
if replacement_imports not in content:
    content = content.replace(target_imports, replacement_imports)

# State usage
target_state = """  const [userMap, setUserMap] = useState<Record<string, UserData>>({});
  const navigate = useNavigate();"""
replacement_state = """  const [userMap, setUserMap] = useState<Record<string, UserData>>({});
  const navigate = useNavigate();
  const { userData } = useAuth();"""
if replacement_state not in content:
    content = content.replace(target_state, replacement_state)

# Role update function
target_role_func = """  const handleRenameUser = async (uid: string, currentName: string) => {"""
replacement_role_func = """  const handleChangeRole = async (uid: string, role: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), { role });
      setUsers(users.map(u => u.uid === uid ? { ...u, role } as UserData : u));
    } catch (err) {
      console.error('Gagal mengubah role', err);
      alert('Gagal mengubah role');
    } finally {
      setLoading(false);
    }
  };

  const handleRenameUser = async (uid: string, currentName: string) => {"""
if "handleChangeRole" not in content:
    content = content.replace(target_role_func, replacement_role_func)


# Fix the UI block
target_ui = """                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {activeUserTab === 'active' ? (
                            <>
                              <button onClick={() => handleBanUser(u.uid, true)} className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-xs font-bold transition-colors">
                                Ban
                              </button>
                              <button onClick={() => handleResetProgress(u.uid)} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">
                                Reset
                              </button>
                            </>
                          ) : (
                            <button onClick={() => handleBanUser(u.uid, false)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-xs font-bold transition-colors">
                              Unban
                            </button>
                          )}
                          <button onClick={() => handleRenameUser(u.uid, u.displayName || u.email || '')} className="p-1.5 text-blue-500 hover:text-white hover:bg-blue-500 rounded-lg transition-colors" title="Ganti Nama">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteUser(u.uid)} className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Hapus Akun">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>"""

replacement_ui = """                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        {/* Status Label Admin/SubAdmin */}
                        {(u.role === 'admin' || u.role === 'sub_admin') && (
                           <div className="text-[10px] font-bold px-2 py-0.5 rounded-md mb-1 w-fit bg-slate-100 text-slate-600">
                             {u.role === 'admin' ? 'Admin Utama' : 'Sub Admin'}
                           </div>
                        )}
                        
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {((userData?.role === 'admin') || (userData?.role === 'sub_admin' && u.role !== 'admin')) && (
                             <>
                               {u.role !== 'admin' && (
                                  <>
                                    {activeUserTab === 'active' ? (
                                      <>
                                        <button onClick={() => handleBanUser(u.uid, true)} className="px-3 py-1.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                          Ban
                                        </button>
                                        <button onClick={() => handleResetProgress(u.uid)} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                          Reset
                                        </button>
                                      </>
                                    ) : (
                                      <button onClick={() => handleBanUser(u.uid, false)} className="px-3 py-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                        Unban
                                      </button>
                                    )}
                                    <button onClick={() => handleRenameUser(u.uid, u.displayName || u.email || '')} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap" title="Ganti Nama">
                                      Ganti Nama
                                    </button>
                                    <button onClick={() => handleDeleteUser(u.uid)} className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Hapus Akun">
                                      <Trash2 size={16} />
                                    </button>
                                    {userData?.role === 'admin' && (
                                      <>
                                        {u.role === 'sub_admin' ? (
                                          <button onClick={() => handleChangeRole(u.uid, 'user')} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                            Hapus Sub
                                          </button>
                                        ) : (
                                          <button onClick={() => handleChangeRole(u.uid, 'sub_admin')} className="px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                            Jadikan Sub
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </>
                               )}
                             </>
                          )}
                          {/* Allow Admin/SubAdmin to rename themselves and reset themselves */}
                          {u.uid === userData?.uid && (
                             <>
                                <button onClick={() => handleRenameUser(u.uid, u.displayName || u.email || '')} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap" title="Ganti Nama Sendiri">
                                  Ganti Nama (Saya)
                                </button>
                                <button onClick={() => handleResetProgress(u.uid)} className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-[10px] font-bold transition-colors whitespace-nowrap">
                                  Reset (Saya)
                                </button>
                             </>
                          )}
                        </div>
                      </div>
                    </td>"""

if target_ui in content:
    content = content.replace(target_ui, replacement_ui)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

