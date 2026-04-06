import os

input_file = r'g:\manobandhu\garden-app\gentle-stretching-final.html'
output_file = r'g:\manobandhu\garden-app\gentle-stretching-final.html.tmp'

with open(input_file, 'r', encoding='utf-8') as f, open(output_file, 'w', encoding='utf-8') as out:
    line_num = 0
    skip_until = -1
    for line in f:
        line_num += 1
        
        # Skip @media block (lines 131 to 157)
        if line_num >= 131 and line_num <= 157:
            continue
            
        # Replace #video-wrapper lines (41 to 45)
        if line_num == 41:
            out.write('#video-wrapper {\n')
            continue
        if line_num == 42:
            out.write('  position:absolute;\n')
            continue
        if line_num == 43:
            out.write('  left:calc(28 * var(--u)); top:calc(131 * var(--u));\n')
            continue
        if line_num == 44:
            out.write('  width:calc(424 * var(--u)); height:calc(361 * var(--u));\n')
            continue
        if line_num == 45:
            out.write('  border-radius:calc(24 * var(--u));\n')
            continue
            
        out.write(line)

os.replace(output_file, input_file)
