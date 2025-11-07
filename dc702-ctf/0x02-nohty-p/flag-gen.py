def validate(c, i):
    import base64

    if (i == 0 or i == 9) and c == "t":
        return True
    if (i == 1) and (ord(c) == 104):
        return True
    if (i == 2) and (c == "secure"[4]):
        return True
    if (i == 3 or i == 4) and (c == chr(ord("g")-2)):
        return True
    if i in [5,6,7,8,9]:
        if c == "tniop"[::-1][i-5]:
            return True
    if i in range(10,21):
        doot = base64.b64decode("MWZvdXIxZml2ZTk=".encode("ascii")).decode("ascii")
        if c == doot[i - 10]:
            return True
    if i in range(21, 31):
        if c == "GANGALF-TON-"[::-1][i-21]:
            return True
    return False



def main():
    import string
    valid_chars = string.printable
    password = []
    for i in range(30):
        for j in range(len(valid_chars)):
            c = valid_chars[j]
            if(validate(c, i)):
                password.append(c)
                break

    print("Generated Flag: " + "DC702{" + "".join(password) + "}")

    return


if __name__ == '__main__':
    main()