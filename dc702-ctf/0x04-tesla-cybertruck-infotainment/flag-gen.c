#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

#define HIDDEN_OPTION (4500 * 2)
#define AUTH_LENGTH 8
#define MAX_INPUT 64
#define BUFFER_SIZE 128

static const unsigned char k1 = 0x42;
static unsigned char temp_cal_1[] = {1, 112, 57, 38, 59, 49, 54, 114, 50, 115, 35, 12, 29, 47, 43, 44, 113, 33, 48, 35, 36, 54, 29, 33, 35, 48, 29, 114, 58, 32, 39, 39, 36, 63};
void get_system_strings(char* str1);


void decode_string(unsigned char* encoded, char* decoded, int len) {
    for (int i = 0; i < len; i++) {
        decoded[i] = encoded[i] ^ k1;
    }
    decoded[len] = '\0';
}

void get_system_strings(char* str1) {
    decode_string(temp_cal_1, str1, 34);
}

int main() {

    char sys_str1[BUFFER_SIZE];
    get_system_strings(sys_str1);
    printf("%s", sys_str1);

}
