import re

with open('src/pages/Admin.tsx', 'r') as f:
    content = f.read()

old_query = """        if (selectedUserForLogs) {
          const sessionsQ = query(collection(db, 'study_sessions'), where('userId', '==', selectedUserForLogs), orderBy('startTime', 'desc'), limit(100));
          const sessionsSnap = await getDocs(sessionsQ);
          setSessions(sessionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as StudySession)));
        } else {"""

new_query = """        if (selectedUserForLogs) {
          const sessionsQ = query(collection(db, 'study_sessions'), where('userId', '==', selectedUserForLogs));
          const sessionsSnap = await getDocs(sessionsQ);
          let userSessions = sessionsSnap.docs.map(d => ({ ...d.data(), id: d.id } as StudySession));
          userSessions.sort((a, b) => b.startTime - a.startTime);
          setSessions(userSessions.slice(0, 100));
        } else {"""

content = content.replace(old_query, new_query)

with open('src/pages/Admin.tsx', 'w') as f:
    f.write(content)
