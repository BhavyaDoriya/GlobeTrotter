import json

with open('C:/Users/BHAVYA/.gemini/antigravity/brain/2c4e2e49-469d-4418-8545-89229b352e98/.system_generated/logs/transcript_full.jsonl', encoding='utf-8') as f:
    lines = f.readlines()

reps = []
for l in lines:
    try:
        data = json.loads(l)
        if 'tool_calls' in data and data['tool_calls'] and data['tool_calls'][0]['name'] == 'replace_file_content':
            if r'build\page.tsx' in data['tool_calls'][0]['args'].get('TargetFile', ''):
                reps.append(data['tool_calls'][0]['args'])
    except:
        pass

content = open('apps/web/app/(dashboard)/trips/[id]/build/page.tsx', encoding='utf-8').read()
for r in reps:
    content = content.replace(r['TargetContent'], r['ReplacementContent'])

open('apps/web/app/(dashboard)/trips/[id]/build/page.tsx', 'w', encoding='utf-8').write(content)
