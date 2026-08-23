import os
import re

# Helper to dedupe progSnap.docs in multiple files
def patch_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Generic dedupe approach: find query execution and forEach loops.
    # Actually, it's safer to just replace `progSnap.docs.forEach(d => {` or `progSnap.forEach(d => {`
    # and manually write the script for each file to ensure it's exact.
    pass

