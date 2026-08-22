import re

with open('src/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Extract blocks using regex
# We want to match from {/* JFT A2 */} up to just before {/* Minna no Nihongo 2 */}
jft_pattern = re.compile(r'(              {/\* JFT A2 \*/}.*?)(?=              {/\* Minna no Nihongo 2 \*/})', re.DOTALL)
mnn2_pattern = re.compile(r'(              {/\* Minna no Nihongo 2 \*/}.*?)(?=              {/\* Other Categories if any \*/})', re.DOTALL)

jft_match = jft_pattern.search(content)
mnn2_match = mnn2_pattern.search(content)

if jft_match and mnn2_match:
    jft_block = jft_match.group(1)
    mnn2_block = mnn2_match.group(1)
    
    # We remove both from the document, then insert them in the new order
    content = content.replace(jft_block, "")
    content = content.replace(mnn2_block, "")
    
    # Now replace the place where it was
    # Actually, let's just do a direct replacement of the combined block
    
    # To be safe, reload content
    with open('src/pages/Dashboard.tsx', 'r') as f:
        content = f.read()
        
    combined_original = jft_block + mnn2_block
    combined_new = mnn2_block + jft_block
    
    content = content.replace(combined_original, combined_new)
    
    with open('src/pages/Dashboard.tsx', 'w') as f:
        f.write(content)
    print("Reordered successfully!")
else:
    print("Could not find the blocks")
