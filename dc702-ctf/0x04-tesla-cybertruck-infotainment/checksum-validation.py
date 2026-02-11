
goal = 2661

password = []
current_sum = 0

# 32 - " " 33 = "!" 65 - "A" 122 - "z"" 126 - "~"
min_char_num = 32 # A
max_char_num = 126 # ~
char_num = max_char_num


while True:
    password = []
    current_sum = 0
    max_char_num -= 1 # z
    if(max_char_num == min_char_num):
        print("Password not possible from max!")
        break

    char_num = max_char_num
    while True:
        if(current_sum == goal):
            print("Password is calculated")
            print("".join(password))
            exit()
            break

        next_sum = (char_num * char_num +1)
        if current_sum + next_sum < goal:
            current_sum += next_sum
            password.append(chr(char_num))
            # print("".join(password))
            continue

        if char_num > min_char_num:
            char_num -= 1
            continue

        psswd_string = "".join(password)
        print(f"Star max Char: {max_char_num} - ({chr(max_char_num)})  Current Sum: {current_sum} Psswd: {psswd_string}")
        break

print("\n"*3)

min_char_num = 32 # A
max_char_num = 126 # z
char_num = min_char_num
while True:
    password = []
    current_sum = 0
    min_char_num += 1 # z
    if(min_char_num == max_char_num):
        print("Password not possible from min!")
        break

    char_num = min_char_num
    while True:
        if(current_sum == goal):
            print("Password is calculated")
            print("".join(password))
            exit()
            break

        next_sum = (char_num * char_num +1)
        if current_sum + next_sum < goal:
            current_sum += next_sum
            password.append(chr(char_num))
            # print("".join(password))
            continue

        if char_num < max_char_num:
            char_num += 1
            continue

        psswd_string = "".join(password)
        print(f"Star max Char: {min_char_num} - ({chr(min_char_num)}) Current Sum: {current_sum} Psswd: {psswd_string}")
        break
