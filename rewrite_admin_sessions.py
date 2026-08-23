import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

# 1. Add state
if 'selectedUserForLogs' not in content:
    content = content.replace("const [activeUserTab, setActiveUserTab] = useState<'active' | 'banned'>('active');", 
                              "const [activeUserTab, setActiveUserTab] = useState<'active' | 'banned'>('active');\n  const [selectedUserForLogs, setSelectedUserForLogs] = useState<string | null>(null);")

# 2. Update fetchData
fetch_sessions_old = """      if (activeTab === 'sessions') {
        // Fetch Sessions
        const sessionsQ = query(collection(db, 'study_sessions'), orderBy('startTime', 'desc'), limit(100));
        const sessionsSnap = await getDocs(sessionsQ);
        setSessions(sessionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as StudySession)));
      }"""

fetch_sessions_new = """      if (activeTab === 'sessions') {
        if (selectedUserForLogs) {
          const sessionsQ = query(collection(db, 'study_sessions'), where('userId', '==', selectedUserForLogs), orderBy('startTime', 'desc'), limit(100));
          const sessionsSnap = await getDocs(sessionsQ);
          setSessions(sessionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as StudySession)));
        } else {
          setSessions([]);
        }
      }"""
content = content.replace(fetch_sessions_old, fetch_sessions_new)

# 3. Update useEffect
use_effect_old = """  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'sessions' || activeTab === 'difficult') {
      fetchData();
    }
  }, [activeTab]);"""

use_effect_new = """  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'sessions' || activeTab === 'difficult') {
      if (activeTab !== 'sessions') setSelectedUserForLogs(null);
      fetchData();
    }
  }, [activeTab, selectedUserForLogs]);"""
content = content.replace(use_effect_old, use_effect_new)

# 4. Update the UI for activeTab === 'sessions'
ui_old = """      {activeTab === 'sessions' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Log Aktivitas Belajar</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Waktu Mulai</th>
                  <th className="p-4 font-bold">Pengguna</th>
                  <th className="p-4 font-bold">Materi & Kendala Siswa</th>
                  <th className="p-4 font-bold text-center">Durasi</th>
                  <th className="p-4 font-bold text-center">Jumlah Soal</th>
                  <th className="p-4 font-bold text-center">Benar / Salah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((s, index) => {
                  const u = userMap[s.userId];
                  return (
                    <tr key={s.id || index} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatDateTime(s.startTime)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{u?.displayName || u?.email?.split('@')[0] || 'Unknown'}</div>
                        <div className="text-slate-500 text-xs">{u?.email || s.userId}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-700 text-sm mb-1">{s.category || s.type || 'Latihan'}</div>
                        {s.failedVocabs && s.failedVocabs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {s.failedVocabs.map((fv, i) => (
                              <span key={i} className="inline-block bg-rose-50 border border-rose-200 text-rose-700 text-[10px] px-2 py-0.5 rounded" title={fv.id_translation}>
                                {fv.jp}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-emerald-500 font-medium">Sempurna (Tidak ada salah)</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold px-2 py-1 rounded">
                          {Math.floor(s.totalDuration / 60)}m {s.totalDuration % 60}s
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold text-indigo-600">
                        {s.cardsReviewed}
                      </td>
                      <td className="p-4 text-center font-bold">
                        <span className="text-emerald-500">{s.correctCount}</span> / <span className="text-rose-500">{s.incorrectCount}</span>
                      </td>
                    </tr>
                  );
                })}
                {sessions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada log belajar.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}"""

# We need to construct the new UI using regex since some parts might differ slightly.
ui_pattern = r"\{activeTab === 'sessions' && \([\s\S]*?Belum ada log belajar\.</td>\n\s*</tr>\n\s*\)\}\n\s*</tbody>\n\s*</table>\n\s*</div>\n\s*</div>\n\s*\)\}"

new_ui = """      {activeTab === 'sessions' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {!selectedUserForLogs ? (
            <>
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Pilih Pengguna untuk Melihat Log</h2>
                <p className="text-slate-500 text-sm mt-1">Pilih salah satu pengguna di bawah ini untuk melihat detail riwayat aktivitas belajar mereka.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold">Nama Pengguna</th>
                      <th className="p-4 font-bold">Email</th>
                      <th className="p-4 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                      <tr key={u.uid} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{u.displayName || u.email?.split('@')[0] || 'Unknown'}</div>
                        </td>
                        <td className="p-4 text-slate-500">{u.email}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => setSelectedUserForLogs(u.uid)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                          >
                            Lihat Log
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && !loading && (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-slate-500">Belum ada pengguna.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedUserForLogs(null)}
                      className="text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Kembali"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    Log Aktivitas Belajar
                  </h2>
                  <p className="text-slate-500 text-sm mt-1 ml-7">
                    Pengguna: <strong className="text-slate-700">{userMap[selectedUserForLogs]?.displayName || userMap[selectedUserForLogs]?.email}</strong>
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold">Waktu Mulai</th>
                      <th className="p-4 font-bold">Materi & Kendala Siswa</th>
                      <th className="p-4 font-bold text-center">Durasi</th>
                      <th className="p-4 font-bold text-center">Jumlah Soal</th>
                      <th className="p-4 font-bold text-center">Benar / Salah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((s, index) => (
                      <tr key={s.id || index} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-700 whitespace-nowrap">
                          {formatDateTime(s.startTime)}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-700 text-sm mb-1">{s.category || s.type || 'Latihan'}</div>
                          {s.failedVocabs && s.failedVocabs.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {s.failedVocabs.map((fv, i) => (
                                <span key={i} className="inline-block bg-rose-50 border border-rose-200 text-rose-700 text-[10px] px-2 py-0.5 rounded" title={fv.id_translation}>
                                  {fv.jp}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-emerald-500 font-medium">Sempurna (Tidak ada salah)</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-bold px-2 py-1 rounded">
                            {Math.floor(s.totalDuration / 60)}m {s.totalDuration % 60}s
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-indigo-600">
                          {s.cardsReviewed}
                        </td>
                        <td className="p-4 text-center font-bold">
                          <span className="text-emerald-500">{s.correctCount}</span> / <span className="text-rose-500">{s.incorrectCount}</span>
                        </td>
                      </tr>
                    ))}
                    {sessions.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada riwayat aktivitas untuk pengguna ini.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}"""

content = re.sub(ui_pattern, new_ui, content)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)

print("Done updating Admin sessions tab.")
