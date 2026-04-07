import re

with open('i:/Games/manodweep/garden-app/How was your day_.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the base64 background in .container
new_content = re.sub(
    r"background:\s*url\('data:image/png;base64,[^']+'\)[^;]+;",
    r"background: url('../src/app/garden/social-bg.jpg') center top / cover no-repeat;",
    content,
    flags=re.IGNORECASE
)

if new_content != content:
    with open('i:/Games/manodweep/garden-app/How was your day_.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Replaced successfully.')
else:
    print('No changes made. Regex might not have matched.')
