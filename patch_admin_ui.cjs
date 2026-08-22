const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf-8');

const targetStr = `{activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Daftar Pengguna</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Nama / Email</th>
                  <th className="p-4 font-bold text-center">Level</th>
                  <th className="p-4 font-bold text-center">Streak</th>
                  <th className="p-4 font-bold text-right">Points</th>
                  <th className="p-4 font-bold text-right">Mastered</th>
                  <th className="p-4 font-bold text-center">Waktu Belajar</th>
                  <th className="p-4 font-bold">Last Login / Aktif</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u, index) => (
                  <tr key={u.uid || index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{u.displayName || u.email?.split('@')[0] || 'User'}</div>
                      <div className="text-slate-500 text-xs">{u.email}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-1 rounded text-xs">Lv. {u.level}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-rose-500">🔥 {u.loginStreak || 1}</span>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-700">{(u.points || 0).toLocaleString()}</td>
                    <td className="p-4 text-right font-medium text-slate-600">{u.masteredVocabCount}</td>
                    <td className="p-4 text-center font-mono text-xs text-slate-500">{formatTime(u.totalStudyTime)}</td>
                    <td className="p-4 text-xs">
                      <div className="text-slate-700 font-bold">{u.lastLoginDate || '-'}</div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">Aktif: {u.lastActiveDate ? formatDateTime(new Date(u.lastActiveDate).getTime()) : '-'}</div>
                    </td>
                    <td className="p-4 text-right">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u.uid)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}`;

const replacementStr = `{activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h2>
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveUserTab('active')}
                className={\`px-4 py-1.5 rounded-md text-sm font-bold transition-all \${activeUserTab === 'active' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}\`}
              >
                Aktif
              </button>
              <button
                onClick={() => setActiveUserTab('banned')}
                className={\`px-4 py-1.5 rounded-md text-sm font-bold transition-all \${activeUserTab === 'banned' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-800'}\`}
              >
                Di-banned
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Nama / Email</th>
                  <th className="p-4 font-bold text-center">Level / Streak</th>
                  <th className="p-4 font-bold text-center">Statistik Belajar</th>
                  <th className="p-4 font-bold">Last Login / Aktif</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.filter(u => activeUserTab === 'active' ? !u.isBanned : u.isBanned).map((u, index) => (
                  <tr key={u.uid || index} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{u.displayName || u.email?.split('@')[0] || 'User'}</div>
                      <div className="text-slate-500 text-xs">{u.email}</div>
                      {u.role === 'admin' && <span className="inline-block mt-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">ADMIN</span>}
                    </td>
                    <td className="p-4 text-center">
                      <div className="bg-indigo-100 text-indigo-800 font-bold px-2 py-1 rounded text-xs inline-block mb-1">Lv. {u.level}</div>
                      <div className="font-bold text-rose-500 text-xs">🔥 {u.loginStreak || 1}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-xs font-bold text-slate-700">Pts: {(u.points || 0).toLocaleString()}</div>
                      <div className="text-xs font-medium text-slate-600">Vocab: {u.masteredVocabCount}</div>
                      <div className="font-mono text-xs text-slate-500 mt-1">{formatTime(u.totalStudyTime)}</div>
                    </td>
                    <td className="p-4 text-xs">
                      <div className="text-slate-700 font-bold">{u.lastLoginDate || '-'}</div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wide mt-1">Aktif: {u.lastActiveDate ? formatDateTime(new Date(u.lastActiveDate).getTime()) : '-'}</div>
                    </td>
                    <td className="p-4 text-right">
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
                          <button onClick={() => handleDeleteUser(u.uid)} className="p-1.5 text-rose-500 hover:text-white hover:bg-rose-500 rounded-lg transition-colors" title="Hapus Akun">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {users.filter(u => activeUserTab === 'active' ? !u.isBanned : u.isBanned).length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">Tidak ada data pengguna di kategori ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replacementStr);
  fs.writeFileSync('src/pages/Admin.tsx', content);
  console.log('UI patched successfully');
} else {
  console.log('Could not find target string in Admin.tsx');
}
