import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace useState for showMnn1
target_state_1 = "  const [showMnn1, setShowMnn1] = useState(true);"
replace_state_1 = """  const [showMnn1, setShowMnn1] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showMnn1_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return true;
  });"""

# Replace useState for showMnn2
target_state_2 = "  const [showMnn2, setShowMnn2] = useState(false);"
replace_state_2 = """  const [showMnn2, setShowMnn2] = useState(() => {
    if (currentUser?.uid) {
      const stored = localStorage.getItem(`ui_showMnn2_${currentUser.uid}`);
      if (stored !== null) return stored === 'true';
    }
    return false;
  });

  const toggleMnn1 = () => {
    const newVal = !showMnn1;
    setShowMnn1(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showMnn1_${currentUser.uid}`, String(newVal));
  };

  const toggleMnn2 = () => {
    const newVal = !showMnn2;
    setShowMnn2(newVal);
    if (currentUser?.uid) localStorage.setItem(`ui_showMnn2_${currentUser.uid}`, String(newVal));
  };"""

content = content.replace(target_state_1, replace_state_1)
content = content.replace(target_state_2, replace_state_2)

target_click_1 = "onClick={() => setShowMnn1(!showMnn1)}"
replace_click_1 = "onClick={toggleMnn1}"

target_click_2 = "onClick={() => setShowMnn2(!showMnn2)}"
replace_click_2 = "onClick={toggleMnn2}"

content = content.replace(target_click_1, replace_click_1)
content = content.replace(target_click_2, replace_click_2)

with open('src/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

print("Dashboard show/hide state patched")
