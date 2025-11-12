import os

temp_file = "tmp.txt"
os.system(f"diff copy_1.pdf copy_2.pdf > {temp_file}")

with open(temp_file, "r") as f:
    diff_text=f.read()

print(f"Diff Text:\n\n{diff_text}\n")

lines = diff_text.splitlines()
lines = lines[1:4]

hex_list = []
for line in lines:
    hex_list.append(line[10:])

hex_str = " ".join(hex_list)
print(hex_str)

os.remove(temp_file)

flag = bytes.fromhex(hex_str).decode("utf-8")
print(f"Flag: {flag}")
