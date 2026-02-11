#!/usr/bin/python3
import sys

ka = ['x120', 'm120', 'a-1', 'a-103', 'x36', 'm158', 'a-105', 'm123', 'x100', 'a-37', 'x115', 'a-13', 'm180', 'm173', 'a-9', 'm119', 'x98', 'a-80', 'a-114', 'x100', 'm95', 'x105', 'm115', 'x104', 'x125']
def decode(b, key):
    if key[0] == 'a':
        o = b - int(key[1:])
    elif key[0] == 'm':
        o = int(key[1:]) - b
    elif key[0] == 'x':
        o = b ^ int(key[1:])
    return chr(o)

def check_secret(secret):
    max = 100
    if (len(secret) * 2) + 18 > max:
        return False

    base = f"{0.1 + 0.2:.100f}"[18:18 + len(secret)*2]
    base = [int(base[i:i+2]) for i in range(0, len(base), 2)]

    p = list(map(decode, base, ka))
    return "".join(p) == secret

def main():
    secret = sys.argv[1]
    if check_secret(secret):
        print(f"Correct! Secret is {secret}")
    else:
        print("WRONG!")

if __name__ == "__main__":
    main()
