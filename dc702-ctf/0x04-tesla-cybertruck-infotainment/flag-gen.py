
def main():
    encoded = [1, 112, 57, 38, 59, 49, 54, 114, 50, 115, 35, 12, 29, 47, 43,
    44, 113, 33, 48, 35, 36, 54, 29, 33, 35, 48, 29, 114, 58, 32, 39, 39, 36, 63]

    password = []
    for i in range(len(encoded)):
        password.append(chr(encoded[i] ^ 0x42))

    psswd = "".join(password)
    print(f"Flag: {psswd} ")


    return

if __name__ == '__main__':
    main()