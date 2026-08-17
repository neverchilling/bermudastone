import re
import os

files_to_fix = [
    "src/app/login/page.tsx",
    "src/app/page.tsx",
    "src/app/admin/login/page.tsx"
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Strip out any wrapping divs containing white backgrounds, borders, or backdrops around logo.png
    # Replace wrapped <img src="/logo.png" ... /> with a clean, standalone image
    code = re.sub(
        r'<div[^>]*>\s*(<img\s+src="/logo\.png"[^>]*/>)\s*</div>',
        r'\1',
        code
    )
    
    # Ensure no lingering background/border styles on any immediate parent
    code = re.sub(r'bg-white[^\s"]*', '', code)
    code = re.sub(r'backdrop-blur-[^\s"]*', '', code)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)
    print(f"✅ Cleaned logo wrappers in {file_path}")

