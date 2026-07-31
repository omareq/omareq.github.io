import base64

def validate(c, i):
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

if __name__ == "__main__":
    password = input("Password: ")

    print("Validating password...", end="")
    i,d,k = 0,0,int(2**8)
    c = False

    while True:
        if k % 5 == 0:
            valid = validate(password[i], i)
            i+=1
            if i >= len(password):
                break
            if not valid:
                print("\nAccess denied...")
                exit()
        else:
            print(".",end="")
            k+=1

    print (f"\n\nAccess Granted: DC702{{{password}}}")
