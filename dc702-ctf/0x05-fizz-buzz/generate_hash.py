import hashlib

unhashed_str = ""

fizz_num = 3
buzz_num = 7

for i in range(1,1025):
    if i %fizz_num == 0 or i%buzz_num == 0:
        if i % fizz_num == 0:
            unhashed_str += "fizz"

        if i % buzz_num == 0:
            unhashed_str += "buzz"

    else:
        unhashed_str += str(i)

    unhashed_str += ","

input_string = unhashed_str[:-1][::-1]

# Encode the string to bytes, as hash functions operate on bytes
encoded_string = input_string.encode('utf-8')

# Create an MD5 hash object
md5_hash_object = hashlib.md5()

# Update the hash object with the encoded string
md5_hash_object.update(encoded_string)

md5_hex_digest = md5_hash_object.hexdigest()


print(input_string)
print()
print(f"MD5 hash: {md5_hex_digest}")
