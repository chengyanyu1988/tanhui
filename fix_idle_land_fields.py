file_path = 'src/components/CarbonFinanceView.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace in handleOpenAddLease:
content = content.replace("idleLands[0].landName", "idleLands[0].parcelName")
content = content.replace("idleLands[0].expectedYears", "idleLands[0].leaseTermYears")

# Replace in handleSaveLease:
content = content.replace("idleLands.find((l) => l.landName === leaseForm.landName)", "idleLands.find((l) => l.parcelName === leaseForm.landName)")

# Replace in modal JSX:
content = content.replace("const matched = idleLands.find((l) => l.landName === selectedName);", "const matched = idleLands.find((l) => l.parcelName === selectedName);")
content = content.replace("landName: matched.landName,", "landName: matched.parcelName,")
content = content.replace("leaseTermYears: matched.expectedYears || f.leaseTermYears,", "leaseTermYears: matched.leaseTermYears || f.leaseTermYears,")
content = content.replace("key={land.id} value={land.landName}", "key={land.id} value={land.parcelName}")
content = content.replace("{land.landName} ({land.areaMu}亩", "{land.parcelName} ({land.areaMu}亩")
content = content.replace("!idleLands.some((l) => l.landName === leaseForm.landName)", "!idleLands.some((l) => l.parcelName === leaseForm.landName)")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed IdleLandRecord field references.")
