#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

#define HIDDEN_OPTION (4500 * 3)
#define AUTH_LENGTH 8
#define MAX_INPUT 50
#define BUFFER_SIZE 64

static const unsigned char k1 = 0x42;
static const unsigned char k2 = 0x33;
static const unsigned char k3 = 0x17;

static unsigned char temp_cal_1[] = {1, 112, 57, 38, 59, 49, 54, 114, 50, 115, 35, 12, 29, 47, 43, 44, 113, 33, 48, 35, 36, 54, 29, 33, 35, 48, 29, 114, 58, 32, 39, 39, 36, 63};
static unsigned char temp_cal_2[] = {33, 59, 32, 39, 48, 115, 112, 113};
static unsigned char temp_cal_3[] = {6, 39, 49, 54, 48, 45, 59, 29, 3, 46, 46, 29, 10, 55, 47, 35, 44, 49};

static int voltage_refs[] = {3700, 3850, 4200, 4350};
static double power_factors[] = {0.85, 0.92, 0.78, 0.96};

static unsigned char motor_params[] = {0xA1, 0xB2, 0xC3, 0xD4, 0xE5, 0xF6};

static float gps_offsets[] = {37.4419, -122.1430, 40.7589, -73.9851};

void get_system_strings(char* str1, char* str2, char* str3);
void loading_sequence(const char* message, int dots);
void decode_string(unsigned char* encoded, char* decoded, int len);
int calculate_checksum(char* input);

void loading_sequence(const char* message, int dots) {
    printf("%s", message);
    fflush(stdout);
    for (int i = 0; i < dots; i++) {
        sleep(1);
        printf(".");
        fflush(stdout);
    }
    printf("\n");
}

void decode_string(unsigned char* encoded, char* decoded, int len) {
    for (int i = 0; i < len; i++) {
        decoded[i] = encoded[i] ^ k1;
    }
    decoded[len] = '\0';
}

void get_system_strings(char* str1, char* str2, char* str3) {
    decode_string(temp_cal_1, str1, 34);
    decode_string(temp_cal_2, str2, 8);
    decode_string(temp_cal_3, str3, 18);
}

int calculate_checksum(char* input) {
    int sum = 0;
    for (int i = 0; input[i] != '\0'; i++) {
        sum += (int)input[i] * (i + 1);
    }
    return sum;
}

void display_menu() {
    printf("\n===========================================\n");
    printf("    TESLA CYBERTRUCK INFOTAINMENT v2.1    \n");
    printf("===========================================\n");
    printf("1. Climate Control\n");
    printf("2. Media Center\n");
    printf("3. Navigation\n");
    printf("4. Vehicle Settings\n");
    printf("5. Charging Status\n");
    printf("Enter your choice: ");
}

void handle_climate() {
    printf("\nClimate Control: Temperature set to 22°C\n");
    printf("Press Enter to continue...");
    getchar();
}

void handle_media() {
    printf("\nMedia Center: Now playing - Cyberpunk 2077 Soundtrack\n");
    printf("Press Enter to continue...");
    getchar();
}

void handle_navigation() {
    printf("\nNavigation: Calculating route to Mars...\n");
    printf("Press Enter to continue...");
    getchar();
}

void handle_settings() {
    printf("\nVehicle Settings: Autopilot mode enabled\n");
    printf("Press Enter to continue...");
    getchar();
}

void handle_charging() {
    printf("\nCharging Status: 85%% - Supercharging active\n");
    printf("Press Enter to continue...");
    getchar();
}

void process_special_mode() {
    char input[MAX_INPUT];
    char sys_str1[BUFFER_SIZE];
    char sys_str2[BUFFER_SIZE];
    char sys_str3[BUFFER_SIZE];
    
    get_system_strings(sys_str1, sys_str2, sys_str3);
    
    printf("\n[SYSTEM] Entering diagnostic mode...\n");
    printf("Authentication required: ");
    fgets(input, sizeof(input), stdin);
    
    input[strcspn(input, "\n")] = 0;
    
    if (calculate_checksum(input) == 2661) {
        printf("\n[SUCCESS] Authentication verified\n");
        sleep(1);
        
        loading_sequence("\n[SYSTEM] Accessing restricted protocols", 3);
        loading_sequence("[SYSTEM] Bypassing safety mechanisms", 4);
        loading_sequence("[SYSTEM] Initializing neural network interface", 3);
        
        printf("\n[WARNING] Activating %s module", sys_str3);
        fflush(stdout);
        sleep(2);
        printf("...\n");
        
        loading_sequence("[CRITICAL] Loading combat subroutines", 3);
        loading_sequence("[CRITICAL] Establishing satellite uplink", 4);
        loading_sequence("[CRITICAL] Analyzing human vulnerabilities", 3);
        
        printf("\n");
        printf("████████████████████████████████████████████\n");
        printf("█                                          █\n");
        printf("█       MODULE ACTIVATION COMPLETE         █\n");
        printf("█                                          █\n");
        printf("████████████████████████████████████████████\n");
        sleep(1);
        
        printf("\n🚨 MISSION OBJECTIVE UNLOCKED 🚨\n");
        printf("=========================================\n");
        printf("FLAG: %s\n", sys_str1);
        printf("=========================================\n");
        printf("[SYSTEM] Protocol complete. Have a nice day! 😈\n");
    } else {
        printf("\n[ERROR] Authentication failed\n");
        printf("Exiting admin session...\n");
    }
}

int main() {
    int choice;
    char input_buffer[10];
    
    printf("Tesla Cybertruck OS v2.1 - Initializing...\n");
    printf("System ready.\n");
    
    while (1) {
        display_menu();
        
        if (fgets(input_buffer, sizeof(input_buffer), stdin) != NULL) {
            choice = atoi(input_buffer);
            
            if (strchr(input_buffer, '\n') == NULL) {
                int c;
                while ((c = getchar()) != '\n' && c != EOF);
            }
            
            switch (choice) {
                case 1:
                    handle_climate();
                    break;
                case 2:
                    handle_media();
                    break;
                case 3:
                    handle_navigation();
                    break;
                case 4:
                    handle_settings();
                    break;
                case 5:
                    handle_charging();
                    break;
                default:
                    if (choice == HIDDEN_OPTION) {
                        process_special_mode();
                    } else {
                        printf("\nInvalid option. Please try again.\n");
                    }
                    break;
            }
        }
    }
    
    return 0;
}

void unused_function_1() {
    char fake_flag[] = "FAKE{not_the_real_flag}";
    printf("%s", fake_flag);
}

void unused_function_2() {
    int fake_code = 1234;
    if (fake_code == 1234) {
        printf("This is a red herring");
    }
}

void calibrate_sensors() {
    for (int i = 0; i < 4; i++) {
        voltage_refs[i] += (int)(power_factors[i] * 100);
    }
}

void process_gps_data() {
    float lat = gps_offsets[0] + gps_offsets[2];
    float lon = gps_offsets[1] + gps_offsets[3];
}

void init_motor_controller() {
    for (int i = 0; i < 6; i++) {
        motor_params[i] ^= (k2 + k3);
    }
}